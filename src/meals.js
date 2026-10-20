// Missing preferences retain the existing three-meal behaviour, including old accounts.
export const mealIds=['breakfast','lunch','dinner'];
export function enabledMeals(profile={}){return mealIds.filter(id=>profile?.meals?.[id]!==false)}
export function activePlan(plan,profile){const enabled=new Set(enabledMeals(profile));return Object.fromEntries(Object.entries(plan||{}).filter(([key])=>enabled.has(key.split(':')[1])))}
export function mealShare(meal,profile){const enabled=enabledMeals(profile),weights={breakfast:.25,lunch:.375,dinner:.375};const total=enabled.reduce((sum,id)=>sum+weights[id],0);return enabled.includes(meal)&&total?weights[meal]/total:0}
// Extra catalogue categories are optional recipes, planned into an active daily meal.
export function recipeEnabled(recipe,profile){const enabled=enabledMeals(profile);return ['snack','dessert','drink'].includes(recipe.category||recipe.meal)?enabled.length>0:enabled.includes(recipe.meal)}
export function categoryEnabled(category,profile){const enabled=enabledMeals(profile);return ['snack','dessert','drink'].includes(category)?enabled.length>0:category==='mealprep'?enabled.some(m=>m==='lunch'||m==='dinner'):enabled.includes(category)}
