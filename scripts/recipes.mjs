import {recipes} from '../src/nutrition.js';
import {validateCatalogue} from '../src/catalogue/validate.js';
const report=validateCatalogue(recipes);
if(process.argv.includes('--seed')){
 const {createApp}=await import('../server.js');const {mkdir}=await import('node:fs/promises');const path=await import('node:path');
 const database=process.env.DATABASE_PATH||path.resolve('.data/ag-fit.sqlite');await mkdir(path.dirname(database),{recursive:true});
 const app=createApp({database});try{console.log(JSON.stringify({...report,database,import:app.catalogue},null,2))}finally{await app.close()}
}else console.log(JSON.stringify(report,null,2));
