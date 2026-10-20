import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './fixture.js';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('manual shopping items are scoped, shared, versioned, idempotent and persistent across restart',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'ag-fit-extras-')),database=join(dir,'data.sqlite');let f=await fixture({database});
 try{const a=await f.register('ExtraA'),b=await f.register('ExtraB'),c=await f.register('Stranger');const payload={name:'Küchenpapier',quantity:'2 Rollen',requestId:'manual-one'};
 assert.equal((await f.request('/api/shopping/extras','POST',payload)).status,401);
 const personal=await f.request('/api/shopping/extras','POST',{...payload,requestId:'personal',name:'Privat'},a.cookie);assert.equal(personal.status,200);assert.equal((await f.request('/api/me','GET',undefined,b.cookie)).data.shoppingExtras.length,0);
 await f.request('/api/household','POST',{name:'Home'},a.cookie);const invite=await f.request('/api/household/invite','POST',{},a.cookie);await f.request('/api/household/join','POST',{code:invite.data.code},b.cookie);
 const made=await f.request('/api/shopping/extras','POST',payload,a.cookie);assert.equal(made.status,200);const item=made.data.item;assert.equal((await f.request('/api/shopping/extras','POST',payload,a.cookie)).data.duplicate,true);assert.equal((await f.request('/api/shopping/extras','POST',{...payload,name:'Anderer Artikel'},b.cookie)).status,409);
 assert.equal((await f.request('/api/me','GET',undefined,b.cookie)).data.shoppingExtras[0].id,item.id);assert.equal((await f.request('/api/me','GET',undefined,c.cookie)).data.shoppingExtras.length,0);
 const path='/api/shopping/extras/'+item.id;assert.equal((await f.request(path,'PUT',{...item,done:true},c.cookie)).status,404);assert.equal((await f.request(path,'DELETE',{version:0},c.cookie)).status,404);
 assert.equal((await f.request(path,'PUT',{...item,done:true},b.cookie)).status,200);assert.equal((await f.request(path,'PUT',{...item,quantity:'3 Rollen'},a.cookie)).status,409);assert.equal((await f.request(path,'DELETE',{version:0},a.cookie)).status,409);
 let state=(await f.request('/api/me','GET',undefined,a.cookie)).data;assert.equal(state.shoppingExtras[0].done,true);assert.equal(state.pantry.length,0);assert.equal(state.purchases.length,0);
 await f.close();f=await fixture({database});state=(await f.request('/api/me','GET',undefined,b.cookie)).data;assert.equal(state.shoppingExtras[0].quantity,'2 Rollen');assert.equal(state.shoppingExtras[0].version,1);
 assert.equal((await f.request(path,'PUT',{...state.shoppingExtras[0],name:'Küchenrolle',quantity:'3 Packungen',done:false},b.cookie)).status,200);assert.equal((await f.request(path,'DELETE',{version:2},a.cookie)).status,200);assert.equal((await f.request('/api/me','GET',undefined,b.cookie)).data.shoppingExtras.length,0);
 await f.request('/api/household/leave','POST',{},a.cookie);assert.equal((await f.request('/api/me','GET',undefined,a.cookie)).data.shoppingExtras[0].id,personal.data.item.id);
 }finally{await f.close();await rm(dir,{recursive:true,force:true})}
});
test('manual shopping validates labels, lengths, versions and status without changing saved plans',async()=>{
 const f=await fixture();try{const a=await f.register('Validation');const cookie=a.cookie;const plan={'2026-10-19:breakfast':'b1'};await f.request('/api/state','PUT',{data:{'ag-plan':plan},revision:0},cookie);
 for(const b of [{name:'',requestId:'empty'},{name:'X'.repeat(121),requestId:'long'},{name:'Kaffee',quantity:'X'.repeat(81),requestId:'quantity'},{name:'Kaffee'}])assert.equal((await f.request('/api/shopping/extras','POST',b,cookie)).status,400);
 const made=await f.request('/api/shopping/extras','POST',{name:'Kaffee',quantity:'',requestId:'coffee'},cookie);assert.equal(made.status,200);assert.equal((await f.request('/api/shopping/extras/'+made.data.item.id,'PUT',{...made.data.item,done:'yes'},cookie)).status,400);assert.deepEqual((await f.request('/api/me','GET',undefined,cookie)).data.data['ag-plan'],plan);
 }finally{await f.close()}
});
