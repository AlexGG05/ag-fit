import {canonicalName,normalizeQuantity,macroKeys} from '../food.js';
import {recipeCategories} from './metadata.js';
import {normalizedSearch} from './search.js';
export const normalizedTitle=normalizedSearch;
export const ingredientSignature=recipe=>recipe.ingredients.map(([name])=>normalizedTitle(name)).sort().join('|');
export function validateCatalogue(recipes,{minimum=2500,exactTargets=true}={}){
 const ids=new Set(),names=new Set(),ingredients=new Set();const counts=Object.fromEntries(recipeCategories.map(c=>[c.id,0]));
 for(const r of recipes){const context=r?.id||'unknown';const assert=(condition,message)=>{if(!condition)throw Error(`${context}: ${message}`)};
  assert(typeof r.id==='string'&&r.id.length>0&&!ids.has(r.id),'missing/duplicate ID');ids.add(r.id);
  assert(typeof r.name==='string'&&r.name.length>=4,'missing name');const title=normalizedTitle(r.name);assert(!names.has(title),'duplicate normalized name');names.add(title);
  assert(typeof r.description==='string'&&r.description.length>=15,'missing description');assert(r.category in counts,'unknown category');counts[r.category]++;
  assert(Number.isInteger(r.servings)&&r.servings>0&&r.servings<=100,'invalid servings');assert(Number.isFinite(r.time)&&r.time>0&&r.time<=1440,'invalid preparation time');
  assert(Array.isArray(r.ingredients)&&r.ingredients.length>=2,'missing ingredients');const local=new Set();
  for(const [name,amount,unit]of r.ingredients){assert(typeof name==='string'&&!!name.trim(),'missing ingredient name');assert(!local.has(canonicalName(name)),'repeated ingredient');local.add(canonicalName(name));assert(Number.isFinite(amount)&&amount>0,'invalid quantity');normalizeQuantity(amount,unit)}
  const signature=ingredientSignature(r);assert(!ingredients.has(signature),'duplicate normalized ingredient composition');ingredients.add(signature);
  assert(Array.isArray(r.steps)&&r.steps.length>=3&&r.steps.every(s=>typeof s==='string'&&s.length>=15),'missing usable cooking steps');
  assert(Array.isArray(r.tags)&&r.tags.length>0&&typeof r.diet==='string','missing tags/diet');assert(Array.isArray(r.allergens)&&!!r.allergenStatus,'missing allergen information');
  assert(r.nutrition?.estimated===true,'nutrition must be marked estimated');
  for(const key of macroKeys)assert(r.nutrition[key]===null||Number.isFinite(r.nutrition[key])&&r.nutrition[key]>=0,`missing/invalid ${key}`);
  assert(Array.isArray(r.nutrition.missing),'missing nutrient completeness information');assert(!!r.nutritionSource&&!!r.recipeSource,'missing provenance');
 }
 if(recipes.length<minimum)throw Error(`Only ${recipes.length} recipes; expected at least ${minimum}`);
 if(exactTargets)for(const c of recipeCategories)if(counts[c.id]!==c.target)throw Error(`${c.id}: ${counts[c.id]} instead of ${c.target}`);
 return {total:recipes.length,categories:counts,uniqueIds:ids.size,uniqueNames:names.size,uniqueIngredientSets:ingredients.size};
}
