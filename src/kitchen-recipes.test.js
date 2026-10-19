import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {recipes} from './nutrition.js';
import {kitchenRecipes} from './kitchen-recipes.js';
import {ingredientNutrition} from './food.js';
import {shoppingWithPantry} from './pantry.js';
import {matchesDiet} from './planner.js';

test('500-recipe expansion preserves the complete original catalogue and has distinct new ingredient sets',()=>{
 const legacy=recipes.filter(r=>!r.id.startsWith('kitchen-'));
 assert.equal(legacy.length,270);
 // Baseline: original 270 recipe objects from a2c8d44, including IDs and all quantities/instructions.
 assert.equal(createHash('sha256').update(JSON.stringify(legacy)).digest('hex'),'72a0eb104768cb00a7ed927407cc713b2041b4416f04e4845bbe2e61fc8662bc');
 assert.equal(kitchenRecipes.length,230);
 assert.deepEqual(['breakfast','lunch','dinner'].map(m=>recipes.filter(r=>r.meal===m).length),[166,166,168]);
 const sets=new Set(legacy.map(r=>r.ingredients.map(i=>i[0]).sort().join('|')));
 for(const r of kitchenRecipes){const signature=r.ingredients.map(i=>i[0]).sort().join('|');assert.ok(!sets.has(signature),r.id+' repeats an ingredient set');sets.add(signature)}
});
test('all additions have complete estimated macros, plausible portions and actionable instructions',()=>{
 for(const r of kitchenRecipes){const n=ingredientNutrition(r.ingredients);assert.deepEqual(n.missing,[],r.id);for(const key of ['kcal','protein','carbs','fat'])assert.equal(r.nutrition[key],n[key],r.id+'/'+key);assert.ok(r.kcal>=200&&r.kcal<=1200,r.id);assert.ok(r.time>=10&&r.time<=75);assert.ok(r.steps.length>=4);assert.ok(r.steps.every(step=>step.length>40));assert.ok(r.ingredients.every(([,amount,unit])=>amount>0&&['g','ml','Stk.'].includes(unit)));if(r.ingredients.some(([name])=>/Lachs|Kabeljau|Hähnchen|Puten/.test(name)))assert.equal(r.vegetarian,false)}
 assert.ok(kitchenRecipes.filter(r=>matchesDiet(r,'Vegan')).length>=50);
});
test('new portions aggregate into shopping and pantry deductions without changing saved older selections',()=>{
 const id='kitchen-kuechlein-apfel-cashew';const plan={'2026-10-19:breakfast':id,'2026-10-20:breakfast':id};
 const list=shoppingWithPantry(plan,2,recipes,[{id:'stock',name:'Haferflocken',amount:100,unit:'g'}]);
 assert.equal(list.find(i=>i.name==='Haferflocken').amount,140);
 assert.equal(list.find(i=>i.name==='Milch').amount,320);
 assert.equal(list.find(i=>i.name==='Eier').amount,240);
 assert.equal(list.find(i=>i.name==='Eier').unit,'g');
 assert.equal(list.find(i=>i.name==='Eier').estimated,true);
 assert.equal(plan['2026-10-19:breakfast'],id);
});
