import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {searchRecipes} from './nutrition.js';import {recipes} from './data.js';import {heartyRecipes} from './hearty-recipes.js';import {ingredientNutrition} from './food.js';import {recipeKind} from './recipe-kind.js';import {matchesDiet} from './planner.js';
test('800 hearty additions meet separate requested quotas and preserve all 500 prior recipes',()=>{
 const previous=recipes.filter(r=>!r.id.startsWith('hearty-'));assert.equal(previous.length,500);
 assert.equal(createHash('sha256').update(JSON.stringify(previous)).digest('hex'),'29e096a19758309568697225a230d20ecc2e0cfdefff5917b781626341a80ea1');
 assert.equal(heartyRecipes.length,800);assert.equal(recipes.length,1300);
 assert.deepEqual(Object.fromEntries(['casseroles','soups','lunch','dinner'].map(group=>[group,heartyRecipes.filter(r=>r.expansionGroup===group).length])),{casseroles:100,soups:100,lunch:300,dinner:300});
 assert.deepEqual(['breakfast','lunch','dinner'].map(meal=>recipes.filter(r=>r.meal===meal).length),[166,566,568]);
 for(const group of ['lunch','dinner'])assert.ok(heartyRecipes.filter(r=>r.expansionGroup===group).every(r=>r.meal===group));
 const combinations=new Set(previous.map(r=>r.ingredients.map(i=>i[0]).sort().join('|')));
 for(const r of heartyRecipes){const signature=r.ingredients.map(i=>i[0]).sort().join('|');assert.ok(!combinations.has(signature),r.id+' has a repeated ingredient set');combinations.add(signature)}
});
test('hearty recipes have full estimated nutrients, vegetable portions and actual cooking instructions',()=>{
 const vegetableNames=new Set(['Brokkoli','Karotten','Blumenkohl','Lauch','Paprika','Zucchini','Hokkaidokürbis','Spinat','Champignons','Fenchel','Aubergine','Tomaten','Weißkohl','Grünkohl','Sellerieknolle','Mangold','Rote Bete, gegart','Rotkohl']);
 for(const r of heartyRecipes){assert.ok(r.ingredients.filter(([name,,unit])=>vegetableNames.has(name)&&unit==='g').reduce((sum,[,amount])=>sum+amount,0)>=240,r.id+' needs vegetable portions');const totals=ingredientNutrition(r.ingredients);assert.deepEqual(totals.missing,[],r.id);for(const key of ['kcal','protein','carbs','fat'])assert.equal(r.nutrition[key],totals[key],r.id+'/'+key);assert.ok(r.kcal>=350&&r.kcal<=1100,r.id);assert.ok(r.protein>=15,r.id);assert.ok(r.steps.length>=5,r.id);assert.ok(r.steps.every(step=>step.length>=20),r.id);assert.ok(r.time>=25&&r.time<=120,r.id);assert.ok(r.ingredients.every(([,amount])=>amount>0));assert.ok(!/salat/i.test(r.name));
 if(r.ingredients.some(([name])=>/Hähnchen|Puten|Rinder|Schweine/.test(name))){assert.equal(r.vegetarian,false);assert.match(r.steps.join(' '),/75|75–90|vollständig gegart/,r.id)}
 }
 assert.ok(heartyRecipes.filter(r=>matchesDiet(r,'Vegan')).length>=100);
});
test('dish filters combine with meals, dietary choices, ingredients and favorites',()=>{
 for(const [kind,total]of [['casserole',100],['soup',100],['hearty',600]]){const found=searchRecipes({catalog:heartyRecipes,kind});assert.equal(found.length,total);assert.ok(found.every(r=>recipeKind(r)===kind))}
 const id='hearty-kartoffel-auflauf-brokkoli-karotte';assert.equal(searchRecipes({kind:'casserole',favorites:[id]}).length,1);assert.equal(searchRecipes({kind:'soup',favorites:[id]}).length,0);
 const found=searchRecipes({kind:'soup',meal:'dinner',diet:'Vegan',search:'Linsen'});assert.ok(found.length>0);assert.ok(found.every(r=>r.meal==='dinner'&&matchesDiet(r,'Vegan')));
 assert.equal(recipeKind({name:'Mein Kartoffelgratin'}),'casserole');assert.equal(recipeKind({name:'Eigene Kürbissuppe'}),'soup');
});
