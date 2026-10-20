import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './fixture.js';
import {recipes} from '../src/nutrition.js';
import {shoppingWithPantry} from '../src/pantry.js';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const plan={'2026-10-19:breakfast':'b1','2026-10-20:breakfast':'b1','2026-11-02:lunch':'l1'};
const start='2026-10-19',end=start;
const oats=shoppingWithPantry({'2026-10-19:breakfast':'b1'},2,recipes).find(i=>i.name==='Haferflocken');
const payload=(requestId='purchase-one')=>({start,end,name:oats.name,amount:oats.amount,unit:oats.unit,requestId});
async function seed(f,cookie){const state=(await f.request('/api/me','GET',undefined,cookie)).data;assert.equal((await f.request('/api/state','PUT',{data:{'ag-plan':plan,'ag-profile':{people:2},'ag-shopping':{Haferflocken:true},legacy:{keep:true}},revision:state.revision,householdRevision:state.householdRevision},cookie)).status,200)}
test('purchases are atomic, range-specific, idempotent, scoped and survive restart with legacy data',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'ag-fit-shopping-'));const database=join(dir,'data.sqlite');let f=await fixture({database});
 try{const a=await f.register('Buyer'),b=await f.register('Stranger');await seed(f,a.cookie);
  assert.equal((await f.request('/api/shopping/purchase','POST',{...payload(),amount:oats.amount*2},a.cookie)).status,409);
  const results=await Promise.all(['one','two'].map(id=>f.request('/api/shopping/purchase','POST',payload(id),a.cookie)));assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);const winner=results.find(r=>r.status===200),id=winner.data.purchase.id,requestId=results[0].status===200?'one':'two';
  assert.equal((await f.request('/api/shopping/purchase','POST',payload(requestId),a.cookie)).data.duplicate,true);
  assert.equal((await f.request('/api/shopping/purchase','POST',{...payload(requestId),end:'2026-10-20'},a.cookie)).status,409);
  assert.equal((await f.request('/api/shopping/purchases/'+id+'/undo','POST',{},b.cookie)).status,404);
  let state=(await f.request('/api/me','GET',undefined,a.cookie)).data;assert.equal(state.pantry.length,1);assert.equal(state.pantry[0].amount,oats.amount);assert.deepEqual(state.data['ag-plan'],plan);assert.deepEqual(state.data.legacy,{keep:true});assert.deepEqual(state.data['ag-shopping'],{Haferflocken:true});assert.equal((await f.request('/api/me','GET',undefined,b.cookie)).data.purchases.length,0);
  await f.close();f=await fixture({database});state=(await f.request('/api/me','GET',undefined,a.cookie)).data;assert.equal(state.purchases[0].id,id);assert.equal(state.pantry[0].amount,oats.amount);
  assert.equal((await f.request('/api/shopping/purchases/'+id+'/undo','POST',{},a.cookie)).status,200);assert.equal((await f.request('/api/shopping/purchases/'+id+'/undo','POST',{},a.cookie)).data.duplicate,true);assert.equal((await f.request('/api/shopping/purchase','POST',payload(requestId),a.cookie)).data.purchase.reversed,true);assert.equal((await f.request('/api/me','GET',undefined,a.cookie)).data.pantry.length,0);
 }finally{await f.close();await rm(dir,{recursive:true,force:true})}
});
test('household purchases are shared, subtract existing quantities and cannot undo edited or consumed lots',async()=>{
 const f=await fixture();try{const a=await f.register('PartnerA'),b=await f.register('PartnerB');await seed(f,a.cookie);await f.request('/api/household','POST',{name:'Home'},a.cookie);const invite=await f.request('/api/household/invite','POST',{},a.cookie);await f.request('/api/household/join','POST',{code:invite.data.code},b.cookie);
 await f.request('/api/pantry','POST',{name:oats.name,amount:20,unit:'g'},a.cookie);
 const body={...payload(),start,end:'2026-10-20',amount:oats.amount*2-20};const bought=await f.request('/api/shopping/purchase','POST',body,b.cookie);assert.equal(bought.status,200);const state=(await f.request('/api/me','GET',undefined,a.cookie)).data;assert.equal(state.purchases[0].id,bought.data.purchase.id);const lot=state.pantry.find(p=>p.id===bought.data.purchase.pantryId);assert.equal(lot.amount,body.amount);
 await f.request('/api/pantry/'+lot.id,'PUT',{...lot,location:'Schrank'},a.cookie);assert.equal((await f.request('/api/shopping/purchases/'+bought.data.purchase.id+'/undo','POST',{},b.cookie)).status,409);
 assert.equal((await f.request('/api/shopping/purchase','POST',{...payload('invalid'),end:'2026-10-18'},a.cookie)).status,400);assert.equal((await f.request('/api/shopping/purchase','POST',{...payload('bad'),unit:'unknown'},a.cookie)).status,400);
 }finally{await f.close()}
});
test('authorized own recipes and normalized units work; consumption blocks reversal',async()=>{
 const f=await fixture();try{const a=await f.register('Cook'),b=await f.register('OtherCook');const own={name:'Milchsuppe',baseServings:1,time:10,meal:'lunch',vegetarian:true,tags:[],ingredientDetails:[{name:'Milch',amount:.25,unit:'l'}],steps:['Milch erwärmen.']};const made=await f.request('/api/recipes','POST',own,a.cookie);assert.equal(made.status,200);
 async function setPlan(cookie){const s=(await f.request('/api/me','GET',undefined,cookie)).data;assert.equal((await f.request('/api/state','PUT',{data:{'ag-plan':{[start+':lunch']:made.data.id,[start+':dinner']:'out'},'ag-profile':{people:2}},revision:s.revision},cookie)).status,200)}
 await setPlan(a.cookie);await setPlan(b.cookie);const body={start,end,name:'Milch',amount:.5,unit:'l',requestId:'milk'};assert.equal((await f.request('/api/shopping/purchase','POST',body,b.cookie)).status,409);const bought=await f.request('/api/shopping/purchase','POST',body,a.cookie);assert.equal(bought.status,200);assert.equal(bought.data.purchase.amount,500);assert.equal(bought.data.purchase.unit,'ml');assert.equal((await f.request('/api/pantry/consume','POST',{recipeId:made.data.id,servings:1,requestId:'cook',confirmed:true},a.cookie)).status,200);assert.equal((await f.request('/api/shopping/purchases/'+bought.data.purchase.id+'/undo','POST',{},a.cookie)).status,409);assert.equal((await f.request('/api/me','GET',undefined,a.cookie)).data.pantry[0].amount,250);
 }finally{await f.close()}
});
