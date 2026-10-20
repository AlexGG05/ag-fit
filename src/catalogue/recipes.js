// Original AG Fit recipes. Fixed, culinary-compatible compositions, never random.
// Each named preparation family has a different dough, base, texture or cooking method.
// Each composition changes multiple substantial ingredients, not just a garnish.
import {ingredientNutrition} from '../food.js';
import {referenceFoods} from './references.js';
const I=(name,amount,unit='g')=>[name,amount,unit];
const ML=(name,amount)=>I(name,amount,'ml');
const profiles=[
 ['apfel-pflaume-walnuss','Apfel, Pflaume und Walnuss','Apfel','Pflaumen','Walnüsse'],
 ['birne-brombeere-sonnenblume','Birne, Brombeere und Sonnenblumenkernen','Birne','Brombeeren','Sonnenblumenkerne'],
 ['pfirsich-himbeere-mandel','Pfirsich, Himbeere und Mandeln','Pfirsich','Himbeeren','Mandeln'],
 ['mango-ananas-kokos','Mango, Ananas und Kokos','Mango','Ananas','Kokosraspeln'],
 ['banane-erdbeere-erdnuss','Banane, Erdbeere und Erdnussmus','Banane','Erdbeeren','Erdnussmus'],
 ['kirsche-orange-pistazie','Kirsche, Orange und Pistazien','Kirschen, entsteint','Orange','Pistazien, geschält'],
 ['aprikose-heidelbeere-cashew','Aprikose, Heidelbeere und Cashews','Aprikosen','Heidelbeeren','Cashewkerne'],
 ['kiwi-papaya-chia','Kiwi, Papaya und Chiasamen','Kiwi','Papaya','Chiasamen'],
 ['nektarine-traube-kuerbiskern','Nektarine, Traube und Kürbiskernen','Nektarine','Trauben','Kürbiskerne'],
 ['granatapfel-erdbeere-sesam','Granatapfel, Erdbeere und Sesam','Granatapfelkerne','Erdbeeren','Sesam'],
 ['apfel-mango-haselnuss','Apfel, Mango und Haselnüssen','Apfel','Mango','Haselnüsse'],
 ['birne-aprikose-leinsamen','Birne, Aprikose und Leinsamen','Birne','Aprikosen','Leinsamen'],
 ['banane-brombeere-mandelmus','Banane, Brombeere und Mandelmus','Banane','Brombeeren','Mandelmus'],
];
// Protein, vegetables and characteristic seasoning are selected together.
// Pulses are cooked/drained; meat and fish are raw edible weights.
const savoury=[
 ['kichererbse-aubergine-tomate','Kichererbsen, Aubergine und Tomate','Kichererbsen',160,'Aubergine','Tomaten',[I('Tahini',10),ML('Zitronensaft',10)]],
 ['tofu-brokkoli-karotte','Tofu, Brokkoli und Karotte','Tofu',150,'Brokkoli','Karotten',[ML('Sojasauce',8),I('Ingwer',4)]],
 ['weissebohne-fenchel-sellerie','weißen Bohnen, Fenchel und Sellerie','Weiße Bohnen, gekocht',170,'Fenchel','Sellerieknolle',[I('Dill',3),ML('Zitronensaft',12)]],
 ['schwarzbohne-paprika-mais','schwarzen Bohnen, Paprika und Mais','Schwarze Bohnen, gekocht',160,'Paprika','Mais',[ML('Limettensaft',10),I('Kreuzkümmel',1)]],
 ['linse-blumenkohl-lauch','Linsen, Blumenkohl und Lauch','Linsen, gekocht',170,'Blumenkohl','Lauch',[I('Senf',6),I('Petersilie',4)]],
 ['kidney-kuerbis-gruenkohl','Kidneybohnen, Kürbis und Grünkohl','Kidneybohnen, gekocht',170,'Hokkaidokürbis','Grünkohl',[I('Paprikapulver',1),I('Kürbiskerne',8)]],
 ['haehnchen-zucchini-paprika','Hähnchen, Zucchini und Paprika','Hähnchenbrust',140,'Zucchini','Paprika',[I('Basilikum',4),ML('Zitronensaft',10)]],
 ['pute-pilz-mangold','Pute, Pilzen und Mangold','Putenbrust',140,'Champignons','Mangold',[I('Senf',6),I('Petersilie',4)]],
 ['lachs-rotebete-weisskohl','Lachs, Roter Bete und Weißkohl','Lachsfilet',130,'Rote Bete, gegart','Weißkohl',[I('Dill',4),ML('Zitronensaft',12)]],
 ['rind-karotte-spinat','Rinderhack, Karotte und Spinat','Rinderhackfleisch, 5 % Fett',130,'Karotten','Spinat',[I('Tomaten, passiert',60),I('Oregano, getrocknet',1)]],
 ['edamame-rotebete-gurke','Edamame, Roter Bete und Gurke','Edamame, geschält, TK',160,'Rote Bete, gegart','Gurke',[I('Sesam',6),ML('Limettensaft',10)]],
 ['kabeljau-fenchel-brokkoli','Kabeljau, Fenchel und Brokkoli','Kabeljaufilet',150,'Fenchel','Brokkoli',[I('Oliven, entsteint',15),I('Basilikum',4)]],
];
export const issue2Recipes=[];
function combine(list){const map=new Map();for(const [name,amount,unit]of list){const key=name+'|'+unit;const old=map.get(key);map.set(key,[name,Math.round(((old?.[1]||0)+amount)*100)/100,unit])}return [...map.values()]}
function add(category,family,composition,name,time,ingredients,steps,extra={}){
 const list=combine(ingredients);const nutrition=ingredientNutrition(list,referenceFoods);
 if(nutrition.missing.length)throw Error('Missing source reference: '+family+' '+nutrition.missing.join(', '));
 const vegetarian=!list.some(([n])=>/Hähnchen|Puten|Lachs|Rinder|Kabeljau|Schweine/.test(n));
 issue2Recipes.push({id:`atlas-${category}-${family}-${composition}`,category,meal:['breakfast','lunch','dinner'].includes(category)?category:category==='mealprep'?(issue2Recipes.filter(r=>r.category==='mealprep').length%2?'dinner':'lunch'):category,name,time,vegetarian,ingredients:list,steps,nutrition,kcal:nutrition.kcal,protein:nutrition.protein,description:`${name}: ${extra.description||'Die Zutaten ergeben eine Portion; die Schritte erklären Zubereitung und Servieren.'}`,subtitle:extra.description||'Abwechslungsreiche Alltagsküche',servings:1,baseServings:1,family,composition,nutritionSource:'usda-sr28',recipeSource:'AG Fit · eigene Rezepttexte',imageKind:'placeholder',...extra});
}
function sweetSteps(p,fruit=160,crunch=10){return [`${p[2]} und ${p[3]} waschen; Schalen, Kerne und Steine bei Bedarf entfernen. Die angegebenen Mengen beziehen sich auf den essbaren Anteil. In kleine Stücke schneiden.`,`Für die Fruchtmischung ${Math.round(fruit*.55*100)/100} g ${p[2]} und ${Math.round(fruit*.45*100)/100} g ${p[3]} abmessen. ${crunch} g ${p[4]} als Kernanteil zurückbehalten und hacken oder als Mus bereithalten. Weitere Mengen derselben Zutat aus der Liste gehören zur Basis; Chia- oder Leinsamen ganz verwenden.`]}
function sweetIngredients(p,fruit=160,crunch=10){return [I(p[2],fruit*.55),I(p[3],fruit*.45),I(p[4],crunch)]}
const fruitFinish='Die vorbereiteten Früchte und den Kern- oder Nussanteil auf der fertigen Basis verteilen. Nussmus gegebenenfalls mit einem Teelöffel Wasser glatt rühren.';
// Breakfast: 18 preparations x 13 complete compositions = 234 additions.
const breakfast=[
 ['buchweizenbrei','Buchweizen-Milchbrei',30,[I('Buchweizen',55),ML('Milch',150),ML('Wasser',130)],['Buchweizen heiß abspülen. Mit Milch und Wasser aufkochen und zugedeckt bei kleiner Hitze 20–25 Minuten weich garen; gelegentlich umrühren.',fruitFinish]],
 ['hirse-quinoa-topf','Hirse-Quinoa-Frühstückstopf',30,[I('Hirse',35),I('Quinoa',25),ML('Sojadrink',180),ML('Wasser',120)],['Hirse und Quinoa heiß abspülen. Mit Sojadrink und Wasser aufkochen, 20 Minuten leise köcheln und 5 Minuten nachquellen lassen.',fruitFinish]],
 ['polentaschnitten','Warme Frühstücks-Polentaschnitten',35,[I('Polenta',55),ML('Milch',180),ML('Wasser',100),I('Ricotta',50)],['Milch und Wasser aufkochen. Polenta einrieseln lassen und nach Packungsangabe unter Rühren garen. Ricotta einrühren und 2 cm hoch auf einen Teller streichen.','15 Minuten fest werden lassen, in Stücke schneiden und mit Früchten und dem Kernanteil servieren.']],
 ['roggen-kuechlein','Roggen-Joghurt-Pfannküchlein',25,[I('Roggenvollkornmehl',50),I('Naturjoghurt',80),I('Eier',60),I('Backpulver',2),ML('Rapsöl',4)],['Mehl, Joghurt, Ei und Backpulver verrühren und 5 Minuten quellen lassen. Bei Bedarf einen Esslöffel Wasser ergänzen.','Öl in einer beschichteten Pfanne erhitzen. Vier kleine Küchlein bei mittlerer Hitze je Seite 3–4 Minuten braten, bis der Teig vollständig gestockt ist.',fruitFinish]],
 ['buchweizenwaffeln','Buchweizen-Milchwaffeln',25,[I('Buchweizenmehl',55),ML('Milch',80),I('Eier',60),I('Backpulver',2),ML('Rapsöl',4)],['Mehl, Milch, Ei, Backpulver und die Hälfte des Öls glatt rühren und 5 Minuten ruhen lassen.','Waffeleisen vorheizen und mit dem übrigen Öl dünn bestreichen. Teig portionsweise 4–6 Minuten vollständig durchbacken.',fruitFinish]],
 ['vollkorncrepes','Zarte Vollkorn-Frühstückscrêpes',30,[I('Weizenvollkornmehl',50),ML('Milch',100),I('Eier',60),ML('Rapsöl',4)],['Mehl, Milch und Ei zu einem dünnflüssigen Teig verquirlen. 10 Minuten quellen lassen.','Pfanne mit dem Öl dünn ausstreichen. Zwei dünne Crêpes bei mittlerer Hitze je Seite 2–3 Minuten vollständig durchbacken und auf Teller legen.','Mit der vorbereiteten Fruchtmischung und dem Kernanteil füllen und locker zusammenklappen.']],
 ['hafer-dattel-schnitten','Saftige Hafer-Dattel-Frühstücksschnitten',40,[I('Haferflocken',50),I('Datteln',20),I('Eier',60),ML('Milch',70),I('Backpulver',2)],['Ofen auf 180 °C Ober-/Unterhitze vorheizen. Datteln fein hacken und mit Hafer, Milch, Ei und Backpulver verrühren. 5 Minuten quellen lassen.','Eine kleine Form mit Backpapier auslegen. Teig hineingeben und 25–30 Minuten backen, bis er innen fest ist. 5 Minuten abkühlen lassen und schneiden.',fruitFinish]],
 ['reisdampf-kuechlein','Gedämpfte Reismehl-Frühstücksküchlein',30,[I('Reismehl',55),I('Eier',60),ML('Milch',55),I('Backpulver',2),ML('Rapsöl',2)],['Reismehl, Ei, Milch und Backpulver glatt verrühren. Zwei hitzefeste Förmchen mit dem Öl bestreichen und den Teig einfüllen.','Förmchen in einen Dämpfeinsatz über siedendes Wasser stellen. Zugedeckt 20–25 Minuten dämpfen; der Deckel darf den Teig nicht berühren. Stäbchenprobe machen und vollständig durchgaren.',fruitFinish]],
 ['huettenkaese-creme','Hüttenkäse-Joghurt-Frühstückscreme',10,[I('Hüttenkäse',130),I('Naturjoghurt',70),I('Haferflocken',25)],['Hüttenkäse mit Joghurt cremig verrühren; auf Wunsch kurz pürieren. Haferflocken unterheben und 5 Minuten quellen lassen.',fruitFinish]],
 ['quinoa-chia-glas','Quinoa-Chia-Frühstücksglas',40,[I('Quinoa',35),I('Chiasamen',12),ML('Sojadrink',170),ML('Wasser',90)],['Quinoa heiß abspülen und in Wasser 15–20 Minuten garen. Abkühlen lassen.','Chiasamen in den Sojadrink rühren, nach 5 Minuten erneut umrühren und 20 Minuten quellen lassen. Mit Quinoa und der Fruchtmischung in ein Glas schichten; den Kernanteil obenauf geben.']],
 ['frucht-ricotta-teller','Frühstücksteller mit Ricotta und Knäcke',10,[I('Ricotta',100),I('Knäckebrot',35),I('Naturjoghurt',50)],['Ricotta und Joghurt cremig rühren. Mit der vorbereiteten Fruchtmischung auf einem Teller anrichten.','Den Kernanteil darübergeben und das Knäckebrot erst beim Essen dazu reichen, damit es knusprig bleibt.']],
 ['roggen-arme-ritter','Roggen-Arme-Ritter zum Frühstück',20,[I('Roggenbrot',70),I('Eier',60),ML('Milch',70),ML('Rapsöl',4)],['Ei und Milch in einem tiefen Teller verquirlen. Roggenbrot von beiden Seiten darin wenden und 2 Minuten einziehen lassen.','Öl in einer Pfanne erhitzen. Brot je Seite 3–4 Minuten bei mittlerer Hitze vollständig durchgaren; übrig gebliebene Eimischung daneben als Rührei durchbraten.',fruitFinish]],
 ['hefe-fruehstuecksfladen','Frisch gebackene Roggen-Frühstücksfladen',100,[I('Weizenvollkornmehl',55),I('Roggenvollkornmehl',20),I('Trockenhefe',2),ML('Wasser',55),ML('Rapsöl',3),I('Naturjoghurt',70)],['Mehle und Hefe mischen. Lauwarmes Wasser und Öl zugeben, 5 Minuten kneten und zugedeckt 60 Minuten gehen lassen.','Ofen auf 210 °C vorheizen. Zwei kleine Fladen formen und auf Backpapier 18–22 Minuten backen, bis sie innen durchgebacken sind.','Etwas abkühlen lassen und mit Joghurt, der Fruchtmischung und dem Kernanteil servieren.']],
 ['reis-hirse-fruehstuecksauflauf','Reis-Hirse-Frühstücksauflauf',65,[I('Reis',30),I('Hirse',25),ML('Milch',180),ML('Wasser',150),I('Eier',60)],['Reis und Hirse abspülen. In Milch und Wasser 25 Minuten weich kochen und 5 Minuten abkühlen lassen. Ofen auf 180 °C vorheizen.','Ei unter den Brei rühren. In eine kleine Form füllen und 20–25 Minuten backen, bis die Eimasse vollständig gestockt ist.',fruitFinish]],
 ['hafer-nussmus-muesli','Geröstetes Hafer-Mandelmus-Müsli',20,[I('Haferflocken',45),I('Mandelmus',12),I('Naturjoghurt',150),ML('Wasser',15)],['Haferflocken in einer trockenen Pfanne 4 Minuten unter Rühren rösten. Mandelmus mit Wasser verrühren, untermischen und 2 Minuten bei kleiner Hitze weiterrösten. Abkühlen lassen.','Mit Joghurt, der Fruchtmischung und dem Kernanteil in einer Schüssel anrichten.']],
 ['weizengriess-ricotta','Vollkorngrieß mit Ricotta-Wirbel',15,[I('Vollkorngrieß',45),ML('Milch',220),I('Ricotta',70)],['Milch aufkochen. Grieß unter Rühren einstreuen und nach Packungsangabe bei kleiner Hitze 5–8 Minuten ausquellen lassen.','Vom Herd nehmen und Ricotta locker unterziehen, sodass die Creme marmoriert bleibt.',fruitFinish]],
 ['hafermehl-fruehstueckssouffle','Ofen-Frühstückssoufflé mit Hafermehl',40,[I('Hafermehl',35),I('Eier',120),ML('Milch',80),I('Naturjoghurt',50),ML('Rapsöl',2)],['Ofen auf 180 °C vorheizen. Eier trennen. Eigelbe mit Hafermehl, Milch und Joghurt verrühren. Eiweiß steif schlagen und vorsichtig unterheben.','Eine kleine ofenfeste Form mit dem Öl ausstreichen. Masse einfüllen und 25–30 Minuten backen, bis sie vollständig gestockt ist. Sofort servieren.',fruitFinish]],
 ['overnight-buchweizen','Übernacht-Buchweizen-Mandelglas',510,[I('Buchweizen',45),I('Mandeln',12),I('Naturjoghurt',130),ML('Wasser',150)],['Buchweizen 15–20 Minuten in Wasser weich kochen, abgießen und zügig abkühlen lassen. Mandeln hacken.','Buchweizen und Mandeln mit Joghurt mischen und zugedeckt mindestens 8 Stunden bei höchstens 5 °C quellen lassen. Die Früchte und den Kernanteil erst vor dem Essen dazugeben.']],
];
for(const [id,title,time,base,method]of breakfast)for(const p of profiles)add('breakfast',id,p[0],`${title} mit ${p[1]}`,time,[...base,...sweetIngredients(p)],[...sweetSteps(p),...method]);
// Sweet snacks: 13 different portable or freshly prepared foods x 12 compositions.
const sweetSnacks=[
 ['dattel-pralinen','Dattel-Hafer-Pralinen',30,[I('Datteln',25),I('Haferflocken',20),I('Backkakao',3)],'balls'],
 ['vollkorn-muffins','Kleine Vollkorn-Joghurtmuffins',35,[I('Weizenvollkornmehl',30),I('Eier',30),I('Naturjoghurt',35),I('Backpulver',1),ML('Rapsöl',3)],'muffin'],
 ['reiscracker','Selbst gebackene Reismehl-Cracker',40,[I('Reismehl',25),I('Sesam',5),ML('Wasser',18),ML('Rapsöl',3)],'cracker'],
 ['hafer-cookies','Weiche Hafer-Erdnuss-Cookies',30,[I('Haferflocken',25),I('Erdnussmus',12),I('Eier',30)],'cookie'],
 ['gebackene-fruechte','Ofenfrüchte mit Ricotta-Haube',30,[I('Ricotta',60),I('Haferflocken',12)],'fruitBake'],
 ['chia-joghurt','Kleines Chia-Joghurtglas',40,[I('Chiasamen',10),I('Naturjoghurt',100),ML('Milch',40)],'chia'],
 ['obstspiesse','Obstspieße mit cremigem Tahini-Dip',10,[I('Naturjoghurt',60),I('Tahini',8)],'skewer'],
 ['suesser-reisbecher','Kleiner Vollkornreis-Milchbecher',40,[I('Naturreis',25),ML('Milch',100),ML('Wasser',70)],'rice'],
 ['pfannenbrot','Süßes Vollkorn-Pfannenbrot',30,[I('Weizenvollkornmehl',30),I('Naturjoghurt',25),I('Backpulver',1),ML('Rapsöl',2)],'flatbread'],
 ['ricotta-toast','Überbackene Ricotta-Toaststreifen',20,[I('Vollkornbrot',35),I('Ricotta',45),I('Eier',20)],'toast'],
 ['hafer-dampfbaellchen','Gedämpfte Hafer-Reismehlbällchen',30,[I('Hafermehl',20),I('Reismehl',15),I('Eier',30),ML('Milch',25)],'steam'],
 ['hirse-ricotta-tal','Kleine Hirse-Ricotta-Taler',35,[I('Hirse',25),I('Ricotta',40),I('Eier',30),ML('Rapsöl',2)],'patty'],
 ['joghurt-fruchtleder','Weiches Ofen-Fruchtleder mit Joghurtdip',195,[I('Naturjoghurt',80),I('Leinsamen',4)],'leather'],
];
function sweetSnackMethod(kind){return {
 balls:['Datteln 10 Minuten in heißem Wasser einweichen und gut abtropfen lassen. Mit Haferflocken und Kakao fein zerkleinern; bei Bedarf einen Teelöffel Einweichwasser zugeben.','Drei feste Kugeln formen und 15 Minuten kühlen. Mit der Fruchtmischung und dem Kernanteil als kleine Snackportion servieren.'],
 muffin:['Ofen auf 180 °C vorheizen. Mehl, Ei, Joghurt, Backpulver und Öl verrühren. Die Hälfte der Früchte unterheben.','Zwei kleine Muffinförmchen füllen und 20–25 Minuten vollständig durchbacken. Mit übrigen Früchten und dem Kernanteil servieren.'],
 cracker:['Ofen auf 180 °C vorheizen. Reismehl, Sesam, Wasser und Öl zu einem Teig verkneten, sehr dünn zwischen Backpapier ausrollen und einschneiden.','18–22 Minuten knusprig backen und auskühlen lassen. Die vorbereiteten Früchte zerdrücken und als frisches Mus mit dem Kernanteil dazu reichen.'],
 cookie:['Ofen auf 180 °C vorheizen. Haferflocken mit Erdnussmus und Ei verrühren. Drei flache Cookies auf Backpapier formen.','15–18 Minuten backen, bis das Ei vollständig gestockt ist. Mit der Fruchtmischung und dem Kernanteil essen.'],
 fruitBake:['Ofen auf 190 °C vorheizen. Die vorbereiteten Früchte in eine kleine Form geben und mit Ricotta und Haferflocken bedecken.','20–25 Minuten backen, bis die Früchte weich sind; bei Bedarf zwei Esslöffel Wasser ergänzen. Mit dem Kernanteil servieren.'],
 chia:['Chiasamen mit Joghurt und Milch vermengen. Nach 5 Minuten nochmals umrühren, dann mindestens 25 Minuten im Kühlschrank quellen lassen.','Mit den vorbereiteten Früchten und dem Kernanteil in ein Glas schichten.'],
 skewer:['Joghurt und Tahini mit einem Teelöffel Wasser glatt rühren. Früchte in mundgerechte Stücke schneiden und auf kurze Spieße stecken.','Den Kernanteil über den Dip geben und zu den Obstspießen reichen.'],
 rice:['Naturreis mit Milch und Wasser aufkochen. Bei kleiner Hitze zugedeckt 30–35 Minuten weich kochen, regelmäßig umrühren und bei Bedarf Wasser ergänzen.','In eine kleine Schale geben und lauwarm mit den Früchten und dem Kernanteil servieren.'],
 flatbread:['Mehl, Joghurt und Backpulver verkneten; bei Bedarf einen Teelöffel Wasser ergänzen. 10 Minuten ruhen lassen und zu einem dünnen Fladen formen.','Pfanne mit Öl bestreichen und den Fladen je Seite 3–4 Minuten vollständig durchbacken. Mit zerdrückten Früchten und dem Kernanteil belegen.'],
 toast:['Ofen auf 190 °C vorheizen. Ricotta und Ei verrühren und auf das Brot streichen. Die Hälfte der Früchte darauf verteilen.','12–15 Minuten backen, bis die Eiermasse vollständig gestockt ist. In Streifen schneiden und mit übrigen Früchten und dem Kernanteil servieren.'],
 steam:['Hafermehl, Reismehl, Ei und Milch zu einem dickflüssigen Teig verrühren. 5 Minuten quellen lassen.','Mit zwei Löffeln kleine Portionen in Silikonförmchen setzen und über siedendem Wasser zugedeckt 18–22 Minuten dämpfen, bis der Teig durchgegart ist. Mit Früchten und Kernanteil essen.'],
 patty:['Hirse in der dreifachen Menge Wasser 20 Minuten garen und 5 Minuten abkühlen lassen. Mit Ricotta und Ei vermengen.','Öl in einer Pfanne erhitzen. Zwei flache Taler formen und bei mittlerer Hitze je Seite 4 Minuten vollständig durchgaren. Mit Früchten und Kernanteil servieren.'],
 leather:['Ofen auf 90 °C Umluft vorheizen. Früchte mit Leinsamen fein pürieren, etwa 3 mm dünn auf Backpapier streichen und 2–3 Stunden trocknen, bis die Oberfläche nicht mehr klebt.','Noch biegsam abziehen und in Streifen rollen. Mit Joghurt und dem Kernanteil essen; dieses weiche Fruchtleder ist für den unmittelbaren Verzehr gedacht, nicht als ungekühlt haltbare Konserve.']
 }[kind]}
