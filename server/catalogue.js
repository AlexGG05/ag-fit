import {createHash} from 'node:crypto';
import {recipes,recipeCategories} from '../src/nutrition.js';
import {recipeKind} from '../src/recipe-kind.js';
import {validateCatalogue,normalizedTitle,ingredientSignature} from '../src/catalogue/validate.js';
import {fail,transaction} from './workspace.js';
const prepared=recipes.map((r,ordinal)=>({r,ordinal,data:JSON.stringify(r),name:normalizedTitle(r.name),signature:ingredientSignature(r),search:normalizedTitle([r.name,r.description,...r.ingredients.map(i=>i[0]),...r.tags].join(' '))}));
const digest=createHash('sha256').update(prepared.map(r=>r.data).join('\n')).digest('hex');
let validated=false;
export function migrateCatalogue(db){
 db.exec(`CREATE TABLE IF NOT EXISTS builtin_recipes(id TEXT PRIMARY KEY,category TEXT NOT NULL,name_key TEXT NOT NULL UNIQUE,ingredient_key TEXT NOT NULL UNIQUE,search_text TEXT NOT NULL,kind TEXT NOT NULL,diet TEXT NOT NULL,time REAL NOT NULL,protein REAL,ordinal INTEGER NOT NULL,data TEXT NOT NULL);CREATE INDEX IF NOT EXISTS builtin_recipes_category ON builtin_recipes(category,ordinal);CREATE INDEX IF NOT EXISTS builtin_recipes_diet ON builtin_recipes(diet,category);CREATE TABLE IF NOT EXISTS catalogue_imports(digest TEXT PRIMARY KEY,imported_at TEXT NOT NULL);`);
 if(db.prepare('SELECT 1 FROM catalogue_imports WHERE digest=?').get(digest)&&db.prepare('SELECT COUNT(*) AS count FROM builtin_recipes').get().count===recipes.length)return {total:recipes.length,inserted:0,unchanged:true};
 if(!validated){validateCatalogue(recipes);validated=true}
 return transaction(db,()=>{
  const before=db.prepare('SELECT COUNT(*) AS count FROM builtin_recipes').get().count;
  const insert=db.prepare('INSERT INTO builtin_recipes(id,category,name_key,ingredient_key,search_text,kind,diet,time,protein,ordinal,data) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET category=excluded.category,name_key=excluded.name_key,ingredient_key=excluded.ingredient_key,search_text=excluded.search_text,kind=excluded.kind,diet=excluded.diet,time=excluded.time,protein=excluded.protein,ordinal=excluded.ordinal,data=excluded.data');
  for(const {r,ordinal,data,name,signature,search}of prepared)insert.run(r.id,r.category,name,signature,search,recipeKind(r),r.diet,r.time,r.protein,ordinal,data);
  db.prepare("INSERT OR IGNORE INTO catalogue_imports VALUES(?,datetime('now'))").run(digest);
  db.exec("INSERT OR IGNORE INTO schema_migrations VALUES(9,datetime('now'))");
  return {total:recipes.length,inserted:recipes.length-before,unchanged:false};
 });
}
function integer(value,fallback,min,max){if(value===null)return fallback;if(!/^\d+$/.test(value))fail(400,'Ungültige Seitenauswahl.');const number=Number(value);if(!Number.isSafeInteger(number)||number<min||number>max)fail(400,'Ungültige Seitenauswahl.');return number}
export function catalogueRoute({db,path,method,params}){
 if(path!=='/api/catalogue'&&!path.startsWith('/api/catalogue/'))return null;
 if(method!=='GET')fail(405,'Der Rezeptkatalog ist nur lesbar.');
 if(path!=='/api/catalogue'){const id=decodeURIComponent(path.slice('/api/catalogue/'.length));const row=db.prepare('SELECT data FROM builtin_recipes WHERE id=?').get(id);if(!row)fail(404,'Rezept nicht gefunden.');return {recipe:JSON.parse(row.data)}}
 const limit=integer(params.get('limit'),24,1,100),offset=integer(params.get('offset'),0,0,1000000);const clauses=[],values=[];const category=params.get('category')||'all',diet=params.get('diet')||'all',kind=params.get('kind')||'all';
 if(category!=='all'){if(!recipeCategories.some(c=>c.id===category))fail(400,'Unbekannte Rezeptkategorie.');clauses.push('category=?');values.push(category)}
 if(diet!=='all'){if(!['Vegan','Vegetarisch','Mischkost'].includes(diet))fail(400,'Unbekannte Ernährungsform.');clauses.push(diet==='Vegetarisch'?"diet IN ('Vegan','Vegetarisch')":'diet=?');if(diet!=='Vegetarisch')values.push(diet)}
 if(kind!=='all'){if(!['casserole','soup','hearty','other'].includes(kind))fail(400,'Unbekannte Gerichtart.');clauses.push('kind=?');values.push(kind)}
 const query=params.get('q')||'';if(query.length>200)fail(400,'Suchtext zu lang.');for(const token of normalizedTitle(query).split(' ').filter(Boolean)){clauses.push('search_text LIKE ?');values.push('%'+token+'%')}
 if(params.get('quick')==='true')clauses.push('time<=25');if(params.get('highProtein')==='true')clauses.push('protein>=25');
 const where=clauses.length?' WHERE '+clauses.join(' AND '):'';
 const total=db.prepare('SELECT COUNT(*) AS count FROM builtin_recipes'+where).get(...values).count;
 const rows=db.prepare('SELECT data FROM builtin_recipes'+where+' ORDER BY ordinal LIMIT ? OFFSET ?').all(...values,limit,offset);
 return {total,limit,offset,categories:recipeCategories,recipes:rows.map(r=>JSON.parse(r.data))};
}
