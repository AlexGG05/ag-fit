import test from 'node:test';
import assert from 'node:assert/strict';
import {suggestions} from './recipe-variety.js';
import {recipes,shoppingList} from './data.js';
test('daily choices are stable, varied for all seven days, dietary-aware and refreshable',()=>{for(const meal of ['breakfast','lunch','dinner'])for(const diet of ['Alles','Vegetarisch']){const weeks=new Set();for(let day=19;day<26;day++){const date=`2026-10-${day}`;const picks=suggestions(date,meal,diet,42);assert.equal(picks.length,3);assert.equal(new Set(picks.map(r=>r.id)).size,3);assert.deepEqual(suggestions(date,meal,diet,42),picks);if(diet==='Vegetarisch')assert.ok(picks.every(r=>r.vegetarian));weeks.add(picks.map(r=>r.id).sort().join(','));assert.notDeepEqual(suggestions(date,meal,diet,42,3),picks)}assert.equal(weeks.size,7)}});
test('new recipes have usable quantities and instructions and feed the shopping list',()=>{for(const r of recipes){assert.ok(r.steps.length>=3);for(const [name,amount,unit]of r.ingredients){assert.ok(name&&amount>0&&unit)}assert.ok(shoppingList({meal:r.id}).length>0)}});