for(const [id,title,time,base,kind]of sweetSnacks)for(const p of profiles.slice(0,12))add('snack',id,p[0],`${title} mit ${p[1]}`,time,[...base,...sweetIngredients(p,95,6)],[...sweetSteps(p,95,6),...sweetSnackMethod(kind)]);
function proteinStep(p){const name=p[2];if(/Hähnchen|Puten|Rinder|Schweine/.test(name))return `${name} auf einem getrennten Brett klein schneiden bzw. zerkrümeln. In der Hälfte des angegebenen Öls 8–12 Minuten vollständig durchbraten (mindestens 75 °C Kerntemperatur); danach Hände und Geräte reinigen.`;if(/Lachs|Kabeljau/.test(name))return `${name} in der Hälfte des angegebenen Öls bei mittlerer Hitze etwa 8–12 Minuten vollständig durchgaren; der Fisch soll im Kern mindestens 70 °C für 2 Minuten erreichen und leicht auseinanderfallen.`;if(name==='Edamame, geschält, TK')return 'Edamame nach Packungsangabe in sprudelndem Wasser mindestens 5 Minuten vollständig garen, abgießen und abtropfen lassen.';if(name==='Tofu')return 'Tofu trocken tupfen, in kleine Würfel schneiden und in der Hälfte des angegebenen Öls etwa 8 Minuten rundum anbraten.';return `${name} sind bereits gekocht: bei Konserven abspülen und abtropfen lassen. Für dieses Rezept werden keine rohen Trockenbohnen verwendet.`}
function savouryIngredients(p,scale=1){return [I(p[2],p[3]*scale),I(p[4],130*scale),I(p[5],120*scale),...p[6].map(([n,a,u])=>I(n,a*scale,u)),ML('Olivenöl',6*scale)]}
function savouryPrep(p,roast=true){return [`${p[4]} und ${p[5]} waschen, bei Bedarf schälen und in etwa 1 cm große Stücke schneiden. Rote Bete ist bereits gegart; Blattgemüse fein schneiden.`,proteinStep(p),roast?'Ofen auf 200 °C Ober-/Unterhitze vorheizen. Gemüse mit dem übrigen Öl auf einem Blech verteilen und 20–30 Minuten weich rösten. Blattgemüse erst in den letzten 5 Minuten zugeben; bei Bedarf zwei Esslöffel Wasser ergänzen.':'Gemüse im übrigen Öl 3 Minuten anbraten. 80 ml Wasser zugeben und zugedeckt 12–18 Minuten weich dünsten; Blattgemüse erst am Ende zugeben.']}
const season='Die in der Zutatenliste genannten Kräuter, Gewürze, Säfte oder Würzsaucen abmessen und unterrühren. Nüsse oder Kerne hacken und zuletzt darüberstreuen.';
// Savoury snacks: 12 preparations x 12 protein/vegetable compositions = 144.
const savourySnacks=[
 ['herzhafte-eimuffins','Herzhafte Gemüse-Eimuffins',45,[I('Eier',60),I('Hüttenkäse',30)],'egg'],
 ['hafer-ricotta-taler','Hafer-Ricotta-Snacktaler',40,[I('Haferflocken',20),I('Ricotta',35),I('Eier',30)],'patty'],
 ['maistortilla-ecken','Knusprige Maistortilla-Ecken',40,[I('Maistortillas',35),I('Mozzarella',20)],'quesadilla'],
 ['mini-roggenfladen','Kleine belegte Roggenfladen',45,[I('Roggenvollkornmehl',25),I('Naturjoghurt',25),I('Backpulver',1)],'flatbread'],
 ['warmer-bohnendip','Warmer Bohnen-Dip mit Gemüsetopping',35,[I('Weiße Bohnen, gekocht',60),I('Tahini',6),I('Knäckebrot',20)],'dip'],
 ['polenta-happen','Überbackene Polenta-Happen',50,[I('Polenta',25),ML('Milch',70),I('Parmesan, vegetarisch',10)],'polenta'],
 ['vollkorn-creperollen','Kleine Vollkorn-Crêperollen',40,[I('Weizenvollkornmehl',25),I('Eier',30),ML('Milch',50)],'crepe'],
 ['reis-snackbaellchen','Ofen-Reis-Snackbällchen',55,[I('Reis',25),I('Eier',30),I('Gouda',12)],'riceballs'],
 ['kartoffel-sandwich','Kleine Kartoffel-Sandwiches',50,[I('Kartoffeln',100),I('Frischkäse',20)],'potato'],
 ['buchweizen-pancakes','Herzhafte Buchweizen-Mini-Pancakes',40,[I('Buchweizenmehl',25),I('Eier',30),ML('Milch',45),I('Backpulver',1)],'pancake'],
 ['huettenkaese-glassnack','Hüttenkäse-Gemüse-Glassnack',35,[I('Hüttenkäse',80),I('Sonnenblumenkerne',5)],'jar'],
 ['roggen-gratinbrot','Überbackenes Roggen-Snackbrot',40,[I('Roggenbrot',35),I('Ricotta',25),I('Mozzarella',15)],'toast'],
];
function savourySnackMethod(kind){return {
 egg:['Ei und Hüttenkäse verquirlen. Gemüse und die vorbereitete Proteinzutat fein hacken, untermischen und in zwei Muffinförmchen füllen. Bei 180 °C 18–22 Minuten backen, bis das Ei vollständig gestockt ist.'],
 patty:['Haferflocken, Ricotta und Ei vermengen. Das gegarte Gemüse und die Proteinzutat fein hacken und unterheben.','Zwei flache Taler auf Backpapier setzen und bei 190 °C 20 Minuten vollständig durchbacken.'],
 quesadilla:['Gegartes Gemüse und Proteinzutat fein schneiden. Mit Mozzarella zwischen zwei Tortillahälften verteilen.','In einer beschichteten Pfanne ohne zusätzliches Fett bei mittlerer Hitze je Seite 3 Minuten rösten und in kleine Ecken schneiden.'],
 flatbread:['Roggenmehl mit Joghurt und Backpulver verkneten; bei Bedarf wenig Wasser ergänzen. 5 Minuten ruhen lassen.','Zwei dünne Fladen formen und bei 200 °C 12–15 Minuten durchbacken. Mit warmem Gemüse und Proteinzutat belegen.'],
 dip:['Zusätzliche weiße Bohnen mit Tahini und zwei Esslöffeln heißem Wasser pürieren. Vorbereitete Proteinzutat klein schneiden und unterheben.','Warmen Dip mit dem gegarten Gemüse und Knäckebrot anrichten.'],
 polenta:['Milch mit 60 ml Wasser aufkochen. Polenta einrühren und nach Packungsangabe weich garen. Parmesan unterheben und etwa 2 cm dick aufstreichen.','10 Minuten fest werden lassen. In Stücke schneiden, mit Gemüse und Proteinzutat belegen und bei 200 °C 8–10 Minuten überbacken.'],
 crepe:['Vollkornmehl, Ei und Milch zu einem glatten Teig verrühren. In einer beschichteten Pfanne zwei dünne Crêpes je Seite 2–3 Minuten vollständig durchbacken.','Mit Gemüse und Proteinzutat füllen, fest aufrollen und in mundgerechte Scheiben schneiden.'],
 riceballs:['Reis nach Packungsangabe in Wasser weich kochen und 5 Minuten abkühlen lassen. Mit Ei und geriebenem Gouda mischen.','Gegartes Gemüse und Proteinzutat fein hacken und unterheben. Kleine Bällchen formen und bei 190 °C 20–25 Minuten vollständig durchbacken.'],
 potato:['Kartoffeln mit Schale in Wasser 20–25 Minuten gar kochen. Etwas abkühlen lassen, längs halbieren und mit Frischkäse bestreichen.','Gegartes Gemüse und Proteinzutat darauf verteilen und als kleine offene Kartoffel-Sandwiches servieren.'],
 pancake:['Buchweizenmehl, Ei, Milch und Backpulver verrühren und 5 Minuten quellen lassen.','Drei kleine Pancakes in einer beschichteten Pfanne ohne zusätzliches Fett je Seite 3–4 Minuten vollständig durchgaren. Mit Gemüse und Proteinzutat belegen.'],
 jar:['Gegartes Gemüse und Proteinzutat zügig abkühlen lassen. Mit Hüttenkäse in ein Glas schichten.','Sonnenblumenkerne darüberstreuen. Im Kühlschrank aufbewahren und am selben Tag essen.'],
 toast:['Roggenbrot mit Ricotta bestreichen. Gegartes Gemüse und Proteinzutat darauf verteilen und mit Mozzarella bedecken.','Bei 200 °C 8–10 Minuten überbacken, bis der Käse geschmolzen ist. In handliche Stücke schneiden.']
 }[kind]}
