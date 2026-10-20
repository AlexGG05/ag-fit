import {dateKey} from './food.js';
export function todayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
export function addDays(key,days){dateKey(key);const date=new Date(key+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+days);return dateKey(date.toISOString().slice(0,10))}
export function monday(key){dateKey(key);const date=new Date(key+'T12:00:00Z');return addDays(key,-(date.getUTCDay()+6)%7)}
export function calendarWeek(key){const start=monday(key);return Array.from({length:7},(_,i)=>{const key=addDays(start,i);return {key,date:new Date(key+'T12:00:00')}})}
export function weekLabel(key){const start=monday(key),thursday=new Date(addDays(start,3)+'T12:00:00Z'),year=thursday.getUTCFullYear();const first=monday(`${year}-01-04`);const number=1+Math.round((Date.parse(start)-Date.parse(first))/604800000);return `KW ${number} · ${year}`}
export function validateRange(start,end){dateKey(start);dateKey(end);const length=Math.round((Date.parse(end)-Date.parse(start))/86400000)+1;if(length<1||length>366)throw Error('Bitte einen Zeitraum von 1 bis 366 Tagen wählen.');return length}
export function planInRange(plan,start,end){validateRange(start,end);return Object.fromEntries(Object.entries(plan).filter(([key])=>/^\d{4}-\d{2}-\d{2}:(breakfast|lunch|dinner)$/.test(key)&&key.slice(0,10)>=start&&key.slice(0,10)<=end))}
