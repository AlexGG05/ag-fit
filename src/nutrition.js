import {matchesDiet} from './planner.js';
import {recipes,mealTypes} from './data.js';
import {suggestions} from './recipe-variety.js';
export {recipes,mealTypes,suggestions};
export function searchRecipes({search='',meal='all',vegetarian=false,quick=false,highProtein=false,favorites=null,catalog=recipes,diet=null}={}){
 const query=search.toLocaleLowerCase('de').trim();
 return catalog.filter(r=>!r.archived&&(!diet||matchesDiet(r,diet))&&(meal==='all'||r.meal===meal)&&(!vegetarian||r.vegetarian)&&(!quick||r.time<=25)&&(!highProtein||r.protein>=25)&&(!favorites||favorites.includes(r.id))&&(!query||[r.name,...r.ingredients.map(i=>i[0])].join(' ').toLocaleLowerCase('de').includes(query)));
}
export function fillWeek(plan,dates,diet,seed,refreshes={},catalog=recipes){
 const next={...plan};
 for(const date of dates)for(const meal of mealTypes){const key=`${date.key}:${meal.id}`;if(!next[key])next[key]=suggestions(date.key,meal.id,diet,seed,refreshes[key]||0,catalog)[0]?.id;}
 return next;
}
export function plannedNutrition(plan,date,catalog=recipes){return mealTypes.reduce((total,meal)=>{const recipe=catalog.find(r=>r.id===plan[`${date}:${meal.id}`]);if(recipe){total.kcal+=recipe.kcal??0;total.protein+=recipe.protein??0;total.count++}return total},{kcal:0,protein:0,count:0});}
const rows=[{y:0,h:300},{y:300,h:295},{y:595,h:296},{y:891,h:363}];
export function photoFrame(recipe){
 const name=recipe.name.toLowerCase();let index=4;
 if(/suppe|eintopf/.test(name))index=9;
 else if(/wrap|pita/.test(name))index=10;
 else if(/curry|dal|chili/.test(name))index=8;
 else if(/risotto|polenta|stroganoff/.test(name))index=12;
 else if(/nudel|pasta|spaghetti|lasagne|orzo|gnocchi/.test(name))index=/tofu|reisnudel|soba|sesam|erdnuss/.test(name)?14:5;
 else if(/lachs|kabeljau/.test(name))index=7;
 else if(/hähnchen|chicken|puten/.test(name))index=/salat/.test(name)?4:6;
 else if(/ofenkartoffel|ofensüßkartoffel|ofenkartoffel|kräuterquark/.test(name))index=15;
 else if(/ofen|blech|auflauf|gefüllte|lasagne|frittata/.test(name))index=11;
 else if(/caprese|burrata|tomaten.*mozzarella/.test(name))index=13;
 else if(recipe.meal==='breakfast'){
  if(/pancake/.test(name))index=2;
  else if(/brot|toast|stulle|rührei|omelett|shakshuka/.test(name))index=1;
  else if(/quark|skyr|joghurt|kefir|ricotta|hüttenkäse/.test(name))index=3;
  else index=0;
 }
 const col=index%4;const row=rows[Math.floor(index/4)];const x=[0,313,627,941][col];const w=[313,314,314,313][col];
 return {x,y:row.y,width:w,height:row.h};
}
