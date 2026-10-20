import {randomUUID} from 'node:crypto';
import {scope} from './pantry.js';
import {fail,text,transaction} from './workspace.js';
export function migrateShoppingExtras(db){db.exec(`CREATE TABLE IF NOT EXISTS shopping_extras(id TEXT PRIMARY KEY,scope_type TEXT NOT NULL,scope_id INTEGER NOT NULL,request_id TEXT NOT NULL,data TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0,UNIQUE(scope_type,scope_id,request_id));CREATE INDEX IF NOT EXISTS shopping_extras_scope ON shopping_extras(scope_type,scope_id);INSERT OR IGNORE INTO schema_migrations VALUES(10,datetime('now'));`)}
const item=row=>({...JSON.parse(row.data),id:row.id,version:row.version});
export function extraShoppingRows(db,userId){const s=scope(db,userId);return db.prepare('SELECT * FROM shopping_extras WHERE scope_type=? AND scope_id=? ORDER BY rowid').all(s.type,s.id).map(item)}
export async function shoppingExtrasRoute({db,user,path,method,body}){
 if(path!=='/api/shopping/extras'&&!path.startsWith('/api/shopping/extras/'))return null;
 const id=path.slice('/api/shopping/extras/'.length);
 if(path==='/api/shopping/extras'&&method==='POST'){
  const b=await body(),name=text(b.name,120),quantity=text(b.quantity||'',80,false),requestId=text(b.requestId,100);
  return transaction(db,()=>{const s=scope(db,user.id);const previous=db.prepare('SELECT * FROM shopping_extras WHERE scope_type=? AND scope_id=? AND request_id=?').get(s.type,s.id,requestId);if(previous){const old=item(previous);if(old.name!==name||old.quantity!==quantity)fail(409,'Diese Buchungskennung wurde bereits verwendet.');return {item:old,duplicate:true}}
   const newId=randomUUID(),data={name,quantity,done:false};db.prepare('INSERT INTO shopping_extras(id,scope_type,scope_id,request_id,data) VALUES(?,?,?,?,?)').run(newId,s.type,s.id,requestId,JSON.stringify(data));return {item:{...data,id:newId,version:0}}});
 }
 if(!id||!['PUT','DELETE'].includes(method))fail(405,'Diese Einkaufsaktion benötigt POST, PUT oder DELETE.');
 const b=await body();return transaction(db,()=>{const s=scope(db,user.id);const row=db.prepare('SELECT * FROM shopping_extras WHERE id=? AND scope_type=? AND scope_id=?').get(id,s.type,s.id);if(!row)fail(404,'Eigener Einkaufsartikel nicht gefunden.');if(!Number.isSafeInteger(b.version)||b.version!==row.version)fail(409,'Dieser Einkaufsartikel wurde inzwischen geändert. Bitte den aktuellen Stand laden.');
  if(method==='DELETE'){db.prepare('DELETE FROM shopping_extras WHERE id=? AND scope_type=? AND scope_id=? AND version=?').run(id,s.type,s.id,b.version);return {ok:true}}
  const name=text(b.name,120),quantity=text(b.quantity||'',80,false);if(typeof b.done!=='boolean')fail(400,'Bitte einen gültigen Einkaufsstatus angeben.');const data={name,quantity,done:b.done};db.prepare('UPDATE shopping_extras SET data=?,version=version+1 WHERE id=? AND scope_type=? AND scope_id=? AND version=?').run(JSON.stringify(data),id,s.type,s.id,b.version);return {item:{...data,id,version:b.version+1}};
 });
}
