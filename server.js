import http from 'node:http';
import {migrate,workspace,saveState,householdRoute} from './server/workspace.js';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {readFile,stat,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const scrypt=promisify(scryptCallback);
const hash=t=>createHash('sha256').update(t).digest('hex');
export function createApp({database=':memory:',dist=path.resolve('dist'),secureCookies=false,maxUsers=2}={}){
 const db=new DatabaseSync(database);db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,data TEXT NOT NULL DEFAULT \'{}\',revision INTEGER NOT NULL DEFAULT 0); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);');
 migrate(db);
 const limits=new Map();
 const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data))};
 const cookie=(req,res,token,age)=>res.setHeader('Set-Cookie',`ag_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${secureCookies||req.headers['x-forwarded-proto']==='https'?'; Secure':''}`);
 async function body(req){let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>200000)throw Object.assign(Error('Anfrage zu groß.'),{status:413})}try{return JSON.parse(text||'{}')}catch{throw Object.assign(Error('Ungültige Anfrage.'),{status:400})}}
 const session=req=>{const token=req.headers.cookie?.match(/(?:^|;\s*)ag_session=([a-f0-9]{64})(?:;|$)/)?.[1];return token?db.prepare('SELECT users.* FROM users JOIN sessions ON users.id=sessions.user_id WHERE token=? AND expires>?').get(hash(token),Date.now()):null};
 const publicUser=u=>({id:u.id,name:u.name,email:u.email});
 const server=http.createServer(async(req,res)=>{try{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});return res.end('ok')}
 if(url.pathname.startsWith('/api/')){
  if(url.pathname==='/api/public'&&req.method==='GET'){const count=db.prepare('SELECT COUNT(*) AS count FROM users').get().count;return send(res,200,{registrationOpen:maxUsers===0||count<maxUsers,maxUsers})}
  if(!['GET','HEAD'].includes(req.method)&&req.headers.origin){let origin;try{origin=new URL(req.headers.origin)}catch{return send(res,403,{error:'Ungültiger Ursprung.'})}if(origin.host!==req.headers.host)return send(res,403,{error:'Anfrage von fremder Website abgelehnt.'})}
  if(['/api/register','/api/login'].includes(url.pathname)&&req.method==='POST'){
   const ip=req.socket.remoteAddress;const now=Date.now();let limit=limits.get(ip);if(!limit||now-limit.start>900000){limit={start:now,count:0};limits.set(ip,limit)}if(limits.size>10000)for(const [k,v]of limits)if(now-v.start>900000)limits.delete(k);if(++limit.count>30)return send(res,429,{error:'Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.'});
   const b=await body(req);const email=typeof b.email==='string'?b.email.trim().toLowerCase():'';const password=typeof b.password==='string'?b.password:'';
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||password.length<10||password.length>128)return send(res,400,{error:'Bitte gültige E-Mail und ein Passwort mit 10–128 Zeichen angeben.'});
   let user;
   if(url.pathname==='/api/register'){
    const name=typeof b.name==='string'?b.name.trim():'';if(!name||name.length>40)return send(res,400,{error:'Bitte einen Namen mit 1–40 Zeichen angeben.'});
    const salt=randomBytes(16).toString('hex');const derived=await scrypt(password,salt,64);if(maxUsers>0&&db.prepare('SELECT COUNT(*) AS count FROM users').get().count>=maxUsers)return send(res,403,{error:'Die Registrierung ist geschlossen. Die verfügbaren Konten sind bereits vergeben.'});try{const result=db.prepare('INSERT INTO users(email,name,password) VALUES(?,?,?)').run(email,name,salt+':'+derived.toString('hex'));user=db.prepare('SELECT * FROM users WHERE id=?').get(result.lastInsertRowid)}catch(e){if(e.code?.includes('SQLITE_CONSTRAINT')||e.errcode===2067)return send(res,409,{error:'Registrierung nicht möglich. Nutze bei einem bestehenden Konto die Anmeldung.'});throw e}
   }else{
    user=db.prepare('SELECT * FROM users WHERE email=?').get(email);const [salt,stored]=(user?.password||'00000000000000000000000000000000:'+ '00'.repeat(64)).split(':');const actual=await scrypt(password,salt,64);if(!user||!timingSafeEqual(actual,Buffer.from(stored,'hex')))return send(res,401,{error:'E-Mail oder Passwort stimmen nicht.'});
   }
   db.prepare('DELETE FROM sessions WHERE expires<?').run(now);const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(token),user.id,now+30*86400000);cookie(req,res,token,30*86400);return send(res,200,workspace(db,user));
  }
  const user=session(req);if(!user)return send(res,401,{error:'Bitte melde dich an.'});
  if(url.pathname==='/api/me'&&req.method==='GET')return send(res,200,workspace(db,user));
  if(url.pathname==='/api/logout'&&req.method==='POST'){const t=req.headers.cookie?.match(/ag_session=([a-f0-9]{64})/)?.[1];if(t)db.prepare('DELETE FROM sessions WHERE token=?').run(hash(t));cookie(req,res,'',0);return send(res,200,{ok:true})}
  if(url.pathname==='/api/state'&&req.method==='PUT')return send(res,200,saveState(db,user,await body(req)));
  const householdResult=await householdRoute({db,user,path:url.pathname,method:req.method,body:()=>body(req)});if(householdResult!==null)return send(res,200,householdResult);
  return send(res,404,{error:'Nicht gefunden.'});
 }
 if(!['GET','HEAD'].includes(req.method))return send(res,405,{error:'Methode nicht erlaubt.'});
 let file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(dist+path.sep)&&file!==dist)return send(res,404,{error:'Nicht gefunden.'});
 try{if(!(await stat(file)).isFile())file=path.join(dist,'index.html')}catch{if(path.extname(url.pathname))return send(res,404,{error:'Nicht gefunden.'});file=path.join(dist,'index.html')}
 const content=await readFile(file);const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':file.includes('/assets/')?'public,max-age=31536000,immutable':'no-cache'});res.end(req.method==='HEAD'?undefined:content);
 }catch(e){if(!res.headersSent)send(res,e.status||500,{error:e.status?e.message:'Serverfehler. Bitte versuche es erneut.'});else res.end()}});
 return {server,close:()=>db.close()};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){const database=process.env.DATABASE_PATH||'/data/ag-fit.sqlite';await mkdir(path.dirname(database),{recursive:true});const maxUsers=Number(process.env.MAX_USERS??2);if(!Number.isSafeInteger(maxUsers)||maxUsers<0)throw Error('MAX_USERS muss eine ganze Zahl ab 0 sein.');const {server,close}=createApp({database,secureCookies:process.env.COOKIE_SECURE==='true',maxUsers});for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>server.close(()=>{close();process.exit(0)}));server.listen(Number(process.env.PORT)||8080,'0.0.0.0',()=>console.log('ag fit läuft auf Port '+(process.env.PORT||8080)))}
