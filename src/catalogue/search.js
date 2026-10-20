export const normalizedSearch=value=>String(value).trim().toLocaleLowerCase('de').normalize('NFKD').replace(/\p{M}/gu,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const indexes=new WeakMap();
export function searchableRecipe(recipe){if(!indexes.has(recipe))indexes.set(recipe,normalizedSearch([recipe.name,recipe.description||'',...recipe.ingredients.map(i=>i[0]),...(recipe.tags||[])].join(' ')));return indexes.get(recipe)}
