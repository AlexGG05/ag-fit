import test from 'node:test';
import assert from 'node:assert/strict';
import {enabledMeals,activePlan,mealShare} from './meals.js';
import {smartFillWeek,smartSuggestions} from './planner.js';
import {calendarWeek} from './calendar.js';
import {recipes,plannedNutrition} from './nutrition.js';
import {shoppingWithPantry} from './pantry.js';
test('legacy profiles enable all meals; explicit false hides without deleting existing plans',()=>{
 assert.deepEqual(enabledMeals(),['breakfast','lunch','dinner']);assert.deepEqual(enabledMeals({meals:{breakfast:false}}),['lunch','dinner']);assert.equal(enabledMeals({meals:null}).length,3);
 const plan={'2026-10-19:breakfast':'b1','2026-10-19:lunch':'l1','2026-10-20:dinner':'out'};const filtered=activePlan(plan,{meals:{breakfast:false}});assert.equal(Object.keys(filtered).length,2);assert.equal(Object.keys(plan).length,3);assert.deepEqual(activePlan(plan,{}),plan);
 assert.equal(plannedNutrition(filtered,'2026-10-19').count,1);assert(!shoppingWithPantry(filtered,2,recipes).some(i=>i.name==='Haferflocken'));
});
test('automatic planning only fills enabled meals and ignores hidden choices for recommendations',()=>{
 const dates=calendarWeek('2026-10-19'),profile={meals:{breakfast:false}};const plan={'2026-10-19:breakfast':'b1','2026-11-02:breakfast':'b2'};const filled=smartFillWeek(plan,dates,profile,recipes,[],1);assert.equal(Object.keys(filled.plan).length,16);assert.equal(filled.plan['2026-10-19:breakfast'],'b1');assert(!filled.plan['2026-10-20:breakfast']);assert.equal(filled.plan['2026-11-02:breakfast'],'b2');assert.equal(filled.missing,0);
 assert.deepEqual(smartSuggestions({date:'2026-10-19',meal:'breakfast',profile,catalog:recipes}).recipes,[]);
 const none={meals:{breakfast:false,lunch:false,dinner:false}};assert.deepEqual(activePlan(plan,none),{});assert.deepEqual(smartFillWeek(plan,dates,none,recipes,[],1).plan,plan);
});
test('target proportions distribute only over enabled meals without division by zero',()=>{
 assert.equal(mealShare('breakfast',{}),.25);assert.equal(mealShare('lunch',{meals:{breakfast:false}}),.5);assert.equal(mealShare('breakfast',{meals:{breakfast:false}}),0);assert.equal(mealShare('dinner',{meals:{breakfast:false,lunch:false}}),1);assert.equal(mealShare('dinner',{meals:{breakfast:false,lunch:false,dinner:false}}),0);
});
