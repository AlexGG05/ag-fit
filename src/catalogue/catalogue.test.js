import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {recipes,searchRecipes} from '../nutrition.js';
import {recipes as legacy} from '../data.js';
import {issue2Recipes} from './recipes.js';
import {validateCatalogue,normalizedTitle,ingredientSignature} from './validate.js';
import {referenceFoods,nutrientSource} from './references.js';
import {ingredientNutrition,scaleNutrients,macroKeys} from '../food.js';
import {requirements,shoppingWithPantry} from '../pantry.js';
import {recipeEnabled,categoryEnabled} from '../meals.js';
test('2500 complete unique recipes meet exact category quotas and retain every previous recipe field',()=>{
 const report=validateCatalogue(recipes);assert.equal(report.total,2500);assert.deepEqual(Object.values(report.categories),[400,650,650,300,200,200,100]);assert.equal(issue2Recipes.length,1200);assert.equal(legacy.length,1300);
 assert.equal(createHash('sha256').update(JSON.stringify(legacy)).digest('hex'),'8a3fec5ea7f841024555658b93b092a27c993402ca3cc418327b936a25000f14','Full 1300-recipe baseline from 99e829e');
 // Freeze the complete pre-issue catalogue, independent of added metadata.
 for(const old of legacy){const enriched=recipes.find(r=>r.id===old.id);for(const [key,value]of Object.entries(old))assert.deepEqual(enriched[key],value,old.id+'/'+key)}
 assert.equal(new Set(recipes.map(ingredientSignature)).size,2500);assert.equal(new Set(recipes.map(r=>normalizedTitle(r.name))).size,2500);
 assert.equal(createHash('sha256').update(JSON.stringify(legacy.filter(r=>!r.id.startsWith('hearty-')))).digest('hex'),'29e096a19758309568697225a230d20ecc2e0cfdefff5917b781626341a80ea1');
});
test('all new nutrient values are recomputable from individually traceable USDA foods and portions scale correctly',()=>{
 assert.equal(nutrientSource.mirrorCommit,'1e457b599af101ce463a195867574eba16c81acb');
 const oats=referenceFoods.find(r=>r.name==='Haferflocken');assert.equal(oats.ndb,'08120');assert.equal(oats.kcal,379);assert.equal(oats.protein,13.15);
 for(const r of issue2Recipes){const result=ingredientNutrition(r.ingredients,referenceFoods);assert.deepEqual(result,r.nutrition,r.id);assert.deepEqual(result.missing,[],r.id);assert(r.kcal>=50&&r.kcal<=1200,r.id);assert(r.protein>=0&&r.protein<100,r.id);assert(r.nutrition.carbs>=0&&r.nutrition.fat>=0,r.id);
  const doubled=ingredientNutrition(r.ingredients.map(([n,a,u])=>[n,a*2,u]),referenceFoods);for(const k of macroKeys)assert(Math.abs(doubled[k]-result[k]*2)<=.02,r.id+'/'+k);
  const scaled=requirements(r,3);assert(scaled.length>=r.ingredients.length-1);const cart=shoppingWithPantry({'2026-10-19:lunch':r.id},3,recipes);assert(cart.some(i=>i.amount>0));
 }
 assert.deepEqual(scaleNutrients({kcal:100,protein:null,carbs:10,fat:2},1.5),{kcal:150,protein:null,carbs:15,fat:3});
 const unknown=ingredientNutrition([['Ohne Referenz',10,'g']],referenceFoods);assert.equal(unknown.kcal,null);assert.deepEqual(unknown.missing,['Ohne Referenz']);
});
test('new compositions differ in multiple substantive ingredients within each preparation family',()=>{
 const groups=new Map();for(const r of issue2Recipes){const key=r.category+':'+r.family;groups.set(key,[...(groups.get(key)||[]),r])}
 assert(groups.size>=100);
 for(const list of groups.values())for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
  const a=new Set(list[i].ingredients.filter(([,amount])=>amount>=15).map(([n])=>n));const b=new Set(list[j].ingredients.filter(([,amount])=>amount>=15).map(([n])=>n));
  assert([...a].some(n=>!b.has(n))&&[...b].some(n=>!a.has(n)),list[i].id+' vs '+list[j].id);
  assert(new Set([...a,...b].filter(n=>a.has(n)!==b.has(n))).size>=2,'only garnish differs: '+list[i].id);
 }
 assert(issue2Recipes.filter(r=>r.category==='mealprep').every(r=>r.storage&&r.steps.join(' ').includes('24 Stunden')));
});
test('all categories are searchable, recipes are reachable by title and filters compose without losing preferences',()=>{
 for(const category of ['breakfast','lunch','dinner','snack','dessert','mealprep','drink']){const found=searchRecipes({category});assert(found.length>0);assert(found.every(r=>r.category===category));const r=found.at(-1);assert(searchRecipes({search:r.name,category}).some(x=>x.id===r.id))}
 const found=searchRecipes({category:'mealprep',diet:'Vegan',search:'Kichererbsen'});assert(found.length>0);assert(found.every(r=>r.diet==='Vegan'&&r.category==='mealprep'));
 assert.equal(searchRecipes({favorites:[issue2Recipes.at(-1).id]}).length,1);
 assert(searchRecipes({search:'gruntee frucht slush'}).length>0);assert(searchRecipes({quick:true,category:'drink'}).every(r=>r.time<=25));
 assert(categoryEnabled('snack',{}));assert(recipeEnabled(recipes.find(r=>r.category==='dessert'),{}));assert(!recipeEnabled(recipes.find(r=>r.category==='snack'),{meals:{breakfast:false,lunch:false,dinner:false}}));
 const enriched=recipes.find(r=>r.id===issue2Recipes[0].id);assert(enriched.allergens.includes('Milch'));assert(enriched.allergens.includes('Schalenfrüchte'));
});
test('catalogue validation rejects malformed or duplicate imports before writing',()=>{
 assert.throws(()=>validateCatalogue([...recipes,recipes[0]]),/duplicate ID/);
 const altered=[...recipes];altered[1]={...recipes[1],name:recipes[0].name.toUpperCase()};assert.throws(()=>validateCatalogue(altered),/duplicate normalized name/);
 altered[1]={...recipes[1],ingredients:recipes[0].ingredients};assert.throws(()=>validateCatalogue(altered),/duplicate normalized ingredient/);
 altered[1]={...recipes[1],steps:[]};assert.throws(()=>validateCatalogue(altered),/cooking steps/);
});