for(const [id,title,time,base,kind]of savourySnacks)for(const p of savoury)add('snack',id,p[0],`${title} mit ${p[1]}`,Math.max(time,55),[...base,...savouryIngredients(p,.4)],[...savouryPrep(p),season,...savourySnackMethod(kind)]);
// Desserts: 20 genuinely different textures and preparations x 10 compositions.
const desserts=[
 ['vanille-milchpudding','Vanille-Milchpudding',75,[ML('Milch',150),I('Speisestärke',12),I('Zucker',8),I('Vanilleextrakt',1)],'pudding'],
 ['schoko-sojapudding','Dunkler Soja-Schokopudding',75,[ML('Sojadrink',150),I('Speisestärke',12),I('Backkakao',7),I('Ahornsirup',8)],'pudding'],
 ['ricotta-ofencreme','Gebackene Ricotta-Eiercreme',45,[I('Ricotta',80),I('Eier',40),I('Naturjoghurt',40),I('Honig',6)],'custard'],
 ['reismehl-dessertkuechlein','Warme Reismehl-Dessertküchlein',35,[I('Reismehl',25),I('Eier',30),ML('Milch',35),I('Backpulver',1),I('Honig',5)],'cake'],
 ['vollkorn-crumble','Fruchtcrumble mit Vollkornstreuseln',40,[I('Weizenvollkornmehl',20),I('Haferflocken',10),ML('Rapsöl',7),I('Ahornsirup',6)],'crumble'],
 ['frucht-sorbet','Fruchtiges Sorbet ohne Sahne',250,[ML('Wasser',45),I('Zucker',10),ML('Zitronensaft',5)],'sorbet'],
 ['joghurt-eisbecher','Cremiger Frozen-Joghurt-Becher',190,[I('Griechischer Joghurt, fettarm',100),I('Honig',8)],'frozen'],
 ['tofu-mousse','Luftige Tofu-Kakaomousse',70,[I('Tofu',80),I('Backkakao',6),I('Ahornsirup',8),ML('Sojadrink',25)],'mousse'],
 ['chia-kokoscreme','Chia-Kokos-Dessertcreme',70,[I('Chiasamen',12),ML('Kokosmilch',45),ML('Milch',75)],'chia'],
 ['griessterrine','Vollkorngrieß-Dessertterrine',100,[I('Vollkorngrieß',25),ML('Milch',140),I('Honig',5)],'terrine'],
 ['frucht-granita','Grobkristalline Fruchtgranita',250,[ML('Wasser',100),I('Zucker',8),ML('Limettensaft',5)],'granita'],
 ['milch-fruchteis','Milch-Fruchteis am Stiel',250,[ML('Milch',80),I('Naturjoghurt',40),I('Honig',6)],'popsicle'],
 ['brotpudding','Kleiner Roggen-Brotpudding',45,[I('Roggenbrot',35),I('Eier',40),ML('Milch',80),I('Rosinen',8)],'bread'],
 ['eier-souffle','Warmes Vollkorn-Dessertsoufflé',40,[I('Eier',60),I('Weizenvollkornmehl',15),ML('Milch',45),I('Zucker',8)],'souffle'],
 ['joghurt-hafer-trifle','Joghurt-Trifle mit Haferknusper',20,[I('Naturjoghurt',100),I('Haferflocken',18),I('Honig',5)],'trifle'],
 ['karamellisierte-fruechte','Pfannenfrüchte mit Mandelcreme',20,[I('Mandelmus',12),I('Naturjoghurt',70),I('Zucker',6),ML('Wasser',20)],'panfruit'],
 ['buchweizen-dessertpfannkuchen','Gefüllter Buchweizen-Dessertpfannkuchen',25,[I('Buchweizenmehl',25),I('Eier',30),ML('Milch',60),ML('Rapsöl',3),I('Ricotta',35)],'crepe'],
 ['reis-kokosbecher','Kokos-Milchreis-Dessertbecher',40,[I('Reis',25),ML('Kokosmilch',45),ML('Milch',100),I('Ahornsirup',5)],'rice'],
 ['frucht-ofenpaeckchen','Duftende Fruchtpäckchen aus dem Ofen',30,[I('Ricotta',50),I('Honig',5),ML('Zitronensaft',8)],'parcel'],
 ['schoko-haferboden','Frucht-Törtchen auf Schoko-Haferboden',90,[I('Haferflocken',20),I('Datteln',15),I('Backkakao',4),I('Griechischer Joghurt, fettarm',70)],'tart'],
];
function dessertMethod(kind){return {
 pudding:['Stärke mit einem Viertel der Flüssigkeit kalt glatt rühren. Restliche Flüssigkeit mit den übrigen Basiszutaten erhitzen. Stärkemischung einrühren und 1 Minute unter Rühren kochen.','In ein Schälchen füllen, abdecken und mindestens 1 Stunde kühlen. Früchte und Kernanteil erst zum Servieren auflegen.'],
 custard:['Ofen auf 170 °C vorheizen. Ricotta, Ei, Joghurt und Honig verrühren. In eine kleine Form geben und 25–30 Minuten backen, bis die Eiercreme vollständig gestockt ist.',fruitFinish],
 cake:['Ofen auf 180 °C vorheizen. Reismehl, Ei, Milch, Honig und Backpulver glatt rühren und in zwei kleine Förmchen füllen.','20–25 Minuten vollständig durchbacken. Warm mit Früchten und Kernanteil servieren.'],
 crumble:['Ofen auf 190 °C vorheizen. Früchte in eine kleine Form geben. Mehl, Haferflocken, Öl und Sirup zu Streuseln verreiben.','Streusel und Kernanteil über den Früchten verteilen. 25–30 Minuten backen, bis die Früchte weich und die Streusel gebräunt sind.'],
 sorbet:['Früchte mit Wasser, Zucker und Zitronensaft fein pürieren und in einer flachen Gefrierdose 4 Stunden einfrieren.','Nach der ersten Stunde alle 30–45 Minuten durchrühren. Vor dem Essen 10 Minuten antauen lassen, nochmals cremig mixen und den Kernanteil darübergeben.'],
 frozen:['Joghurt mit Honig und der Hälfte der Früchte pürieren. In einer flachen Form 3 Stunden einfrieren und alle 30–45 Minuten umrühren.','10 Minuten antauen lassen und mit restlichen Früchten und Kernanteil servieren.'],
 mousse:['Tofu mit Sojadrink, Kakao und Sirup im Mixer 2 Minuten sehr fein pürieren. Die Creme mindestens 1 Stunde kühlen.','Mit der vorbereiteten Fruchtmischung und dem Kernanteil anrichten.'],
 chia:['Chiasamen mit Kokosmilch und Milch verrühren. Nach 5 Minuten nochmals gründlich rühren und 1 Stunde im Kühlschrank quellen lassen.',fruitFinish],
 terrine:['Milch und Honig aufkochen. Grieß einrühren und nach Packungsangabe 5–8 Minuten unter Rühren garen.','Eine kleine Schale kalt ausspülen, Grieß einfüllen und mindestens 90 Minuten kühlen. Stürzen oder aus der Schale mit Früchten und Kernanteil essen.'],
 granita:['Früchte mit Wasser, Zucker und Limettensaft pürieren und in eine flache Gefrierdose geben.','4 Stunden einfrieren; dabei alle 30–45 Minuten mit einer Gabel die Eiskristalle vom Rand lösen. In ein Glas geben und mit dem Kernanteil servieren.'],
 popsicle:['Früchte mit Milch, Joghurt und Honig pürieren. Kernanteil fein hacken oder als Mus unterziehen.','In Eisförmchen füllen und mindestens 4 Stunden einfrieren. Zum Herauslösen die Form kurz mit lauwarmem Wasser benetzen.'],
 bread:['Ofen auf 180 °C vorheizen. Brot würfeln und mit Milch, Ei und Rosinen mischen. 10 Minuten einweichen lassen.','Die Hälfte der Früchte unterheben und in einer kleinen Form 25–30 Minuten vollständig durchbacken. Mit übrigen Früchten und Kernanteil servieren.'],
 souffle:['Ofen auf 180 °C vorheizen. Ei trennen. Eigelb mit Mehl und Milch verrühren. Eiweiß mit Zucker steif schlagen und unterheben.','In eine kleine ofenfeste Form geben und 20–25 Minuten backen, bis die Eiermasse vollständig gestockt ist. Sofort mit Früchten und Kernanteil servieren.'],
 trifle:['Haferflocken in einer trockenen Pfanne 4 Minuten rösten. Honig einrühren, sofort auf Backpapier geben und 5 Minuten abkühlen lassen.','Früchte, Joghurt und Haferknusper in ein Glas schichten. Den Kernanteil zuletzt dazugeben.'],
 panfruit:['Zucker und Wasser in einer Pfanne aufkochen. Früchte hinzufügen und 5–8 Minuten weich dünsten, dabei vorsichtig wenden.','Mandelmus und Joghurt verrühren. Pfannenfrüchte mit der Mandelcreme und dem Kernanteil servieren.'],
 crepe:['Buchweizenmehl, Ei und Milch verquirlen und 5 Minuten ruhen lassen. Pfanne mit Öl ausstreichen und zwei dünne Pfannkuchen je Seite 2–3 Minuten vollständig durchbacken.','Mit Ricotta und der Hälfte der Früchte füllen. Übrige Früchte und Kernanteil dazugeben.'],
 rice:['Reis mit Kokosmilch, Milch, Sirup und 60 ml Wasser aufkochen. 25–30 Minuten bei kleiner Hitze weich garen und dabei regelmäßig umrühren.',fruitFinish],
 parcel:['Ofen auf 190 °C vorheizen. Früchte mit Honig und Zitronensaft auf ein großes Stück Backpapier legen. Papier zu einem geschlossenen Päckchen falten.','20 Minuten auf einem Blech backen. Vorsichtig öffnen, heißen Dampf entweichen lassen und mit Ricotta und Kernanteil servieren.'],
 tart:['Datteln 10 Minuten in heißem Wasser einweichen und abgießen. Mit Haferflocken und Kakao zerkleinern; bei Bedarf einen Teelöffel Wasser ergänzen.','Die Masse in ein kleines Förmchen drücken und 1 Stunde kühlen. Joghurt darauf verteilen und mit Früchten und Kernanteil belegen.']
 }[kind]}
