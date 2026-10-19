// 230 curated additions. Amounts are for one portion; IDs are independent of titles.
// Shared methods expand into complete instructions, not random ingredient combinations.
import {ingredientNutrition} from './food.js';
const I=(name,amount,unit='g')=>[name,amount,unit];
export const kitchenRecipes=[];
function add(id,meal,name,time,ingredients,steps,vegetarian=true){
 const combined=new Map();for(const [name,amount,unit]of ingredients){const key=name+'|'+unit;const previous=combined.get(key);combined.set(key,[name,(previous?.[1]||0)+amount,unit])}
 const list=[...combined.values()];const nutrition=ingredientNutrition(list);
 if(nutrition.missing.length)throw Error('Missing nutrition in '+id+': '+nutrition.missing.join(', '));
 kitchenRecipes.push({id:'kitchen-'+id,meal,name,time,vegetarian,ingredients:list,steps,nutrition,kcal:Math.round(nutrition.kcal/5)*5,protein:Math.round(nutrition.protein),subtitle:'Mehr Abwechslung aus eurer Alltagsküche'});
}
const wash='Obst und Gemüse waschen; bei Bedarf schälen, entkernen und klein schneiden.';
const pancakes=[
 ['apfel-cashew','Apfel-Cashew-Haferküchlein','Apfel','Cashewkerne'],
 ['birne-sesam','Birnen-Sesam-Haferküchlein','Birne','Sesam'],
 ['mango-mandel','Mango-Mandel-Haferküchlein','Mango','Mandeln'],
 ['pflaume-kuerbis','Pflaumen-Haferküchlein mit Kürbiskernen','Pflaumen','Kürbiskerne'],
 ['kiwi-kokos','Kiwi-Kokos-Haferküchlein','Kiwi','Kokosraspeln'],
 ['ananas-erdnuss','Ananas-Haferküchlein mit Erdnussmus','Ananas','Erdnussmus'],
 ['erdbeer-pistazie','Erdbeer-Pistazien-Haferküchlein','Erdbeeren','Pistazien, geschält'],
 ['himbeer-walnuss','Himbeer-Walnuss-Haferküchlein','Himbeeren','Walnüsse'],
 ['heidelbeer-sonnenblume','Heidelbeer-Haferküchlein mit Sonnenblumenkernen','Heidelbeeren','Sonnenblumenkerne'],
 ['nektarine-haselnuss','Nektarinen-Haselnuss-Haferküchlein','Nektarine','Haselnüsse'],
 ['kirsch-leinsamen','Kirsch-Haferküchlein mit Leinsamen','Kirschen, entsteint','Leinsamen'],
 ['orange-mandelmus','Orangen-Haferküchlein mit Mandelmus','Orange','Mandelmus'],
];
for(const [id,name,fruit,nuts]of pancakes)add('kuechlein-'+id,'breakfast',name,25,[I('Haferflocken',60),I('Eier',1,'Stk.'),I('Milch',80,'ml'),I('Rapsöl',5,'ml'),I(fruit,130),I(nuts,15)],[
 'Haferflocken fein mixen. Mit Ei und Milch zu einem dickflüssigen Teig verrühren und 5 Minuten quellen lassen.',
 `${wash} ${fruit} für das Topping vorbereiten. Nüsse oder Kerne gegebenenfalls hacken.`,
 'Eine beschichtete Pfanne auf mittlere Hitze erwärmen und dünn mit dem Öl bestreichen. Teig portionsweise zu kleinen Küchlein hineingeben.',
 `Auf jeder Seite etwa 3 Minuten vollständig durchbacken. Mit ${fruit} und ${nuts} servieren.`,
]);
const bakedOats=[
 ['apfel-kakao','Ofenhafer mit Apfel, Kakao und Kürbiskernen','Apfel','Kürbiskerne','Backkakao'],
 ['birne-kokos','Ofenhafer mit Birne, Kokos und Zimt','Birne','Kokosraspeln','Zimt'],
 ['banane-haselnuss','Ofenhafer mit Banane, Haselnüssen und Kakao','Banane','Haselnüsse','Backkakao'],
 ['mango-sesam','Ofenhafer mit Mango, Sesam und Zimt','Mango','Sesam','Zimt'],
 ['himbeer-mandel','Ofenhafer mit Himbeeren, Mandeln und Kakao','Himbeeren','Mandeln','Backkakao'],
 ['heidelbeer-cashew','Ofenhafer mit Heidelbeeren, Cashews und Zimt','Heidelbeeren','Cashewkerne','Zimt'],
 ['kirsch-erdnuss','Ofenhafer mit Kirschen, Erdnussmus und Kakao','Kirschen, entsteint','Erdnussmus','Backkakao'],
 ['pflaume-walnuss','Ofenhafer mit Pflaumen, Walnüssen und Zimt','Pflaumen','Walnüsse','Zimt'],
 ['ananas-leinsamen','Ofenhafer mit Ananas, Leinsamen und Zimt','Ananas','Leinsamen','Zimt'],
 ['nektarine-pistazie','Ofenhafer mit Nektarine, Pistazien und Zimt','Nektarine','Pistazien, geschält','Zimt'],
];
for(const [id,name,fruit,nut,spice]of bakedOats)add('ofenhafer-'+id,'breakfast',name,35,[I('Haferflocken',65),I('Haferdrink',160,'ml'),I('Sojajoghurt',100),I(fruit,140),I(nut,15),I(spice,spice==='Zimt'?1:5)],[
 'Ofen auf 180 °C Ober-/Unterhitze vorheizen. Eine kleine ofenfeste Form bereitstellen.',
 `${wash} ${fruit} in mundgerechte Stücke schneiden. Mit Haferflocken, Haferdrink und ${spice} in der Form vermengen.`,
 `Mit ${nut} belegen. Auf mittlerer Schiene etwa 25 Minuten backen, bis der Hafer weich und die Oberfläche leicht gebräunt ist.`,
 'Kurz abkühlen lassen und den Sojajoghurt erst zum Servieren dazugeben.',
]);
const morningSalads=[
 ['tomate-kichererbse','Frühstückssalat mit Tomate, Kichererbsen und Avocado','Tomaten','Kichererbsen','Avocado','Petersilie'],
 ['gurke-edamame','Frühstückssalat mit Gurke, Edamame und Feta','Gurke','Edamame, geschält, TK','Feta','Dill'],
 ['rotebete-bohne','Frühstückssalat mit Roter Bete, weißen Bohnen und Ricotta','Rote Bete, gegart','Weiße Bohnen, gekocht','Ricotta','Schnittlauch'],
 ['paprika-linse','Frühstückssalat mit Paprika, Linsen und Hüttenkäse','Paprika','Linsen, gekocht','Hüttenkäse','Petersilie'],
 ['radieschen-kichererbse','Frühstückssalat mit Radieschen, Kichererbsen und Feta','Radieschen','Kichererbsen','Feta','Minze'],
 ['karotte-bohne','Frühstückssalat mit Karotte, Kidneybohnen und Avocado','Karotten','Kidneybohnen, gekocht','Avocado','Petersilie'],
 ['gurke-linse','Frühstückssalat mit Gurke, Linsen und Mozzarella','Gurke','Linsen, gekocht','Mozzarella','Basilikum'],
 ['tomate-bohne','Frühstückssalat mit Tomate, weißen Bohnen und Hüttenkäse','Tomaten','Weiße Bohnen, gekocht','Hüttenkäse','Schnittlauch'],
 ['rotkohl-edamame','Frühstückssalat mit Rotkohl, Edamame und Avocado','Rotkohl','Edamame, geschält, TK','Avocado','Minze'],
 ['fenchel-kichererbse','Frühstückssalat mit Fenchel, Kichererbsen und Ricotta','Fenchel','Kichererbsen','Ricotta','Dill'],
];
for(const [id,name,veg,bean,top,herb]of morningSalads)add('fruehsalat-'+id,'breakfast',name,20,[I('Vollkornbrot',70),I(veg,140),I(bean,100),I(top,50),I(herb,5),I('Zitrone',.25,'Stk.'),I('Olivenöl',5,'ml')],[
 `${wash} ${veg} fein schneiden oder raspeln. Kräuter fein hacken.`,
 bean.includes('TK')?'Edamame nach Packungsangabe in kochendem Wasser vollständig garen, abgießen und abkühlen lassen.':'Bereits gegarte Hülsenfrüchte in einem Sieb abspülen und gut abtropfen lassen.',
 `Zitronensaft, Öl und ${herb} verrühren. Mit ${veg} und ${bean} vermengen und abschmecken.`,
 `${top} bei Bedarf schälen, vom Kern befreien oder würfeln und auf dem Salat verteilen. Mit dem Brot servieren.`,
]);
const savoryOats=[
 ['pilz-erbse','Herzhafte Haferpfanne mit Pilzen, Erbsen und Gouda','Champignons','Erbsen, TK','Gouda'],
 ['spinat-kichererbse','Herzhafte Haferpfanne mit Spinat, Kichererbsen und Feta','Spinat','Kichererbsen','Feta'],
 ['zucchini-bohne','Herzhafte Haferpfanne mit Zucchini, weißen Bohnen und Ricotta','Zucchini','Weiße Bohnen, gekocht','Ricotta'],
 ['paprika-edamame','Herzhafte Haferpfanne mit Paprika, Edamame und Tofu','Paprika','Edamame, geschält, TK','Tofu'],
 ['karotte-linse','Herzhafte Haferpfanne mit Karotte, Linsen und Frischkäse','Karotten','Linsen, gekocht','Frischkäse'],
 ['brokkoli-mais','Herzhafte Haferpfanne mit Brokkoli, Mais und Hüttenkäse','Brokkoli','Mais','Hüttenkäse'],
 ['lauch-kidney','Herzhafte Haferpfanne mit Lauch, Kidneybohnen und Mozzarella','Lauch','Kidneybohnen, gekocht','Mozzarella'],
 ['fenchel-erbse','Herzhafte Haferpfanne mit Fenchel, Erbsen und Feta','Fenchel','Erbsen, TK','Feta'],
 ['mangold-bohne','Herzhafte Haferpfanne mit Mangold, weißen Bohnen und Gouda','Mangold','Weiße Bohnen, gekocht','Gouda'],
 ['tomate-kichererbse','Herzhafte Haferpfanne mit Tomate, Kichererbsen und Tofu','Tomaten','Kichererbsen','Tofu'],
];
for(const [id,name,veg,bean,cheese]of savoryOats)add('haferpfanne-'+id,'breakfast',name,25,[I('Haferflocken',60),I(veg,150),I(bean,90),I(cheese,50),I('Zwiebel',30),I('Rapsöl',5,'ml'),I('Paprikapulver',1)],[
 `${wash} Gemüse sehr klein schneiden, Zwiebel fein würfeln. Tiefgekühlte Hülsenfrüchte nach Packungsangabe vorgaren; bereits gegarte abspülen.`,
 `Öl erhitzen. Zwiebel und ${veg} 5–7 Minuten unter Rühren anbraten. Bei Mangold die Stiele zuerst, Blätter erst zum Schluss zugeben.`,
 `Haferflocken, ${bean}, Paprikapulver und etwa 180 ml Wasser dazugeben. 7–10 Minuten bei geringer Hitze köcheln, bis Gemüse und Hafer weich sind. Wasser bei Bedarf ergänzen.`,
 `${cheese==='Tofu'?'Tofu klein würfeln und in der Pfanne mindestens 5 Minuten mit erhitzen.':cheese+' zerkleinern und unterrühren.'} Abschmecken und warm servieren.`,
]);
const quesadillas=[
 ['spinat-mais','Frühstücks-Quesadilla mit Spinat und Mais','Spinat','Mais','Gouda'],
 ['pilz-paprika','Frühstücks-Quesadilla mit Pilzen und Paprika','Champignons','Paprika','Mozzarella'],
 ['zucchini-erbse','Frühstücks-Quesadilla mit Zucchini und Erbsen','Zucchini','Erbsen, TK','Feta'],
 ['tomate-kidney','Frühstücks-Quesadilla mit Tomate und Kidneybohnen','Tomaten','Kidneybohnen, gekocht','Gouda'],
 ['lauch-kichererbse','Frühstücks-Quesadilla mit Lauch und Kichererbsen','Lauch','Kichererbsen','Feta'],
 ['paprika-bohne','Frühstücks-Quesadilla mit Paprika und weißen Bohnen','Paprika','Weiße Bohnen, gekocht','Mozzarella'],
 ['mangold-mais','Frühstücks-Quesadilla mit Mangold und Mais','Mangold','Mais','Gouda'],
 ['karotte-edamame','Frühstücks-Quesadilla mit Karotte und Edamame','Karotten','Edamame, geschält, TK','Feta'],
 ['brokkoli-linse','Frühstücks-Quesadilla mit Brokkoli und Linsen','Brokkoli','Linsen, gekocht','Mozzarella'],
 ['fenchel-erbse','Frühstücks-Quesadilla mit Fenchel und Erbsen','Fenchel','Erbsen, TK','Gouda'],
];
for(const [id,name,veg,bean,cheese]of quesadillas)add('fruehquesadilla-'+id,'breakfast',name,25,[I('Vollkornwraps',1,'Stk.'),I('Eier',1,'Stk.'),I(veg,120),I(bean,70),I(cheese,35),I('Rapsöl',5,'ml')],[
 `${wash} Gemüse fein schneiden. TK-Erbsen oder Edamame nach Packungsangabe vorgaren; gegarte Hülsenfrüchte abspülen. Käse zerkleinern.`,
 `Die Hälfte des Öls erhitzen. ${veg} unter Rühren 6–8 Minuten weich braten, dabei bei Bedarf etwas Wasser zufügen. ${bean} dazugeben und erhitzen.`,
 'Ei verquirlen, in die Gemüsepfanne geben und unter Rühren vollständig stocken lassen. Die Füllung aus der Pfanne nehmen.',
 `Wrap mit Gemüse-Ei-Füllung und ${cheese} zur Hälfte belegen und zusammenklappen. Mit dem restlichen Öl bei mittlerer Hitze auf beiden Seiten je 2–3 Minuten knusprig braten.`,
]);
const fruitGrains=[
 ['hirse-kiwi-himbeer','Frühstücks-Hirsesalat mit Kiwi und Himbeeren','Hirse','Kiwi','Himbeeren','Pistazien, geschält'],
 ['quinoa-orange-apfel','Frühstücks-Quinoasalat mit Orange und Apfel','Quinoa','Orange','Apfel','Kürbiskerne'],
 ['buchweizen-mango-kokos','Frühstücks-Buchweizensalat mit Mango und Kokos','Buchweizen','Mango','Ananas','Kokosraspeln'],
 ['hirse-pfirsich-kirsch','Frühstücks-Hirsesalat mit Pfirsich und Kirschen','Hirse','Pfirsich','Kirschen, entsteint','Mandeln'],
 ['quinoa-birne-traube','Frühstücks-Quinoasalat mit Birne und Trauben','Quinoa','Birne','Trauben','Walnüsse'],
 ['buchweizen-erdbeer-banane','Frühstücks-Buchweizensalat mit Erdbeeren und Banane','Buchweizen','Erdbeeren','Banane','Cashewkerne'],
 ['hirse-nektarine-blaubeer','Frühstücks-Hirsesalat mit Nektarine und Heidelbeeren','Hirse','Nektarine','Heidelbeeren','Sonnenblumenkerne'],
 ['quinoa-aprikose-himbeer','Frühstücks-Quinoasalat mit Aprikosen und Himbeeren','Quinoa','Aprikosen','Himbeeren','Haselnüsse'],
 ['buchweizen-pflaume-apfel','Frühstücks-Buchweizensalat mit Pflaumen und Apfel','Buchweizen','Pflaumen','Apfel','Leinsamen'],
 ['hirse-ananas-orange','Frühstücks-Hirsesalat mit Ananas und Orange','Hirse','Ananas','Orange','Sesam'],
];
for(const [id,name,grain,fruit,second,nuts]of fruitGrains)add('fruchtgetreide-'+id,'breakfast',name,30,[I(grain,60),I(fruit,100),I(second,100),I('Sojajoghurt',150),I(nuts,15),I('Minze',3)],[
 `${grain} in einem feinen Sieb abspülen und nach Packungsangabe in Wasser etwa 15–20 Minuten weich garen.`,
 'Getreide auf einem Teller ausbreiten und einige Minuten abkühlen lassen. Für spätere Verwendung rasch kühlen und im Kühlschrank aufbewahren.',
 `${wash} ${fruit} und ${second} vorbereiten. Minze fein hacken, Nüsse oder Kerne nach Bedarf zerkleinern.`,
 `Getreide mit Obst und Minze mischen. Mit Sojajoghurt und ${nuts} servieren.`,
]);
const spreads=[
 ['bohne-paprika','Weiße-Bohnen-Paprika-Aufstrich auf Brot','Weiße Bohnen, gekocht','Paprika','Sonnenblumenkerne','Petersilie'],
 ['kichererbse-karotte','Kichererbsen-Karotten-Aufstrich auf Brot','Kichererbsen','Karotten','Tahini','Kreuzkümmel'],
 ['kidney-tomate','Kidney-Tomaten-Aufstrich auf Brot','Kidneybohnen, gekocht','Tomaten','Kürbiskerne','Paprikapulver'],
 ['tofu-radieschen','Tofu-Radieschen-Aufstrich auf Brot','Tofu','Radieschen','Sesam','Schnittlauch'],
 ['linse-rotebete','Linsen-Rote-Bete-Aufstrich auf Brot','Linsen, gekocht','Rote Bete, gegart','Walnüsse','Dill'],
 ['bohne-avocado','Bohnen-Avocado-Aufstrich auf Brot','Weiße Bohnen, gekocht','Avocado','Kürbiskerne','Basilikum'],
 ['kichererbse-gurke','Kichererbsen-Gurken-Aufstrich auf Brot','Kichererbsen','Gurke','Mandelmus','Minze'],
 ['tofu-karotte','Tofu-Karotten-Aufstrich auf Brot','Tofu','Karotten','Erdnussmus','Ingwer'],
 ['linse-fenchel','Linsen-Fenchel-Aufstrich auf Brot','Linsen, gekocht','Fenchel','Cashewkerne','Petersilie'],
 ['kidney-rotkohl','Kidney-Rotkohl-Aufstrich auf Brot','Kidneybohnen, gekocht','Rotkohl','Tahini','Kreuzkümmel'],
];
for(const [id,name,base,veg,nuts,herb]of spreads)add('aufstrich-'+id,'breakfast',name,15,[I('Vollkornbrot',90),I(base,120),I(veg,80),I(nuts,15),I(herb,['Kreuzkümmel','Paprikapulver'].includes(herb)?1:4),I('Zitrone',.25,'Stk.'),I('Olivenöl',5,'ml')],[
 `${wash} ${veg} sehr fein raspeln oder würfeln. Kräuter beziehungsweise Ingwer fein hacken. Hülsenfrüchte abspülen, Tofu abtropfen lassen.`,
 `${base} mit Zitronensaft, Olivenöl und ${nuts} in einen Mixer geben. Bei Bedarf esslöffelweise Wasser hinzufügen und zu einem streichfähigen Aufstrich pürieren.`,
 `${veg} und ${herb} unterrühren. Mit Salz und Pfeffer abschmecken.`,
 'Brot nach Wunsch toasten und mit dem Aufstrich bestreichen. Übrigen Aufstrich abgedeckt im Kühlschrank aufbewahren und bald verbrauchen.',
]);
const shakshuka=[
 ['bohne-zucchini','Frühstücks-Shakshuka mit weißen Bohnen und Zucchini','Weiße Bohnen, gekocht','Zucchini'],
 ['kichererbse-spinat','Frühstücks-Shakshuka mit Kichererbsen und Spinat','Kichererbsen','Spinat'],
 ['kidney-paprika','Frühstücks-Shakshuka mit Kidneybohnen und Paprika','Kidneybohnen, gekocht','Paprika'],
 ['linse-pilz','Frühstücks-Shakshuka mit Linsen und Pilzen','Linsen, gekocht','Champignons'],
 ['erbse-mangold','Frühstücks-Shakshuka mit Erbsen und Mangold','Erbsen, TK','Mangold'],
];
for(const [id,name,bean,veg]of shakshuka)add('shakshuka-'+id,'breakfast',name,30,[I('Eier',2,'Stk.'),I('Tomaten, passiert',200),I(bean,90),I(veg,100),I('Zwiebel',40),I('Olivenöl',5,'ml'),I('Kreuzkümmel',1),I('Vollkornbrot',60)],[
 `${wash} Zwiebel und Gemüse klein schneiden. Bereits gegarte Hülsenfrüchte abspülen, TK-Erbsen nach Packungsangabe garen.`,
 `Öl in einer Pfanne mit Deckel erhitzen. Zwiebel und ${veg} 5 Minuten anbraten; bei Blattgemüse erst die Stiele, dann die Blätter zugeben.`,
 `Kreuzkümmel, passierte Tomaten und ${bean} unterrühren und etwa 8 Minuten köcheln lassen. Bei Bedarf etwas Wasser ergänzen und abschmecken.`,
 'Zwei Mulden formen und Eier einzeln hineinschlagen. Zugedeckt bei kleiner Hitze etwa 8–12 Minuten garen, bis Eiweiß und Eigelb vollständig gestockt sind. Mit Brot servieren.',
]);
const fritters=[
 ['zucchini-feta','Zucchini-Kartoffel-Puffer mit Fetaquark','Zucchini','Feta'],
 ['karotte-gouda','Karotten-Kartoffel-Puffer mit Goudaquark','Karotten','Gouda'],
 ['brokkoli-ricotta','Brokkoli-Kartoffel-Puffer mit Ricottaquark','Brokkoli','Ricotta'],
 ['blumenkohl-feta','Blumenkohl-Kartoffel-Puffer mit Fetaquark','Blumenkohl','Feta'],
 ['rotebete-huette','Rote-Bete-Kartoffel-Puffer mit Hüttenkäsequark','Rote Bete, gegart','Hüttenkäse'],
 ['sellerie-frischkaese','Sellerie-Kartoffel-Puffer mit Frischkäsequark','Sellerieknolle','Frischkäse'],
 ['kuerbis-ricotta','Kürbis-Kartoffel-Puffer mit Ricottaquark','Hokkaidokürbis','Ricotta'],
 ['lauch-gouda','Lauch-Kartoffel-Puffer mit Goudaquark','Lauch','Gouda'],
 ['spinat-feta','Spinat-Kartoffel-Puffer mit Fetaquark','Spinat','Feta'],
 ['rotkohl-huette','Rotkohl-Kartoffel-Puffer mit Hüttenkäsequark','Rotkohl','Hüttenkäse'],
 ['fenchel-ricotta','Fenchel-Kartoffel-Puffer mit Ricottaquark','Fenchel','Ricotta'],
 ['mangold-frischkaese','Mangold-Kartoffel-Puffer mit Frischkäsequark','Mangold','Frischkäse'],
];
for(const [id,name,veg,cheese]of fritters)add('puffer-'+id,'lunch',name,35,[I('Kartoffeln',180),I(veg,150),I('Eier',1,'Stk.'),I('Haferflocken',30),I('Rapsöl',10,'ml'),I('Magerquark',100),I(cheese,35),I('Schnittlauch',5)],[
 `${wash} Kartoffeln schälen, fein raspeln und in einem sauberen Tuch ausdrücken. ${veg} ebenfalls sehr fein raspeln oder hacken; Blattgemüse kurz zusammenfallen lassen und ausdrücken.`,
 'Kartoffeln und Gemüse mit Ei und Haferflocken vermengen, würzen und 5 Minuten quellen lassen. Die Masse soll gut formbar sein.',
 'Öl in einer beschichteten Pfanne erhitzen. Dünne Puffer formen und bei mittlerer Hitze auf jeder Seite etwa 5–7 Minuten braten, bis Kartoffeln weich und Eier vollständig gegart sind.',
 `${cheese} zerkleinern und mit Quark, gehacktem Schnittlauch und etwas Wasser cremig rühren. Abschmecken und zu den Puffern reichen.`,
]);
const pitas=[
 ['kichererbse-gurke','Pita mit Kichererbsen, Gurke und Minzjoghurt','Kichererbsen','Gurke','Minze'],
 ['bohne-paprika','Pita mit weißen Bohnen, Paprika und Basilikumjoghurt','Weiße Bohnen, gekocht','Paprika','Basilikum'],
 ['linse-rotebete','Pita mit Linsen, Roter Bete und Dilljoghurt','Linsen, gekocht','Rote Bete, gegart','Dill'],
 ['kidney-mais','Pita mit Kidneybohnen, Mais und Petersilienjoghurt','Kidneybohnen, gekocht','Mais','Petersilie'],
 ['tofu-karotte','Pita mit Tofu, Karotte und Schnittlauchjoghurt','Tofu','Karotten','Schnittlauch'],
 ['edamame-rotkohl','Pita mit Edamame, Rotkohl und Minzjoghurt','Edamame, geschält, TK','Rotkohl','Minze'],
 ['kichererbse-radieschen','Pita mit Kichererbsen, Radieschen und Dilljoghurt','Kichererbsen','Radieschen','Dill'],
 ['bohne-tomate','Pita mit weißen Bohnen, Tomate und Petersilienjoghurt','Weiße Bohnen, gekocht','Tomaten','Petersilie'],
 ['linse-fenchel','Pita mit Linsen, Fenchel und Basilikumjoghurt','Linsen, gekocht','Fenchel','Basilikum'],
 ['tofu-gurke','Pita mit Tofu, Gurke und Dilljoghurt','Tofu','Gurke','Dill'],
 ['kidney-avocado','Pita mit Kidneybohnen, Avocado und Minzjoghurt','Kidneybohnen, gekocht','Avocado','Minze'],
 ['edamame-paprika','Pita mit Edamame, Paprika und Schnittlauchjoghurt','Edamame, geschält, TK','Paprika','Schnittlauch'],
];
for(const [id,name,protein,veg,herb]of pitas)add('pita-'+id,'lunch',name,20,[I('Vollkornpita',1,'Stk.'),I(protein,130),I(veg,120),I('Römersalat',40),I('Naturjoghurt',80),I(herb,5),I('Zitrone',.25,'Stk.'),I('Olivenöl',5,'ml')],[
 `${wash} Gemüse und Salat fein schneiden. Kräuter hacken und mit Joghurt und Zitronensaft verrühren.`,
 protein==='Tofu'?'Tofu trocken tupfen, klein würfeln und in dem Öl 7–8 Minuten rundum anbraten.':protein.includes('TK')?'Edamame nach Packungsangabe kochen, abgießen und mit dem Öl vermengen.':'Bereits gegarte Hülsenfrüchte abspülen, abtropfen lassen und mit dem Öl und etwas Salz vermengen.',
 'Pita nach Packungsangabe erwärmen und vorsichtig zu einer Tasche aufschneiden.',
 `Mit Salat, ${veg}, ${protein} und Kräuterjoghurt füllen und direkt servieren.`,
]);
const pilafs=[
 ['reis-karotte-kidney','Reispilaf mit Karotten und Kidneybohnen','Basmatireis','Karotten','Kidneybohnen, gekocht','Kreuzkümmel'],
 ['bulgur-fenchel-kichererbse','Bulgurpilaf mit Fenchel und Kichererbsen','Bulgur','Fenchel','Kichererbsen','Paprikapulver'],
 ['hirse-paprika-bohne','Hirsepilaf mit Paprika und weißen Bohnen','Hirse','Paprika','Weiße Bohnen, gekocht','Currypulver'],
 ['quinoa-brokkoli-edamame','Quinoapilaf mit Brokkoli und Edamame','Quinoa','Brokkoli','Edamame, geschält, TK','Ingwer'],
 ['buchweizen-pilz-linse','Buchweizenpilaf mit Pilzen und Linsen','Buchweizen','Champignons','Linsen, gekocht','Paprikapulver'],
 ['reis-kuerbis-kichererbse','Reispilaf mit Kürbis und Kichererbsen','Reis','Hokkaidokürbis','Kichererbsen','Kreuzkümmel'],
 ['bulgur-aubergine-kidney','Bulgurpilaf mit Aubergine und Kidneybohnen','Bulgur','Aubergine','Kidneybohnen, gekocht','Paprikapulver'],
 ['quinoa-zucchini-erbse','Quinoapilaf mit Zucchini und Erbsen','Quinoa','Zucchini','Erbsen, TK','Currypulver'],
 ['hirse-blumenkohl-linse','Hirsepilaf mit Blumenkohl und Linsen','Hirse','Blumenkohl','Linsen, gekocht','Kreuzkümmel'],
 ['reis-lauch-bohne','Reispilaf mit Lauch und weißen Bohnen','Basmatireis','Lauch','Weiße Bohnen, gekocht','Paprikapulver'],
 ['buchweizen-gruenebohne-tofu','Buchweizenpilaf mit grünen Bohnen und Tofu','Buchweizen','Grüne Bohnen','Tofu','Ingwer'],
 ['bulgur-mangold-erbse','Bulgurpilaf mit Mangold und Erbsen','Bulgur','Mangold','Erbsen, TK','Kreuzkümmel'],
];
for(const [id,name,grain,veg,bean,spice]of pilafs)add('pilaf-'+id,'lunch',name,35,[I(grain,80),I(veg,180),I(bean,130),I('Zwiebel',40),I('Olivenöl',10,'ml'),I(spice,spice==='Ingwer'?5:2),I('Petersilie',5)],[
 `${wash} Gemüse klein schneiden, Zwiebel fein würfeln. ${grain} nach Packungsempfehlung vorbereiten. Gegarte Hülsenfrüchte abspülen oder Tofu würfeln.`,
 `Zwiebel im Öl glasig braten. ${veg} und ${spice} zugeben und kurz mitbraten. Bei Mangold die Blätter noch zurückhalten.`,
 `${grain} einrühren und Wasser entsprechend der Packungsangabe angießen. Etwa 15–25 Minuten sanft garen, bis das Getreide weich ist. Bei grünen Bohnen sicherstellen, dass sie mindestens 12 Minuten sprudelnd gegart werden.`,
 `${bean} zugeben und vollständig erhitzen; TK-Erbsen oder Edamame nach Packungsvorgabe ausreichend lange mitgaren. Mangoldblätter kurz vor Schluss einrühren. Abschmecken und mit gehackter Petersilie servieren.`,
]);
const noodlePans=[
 ['reisnudel-rotkohl-erdnuss','Reisnudelpfanne mit Rotkohl und Erdnuss-Tofu','Reisnudeln','Rotkohl','Tofu','Erdnussmus'],
 ['soba-karotte-tahini','Sobapfanne mit Karotten und Tahini-Edamame','Soba-Nudeln','Karotten','Edamame, geschält, TK','Tahini'],
 ['vollkorn-brokkoli-mandel','Vollkornnudelpfanne mit Brokkoli und Mandel-Tofu','Vollkornnudeln','Brokkoli','Tofu','Mandelmus'],
 ['reisnudel-paprika-tahini','Reisnudelpfanne mit Paprika und Tahini-Kichererbsen','Reisnudeln','Paprika','Kichererbsen','Tahini'],
 ['soba-zuckererbse-erdnuss','Sobapfanne mit Zuckererbsen und Erdnuss-Tofu','Soba-Nudeln','Zuckererbsen','Tofu','Erdnussmus'],
 ['vollkorn-pilz-tahini','Vollkornnudelpfanne mit Pilzen und Tahini-Linsen','Vollkornnudeln','Champignons','Linsen, gekocht','Tahini'],
 ['reisnudel-blumenkohl-mandel','Reisnudelpfanne mit Blumenkohl und Mandel-Edamame','Reisnudeln','Blumenkohl','Edamame, geschält, TK','Mandelmus'],
 ['soba-lauch-tahini','Sobapfanne mit Lauch und Tahini-Kichererbsen','Soba-Nudeln','Lauch','Kichererbsen','Tahini'],
 ['vollkorn-weisskohl-erdnuss','Vollkornnudelpfanne mit Weißkohl und Erdnuss-Tofu','Vollkornnudeln','Weißkohl','Tofu','Erdnussmus'],
 ['reisnudel-zucchini-mandel','Reisnudelpfanne mit Zucchini und Mandel-Linsen','Reisnudeln','Zucchini','Linsen, gekocht','Mandelmus'],
 ['soba-mangold-mandel','Sobapfanne mit Mangold und Mandel-Edamame','Soba-Nudeln','Mangold','Edamame, geschält, TK','Mandelmus'],
 ['vollkorn-karotte-tahini','Vollkornnudelpfanne mit Karotten und Tahini-Kidneybohnen','Vollkornnudeln','Karotten','Kidneybohnen, gekocht','Tahini'],
];
for(const [id,name,noodle,veg,protein,sauce]of noodlePans)add('nudelpfanne-'+id,'lunch',name,30,[I(noodle,80),I(veg,180),I(protein,140),I(sauce,20),I('Sojasauce',10,'ml'),I('Ingwer',5),I('Rapsöl',5,'ml'),I('Limette',.25,'Stk.')],[
 `${wash} Gemüse fein schneiden und Ingwer hacken. ${protein==='Tofu'?'Tofu trocken tupfen und würfeln.':protein.includes('TK')?'Edamame nach Packungsvorgabe in kochendem Wasser garen.':'Gegarte Hülsenfrüchte abspülen und abtropfen lassen.'}`,
 `${noodle} nach Packungsangabe garen. Etwas Kochwasser auffangen und Nudeln abgießen.`,
 `${protein==='Tofu'?'Tofu im Öl 5 Minuten anbraten, dann Gemüse und Ingwer zugeben.':'Gemüse und Ingwer im Öl anbraten, dann die Hülsenfrüchte hinzufügen.'} Alles 6–8 Minuten garen, bei Bedarf etwas Wasser ergänzen. Mangoldblätter erst gegen Ende zugeben.`,
 `${sauce} mit Sojasauce, Limettensaft und etwas warmem Kochwasser glatt rühren. Mit Nudeln und Gemüse vermengen und 2 Minuten erhitzen.`,
]);
const frittatas=[
 ['brokkoli-gouda','Kartoffel-Frittata mit Brokkoli und Gouda','Brokkoli','Gouda'],
 ['paprika-feta','Kartoffel-Frittata mit Paprika und Feta','Paprika','Feta'],
 ['pilz-ricotta','Kartoffel-Frittata mit Pilzen und Ricotta','Champignons','Ricotta'],
 ['zucchini-mozzarella','Kartoffel-Frittata mit Zucchini und Mozzarella','Zucchini','Mozzarella'],
 ['lauch-huette','Kartoffel-Frittata mit Lauch und Hüttenkäse','Lauch','Hüttenkäse'],
 ['spinat-gouda','Kartoffel-Frittata mit Spinat und Gouda','Spinat','Gouda'],
 ['fenchel-feta','Kartoffel-Frittata mit Fenchel und Feta','Fenchel','Feta'],
 ['kuerbis-ricotta','Kartoffel-Frittata mit Kürbis und Ricotta','Hokkaidokürbis','Ricotta'],
 ['mangold-mozzarella','Kartoffel-Frittata mit Mangold und Mozzarella','Mangold','Mozzarella'],
 ['karotte-huette','Kartoffel-Frittata mit Karotte und Hüttenkäse','Karotten','Hüttenkäse'],
];
for(const [id,name,veg,cheese]of frittatas)add('frittata-'+id,'lunch',name,40,[I('Kartoffeln',200),I(veg,150),I('Eier',2,'Stk.'),I('Milch',40,'ml'),I(cheese,50),I('Olivenöl',5,'ml'),I('Schnittlauch',5)],[
 'Ofen auf 180 °C Ober-/Unterhitze vorheizen. Kartoffeln schälen, in dünne Scheiben schneiden und etwa 10 Minuten in Wasser vorgaren.',
 `${wash} ${veg} klein schneiden und im Öl etwa 6 Minuten dünsten; bei Blattgemüse Stiele zuerst, Blätter zum Schluss garen. Kartoffeln und Gemüse in eine kleine Auflaufform geben.`,
 `Eier mit Milch, gehacktem Schnittlauch und ${cheese} verrühren. Mit Salz und Pfeffer würzen und über das Gemüse gießen.`,
 'Etwa 20 Minuten backen, bis die Eimasse auch in der Mitte vollständig gestockt ist. Vor dem Anschneiden kurz ruhen lassen.',
]);
const lunchSoups=[
 ['bohne-sellerie','Weiße-Bohnen-Sellerie-Suppe mit Dill','Weiße Bohnen, gekocht','Sellerieknolle','Dill'],
 ['kidney-kuerbis','Kidney-Kürbis-Suppe mit Kreuzkümmel','Kidneybohnen, gekocht','Hokkaidokürbis','Kreuzkümmel'],
 ['kichererbse-fenchel','Kichererbsen-Fenchel-Suppe mit Minze','Kichererbsen','Fenchel','Minze'],
 ['linse-karotte','Linsen-Karotten-Suppe mit Ingwer und Kokos','Linsen, gekocht','Karotten','Ingwer'],
 ['bohne-blumenkohl','Weiße-Bohnen-Blumenkohl-Suppe mit Petersilie','Weiße Bohnen, gekocht','Blumenkohl','Petersilie'],
 ['kidney-paprika','Kidney-Paprika-Suppe mit Paprikagewürz','Kidneybohnen, gekocht','Paprika','Paprikapulver'],
 ['kichererbse-lauch','Kichererbsen-Lauch-Suppe mit Dill','Kichererbsen','Lauch','Dill'],
 ['linse-rotebete','Linsen-Rote-Bete-Suppe mit Kreuzkümmel','Linsen, gekocht','Rote Bete, gegart','Kreuzkümmel'],
 ['bohne-zucchini','Weiße-Bohnen-Zucchini-Suppe mit Basilikum','Weiße Bohnen, gekocht','Zucchini','Basilikum'],
 ['kichererbse-brokkoli','Kichererbsen-Brokkoli-Suppe mit Petersilie','Kichererbsen','Brokkoli','Petersilie'],
];
for(const [id,name,bean,veg,herb]of lunchSoups)add('mittagssuppe-'+id,'lunch',name,30,[I(bean,180),I(veg,220),I('Zwiebel',40),I('Kokosmilch',60,'ml'),I('Olivenöl',5,'ml'),I(herb,['Kreuzkümmel','Paprikapulver'].includes(herb)?2:5),I('Vollkornbrot',70)],[
 `${wash} Gemüse klein schneiden. Zwiebel würfeln und die gegarten Hülsenfrüchte abspülen.`,
 `Öl erhitzen, Zwiebel glasig braten und ${veg} kurz mitbraten. Etwa 300 ml Wasser zugießen, salzen und 12–18 Minuten köcheln, bis das Gemüse weich ist.`,
 `${bean} und Kokosmilch einrühren und 5 Minuten erhitzen. ${herb} hacken beziehungsweise abmessen und dazugeben.`,
 'Nach Wunsch einen Teil der Suppe pürieren, bei Bedarf mit Wasser verdünnen und abschmecken. Brot dazu reichen.',
]);
const lentilSalads=[
 ['apfel-radieschen','Linsensalat mit Apfel, Radieschen und Walnüssen','Apfel','Radieschen','Walnüsse','Feta'],
 ['birne-fenchel','Linsensalat mit Birne, Fenchel und Haselnüssen','Birne','Fenchel','Haselnüsse','Gouda'],
 ['orange-rotebete','Linsensalat mit Orange, Roter Bete und Pistazien','Orange','Rote Bete, gegart','Pistazien, geschält','Ricotta'],
 ['mango-gurke','Linsensalat mit Mango, Gurke und Cashews','Mango','Gurke','Cashewkerne','Hüttenkäse'],
 ['traube-paprika','Linsensalat mit Trauben, Paprika und Mandeln','Trauben','Paprika','Mandeln','Feta'],
 ['pfirsich-tomate','Linsensalat mit Pfirsich, Tomate und Kürbiskernen','Pfirsich','Tomaten','Kürbiskerne','Mozzarella'],
 ['nektarine-karotte','Linsensalat mit Nektarine, Karotte und Sesam','Nektarine','Karotten','Sesam','Ricotta'],
 ['aprikose-rotkohl','Linsensalat mit Aprikosen, Rotkohl und Sonnenblumenkernen','Aprikosen','Rotkohl','Sonnenblumenkerne','Hüttenkäse'],
];
for(const [id,name,fruit,veg,nuts,cheese]of lentilSalads)add('fruchtlinsen-'+id,'lunch',name,20,[I('Linsen, gekocht',200),I(fruit,100),I(veg,130),I(nuts,15),I(cheese,50),I('Rucola',30),I('Olivenöl',5,'ml'),I('Senf',5),I('Zitrone',.25,'Stk.')],[
 'Bereits gegarte Linsen abspülen und gut abtropfen lassen.',
 `${wash} ${fruit} bei Bedarf schälen und entkernen. Obst und ${veg} klein schneiden, Rucola trocknen.`,
 'Zitronensaft mit Senf, Olivenöl und einem Esslöffel Wasser zu einem Dressing verrühren und würzen.',
 `Linsen mit Obst, Gemüse und Dressing vermischen. Mit Rucola, ${nuts} und zerkleinertem ${cheese} anrichten.`,
]);
const stuffed=[
 ['paprika-bulgur-bohne','Gefüllte Paprika mit Bulgur, weißen Bohnen und Mozzarella','Paprika','Bulgur','Weiße Bohnen, gekocht','Mozzarella'],
 ['zucchini-quinoa-linse','Gefüllte Zucchini mit Quinoa, Linsen und Feta','Zucchini','Quinoa','Linsen, gekocht','Feta'],
 ['aubergine-reis-kidney','Gefüllte Aubergine mit Reis, Kidneybohnen und Gouda','Aubergine','Reis','Kidneybohnen, gekocht','Gouda'],
 ['paprika-hirse-edamame','Gefüllte Paprika mit Hirse, Edamame und Ricotta','Paprika','Hirse','Edamame, geschält, TK','Ricotta'],
 ['zucchini-bulgur-kichererbse','Gefüllte Zucchini mit Bulgur, Kichererbsen und Mozzarella','Zucchini','Bulgur','Kichererbsen','Mozzarella'],
 ['aubergine-quinoa-bohne','Gefüllte Aubergine mit Quinoa, weißen Bohnen und Feta','Aubergine','Quinoa','Weiße Bohnen, gekocht','Feta'],
 ['paprika-reis-linse','Gefüllte Paprika mit Reis, Linsen und Ricotta','Paprika','Reis','Linsen, gekocht','Ricotta'],
 ['zucchini-hirse-kidney','Gefüllte Zucchini mit Hirse, Kidneybohnen und Gouda','Zucchini','Hirse','Kidneybohnen, gekocht','Gouda'],
 ['aubergine-bulgur-edamame','Gefüllte Aubergine mit Bulgur, Edamame und Mozzarella','Aubergine','Bulgur','Edamame, geschält, TK','Mozzarella'],
 ['paprika-quinoa-kichererbse','Gefüllte Paprika mit Quinoa, Kichererbsen und Feta','Paprika','Quinoa','Kichererbsen','Feta'],
 ['zucchini-reis-bohne','Gefüllte Zucchini mit Reis, weißen Bohnen und Ricotta','Zucchini','Reis','Weiße Bohnen, gekocht','Ricotta'],
 ['aubergine-hirse-linse','Gefüllte Aubergine mit Hirse, Linsen und Gouda','Aubergine','Hirse','Linsen, gekocht','Gouda'],
];
for(const [id,name,veg,grain,bean,cheese]of stuffed)add('ofenschiffchen-'+id,'dinner',name,veg==='Aubergine'?65:55,[I(veg,250),I(grain,60),I(bean,130),I(cheese,50),I('Tomaten, passiert',150),I('Zwiebel',40),I('Olivenöl',10,'ml'),I('Basilikum',5)],[
 `Ofen auf 200 °C Ober-/Unterhitze vorheizen. ${grain} nach Packungsangabe in Wasser garen. Hülsenfrüchte abspülen beziehungsweise TK-Edamame nach Packungsvorgabe kochen.`,
 `${wash} ${veg} längs halbieren. ${veg==='Paprika'?'Kerne und weiße Trennhäute entfernen.':'Mit einem Löffel etwas Fruchtfleisch herauslösen und fein hacken.'} Zwiebel würfeln.`,
 `Zwiebel${veg!=='Paprika'?' und herausgelöstes Fruchtfleisch':''} in der Hälfte des Öls 5 Minuten anbraten. Mit ${grain}, ${bean}, gehacktem Basilikum und der Hälfte der Tomaten vermischen und würzen.`,
 `Restliche Tomaten mit etwas Wasser in eine Form geben. Gemüsehälften mit der Füllung belegen, mit ${cheese} bestreuen und mit dem restlichen Öl beträufeln.`,
 `Etwa ${veg==='Aubergine'?'35–40':'25–30'} Minuten backen, bis das Gemüse vollständig weich und die Füllung heiß ist. Bei Bedarf gegen Ende abdecken.`,
]);
const gratins=[
 ['kartoffel-fenchel-gouda','Kartoffel-Fenchel-Gratin mit Gouda','Kartoffeln','Fenchel','Gouda'],
 ['suesskartoffel-brokkoli-feta','Süßkartoffel-Brokkoli-Gratin mit Feta','Süßkartoffel','Brokkoli','Feta'],
 ['kartoffel-lauch-mozzarella','Kartoffel-Lauch-Gratin mit Mozzarella','Kartoffeln','Lauch','Mozzarella'],
 ['suesskartoffel-blumenkohl-gouda','Süßkartoffel-Blumenkohl-Gratin mit Gouda','Süßkartoffel','Blumenkohl','Gouda'],
 ['kartoffel-pilz-ricotta','Kartoffel-Pilz-Gratin mit Ricotta','Kartoffeln','Champignons','Ricotta'],
 ['suesskartoffel-spinat-feta','Süßkartoffel-Spinat-Gratin mit Feta','Süßkartoffel','Spinat','Feta'],
 ['kartoffel-sellerie-mozzarella','Kartoffel-Sellerie-Gratin mit Mozzarella','Kartoffeln','Sellerieknolle','Mozzarella'],
 ['suesskartoffel-zucchini-ricotta','Süßkartoffel-Zucchini-Gratin mit Ricotta','Süßkartoffel','Zucchini','Ricotta'],
 ['kartoffel-mangold-gouda','Kartoffel-Mangold-Gratin mit Gouda','Kartoffeln','Mangold','Gouda'],
 ['suesskartoffel-paprika-mozzarella','Süßkartoffel-Paprika-Gratin mit Mozzarella','Süßkartoffel','Paprika','Mozzarella'],
 ['kartoffel-rotebete-feta','Kartoffel-Rote-Bete-Gratin mit Feta','Kartoffeln','Rote Bete, gegart','Feta'],
 ['suesskartoffel-kuerbis-ricotta','Süßkartoffel-Kürbis-Gratin mit Ricotta','Süßkartoffel','Hokkaidokürbis','Ricotta'],
];
for(const [id,name,tuber,veg,cheese]of gratins)add('gratin-'+id,'dinner',name,45,[I(tuber,250),I(veg,180),I('Milch',120,'ml'),I('Frischkäse',35),I(cheese,55),I('Olivenöl',5,'ml'),I('Knoblauch',3),I('Schnittlauch',5)],[
 `Ofen auf 200 °C Ober-/Unterhitze vorheizen. ${tuber} schälen, in dünne Scheiben schneiden und 8–10 Minuten in Wasser vorgaren.`,
 `${wash} ${veg} in kleine Stücke schneiden. Blattgemüse kurz dünsten und ausdrücken, feste Gemüsearten 5 Minuten vorgaren; gegarte Rote Bete nur schneiden. Eine Auflaufform mit dem Öl ausstreichen.`,
 'Milch mit Frischkäse, fein gehacktem Knoblauch und Schnittlauch verrühren und würzen. Gemüse und Knollenscheiben in die Form geben und mit der Sauce übergießen.',
 `${cheese} zerkleinern und darauf verteilen. Etwa 25 Minuten backen, bis das Gemüse weich und die Oberfläche goldbraun ist.`,
]);
const braises=[
 ['bohne-aubergine-hirse','Tomatenschmortopf mit weißen Bohnen, Aubergine und Hirse','Weiße Bohnen, gekocht','Aubergine','Hirse','Paprikapulver'],
 ['kidney-kuerbis-bulgur','Tomatenschmortopf mit Kidneybohnen, Kürbis und Bulgur','Kidneybohnen, gekocht','Hokkaidokürbis','Bulgur','Kreuzkümmel'],
 ['kichererbse-fenchel-reis','Tomatenschmortopf mit Kichererbsen, Fenchel und Reis','Kichererbsen','Fenchel','Reis','Paprikapulver'],
 ['linse-paprika-quinoa','Tomatenschmortopf mit Linsen, Paprika und Quinoa','Linsen, gekocht','Paprika','Quinoa','Kreuzkümmel'],
 ['bohne-karotte-buchweizen','Tomatenschmortopf mit weißen Bohnen, Karotte und Buchweizen','Weiße Bohnen, gekocht','Karotten','Buchweizen','Currypulver'],
 ['kidney-blumenkohl-reis','Tomatenschmortopf mit Kidneybohnen, Blumenkohl und Reis','Kidneybohnen, gekocht','Blumenkohl','Basmatireis','Paprikapulver'],
 ['kichererbse-gruenebohne-hirse','Tomatenschmortopf mit Kichererbsen, grünen Bohnen und Hirse','Kichererbsen','Grüne Bohnen','Hirse','Kreuzkümmel'],
 ['linse-zucchini-bulgur','Tomatenschmortopf mit Linsen, Zucchini und Bulgur','Linsen, gekocht','Zucchini','Bulgur','Currypulver'],
 ['bohne-lauch-quinoa','Tomatenschmortopf mit weißen Bohnen, Lauch und Quinoa','Weiße Bohnen, gekocht','Lauch','Quinoa','Paprikapulver'],
 ['kidney-weisskohl-buchweizen','Tomatenschmortopf mit Kidneybohnen, Weißkohl und Buchweizen','Kidneybohnen, gekocht','Weißkohl','Buchweizen','Kreuzkümmel'],
 ['kichererbse-sellerie-reis','Tomatenschmortopf mit Kichererbsen, Sellerie und Reis','Kichererbsen','Sellerieknolle','Naturreis','Currypulver'],
 ['linse-mangold-hirse','Tomatenschmortopf mit Linsen, Mangold und Hirse','Linsen, gekocht','Mangold','Hirse','Paprikapulver'],
];
for(const [id,name,bean,veg,grain,spice]of braises)add('schmortopf-'+id,'dinner',name,grain==='Naturreis'?45:40,[I(bean,180),I(veg,200),I(grain,65),I('Tomaten, passiert',180),I('Zwiebel',40),I('Olivenöl',10,'ml'),I(spice,2),I('Petersilie',5)],[
 `${grain} nach Packungsangabe in Wasser weich garen. Bereits gekochte Hülsenfrüchte abspülen und abtropfen lassen.`,
 `${wash} Gemüse klein schneiden und Zwiebel würfeln. Öl erhitzen, Zwiebel und Gemüse etwa 5 Minuten anbraten. Mangoldblätter zunächst zurückhalten.`,
 `${spice}, Tomaten und etwa 150 ml Wasser hinzufügen und 15–20 Minuten köcheln lassen, bis das Gemüse weich ist.${veg==='Grüne Bohnen'?' Grüne Bohnen vorher separat mindestens 12 Minuten in sprudelndem Wasser kochen und abgießen.':''}`,
 `${bean} und gegebenenfalls Mangoldblätter einrühren und 5 Minuten erhitzen. Abschmecken und mit ${grain} und gehackter Petersilie servieren.`,
]);
const fishDinners=[
 ['lachs-fenchel-quinoa','Lachspfanne mit Fenchel-Quinoa und Dilljoghurt','Lachsfilet','Fenchel','Quinoa','Dill'],
 ['kabeljau-paprika-bulgur','Kabeljaupfanne mit Paprika-Bulgur und Petersilienjoghurt','Kabeljaufilet','Paprika','Bulgur','Petersilie'],
 ['lachs-lauch-hirse','Lachspfanne mit Lauch-Hirse und Schnittlauchjoghurt','Lachsfilet','Lauch','Hirse','Schnittlauch'],
 ['kabeljau-brokkoli-reis','Kabeljaupfanne mit Brokkoli-Reis und Dilljoghurt','Kabeljaufilet','Brokkoli','Naturreis','Dill'],
 ['lachs-zucchini-buchweizen','Lachspfanne mit Zucchini-Buchweizen und Basilikumjoghurt','Lachsfilet','Zucchini','Buchweizen','Basilikum'],
 ['kabeljau-karotte-quinoa','Kabeljaupfanne mit Karotten-Quinoa und Minzjoghurt','Kabeljaufilet','Karotten','Quinoa','Minze'],
 ['lachs-blumenkohl-couscous','Lachspfanne mit Blumenkohl-Couscous und Petersilienjoghurt','Lachsfilet','Blumenkohl','Couscous','Petersilie'],
 ['kabeljau-pilz-hirse','Kabeljaupfanne mit Pilz-Hirse und Schnittlauchjoghurt','Kabeljaufilet','Champignons','Hirse','Schnittlauch'],
 ['lachs-spinat-bulgur','Lachspfanne mit Spinat-Bulgur und Minzjoghurt','Lachsfilet','Spinat','Bulgur','Minze'],
 ['kabeljau-kuerbis-reis','Kabeljaupfanne mit Kürbis-Reis und Basilikumjoghurt','Kabeljaufilet','Hokkaidokürbis','Basmatireis','Basilikum'],
];
for(const [id,name,fish,veg,grain,herb]of fishDinners)add('fischpfanne-'+id,'dinner',name,grain==='Naturreis'?45:40,[I(fish,180),I(veg,200),I(grain,70),I('Naturjoghurt',80),I(herb,5),I('Zitrone',.5,'Stk.'),I('Olivenöl',10,'ml')],[
 `${grain} nach Packungsangabe in Wasser garen. ${wash} Gemüse klein schneiden und Kräuter hacken.`,
 `${veg} in der Hälfte des Öls je nach Gemüseart 8–15 Minuten mit etwas Wasser weich dünsten. Bei Spinat genügen wenige Minuten. Mit dem gegarten ${grain} vermengen.`,
 `${fish} trocken tupfen und würzen. Im restlichen Öl bei mittlerer Hitze je nach Dicke insgesamt etwa 8–12 Minuten braten. Vollständig durchgaren: mindestens 63 °C im Kern für 2 Minuten; bei Bedarf Garzeit verlängern.`,
 `Joghurt mit ${herb}, Zitronensaft und etwas Salz verrühren. Fisch auf dem Gemüsegetreide anrichten und den Dip dazu reichen.`,
],false);
const poultryDinners=[
 ['haehnchen-kuerbis-quinoa','Hähnchenpfanne mit Kürbis-Quinoa und Mandelcreme','Hähnchenbrust','Hokkaidokürbis','Quinoa','Mandelmus'],
 ['pute-brokkoli-reis','Putenpfanne mit Brokkoli-Reis und Erdnusscreme','Putenbrust','Brokkoli','Basmatireis','Erdnussmus'],
 ['haehnchen-fenchel-bulgur','Hähnchenpfanne mit Fenchel-Bulgur und Tahinicreme','Hähnchenbrust','Fenchel','Bulgur','Tahini'],
 ['pute-paprika-hirse','Putenpfanne mit Paprika-Hirse und Mandelcreme','Putenbrust','Paprika','Hirse','Mandelmus'],
 ['haehnchen-karotte-buchweizen','Hähnchenpfanne mit Karotten-Buchweizen und Erdnusscreme','Hähnchenbrust','Karotten','Buchweizen','Erdnussmus'],
 ['pute-zucchini-quinoa','Putenpfanne mit Zucchini-Quinoa und Tahinicreme','Putenbrust','Zucchini','Quinoa','Tahini'],
 ['haehnchen-blumenkohl-reis','Hähnchenpfanne mit Blumenkohl-Reis und Mandelcreme','Hähnchenbrust','Blumenkohl','Naturreis','Mandelmus'],
 ['pute-pilz-bulgur','Putenpfanne mit Pilz-Bulgur und Erdnusscreme','Putenbrust','Champignons','Bulgur','Erdnussmus'],
 ['haehnchen-lauch-hirse','Hähnchenpfanne mit Lauch-Hirse und Tahinicreme','Hähnchenbrust','Lauch','Hirse','Tahini'],
 ['pute-mangold-couscous','Putenpfanne mit Mangold-Couscous und Mandelcreme','Putenbrust','Mangold','Couscous','Mandelmus'],
];
for(const [id,name,meat,veg,grain,sauce]of poultryDinners)add('gefluegelpfanne-'+id,'dinner',name,grain==='Naturreis'?45:40,[I(meat,170),I(veg,200),I(grain,70),I(sauce,20),I('Zitrone',.25,'Stk.'),I('Rapsöl',10,'ml'),I('Paprikapulver',2)],[
 `${grain} nach Packungsangabe in Wasser garen. ${wash} Gemüse klein schneiden. Geflügel auf einem separaten Brett in Streifen schneiden, anschließend Hände und Arbeitsflächen reinigen.`,
 'Die Hälfte des Öls erhitzen. Geflügel mit Paprikapulver würzen und rundum anbraten. Bei mittlerer Hitze vollständig durchgaren, bis mindestens 75 °C Kerntemperatur erreicht sind. Auf einen sauberen Teller legen.',
 `${veg} im restlichen Öl etwa 8–12 Minuten weich braten, bei Bedarf etwas Wasser ergänzen. Bei Mangold die Stiele vor den Blättern garen.`,
 `${sauce} mit Zitronensaft und etwas warmem Wasser cremig rühren. Mit Geflügel und Gemüse vermengen, nochmals erhitzen und auf ${grain} servieren.`,
],false);
const veganPans=[
 ['tofu-pilz-brokkoli','Tofupfanne mit Pilzen, Brokkoli und Tahini-Reis','Tofu','Champignons','Brokkoli','Tahini'],
 ['kichererbse-zucchini-paprika','Kichererbsenpfanne mit Zucchini, Paprika und Mandel-Reis','Kichererbsen','Zucchini','Paprika','Mandelmus'],
 ['bohne-karotte-fenchel','Bohnenpfanne mit Karotte, Fenchel und Erdnuss-Reis','Weiße Bohnen, gekocht','Karotten','Fenchel','Erdnussmus'],
 ['tofu-kuerbis-spinat','Tofupfanne mit Kürbis, Spinat und Mandel-Reis','Tofu','Hokkaidokürbis','Spinat','Mandelmus'],
 ['kidney-blumenkohl-lauch','Kidneypfanne mit Blumenkohl, Lauch und Tahini-Reis','Kidneybohnen, gekocht','Blumenkohl','Lauch','Tahini'],
 ['edamame-karotte-zuckererbse','Edamamepfanne mit Karotte, Zuckererbsen und Erdnuss-Reis','Edamame, geschält, TK','Karotten','Zuckererbsen','Erdnussmus'],
 ['tofu-weisskohl-paprika','Tofupfanne mit Weißkohl, Paprika und Tahini-Reis','Tofu','Weißkohl','Paprika','Tahini'],
 ['linse-aubergine-tomate','Linsenpfanne mit Aubergine, Tomate und Mandel-Reis','Linsen, gekocht','Aubergine','Tomaten','Mandelmus'],
 ['kichererbse-brokkoli-pilz','Kichererbsenpfanne mit Brokkoli, Pilzen und Erdnuss-Reis','Kichererbsen','Brokkoli','Champignons','Erdnussmus'],
 ['bohne-mangold-zucchini','Bohnenpfanne mit Mangold, Zucchini und Mandel-Reis','Weiße Bohnen, gekocht','Mangold','Zucchini','Mandelmus'],
 ['tofu-rotebete-fenchel','Tofupfanne mit Roter Bete, Fenchel und Erdnuss-Reis','Tofu','Rote Bete, gegart','Fenchel','Erdnussmus'],
];
for(const [id,name,protein,veg,second,sauce]of veganPans)add('pflanzenpfanne-'+id,'dinner',name,30,[I('Basmatireis',75),I(protein,160),I(veg,120),I(second,120),I(sauce,20),I('Rapsöl',5,'ml'),I('Sojasauce',10,'ml'),I('Ingwer',5)],[
 `Reis nach Packungsangabe kochen. ${wash} Gemüse mundgerecht schneiden und Ingwer hacken. Bereits gegarte Hülsenfrüchte abspülen, Tofu würfeln oder TK-Edamame nach Packungsvorgabe garen.`,
 `${protein==='Tofu'?'Tofu im Öl 5 Minuten anbraten, dann Ingwer und Gemüse hinzufügen.':'Öl erhitzen und Ingwer und Gemüse anbraten.'} Gemüse mit etwas Wasser 8–12 Minuten weich dünsten. Bei Mangold die Blätter erst zum Schluss zugeben.`,
 `${protein==='Tofu'?'Tofu in der Pfanne lassen.':protein+' zum Gemüse geben.'} ${sauce} mit Sojasauce und etwa 50 ml Wasser glatt rühren und in die Pfanne geben.`,
 'Alles nochmals 3–5 Minuten erhitzen. Sauce nach Bedarf mit Wasser verdünnen, abschmecken und mit dem Reis servieren.',
]);
const risottos=[
 ['reis-fenchel-erbse','Fenchel-Erbsen-Risotto mit Ricotta','Risottoreis','Fenchel','Erbsen, TK','Ricotta'],
 ['graupe-pilz-bohne','Pilz-Bohnen-Graupenrisotto mit Parmesan','Perlgraupen','Champignons','Weiße Bohnen, gekocht','Parmesan, vegetarisch'],
 ['reis-kuerbis-linse','Kürbis-Linsen-Risotto mit Feta','Risottoreis','Hokkaidokürbis','Linsen, gekocht','Feta'],
 ['graupe-karotte-kichererbse','Karotten-Kichererbsen-Graupenrisotto mit Ricotta','Perlgraupen','Karotten','Kichererbsen','Ricotta'],
 ['reis-brokkoli-edamame','Brokkoli-Edamame-Risotto mit Gouda','Risottoreis','Brokkoli','Edamame, geschält, TK','Gouda'],
 ['graupe-lauch-erbse','Lauch-Erbsen-Graupenrisotto mit Feta','Perlgraupen','Lauch','Erbsen, TK','Feta'],
 ['reis-paprika-bohne','Paprika-Bohnen-Risotto mit Parmesan','Risottoreis','Paprika','Weiße Bohnen, gekocht','Parmesan, vegetarisch'],
 ['graupe-mangold-linse','Mangold-Linsen-Graupenrisotto mit Gouda','Perlgraupen','Mangold','Linsen, gekocht','Gouda'],
 ['reis-zucchini-kichererbse','Zucchini-Kichererbsen-Risotto mit Ricotta','Risottoreis','Zucchini','Kichererbsen','Ricotta'],
 ['graupe-blumenkohl-edamame','Blumenkohl-Edamame-Graupenrisotto mit Parmesan','Perlgraupen','Blumenkohl','Edamame, geschält, TK','Parmesan, vegetarisch'],
];
for(const [id,name,grain,veg,bean,cheese]of risottos)add('risotto-'+id,'dinner',name,grain==='Perlgraupen'?45:35,[I(grain,75),I(veg,170),I(bean,100),I(cheese,45),I('Zwiebel',40),I('Olivenöl',5,'ml'),I('Zitrone',.25,'Stk.')],[
 `${wash} Gemüse klein schneiden, Zwiebel fein würfeln. Bereits gegarte Hülsenfrüchte abspülen; Tiefkühl-Erbsen oder Edamame nach Packungsangabe vorbereiten.`,
 `Zwiebel in Olivenöl glasig dünsten. ${grain} und Gemüse hinzufügen und kurz mitdünsten. Mangoldblätter zunächst zurückhalten.`,
 `Nach und nach heißes, leicht gesalzenes Wasser angießen und häufig umrühren. Insgesamt etwa 350–450 ml verwenden. ${grain==='Perlgraupen'?'Graupen nach Packungsangabe etwa 25–35 Minuten':'Reis etwa 18–22 Minuten'} weich und cremig garen.`,
 `${bean} und gegebenenfalls Mangoldblätter rechtzeitig zugeben und vollständig erhitzen; TK-Produkte mindestens entsprechend ihrer Packungsangabe garen. ${cheese} zerkleinern und unterrühren. Mit Zitronensaft und Pfeffer abschmecken.`,
]);
