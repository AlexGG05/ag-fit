export function recipeKind(recipe){
 if(['casserole','soup','hearty'].includes(recipe.kind))return recipe.kind;
 const name=recipe.name.toLocaleLowerCase('de');
 if(/suppe/.test(name))return 'soup';
 if(/auflauf|gratin|lasagne/.test(name))return 'casserole';
 if(/pfanne|eintopf|schmor|gulasch|ragout|risotto|curry|dal|chili|ofengemüse|frikadelle|bratling|puffer|frittata/.test(name))return 'hearty';
 return 'other';
}
