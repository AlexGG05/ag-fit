// Missing preferences retain the existing three-meal behaviour, including old accounts.
export const mealIds=['breakfast','lunch','dinner'];
export function enabledMeals(profile={}){return mealIds.filter(id=>profile?.meals?.[id]!==false)}
export function activePlan(plan,profile){const enabled=new Set(enabledMeals(profile));return Object.fromEntries(Object.entries(plan||{}).filter(([key])=>enabled.has(key.split(':')[1])))}
export function mealShare(meal,profile){const enabled=enabledMeals(profile),weights={breakfast:.25,lunch:.375,dinner:.375};const total=enabled.reduce((sum,id)=>sum+weights[id],0);return enabled.includes(meal)&&total?weights[meal]/total:0}
