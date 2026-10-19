import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash,scryptSync} from 'node:crypto';
import {fixture} from './fixture.js';
test('legacy users, credentials, sessions and arbitrary saved data survive additive migrations and restart',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'ag-fit-upgrade-')),database=path.join(dir,'legacy.sqlite');
 const original={'ag-profile':{name:'Legacy',people:3,calorieGoal:2200},'ag-favorites':['b1','l1'],'ag-plan':{'2026-10-19:dinner':'d1'},'ag-shopping':{Tomaten:true},legacyTraining:{keep:['all','data']}};
 const token='a'.repeat(64),salt='a'.repeat(32),password=salt+':'+scryptSync('legacy-test-password',salt,64).toString('hex');
 let db=new DatabaseSync(database);db.exec("CREATE TABLE users(id INTEGER PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,data TEXT NOT NULL DEFAULT '{}',revision INTEGER NOT NULL DEFAULT 0);CREATE TABLE sessions(token TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),expires INTEGER NOT NULL)");
 db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(1,'legacy@example.com','Legacy',password,JSON.stringify(original),7);db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(createHash('sha256').update(token).digest('hex'),1,Date.now()+86400000);db.close();
 const cookie='ag_session='+token;let f;
 try{f=await fixture({database});let me=await f.request('/api/me','GET',undefined,cookie);assert.equal(me.status,200);assert.deepEqual(me.data.data,original);assert.equal(me.data.revision,7);assert.equal((await f.request('/api/login','POST',{email:'legacy@example.com',password:'legacy-test-password'})).status,200);
 assert.equal((await f.request('/api/household','POST',{name:'Legacy household'},cookie)).status,200);
 assert.equal((await f.request('/api/pantry','POST',{name:'Haferflocken',amount:1,unit:'kg',location:'Schrank'},cookie)).status,200);
 assert.equal((await f.request('/api/prices','POST',{name:'Haferflocken',amount:1,unit:'kg',price:1.49},cookie)).status,200);
 assert.equal((await f.request('/api/products','POST',{name:'Testmilch',basis:'ml',kcal:40,protein:3,carbs:4,fat:1,allergens:[],source:'manual'},cookie)).status,200);
 assert.equal((await f.request('/api/diary','POST',{date:'2026-10-19',meal:'dinner',recipeId:'d1',servings:1,sourceKey:'planned:2026-10-19:dinner'},cookie)).status,200);
 assert.equal((await f.request('/api/recipes','POST',{name:'Legacy Rezept',baseServings:2,time:10,meal:'breakfast',vegetarian:true,shared:true,ingredientDetails:[{name:'Haferflocken',amount:100,unit:'g'}],steps:['Kochen.'],tags:[]},cookie)).status,200);
 const before=(await f.request('/api/me','GET',undefined,cookie)).data;await f.close();f=await fixture({database});me=(await f.request('/api/me','GET',undefined,cookie));assert.deepEqual(me.data,before);assert.equal(me.data.entries.length,1);assert.equal(me.data.customRecipes.length,1);assert.equal(me.data.pantry.length,1);assert.equal(me.data.prices.length,1);assert.equal(me.data.products.length,1);assert.deepEqual(me.data.data.legacyTraining,original.legacyTraining);
 db=new DatabaseSync(database);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.equal(db.prepare('SELECT password FROM users WHERE id=1').get().password,password);assert.deepEqual(JSON.parse(db.prepare('SELECT data FROM users WHERE id=1').get().data),original);assert.equal(db.prepare('SELECT count(*) AS n FROM schema_migrations').get().n,7);db.close();
 }finally{await f?.close();await rm(dir,{recursive:true,force:true})}
});
