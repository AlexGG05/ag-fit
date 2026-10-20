import {activePlan} from '../src/meals.js';
import {randomUUID} from 'node:crypto';
import {fail,text,transaction,membership} from './workspace.js';
import {scope,pantryRows} from './pantry.js';
import {ownRecipes} from './recipes.js';
import {recipes} from '../src/nutrition.js';
import {canonicalName,normalizeQuantity} from '../src/food.js';
import {planInRange,validateRange} from '../src/calendar.js';
import {shoppingWithPantry} from '../src/pantry.js';
export function migrateShopping(db){db.exec(`CREATE TABLE IF NOT EXISTS shopping_purchases(id TEXT PRIMARY KEY,scope_type TEXT NOT NULL,scope_id INTEGER NOT NULL,request_id TEXT NOT NULL,data TEXT NOT NULL,reversed INTEGER NOT NULL DEFAULT 0,UNIQUE(scope_type,scope_id,request_id));INSERT OR IGNORE INTO schema_migrations VALUES(8,datetime('now'));`)}
const purchase=row=>({...JSON.parse(row.data),id:row.id,reversed:!!row.reversed});
export function purchaseRows(db,userId){const s=scope(db,userId);return db.prepare('SELECT * FROM shopping_purchases WHERE scope_type=? AND scope_id=? ORDER BY rowid DESC').all(s.type,s.id).map(purchase)}
export async function shoppingRoute({db,user,path,method,body}){
 if(!path.startsWith('/api/shopping/'))return null;
 if(method!=='POST')fail(405,'Diese Einkaufsaktion benötigt POST.');
 const b=await body();
 if(path==='/api/shopping/purchase'){
  const name=text(b.name,120),requestId=text(b.requestId,100);let q;try{validateRange(b.start,b.end);q=normalizeQuantity(b.amount,b.unit);if(q.amount<=0||q.amount>1000000)throw Error()}catch{fail(400,'Bitte einen gültigen Einkaufszeitraum und eine positive Menge angeben.')}
  return transaction(db,()=>{
   const s=scope(db,user.id);const previous=db.prepare('SELECT * FROM shopping_purchases WHERE scope_type=? AND scope_id=? AND request_id=?').get(s.type,s.id,requestId);
   if(previous){const p=purchase(previous);if(p.start!==b.start||p.end!==b.end||canonicalName(p.name)!==canonicalName(name)||p.unit!==q.unit||Math.abs(p.amount-q.amount)>.001)fail(409,'Diese Buchungskennung gehört zu einem anderen Einkauf.');return {purchase:p,duplicate:true}}
   const fresh=db.prepare('SELECT * FROM users WHERE id=?').get(user.id),house=membership(db,user.id);const personal=JSON.parse(fresh.data),data=house?JSON.parse(house.data):personal;
   const people=Number(house?data['ag-servings']??2:personal['ag-profile']?.people??2);if(!Number.isInteger(people)||people<1||people>6)fail(400,'Bitte eine Portionszahl von 1 bis 6 einstellen.');
   const items=shoppingWithPantry(planInRange(activePlan(data['ag-plan'],personal['ag-profile']),b.start,b.end),people,[...recipes,...ownRecipes(db,user.id)],pantryRows(db,user.id));
   const item=items.find(i=>canonicalName(i.name)===canonicalName(name)&&i.unit===q.unit);
   if(!item||item.amount<=0||Math.abs(item.amount-q.amount)>.01)fail(409,'Einkaufsliste oder Vorräte wurden geändert. Bitte den aktuellen Stand laden und die benötigte Menge erneut bestätigen.');
   const id=randomUUID(),pantryId=randomUUID(),at=new Date().toISOString();
   const lot={name:item.name,amount:item.amount,unit:item.unit,location:'Einkauf',bestBefore:null,purchaseId:id};
   const dataRecord={name:item.name,amount:item.amount,unit:item.unit,start:b.start,end:b.end,purchasedAt:at,pantryId,estimated:!!item.estimated};
   db.prepare('INSERT INTO pantry(id,scope_type,scope_id,data) VALUES(?,?,?,?)').run(pantryId,s.type,s.id,JSON.stringify(lot));
   db.prepare('INSERT INTO shopping_purchases(id,scope_type,scope_id,request_id,data) VALUES(?,?,?,?,?)').run(id,s.type,s.id,requestId,JSON.stringify(dataRecord));
   return {purchase:{...dataRecord,id,reversed:false},duplicate:false};
  });
 }
 const match=path.match(/^\/api\/shopping\/purchases\/([^/]+)\/undo$/);
 if(match)return transaction(db,()=>{const s=scope(db,user.id);const row=db.prepare('SELECT * FROM shopping_purchases WHERE id=? AND scope_type=? AND scope_id=?').get(match[1],s.type,s.id);if(!row)fail(404,'Einkauf nicht gefunden.');const p=purchase(row);if(p.reversed)return {ok:true,duplicate:true};const lot=db.prepare('SELECT * FROM pantry WHERE id=? AND scope_type=? AND scope_id=?').get(p.pantryId,s.type,s.id);if(!lot||lot.version!==0)fail(409,'Dieser Vorrat wurde bereits geändert oder verbraucht. Eine automatische Rücknahme ist deshalb nicht mehr möglich. Bitte den Vorrat bei Bedarf manuell korrigieren.');db.prepare('DELETE FROM pantry WHERE id=?').run(p.pantryId);db.prepare('UPDATE shopping_purchases SET reversed=1 WHERE id=?').run(p.id);return {ok:true}});
 fail(404,'Einkaufsaktion nicht gefunden.');
}