for(const [id,title,time,base,kind]of desserts)for(const p of profiles.slice(0,10))add('dessert',id,p[0],`${title} mit ${p[1]}`,time,[...base,...sweetIngredients(p,100,6)],[...sweetSteps(p,100,6),...dessertMethod(kind)]);
// Main-course methods. These are deliberately not all bowls or salads.
const mainMethods={
 pilaf:['Getreide heiß abspülen. Mit der auf der Packung angegebenen Wassermenge aufkochen und zugedeckt weich garen. Gemüse und Proteinzutat unterheben und 5 Minuten ziehen lassen.'],
 bake:['Getreide oder Pasta nach Packungsangabe in Wasser bissfest vorgaren. Mit Gemüse und Proteinzutat in eine ofenfeste Form geben.','Die im Rezept angegebenen Milchprodukte, Eier oder passierten Tomaten verrühren und darübergeben. Bei 190 °C 20–25 Minuten backen, bis die Masse innen fest und gegebenenfalls das Ei vollständig gestockt ist.'],
 tortilla:['Kartoffeln schälen, in dünne Scheiben schneiden und 10–12 Minuten in Wasser vorgaren. Abgießen und gut abtropfen lassen.','Eier mit den Milchprodukten der Zutatenliste verquirlen. Gegartes Gemüse und Proteinzutat klein schneiden und untermischen.','Masse in eine kleine mit Backpapier ausgelegte Form geben. Bei 180 °C 20–25 Minuten vollständig stocken lassen und in Stücke schneiden.'],
 potato:['Kartoffeln waschen und in Wasser 20–25 Minuten gar kochen. Längs einschneiden und vorsichtig aufdrücken.','Mit dem gegarten Gemüse und der Proteinzutat füllen. Milchprodukte aus der Zutatenliste verrühren und als Sauce darübergeben; Käse gegebenenfalls bei 200 °C 8 Minuten überbacken.'],
 soup:['Die in der Zutatenliste enthaltenen trockenen Getreide oder Linsen mit 400 ml Wasser aufkochen und nach Packungsangabe weich köcheln. Gemüse und Proteinzutat zugeben.','Passierte Tomaten oder Milchprodukte, sofern angegeben, einrühren, nochmals 5 Minuten leise köcheln lassen und mit Wasser zur gewünschten Konsistenz ergänzen.'],
 curry:['Die in der Zutatenliste enthaltenen trockenen Getreide nach Packungsangabe in Wasser weich garen.','Gemüse und Proteinzutat mit Kokosmilch und Currypulver in einen Topf geben. 80 ml Wasser hinzufügen und 8–10 Minuten leise köcheln lassen. Mit dem Getreide servieren.'],
 stew:['Getreide oder Kartoffeln in mundgerechte Stücke schneiden bzw. abspülen und nach Packungsangabe in Wasser weich garen.','Passierte Tomaten mit 100 ml Wasser aufkochen. Gemüse, Proteinzutat und die gegarte Sättigungsbeilage hinzufügen und alles 8–10 Minuten leise köcheln lassen.'],
 pasta:['Pasta nach Packungsangabe in Wasser bissfest kochen. Vor dem Abgießen 80 ml Kochwasser auffangen.','Gemüse, Proteinzutat und die in der Zutatenliste angegebenen Saucenzutaten in einer Pfanne mischen und 5 Minuten erhitzen. Pasta unterheben und mit Kochwasser cremig rühren.'],
 couscous:['Couscous oder Bulgur nach Packungsangabe mit kochendem Wasser übergießen bzw. weich garen. Mit einer Gabel auflockern.','Mit Gemüse und Proteinzutat vermengen. Milchprodukte aus der Zutatenliste zu einem Dip verrühren und dazu reichen.'],
 polenta:['Milch bzw. Wasser nach Zutatenliste aufkochen; für Polenta bei Bedarf insgesamt etwa die vierfache Flüssigkeitsmenge verwenden. Polenta nach Packungsangabe unter Rühren garen.','In eine kleine Form streichen, 15 Minuten fest werden lassen und in Scheiben schneiden. Gemüse, Proteinzutat und Käse darauf verteilen und bei 200 °C 12–15 Minuten überbacken.'],
 patty:['Getreide oder Kartoffeln nach Packungsangabe weich kochen, gut abtropfen und 5 Minuten abkühlen lassen. Hülsenfrüchte und Kartoffeln mit einer Gabel zerdrücken.','Gegartes Gemüse und Proteinzutat fein hacken. Mit Ei und Haferflocken der Zutatenliste unter die Basis mischen. Vier flache Taler formen und bei 190 °C 25 Minuten vollständig durchbacken. Joghurt, sofern angegeben, als Dip servieren.'],
 pancake:['Das in der Zutatenliste angegebene Mehl mit Ei und Milch glatt verrühren. 5 Minuten quellen lassen.','In einer beschichteten Pfanne ohne zusätzliches Fett zwei Pfannkuchen bei mittlerer Hitze je Seite 3–4 Minuten vollständig durchgaren. Mit Gemüse und Proteinzutat füllen.'],
 dumpling:['Mehl, Ei und Hüttenkäse oder Ricotta aus der Zutatenliste zu einer weichen Masse rühren. 10 Minuten quellen lassen.','Mit zwei Löffeln kleine Nocken abstechen, in leicht siedendes Wasser geben und 8–10 Minuten gar ziehen lassen. Eine Nocke aufschneiden und prüfen, dass innen kein roher Teig bleibt. Mit Gemüse und Proteinzutat servieren.'],
 bread:['Mehl, Backpulver und Joghurt mit so viel Wasser verkneten, dass ein weicher formbarer Teig entsteht. 10 Minuten ruhen lassen.','Teig dünn auf Backpapier ausrollen, mit gegartem Gemüse, Proteinzutat und Käse aus der Zutatenliste belegen. Bei 210 °C 18–22 Minuten backen, bis der Boden vollständig durchgebacken ist.'],
 crepe:['Beide Mehle mit Ei und Milch zu einem dünnen Teig verquirlen und 10 Minuten quellen lassen. Zwei dünne Crêpes in einer beschichteten Pfanne je Seite 2–3 Minuten vollständig durchbacken.','Ricotta mit gegartem Gemüse und Proteinzutat vermengen. Die Crêpes damit füllen, aufrollen und mit passierten Tomaten bedecken. Bei 190 °C 15 Minuten überbacken.'],
 steam:['Reismehl, Ei, Milch und Backpulver glatt rühren. Gemüse und Proteinzutat fein hacken und unterheben.','In hitzefeste Förmchen geben und im Dämpfeinsatz über siedendem Wasser zugedeckt 25 Minuten dämpfen. Eine Portion aufschneiden und prüfen, dass innen kein roher Teig bleibt.'],
 risotto:['Reis in einem Topf mit zwei Esslöffeln Wasser 1 Minute erhitzen. Nach und nach etwa 300 ml heißes Wasser zugießen und unter Rühren 25–35 Minuten weich garen; Packungsangabe beachten.','Gegartes Gemüse, Proteinzutat und die angegebenen Milchprodukte unterheben. 3 Minuten ziehen lassen und bei Bedarf mit Wasser cremig rühren.'],
 roll:['Naturreis nach Packungsangabe in Wasser gar kochen und abtropfen lassen. Maistortillas nach Packungsangabe erwärmen. Mit Reis, gegartem Gemüse und Proteinzutat füllen und aufrollen.','Dicht nebeneinander in eine Form legen, mit passierten Tomaten und Käse aus der Zutatenliste bedecken und bei 190 °C 15 Minuten backen.'],
 schnitte:['Reis oder Hirse aus der Zutatenliste nach Packungsangabe in Wasser weich kochen und gut abtropfen lassen.','Gegarten Reis bzw. gegarte Hirse 5 Minuten abkühlen lassen. Mit Ei, gegebenenfalls Mehl und den Milchprodukten aus der Zutatenliste verrühren. Gemüse und Proteinzutat fein hacken und unterheben.','In eine mit Backpapier ausgelegte flache Form füllen und bei 190 °C 25–30 Minuten backen, bis die Masse vollständig gestockt ist. 5 Minuten abkühlen lassen und in Schnitten teilen.'],
};
const mainFamilies=[
 ['dinkel-pilaf','Dinkelkorn-Pilaf',60,[I('Dinkelkörner',65),I('Sonnenblumenkerne',10)],'pilaf'],
 ['hirse-ricotta-gratin','Hirse-Ricotta-Gratin',60,[I('Hirse',60),I('Ricotta',55),ML('Milch',80)],'bake'],
 ['kartoffel-eier-tortilla','Ofen-Kartoffeltortilla',55,[I('Kartoffeln',180),I('Eier',120),I('Hüttenkäse',40)],'tortilla'],
 ['gefuellte-kartoffeln','Gefüllte Kartoffeln mit Senfcreme',50,[I('Kartoffeln',230),I('Naturjoghurt',70),I('Senf',8)],'potato'],
 ['quinoa-suppentopf','Quinoa-Suppentopf',45,[I('Quinoa',55),I('Tomaten, passiert',140)],'soup'],
 ['hirsedhal','Hirse-Kokos-Curry',45,[I('Hirse',55),ML('Kokosmilch',80),I('Currypulver',3)],'curry'],
 ['graupen-schmortopf','Graupen-Tomatenschmortopf',60,[I('Perlgraupen',60),I('Tomaten, passiert',160),I('Zwiebel',40)],'stew'],
 ['vollkorn-nudelpfanne','Vollkorn-Nudelpfanne mit Ricotta',45,[I('Vollkornpasta',70),I('Ricotta',50),ML('Milch',60)],'pasta'],
 ['bulgur-joghurt-teller','Warmer Bulgur mit Joghurt-Tahini-Sauce',45,[I('Bulgur',65),I('Naturjoghurt',70),I('Tahini',10)],'couscous'],
 ['polenta-gouda-scheiben','Überbackene Polenta-Gouda-Scheiben',60,[I('Polenta',60),ML('Milch',120),ML('Wasser',150),I('Gouda',30)],'polenta'],
 ['buchweizen-haftaler','Buchweizen-Hafer-Brattaler',65,[I('Buchweizen',45),I('Haferflocken',25),I('Eier',60),I('Naturjoghurt',60)],'patty'],
 ['roggen-pfannkuchen','Herzhafte Roggen-Milchpfannkuchen',45,[I('Roggenvollkornmehl',55),I('Eier',60),ML('Milch',100)],'pancake'],
 ['ricotta-nocken','Vollkorn-Ricottanocken',50,[I('Weizenvollkornmehl',45),I('Ricotta',80),I('Eier',60)],'dumpling'],
 ['joghurt-flammkuchen','Vollkorn-Joghurt-Flammkuchen',50,[I('Weizenvollkornmehl',70),I('Naturjoghurt',60),I('Backpulver',2),I('Mozzarella',35)],'bread'],
];
for(const category of ['lunch','dinner'])for(const [index,[id,title,time,base,kind]]of mainFamilies.entries())for(const [pi,p]of savoury.slice(category==='lunch'?0:6,category==='lunch'?6:12).entries()){
 if(category==='dinner'&&index===13&&pi>=4)continue;
 // Dinner has a different base and sauce from its lunch counterpart.
 const additions=category==='dinner'?[I('Parmesan, vegetarisch',12),I('Knoblauch',3)]:[I('Zwiebel',30)];
 const aromatics=category==='dinner'?'Knoblauch schälen und fein hacken. Mit dem Gemüse garen. Parmesan vor dem Servieren darüberreiben.':'Zwiebel schälen, fein würfeln und zusammen mit dem Gemüse garen.';
 add(category,id,p[0],`${title} mit ${p[1]}`,time,[...base,...additions,...savouryIngredients(p)],[aromatics,...savouryPrep(p,kind!=='soup'&&kind!=='stew'),season,...mainMethods[kind]]);
}
// Meal prep is a catalogue category, not a fourth mandatory daily meal.
// Dedicated batch-cooking dishes, not relabelled lunch/dinner recipes.
Object.assign(mainMethods,{
 loaf:['Quinoa und rote Linsen getrennt nach Packungsangabe in Wasser weich garen, abgießen und 10 Minuten abkühlen lassen.','Mit Ei und Haferflocken verrühren. Gegartes Gemüse und Proteinzutat klein hacken, unterheben und in eine kleine mit Backpapier ausgelegte Form drücken. Bei 190 °C 30–35 Minuten vollständig durchbacken und in Scheiben schneiden.'],
 noodleTerrine:['Pasta in Wasser bissfest kochen und gut abtropfen lassen. Ei mit Hüttenkäse verquirlen.','Pasta, gegartes Gemüse und Proteinzutat unterheben und in eine kleine Kastenform füllen. Bei 180 °C 30 Minuten vollständig stocken lassen; 10 Minuten vor dem Schneiden ruhen lassen.'],
 grainSteam:['Couscous nach Packungsangabe mit kochendem Wasser quellen lassen und mit einer Gabel auflockern. 5 Minuten abkühlen lassen.','Ei und Joghurt verrühren, Couscous, gegartes Gemüse und Proteinzutat unterheben. In hitzefeste Förmchen füllen und über siedendem Wasser 25–30 Minuten dämpfen, bis das Ei vollständig gestockt ist.'],
 riceDumpling:['Naturreis nach Packungsangabe in Wasser weich kochen und gut abtropfen lassen. 10 Minuten abkühlen und mit einer Gabel grob zerdrücken.','Mit Ei und Speisestärke vermengen. Kleine Nocken mit zwei Löffeln abstechen und in leicht siedendem Wasser 10 Minuten vollständig gar ziehen lassen. Eine Nocke aufschneiden und auf vollständiges Durchgaren prüfen. Mit Gemüse und Proteinzutat servieren.'],
 pocket:['Vollkornmehl, Joghurt und Backpulver mit 2–3 Esslöffeln Wasser zu einem formbaren Teig kneten und 10 Minuten ruhen lassen.','Zwei dünne Kreise ausrollen. Gemüse und Proteinzutat fein schneiden, mit Feta mischen und auf je einer Kreishälfte verteilen. Zuklappen, Ränder fest andrücken und bei 210 °C 20–25 Minuten durchbacken.'],
 pepper:['Zusätzlich zu den Gemüsezutaten 160 g Paprika für die Hüllen zurückbehalten, halbieren und entkernen. Das übrige Gemüse wie beschrieben garen. Bulgur nach Packungsangabe weich garen.','Bulgur, Feta, gegartes Gemüse und Proteinzutat vermengen und in die Paprikahälften füllen. Mit 100 ml Wasser in eine Form setzen und bei 190 °C 30 Minuten gar backen.'],
 cabbageRoll:['Zusätzlich zum gegarten Gemüse 160 g Weißkohlblätter als Hüllen zurückbehalten. In kochendem Wasser 5 Minuten blanchieren und dicke Blattrippen flach schneiden. Hirse nach Packungsangabe weich kochen.','Hirse mit gegartem Gemüse und Proteinzutat mischen. In die Kohlblätter wickeln, mit passierten Tomaten und 100 ml Wasser in eine Form geben und zugedeckt bei 190 °C 30 Minuten backen.'],
 mashLid:['Kartoffeln schälen und mit roten Linsen in ausreichend Wasser 20 Minuten sehr weich kochen. Gut abgießen und mit Joghurt zu einer streichfähigen Masse stampfen.','Gegartes Gemüse und Proteinzutat in eine kleine Form geben. Kartoffel-Linsen-Masse darüberstreichen und bei 200 °C 20 Minuten überbacken.'],
 potatoWaffle:['Kartoffeln schälen, fein raspeln und 5 Minuten in wenig Wasser weich dünsten. Abgießen, leicht ausdrücken und 5 Minuten abkühlen lassen.','Mit Roggenmehl, Ei und Joghurt verrühren. Auf einem gut beschichteten Waffeleisen portionsweise 6–8 Minuten vollständig durchbacken. Mit gegartem Gemüse und Proteinzutat servieren.'],
 savouryCrumble:['Vollkornmehl, Haferflocken, Parmesan und das zusätzlich angegebene Rapsöl mit 1–2 Esslöffeln Wasser zu Streuseln verreiben.','Gegartes Gemüse und Proteinzutat in eine Form geben, Streusel darauf verteilen und bei 190 °C 25 Minuten backen, bis die Streusel knusprig und das Mehl durchgebacken ist.'],
 semolinaGnocchi:['Milch mit 80 ml Wasser aufkochen. Grieß einrühren und nach Packungsangabe weich garen. 5 Minuten abkühlen lassen, dann Ricotta und Ei unterrühren.','Mit zwei Löffeln Nocken abstechen und auf Backpapier setzen. Bei 190 °C 20–25 Minuten vollständig durchbacken. Mit gegartem Gemüse und Proteinzutat servieren.'],
 beanBread:['90 g der gekochten weißen Bohnen für den Brotteig zurückbehalten und fein zerdrücken; übrige Bohnen gehören zur Proteinzutat. Mit den Mehlen, Hefe und 60–80 ml lauwarmem Wasser zu einem weichen Teig kneten. Zugedeckt 60 Minuten gehen lassen.','Einen kleinen Laib formen und bei 200 °C 30–35 Minuten durchbacken. 15 Minuten abkühlen lassen, in Scheiben schneiden und mit dem gegarten Gemüse und der Proteinzutat servieren.'],
 chickpeaGnocchi:['Milch mit 130 ml Wasser aufkochen. Polenta einrühren und nach Packungsangabe garen. 90 g der gekochten Kichererbsen zerdrücken und unterheben; übrige Kichererbsen als Proteinzutat zum Gemüse geben. 5 Minuten abkühlen lassen.','Ei untermischen, mit zwei Löffeln Nocken auf Backpapier setzen und bei 190 °C 25 Minuten vollständig durchbacken. Gemüse und Proteinzutat dazu servieren.'],
 beanSoup:['120 g der gekochten weißen Bohnen mit passierten Tomaten und 250 ml Wasser 10 Minuten leise köcheln lassen und cremig pürieren; übrige weiße Bohnen als Proteinzutat zurückbehalten. Joghurt einrühren und nur noch sanft erwärmen.','Brot würfeln und auf einem Blech bei 180 °C 8–10 Minuten knusprig rösten. Gegartes Gemüse und Proteinzutat in die Suppe geben, erhitzen und mit den Brotchips servieren.'],
});
const prepFamilies=[
 ['quinoa-linsen-laib','Quinoa-Linsen-Laib',85,[I('Quinoa',40),I('Rote Linsen',35),I('Eier',60),I('Haferflocken',20)],'loaf'],
 ['vollkorn-nudelterrine','Vollkorn-Nudelterrine',80,[I('Vollkornpasta',60),I('Eier',90),I('Hüttenkäse',75)],'noodleTerrine'],
 ['couscous-dampfkuchen','Couscous-Eier-Dampfkuchen',65,[I('Couscous',45),I('Eier',90),I('Naturjoghurt',60)],'grainSteam'],
 ['naturreis-nocken','Naturreis-Stärkenocken',75,[I('Naturreis',55),I('Speisestärke',15),I('Eier',60)],'riceDumpling'],
 ['gefuellte-joghurttaschen','Gefüllte Vollkorn-Joghurttaschen',65,[I('Weizenvollkornmehl',70),I('Naturjoghurt',50),I('Backpulver',2),I('Feta',25)],'pocket'],
 ['bulgur-paprikaschiffchen','Bulgur-Feta-Paprikaschiffchen',75,[I('Bulgur',45),I('Feta',35),I('Paprika',160)],'pepper'],
 ['hirse-kohlrouladen','Hirse-Kohlrouladen in Tomatensauce',80,[I('Weißkohl',160),I('Hirse',50),I('Tomaten, passiert',150)],'cabbageRoll'],
 ['kartoffel-linsen-haube','Ofengericht mit Kartoffel-Linsen-Haube',70,[I('Kartoffeln',200),I('Rote Linsen',35),I('Naturjoghurt',40)],'mashLid'],
 ['kartoffel-roggenwaffeln','Kartoffel-Roggenwaffeln',65,[I('Kartoffeln',160),I('Roggenvollkornmehl',35),I('Eier',60),I('Naturjoghurt',30)],'potatoWaffle'],
 ['herzhafter-hafercrumble','Herzhafter Vollkorn-Hafercrumble',65,[I('Weizenvollkornmehl',45),I('Haferflocken',25),I('Parmesan, vegetarisch',20),ML('Rapsöl',8)],'savouryCrumble'],
 ['griess-ricottanocken','Grieß-Ricotta-Ofennocken',65,[I('Vollkorngrieß',45),I('Ricotta',70),I('Eier',60),ML('Milch',100)],'semolinaGnocchi'],
 ['bohnen-roggenbrot','Frisches Bohnen-Roggenbrot',140,[I('Weiße Bohnen, gekocht',90),I('Weizenvollkornmehl',55),I('Roggenvollkornmehl',20),I('Trockenhefe',3)],'beanBread'],
 ['kichererbsen-polentanocken','Kichererbsen-Polenta-Nocken',65,[I('Kichererbsen',90),I('Polenta',45),I('Eier',60),ML('Milch',100)],'chickpeaGnocchi'],
 ['tomaten-bohnencremesuppe','Tomaten-Bohnencremesuppe mit Brotchips',50,[I('Weiße Bohnen, gekocht',120),I('Tomaten, passiert',220),I('Vollkornbrot',50),I('Naturjoghurt',80)],'beanSoup'],
 ['tomaten-crepebox','Ricotta-Hafer-Crêpebox',70,[I('Weizenvollkornmehl',35),I('Hafermehl',20),I('Eier',60),ML('Milch',120),I('Ricotta',75),I('Tomaten, passiert',120)],'crepe'],
 ['reis-dampfportionen','Reismehl-Dampfportionen',60,[I('Reismehl',55),I('Eier',60),ML('Milch',70),I('Backpulver',2)],'steam'],
 ['naturreis-rahmtopf','Cremiger Naturreis-Topf',60,[I('Naturreis',60),I('Frischkäse',35),ML('Milch',90)],'risotto'],
 ['maistortilla-rollen','Naturreis-Maistortilla-Enchiladas',75,[I('Maistortillas',60),I('Naturreis',35),I('Tomaten, passiert',130),I('Gouda',35)],'roll'],
 ['hirse-eier-schnitten','Hirse-Eier-Schnitten',75,[I('Hirse',55),I('Eier',90),I('Hüttenkäse',60)],'schnitte'],
 ['roggen-reis-schnitten','Naturreis-Roggen-Schnitten',70,[I('Naturreis',50),I('Roggenvollkornmehl',15),I('Eier',90),I('Ricotta',45)],'schnitte'],
];
for(const [id,title,time,base,kind]of prepFamilies)for(const p of savoury.slice(0,10))add('mealprep','vorrats-'+id,p[0],`Meal-Prep: ${title} mit ${p[1]}`,time,[...base,...savouryIngredients(p)],[...(kind==='pepper'?['160 g Paprika als halbierte, entkernte Hüllen zurückbehalten.']:kind==='cabbageRoll'?['160 g Weißkohlblätter als ganze Hüllen zurückbehalten.']:[]),...savouryPrep(p,kind!=='soup'&&kind!=='stew'),season,...mainMethods[kind],'Zum Vorbereiten in flache saubere Behälter portionieren, rasch abkühlen und spätestens nach 2 Stunden bei höchstens 5 °C kühlen. Gekochten Reis besonders rasch kühlen. Gekühlt innerhalb von 24 Stunden essen oder noch am Kochtag portionsweise einfrieren.','Beim Aufwärmen die gesamte Portion auf mindestens 75 °C erhitzen. Nur einmal wieder erwärmen; die Wochenplanung bedeutet keine Lagerfähigkeit über eine Woche.'],{tags:['Meal-Prep','Einfrierbar'],storage:'Maximal 24 Stunden gekühlt bei ≤5 °C oder am Kochtag einfrieren.'});
// Drinks: 10 distinct bases / preparations x 10 fruit compositions.
const drinks=[
 ['joghurt-lassi','Joghurt-Lassi',10,[I('Naturjoghurt',100),ML('Wasser',100)],'blend'],
 ['mandel-milchshake','Ungesüßter Mandelmilch-Shake',10,[ML('Mandelmilch, ungesüßt',160),I('Mandelmus',6)],'blend'],
 ['hafer-soja-smoothie','Hafer-Soja-Smoothie',20,[ML('Sojadrink',160),I('Haferflocken',15)],'soak'],
 ['spinat-frucht-smoothie','Grüner Spinat-Frucht-Smoothie',10,[I('Spinat',35),ML('Wasser',160),ML('Zitronensaft',5)],'blend'],
 ['karotten-joghurt-drink','Karotten-Joghurt-Drink',10,[I('Karotten',50),I('Naturjoghurt',60),ML('Wasser',110)],'blend'],
 ['chia-fresca','Chia-Frucht-Fresca',35,[I('Chiasamen',6),ML('Wasser',180),ML('Limettensaft',8)],'chia'],
 ['frucht-eistee','Fruchtiger schwarzer Eistee',40,[ML('Schwarzer Tee, aufgebrüht',180),ML('Zitronensaft',8),I('Minze',2)],'tea'],
 ['gruentee-slush','Grüntee-Frucht-Slush',190,[ML('Grüner Tee, aufgebrüht',160),ML('Limettensaft',8)],'slush'],
 ['kokos-milch-drink','Kokos-Milch-Fruchtdrink',10,[ML('Kokosmilch',40),ML('Milch',100),ML('Wasser',40)],'blend'],
 ['frucht-agua-fresca','Ingwer-Frucht-Agua-Fresca',15,[ML('Wasser',200),I('Ingwer',3),ML('Limettensaft',8)],'blend'],
];
for(const [id,title,time,base,kind]of drinks)for(const p of profiles.slice(0,10)){
 const method=kind==='soak'?['Haferflocken 10 Minuten im Sojadrink quellen lassen. Dann mit Früchten und Kernanteil fein mixen.']:kind==='chia'?['Chiasamen mit Wasser und Limettensaft verrühren, nach 5 Minuten erneut umrühren und 25 Minuten quellen lassen. Früchte und Kernanteil separat fein pürieren und unterrühren.']:kind==='tea'?['Den aufgebrühten Tee auf Raumtemperatur abkühlen lassen. Früchte und Kernanteil mit Zitronensaft fein pürieren und unter den Tee rühren. Minze waschen und fein schneiden.']:kind==='slush'?['Den aufgebrühten Grüntee abkühlen lassen. Mit Früchten und Limettensaft pürieren und in einer flachen Form 3 Stunden einfrieren; jede Stunde mit einer Gabel lockern.','Kurz vor dem Trinken nochmals grob mixen und den fein zerkleinerten Kernanteil unterrühren.']:['Die Zutaten der Basis zusammen mit Früchten und Kernanteil 60–90 Sekunden sehr fein mixen. Bei Bedarf esslöffelweise Wasser ergänzen.'];
 add('drink',id,p[0],`${title} mit ${p[1]}`,time,[...base,...sweetIngredients(p,120,5)],[...sweetSteps(p,120,5),...method,'Nicht abseihen: Fruchtfleisch und Kernanteil bleiben im Getränk und sind in den Nährwerten berücksichtigt. Frisch trinken; Reste sofort kühlen und am selben Tag verbrauchen.']);
}
