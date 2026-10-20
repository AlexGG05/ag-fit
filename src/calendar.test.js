import test from 'node:test';
import assert from 'node:assert/strict';
import {monday,calendarWeek,weekLabel,addDays,validateRange,planInRange} from './calendar.js';
test('calendar weeks cross year, leap day and DST boundaries without losing days',()=>{
 assert.equal(monday('2027-01-03'),'2026-12-28');assert.equal(weekLabel('2027-01-03'),'KW 53 · 2026');assert.equal(weekLabel('2027-01-04'),'KW 1 · 2027');
 assert.equal(addDays('2028-02-28',1),'2028-02-29');assert.deepEqual(calendarWeek('2026-10-25').map(d=>d.key),['2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-24','2026-10-25']);
 assert.equal(addDays('2026-03-29',1),'2026-03-30');assert.throws(()=>monday('2026-02-30'));
});
test('shopping intervals include both endpoints and can cover a single day or several weeks',()=>{
 const plan={'2026-10-19:lunch':'l1','2026-10-20:dinner':'out','2026-10-26:lunch':'l2','2026-11-02:lunch':'l3'};
 assert.deepEqual(planInRange(plan,'2026-10-19','2026-10-19'),{'2026-10-19:lunch':'l1'});assert.equal(Object.keys(planInRange(plan,'2026-10-19','2026-10-26')).length,3);assert.equal(Object.keys(plan).length,4);
 assert.equal(validateRange('2026-10-19','2026-10-19'),1);assert.throws(()=>validateRange('2026-10-20','2026-10-19'));assert.throws(()=>validateRange('2026-01-01','2027-01-02'));
});
