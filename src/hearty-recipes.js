// 40 fixed cooking families, each with 20 selected vegetable combinations.
// No runtime randomness, quantity-only duplicates or changes to earlier recipe IDs.
import {ingredientNutrition} from './food.js';
const I=(name,amount,unit='g')=>[name,amount,unit];
const vegetables=[
 ['brokkoli-karotte','Brokkoli und Karotten','Brokkoli','Karotten'],
 ['blumenkohl-lauch','Blumenkohl und Lauch','Blumenkohl','Lauch'],
 ['paprika-zucchini','Paprika und Zucchini','Paprika','Zucchini'],
 ['kuerbis-spinat','Kürbis und Spinat','Hokkaidokürbis','Spinat'],
 ['pilz-fenchel','Pilzen und Fenchel','Champignons','Fenchel'],
 ['aubergine-tomate','Aubergine und Tomaten','Aubergine','Tomaten'],
 ['weisskohl-karotte','Weißkohl und Karotten','Weißkohl','Karotten'],
 ['gruenkohl-sellerie','Grünkohl und Sellerie','Grünkohl','Sellerieknolle'],
 ['mangold-paprika','Mangold und Paprika','Mangold','Paprika'],
 ['rotebete-fenchel','Roter Bete und Fenchel','Rote Bete, gegart','Fenchel'],
 ['brokkoli-pilz','Brokkoli und Pilzen','Brokkoli','Champignons'],
 ['blumenkohl-karotte','Blumenkohl und Karotten','Blumenkohl','Karotten'],
 ['kuerbis-lauch','Kürbis und Lauch','Hokkaidokürbis','Lauch'],
 ['zucchini-mangold','Zucchini und Mangold','Zucchini','Mangold'],
 ['aubergine-paprika','Aubergine und Paprika','Aubergine','Paprika'],
 ['rotkohl-sellerie','Rotkohl und Sellerie','Rotkohl','Sellerieknolle'],
 ['fenchel-spinat','Fenchel und Spinat','Fenchel','Spinat'],
 ['gruenkohl-pilz','Grünkohl und Pilzen','Grünkohl','Champignons'],
 ['rotebete-weisskohl','Roter Bete und Weißkohl','Rote Bete, gegart','Weißkohl'],
 ['brokkoli-kuerbis','Brokkoli und Kürbis','Brokkoli','Hokkaidokürbis'],
];
const P={chicken:['Hähnchenbrust',160,'Hähnchen'],turkey:['Putenbrust',160,'Puten'],beef:['Rinderhackfleisch, 5 % Fett',140,'Rinderhack'],stew:['Rindergulasch, mager',160,'Rindergulasch'],pork:['Schweinefilet',160,'Schweinefilet'],mince:['Putenhackfleisch, mager',150,'Putenhack'],fish:['Kabeljaufilet',170,'Kabeljau'],salmon:['Lachsfilet',150,'Lachs'],tofu:['Tofu',180,'Tofu'],chickpea:['Kichererbsen',180,'Kichererbsen'],white:['Weiße Bohnen, gekocht',190,'Weiße-Bohnen'],kidney:['Kidneybohnen, gekocht',190,'Kidneybohnen'],lentil:['Linsen, gekocht',190,'Linsen']};
const rawMeat=new Set(['chicken','turkey','beef','stew','pork','mince']);
const fish=new Set(['fish','salmon']);
const grainBases=new Set(['Reis','Naturreis','Basmatireis','Bulgur','Couscous','Quinoa','Hirse','Buchweizen','Perlgraupen','Vollkornpasta','Vollkornnudeln','Vollkornspaghetti','Soba-Nudeln','Polenta']);
const herbs=I('Petersilie',5);
const tomato=[I('Tomaten, passiert',180),I('Paprikapulver',2)];
const cream=[I('Milch',120,'ml'),I('Frischkäse',25),I('Senf',5)];
const yogurt=[I('Naturjoghurt',90),I('Zitrone',.25,'Stk.')];
const spice=[I('Kreuzkümmel',2),I('Paprikapulver',2)];
// Each family specifies ingredients and its actual preparation method.
const families=[
 {id:'kartoffel-auflauf',group:'casseroles',style:'bake',title:'{p}-Kartoffelauflauf',base:'Kartoffeln',amount:220,proteins:['chicken','tofu'],extra:[...cream,I('Gouda',30)],time:55},
 {id:'nudel-auflauf',group:'casseroles',style:'bake',title:'{p}-Vollkornnudelauflauf',base:'Vollkornnudeln',amount:70,proteins:['beef','white'],extra:[...tomato,I('Mozzarella',40),I('Basilikum',5)],time:45},
 {id:'reis-auflauf',group:'casseroles',style:'bake',title:'{p}-Reisauflauf',base:'Naturreis',amount:65,proteins:['turkey','chickpea'],extra:[I('Tomaten, passiert',150),I('Feta',35),I('Naturjoghurt',60),I('Kreuzkümmel',2)],time:65},
 {id:'linsen-lasagne',group:'casseroles',style:'lasagne',title:'Gemüse-Linsen-Lasagne',base:'Lasagneblätter',amount:60,proteins:['lentil'],extra:[I('Tomaten, passiert',230),I('Milch',100,'ml'),I('Ricotta',50),I('Parmesan, vegetarisch',20)],time:70},
 {id:'hirse-eierauflauf',group:'casseroles',style:'eggBake',title:'Hirse-Kartoffel-Eierauflauf',base:'Hirse',amount:50,extra:[I('Kartoffeln',120),I('Eier',2,'Stk.'),I('Milch',70,'ml'),I('Hüttenkäse',80)],time:60},
 {id:'kartoffel-linsensuppe',group:'soups',style:'soup',title:'Sämige Kartoffel-Linsensuppe',base:'Kartoffeln',amount:180,proteins:['lentil'],extra:[I('Tomaten, passiert',100),...spice,herbs],time:40},
 {id:'bohnen-graupensuppe',group:'soups',style:'soup',title:'Deftige Bohnen-Graupensuppe',base:'Perlgraupen',amount:50,proteins:['white'],extra:[I('Tomaten, passiert',100),I('Sellerieknolle',50),herbs],time:50},
 {id:'haehnchen-nudelsuppe',group:'soups',style:'soup',title:'Kräftige Hähnchen-Vollkornnudelsuppe',base:'Vollkornnudeln',amount:60,proteins:['chicken'],extra:[I('Erbsen, TK',60),I('Ingwer',4),I('Dill',5)],time:40},
 {id:'kichererbsen-cremesuppe',group:'soups',style:'creamSoup',title:'Sättigende Kichererbsen-Gemüsecremesuppe',base:'Kartoffeln',amount:120,proteins:['chickpea'],extra:[I('Kokosmilch',60,'ml'),I('Currypulver',2),I('Kürbiskerne',15)],time:35},
 {id:'tomaten-fischsuppe',group:'soups',style:'soup',title:'Kabeljau-Tomaten-Suppe',base:'Bulgur',amount:60,proteins:['fish'],extra:[I('Tomaten, passiert',200),I('Dill',5),I('Zitrone',.25,'Stk.')],time:40},
 {id:'rinder-kartoffelgulasch',group:'lunch',style:'braise',title:'Mageres Rinder-Kartoffelgulasch',base:'Kartoffeln',amount:200,proteins:['stew'],extra:[...tomato,I('Kreuzkümmel',1)],time:110},
 {id:'kartoffel-hackpfanne',group:'lunch',style:'pan',title:'Kartoffel-Rinderhackpfanne',base:'Kartoffeln',amount:230,proteins:['beef'],extra:[...yogurt,I('Senf',8),I('Paprikapulver',2)],time:40},
 {id:'puten-geschnetzeltes',group:'lunch',style:'pan',title:'{p}-Geschnetzeltes mit Vollkornnudeln',base:'Vollkornnudeln',amount:75,proteins:['turkey','pork'],extra:cream,time:35},
 {id:'haehnchen-rahmreis',group:'lunch',style:'pan',title:'Hähnchen-Rahmreis',base:'Basmatireis',amount:70,proteins:['chicken'],extra:[I('Erbsen, TK',60),I('Milch',100,'ml'),I('Ricotta',50),herbs],time:35},
 {id:'linsen-bolognese',group:'lunch',style:'ragout',title:'Deftige Linsen-Bolognese mit Vollkornspaghetti',base:'Vollkornspaghetti',amount:80,proteins:['lentil'],extra:[I('Tomaten, passiert',220),I('Parmesan, vegetarisch',20),I('Basilikum',5)],time:35},
 {id:'kichererbsen-bratlinge',group:'lunch',style:'patty',title:'Kichererbsen-Bratlinge mit Salzkartoffeln',base:'Kartoffeln',amount:180,proteins:['chickpea'],extra:[I('Haferflocken',30),I('Eier',1,'Stk.'),...yogurt,I('Kreuzkümmel',2)],time:45},
 {id:'warme-proteinwraps',group:'lunch',style:'wrap',title:'Warme {p}-Gemüsewraps',base:'Vollkornwraps',amount:2,unit:'Stk.',proteins:['chicken','tofu'],extra:[...yogurt,I('Paprikapulver',2)],time:30},
 {id:'bohnen-reistopf',group:'lunch',style:'onepot',title:'Würziger Bohnen-Reistopf',base:'Reis',amount:70,proteins:['kidney','white'],extra:[...tomato,...spice,I('Mais',50)],time:40},
 {id:'hirse-kaesepfanne',group:'lunch',style:'eggPan',title:'Herzhafte Hirse-Käse-Pfanne',base:'Hirse',amount:75,extra:[I('Hüttenkäse',100),I('Gouda',25),I('Eier',1,'Stk.'),I('Schnittlauch',5)],time:35},
 {id:'gemuese-kartoffelroesti',group:'lunch',style:'roesti',title:'Gemüse-Kartoffelrösti mit Fetaquark',base:'Kartoffeln',amount:250,extra:[I('Eier',1,'Stk.'),I('Haferflocken',25),I('Magerquark',120),I('Feta',30),I('Schnittlauch',5)],time:40},
 {id:'puten-hackbaellchen',group:'lunch',style:'meatballs',title:'Putenhackbällchen mit Vollkornpasta',base:'Vollkornpasta',amount:70,proteins:['mince'],extra:[I('Haferflocken',20),I('Eier',.5,'Stk.'),...tomato,I('Basilikum',5)],time:45},
 {id:'buchweizen-schmorpilaw',group:'lunch',style:'onepot',title:'Kichererbsen-Buchweizen-Schmorpilaw',base:'Buchweizen',amount:75,proteins:['chickpea'],extra:[I('Tahini',15),I('Kreuzkümmel',2),I('Zitrone',.25,'Stk.')],time:35},
 {id:'fisch-kartoffelragout',group:'lunch',style:'fishStew',title:'Kabeljau-Kartoffelragout',base:'Kartoffeln',amount:250,proteins:['fish'],extra:[I('Tomaten, passiert',170),I('Dill',5),I('Zitrone',.25,'Stk.')],time:40},
 {id:'haehnchen-reiscurry',group:'lunch',style:'pan',title:'Hähnchen-Reiscurry',base:'Basmatireis',amount:70,proteins:['chicken'],extra:[I('Kokosmilch',80,'ml'),I('Currypulver',3),I('Ingwer',5)],time:35},
 {id:'gefuellte-suesskartoffel',group:'lunch',style:'stuffedPotato',title:'Ofensüßkartoffel mit Bohnen-Feta-Füllung',base:'Süßkartoffel',amount:280,proteins:['white','kidney'],extra:[I('Naturjoghurt',70),I('Feta',35),I('Paprikapulver',2)],time:60},
 {id:'rinder-graupentopf',group:'dinner',style:'braise',title:'Rinder-Graupen-Schmortopf',base:'Perlgraupen',amount:65,proteins:['stew'],extra:[I('Tomaten, passiert',160),I('Paprikapulver',3),herbs],time:115},
 {id:'haehnchen-ofenpfanne',group:'dinner',style:'roast',title:'Hähnchen-Kartoffel-Ofenpfanne',base:'Kartoffeln',amount:230,proteins:['chicken'],extra:[...yogurt,I('Senf',8),I('Paprikapulver',2)],time:55},
 {id:'linsen-kartoffelhaube',group:'dinner',style:'pie',title:'Linsen-Gemüse-Pie unter Kartoffelhaube',base:'Kartoffeln',amount:230,proteins:['lentil'],extra:[I('Milch',80,'ml'),I('Frischkäse',25),I('Tomaten, passiert',150),herbs],time:55},
 {id:'ofenfisch-suesskartoffel',group:'dinner',style:'roast',title:'Ofen-{p} mit Süßkartoffeln',base:'Süßkartoffel',amount:240,proteins:['fish','salmon'],extra:[I('Tahini',20),I('Zitrone',.5,'Stk.'),I('Dill',5)],time:50},
 {id:'kraeuter-tofusteaks',group:'dinner',style:'tofuSteak',title:'Kräuter-Tofusteaks mit Hirse',base:'Hirse',amount:70,proteins:['tofu'],extra:[I('Senf',10),I('Haferflocken',20),I('Sojajoghurt',80),herbs],time:35},
 {id:'rinder-pastaragout',group:'dinner',style:'ragout',title:'Vollkornpasta mit magerem Rinderhackragout',base:'Vollkornpasta',amount:80,proteins:['beef'],extra:[I('Tomaten, passiert',220),I('Basilikum',5),I('Parmesan, vegetarisch',15)],time:35},
 {id:'bohnenchili-reis',group:'dinner',style:'chili',title:'Deftiges Kidneybohnen-Chili mit Reis',base:'Naturreis',amount:65,proteins:['kidney'],extra:[I('Mais',60),I('Tomaten, passiert',200),...spice,I('Backkakao',3)],time:50},
 {id:'puten-zucchiniboote',group:'dinner',style:'boats',title:'Putenhack-Quinoa-Zucchiniboote',base:'Quinoa',amount:55,proteins:['mince'],extra:[I('Zucchini',250),I('Feta',35),I('Tomaten, passiert',150)],time:60},
 {id:'auberginen-hackpfanne',group:'dinner',style:'pan',title:'Auberginen-Rinderhackpfanne mit Bulgur',base:'Bulgur',amount:70,proteins:['beef'],extra:[I('Aubergine',150),I('Tomaten, passiert',160),I('Kreuzkümmel',2)],time:40},
 {id:'kartoffel-eierpfanne',group:'dinner',style:'eggPan',title:'Kartoffel-Eier-Pfanne mit Hüttenkäse',base:'Kartoffeln',amount:240,extra:[I('Eier',2,'Stk.'),I('Hüttenkäse',100),I('Senf',5),I('Schnittlauch',5)],time:40},
 {id:'ofen-kichererbsen-polenta',group:'dinner',style:'roast',title:'Ofenkichererbsen mit cremiger Polenta',base:'Polenta',amount:70,proteins:['chickpea'],extra:[I('Tomaten, passiert',150),I('Milch',100,'ml'),I('Feta',30)],time:40},
 {id:'puten-senftopf',group:'dinner',style:'pan',title:'Puten-Senf-Schmortopf mit Naturreis',base:'Naturreis',amount:65,proteins:['turkey'],extra:[I('Senf',12),I('Milch',120,'ml'),I('Frischkäse',30),I('Dill',5)],time:50},
 {id:'erdnuss-tofunudeln',group:'dinner',style:'pan',title:'Sämige Erdnuss-Tofu-Vollkornnudeln',base:'Vollkornnudeln',amount:75,proteins:['tofu'],extra:[I('Erdnussmus',20),I('Sojasauce',10,'ml'),I('Ingwer',5),I('Limette',.25,'Stk.')],time:30},
 {id:'bohnen-kartoffelstampf',group:'dinner',style:'mash',title:'Deftiger Bohnen-Kartoffelstampf',base:'Kartoffeln',amount:240,proteins:['white'],extra:[I('Senf',8),I('Magerquark',90),I('Schnittlauch',5)],time:35},
 {id:'sesam-haehnchennudeln',group:'dinner',style:'pan',title:'Sesam-Hähnchen-Sobapfanne',base:'Soba-Nudeln',amount:75,proteins:['chicken'],extra:[I('Sesam',15),I('Sojasauce',10,'ml'),I('Ingwer',5),I('Limette',.25,'Stk.')],time:35},
];
const leafy=new Set(['Spinat','Mangold','Grünkohl']);
const liquidNames=new Set(['Tomaten, passiert','Milch','Kokosmilch','Frischkäse','Ricotta','Senf','Tahini','Erdnussmus','Sojasauce']);
const coldNames=new Set(['Naturjoghurt','Sojajoghurt','Magerquark','Zitrone','Limette']);
const cheeseNames=new Set(['Gouda','Mozzarella','Feta','Parmesan, vegetarisch','Hüttenkäse']);
const spiceNames=new Set(['Paprikapulver','Kreuzkümmel','Currypulver','Ingwer','Backkakao']);
const herbNames=new Set(['Petersilie','Dill','Basilikum','Schnittlauch']);
const names=items=>items.map(i=>i[0]).join(', ');
function baseStep(f){
 if(f.style==='lasagne')return 'Lasagneblätter ungekocht bereitlegen; die Sauce muss beim Schichten noch gut flüssig sein.';
 if(f.style==='stuffedPotato')return 'Süßkartoffel gründlich waschen, mehrmals einstechen und im auf 200 °C Ober-/Unterhitze vorgeheizten Ofen etwa 45–55 Minuten weich backen. Bei großen Exemplaren längere Garzeit einplanen.';
 if(f.style==='roesti')return 'Kartoffeln schälen, fein raspeln und in einem sauberen Tuch kräftig ausdrücken.';
 if(f.style==='wrap')return 'Vollkornwraps nach Packungsangabe erwärmen und bis zum Füllen abdecken.';
 const extraPotato=f.base!=='Kartoffeln'&&f.extra.some(i=>i[0]==='Kartoffeln')?' Die zusätzlichen Kartoffeln schälen, würfeln und separat etwa 15 Minuten weich kochen.':'';
 if(f.base==='Kartoffeln'||f.base==='Süßkartoffel')return `${f.base} schälen und in kleine Würfel schneiden. In leicht gesalzenem Wasser 15–20 Minuten weich kochen und abgießen.`;
 if(grainBases.has(f.base))return `${f.base} nach Packungsangabe separat garen.${['Quinoa','Hirse','Buchweizen'].includes(f.base)?' Vorher in einem feinen Sieb abspülen.':''} Kochwasser nach Bedarf auffangen.${extraPotato}`;
 throw Error('Missing base preparation: '+f.id);
}
function proteinPrep(key){if(!key)return '';
 const name=P[key][0];
 if(rawMeat.has(key))return `${name} ${['beef','mince'].includes(key)?'bis zur Verwendung gekühlt halten':'auf einem separaten Brett klein schneiden'}. Hände, Messer und Arbeitsfläche danach reinigen; rohes Fleisch nicht abwaschen.`;
 if(fish.has(key))return `${name} auf Gräten prüfen, trocken tupfen und in mundgerechte Stücke schneiden. Bis zum Garen kühl stellen.`;
 if(key==='tofu')return 'Tofu abtropfen lassen, trocken tupfen und würfeln; für Steaks stattdessen in dicke Scheiben schneiden.';
 return `${name} sind hier bereits gegart vorgesehen: in einem Sieb abspülen und gut abtropfen lassen.`;
}
function proteinPan(key){if(!key)return '';
 const name=P[key][0];
 if(rawMeat.has(key))return `${name} in der Hälfte des Olivenöls rundum anbraten und bei mittlerer Hitze vollständig durchgaren (mindestens 75 °C Kerntemperatur). ${['beef','mince'].includes(key)?'Hack dabei gründlich zerteilen.':''} Auf einen sauberen Teller geben.`;
 if(fish.has(key))return `${name} in der Hälfte des Olivenöls bei mittlerer Hitze garen, bis mindestens 63 °C Kerntemperatur für 2 Minuten erreicht sind. Auf einen sauberen Teller geben.`;
 if(key==='tofu')return 'Tofu in der Hälfte des Olivenöls 6–8 Minuten rundherum goldbraun braten und herausnehmen.';
 return `${name} am Ende zugeben und mindestens 5 Minuten vollständig erhitzen; nur gegarte Hülsenfrüchte verwenden.`;
}
function stepsFor(f,row,key){
 const [,label,a,b]=row;const extras=f.extra||[];
 const liquids=extras.filter(i=>liquidNames.has(i[0]));
 const spices=extras.filter(i=>spiceNames.has(i[0]));
 const cold=extras.filter(i=>coldNames.has(i[0]));
 const coldDairy=cold.filter(i=>!['Zitrone','Limette'].includes(i[0]));
 const cheese=extras.filter(i=>cheeseNames.has(i[0]));
 const green=extras.filter(i=>herbNames.has(i[0]));
 const hasLegume=key&&!rawMeat.has(key)&&!fish.has(key)&&key!=='tofu';
 const sauce=liquids.length?`${names(liquids)}${spices.length?', '+names(spices):''} mit etwas Wasser glatt rühren.`:spices.length?`${names(spices)} abmessen und zum Würzen verwenden.`:'Mit Salz und Pfeffer abschmecken.';
 const dairy=cheese.length?`${names(cheese)} zerkleinern oder cremig rühren und unterheben beziehungsweise darauf verteilen.`:'';
 const finish=[coldDairy.length?`${names(cold)} zu einem kalten Dip verrühren; vorhandene Zitrusfrüchte vorher auspressen. Nicht mehr stark kochen.`:cold.length?`${names(cold)} auspressen und das fertige Gericht nach Geschmack mit dem Saft abschmecken.`:'',green.length?`${names(green)} waschen, fein hacken und erst zum Servieren hinzufügen.`:''].filter(Boolean);
 const leaves=[a,b].filter(name=>leafy.has(name));
 const prep=`Gemüse (${a}, ${b}) waschen, gegebenenfalls schälen und klein schneiden oder raspeln. Zwiebel schälen und fein würfeln. ${leaves.length?names(leaves.map(name=>[name]))+' von festen Stielen trennen und die Blätter erst gegen Ende garen.':''} ${[a,b].includes('Rote Bete, gegart')?'Vorgegarte Rote Bete braucht nur erhitzt zu werden.':''} ${proteinPrep(key)}`;
 const vegetablesStep=`Zwiebel und festes Gemüse in dem ${key&&!hasLegume?'restlichen':'bereitgestellten'} Olivenöl 8–12 Minuten dünsten, bei Bedarf Wasser hinzufügen. ${leaves.length?'Blätter von '+leaves.join(' und ')+' zunächst zurückhalten.':''} Feste Gemüsewürfel müssen vor dem Servieren weich sein. ${extras.some(i=>i[0]==='Erbsen, TK')?'Erbsen, TK nach Packungsangabe mitgaren.':''} ${extras.some(i=>i[0]==='Mais')?'Bereits gegarten Mais abgießen und mit erhitzen.':''}`;
 const allFinish=finish;
 const pro=key?P[key][0]:'';
 let steps;
 switch(f.style){
 case 'bake':case 'lasagne':case 'eggBake':
  steps=[`Ofen auf 190 °C Ober-/Unterhitze vorheizen. ${baseStep(f)}`,prep,key?proteinPan(key):'Eier mit Milch verquirlen und Hüttenkäse unterrühren. Diese Eimischung bis zum Backen kühl halten.',vegetablesStep,f.style==='eggBake'?'Die vorbereitete Eimischung nochmals durchrühren.':sauce];
  if(f.style==='lasagne')steps.push(`Gegarte Linsen und Blattgemüse mit der Sauce mischen. Abwechselnd mit Lasagneblättern in eine Auflaufform schichten. ${dairy} Bei Bedarf Wasser ergänzen, damit alle Blätter von Sauce bedeckt sind. 35–40 Minuten backen, bis die Lasagneblätter weich sind.`);
  else if(f.style==='eggBake')steps.push('Hirse, vorgegarte Kartoffeln und Gemüse in eine kleine Auflaufform füllen. Eimischung darübergeben und etwa 25–30 Minuten backen, bis auch die Mitte vollständig gestockt ist.');
  else steps.push(`${f.base}, Gemüse${key?', '+pro:''} und Sauce in eine Form geben. ${dairy} Etwa 25 Minuten backen, bis alles durchgehend heiß ist. ${hasLegume?'Vorgegarte Hülsenfrüchte spätestens vor dem Backen mit einfüllen.':''}`);
  break;
 case 'soup':case 'creamSoup':
  steps=[baseStep(f),prep,'Zwiebel in Olivenöl glasig dünsten. Festes Gemüse zugeben und kurz anschwitzen. Mit etwa 350–500 ml Wasser aufgießen und 15–20 Minuten köcheln lassen, bis das Gemüse weich ist.',sauce+' Vorbereitete Sauce beziehungsweise Gewürze in die Suppe einrühren.'];
  if(rawMeat.has(key))steps.push(`${pro} in der heißen Suppe 12–15 Minuten vollständig durchgaren; mindestens 75 °C im Kern erreichen. Dann die vorgegarte Beilage und Blattgemüse hinzufügen.`);
  else if(fish.has(key))steps.push(`${pro} und die vorgegarte Beilage in die Suppe geben. Sanft weitergaren, bis der Fisch mindestens 63 °C im Kern für 2 Minuten erreicht hat. Blattgemüse zum Schluss zugeben.`);
  else steps.push(`${pro} und die vorgegarte Beilage zugeben und 5 Minuten erhitzen. Blattgemüse zum Schluss zusammenfallen lassen. ${f.style==='creamSoup'?'Kürbiskerne zurückhalten; den Suppenansatz samt Kokosmilch fein pürieren und mit den Kürbiskernen bestreuen.':'Nach Wunsch einen kleinen Teil der Suppe pürieren, damit sie sämiger wird.'}`);
  steps.push('Die Suppe abschmecken, nochmals erwärmen und bei Bedarf mit Wasser verdünnen.');
  break;
 case 'braise':
  steps=[prep,'Rindergulasch, mager in Olivenöl portionsweise kräftig anbraten. Zwiebel hinzufügen und mitbraten.',sauce,'Sauce und etwa 250 ml Wasser zum Fleisch geben. Zugedeckt etwa 75–90 Minuten sanft schmoren, bis das Fleisch weich ist; bei Bedarf Wasser ergänzen. Gemüse in den letzten 20 Minuten mitgaren, Blattgemüse erst in den letzten 5 Minuten.','Während das Fleisch schmort: '+baseStep(f),'Vorgegarte Beilage zum Schmortopf reichen oder unterrühren. Vor dem Servieren prüfen, dass Fleisch und Gemüse vollständig gegart sind.'];
  break;
 case 'patty':case 'roesti':
  steps=[baseStep(f),prep,`${f.style==='patty'?'Kichererbsen mit einer Gabel zerdrücken; Kartoffeln als Beilage zurückhalten.':'Kartoffelraspel bereitstellen.'} Gemüse sehr fein hacken oder raspeln, Blattgemüse vorher kurz zusammenfallen lassen und ausdrücken.`,`${f.style==='patty'?'Kichererbsen':'Kartoffeln'} mit Gemüse, Zwiebel, Eiern und Haferflocken vermengen. ${spices.length?names(spices)+' zugeben.':''} Würzen und 5 Minuten quellen lassen. Kleine, flache Bratlinge formen.`, 'Olivenöl in einer beschichteten Pfanne erhitzen. Bratlinge bei mittlerer Hitze auf jeder Seite etwa 5–7 Minuten vollständig durchgaren; Kartoffelraspel müssen weich und Eier vollständig gestockt sein.',...finish,`${f.style==='patty'?'Zu den Salzkartoffeln reichen.':''} ${cheese.length?names(cheese)+' in den Quark beziehungsweise Joghurtdip rühren.':''}`];
  return steps.filter(Boolean);
 case 'meatballs':
  steps=[baseStep(f),prep,'Haferflocken mit dem verquirlten Ei und Putenhackfleisch, mager vermengen, würzen und kleine Bällchen formen. Bei einer halben Eimenge das Ei zunächst verquirlen und die Hälfte abwiegen.', 'Bällchen in der Hälfte des Olivenöls rundum anbraten. Auf einen sauberen Teller geben und die Zwiebel sowie das feste Gemüse im übrigen Öl dünsten.',sauce,'Sauce mit etwas Wasser zum Gemüse geben, Bällchen einlegen und 12–15 Minuten sanft garen. Putenhack muss auch in der Mitte mindestens 75 °C erreichen. Blattgemüse zum Schluss hinzufügen.',`Mit ${f.base} anrichten.`];
  break;
 case 'pie':
  steps=[`Ofen auf 200 °C Ober-/Unterhitze vorheizen. ${baseStep(f)}`,prep,vegetablesStep,'Milch und Frischkäse mit den gekochten Kartoffeln zu einem cremigen Stampf verarbeiten. Bei Bedarf etwas Kochwasser ergänzen.','Gegarte Linsen und Tomaten, passiert zum Gemüse geben und 5 Minuten erhitzen. Blattgemüse unterrühren und würzen.','Linsen-Gemüse-Mischung in eine Form geben, Kartoffelstampf darüber verstreichen und etwa 20 Minuten goldbraun backen.'];
  break;
 case 'stuffedPotato':
  steps=[baseStep(f),prep,vegetablesStep,`${pro} mit Paprikapulver zum Gemüse geben und 5 Minuten vollständig erhitzen. Blattgemüse zuletzt zugeben.`, 'Weiche Süßkartoffel aufschneiden und das Innere mit einer Gabel lockern. Gemüse-Bohnen-Füllung darauf und daneben verteilen. Feta darüberbröseln.',...finish];return steps;
 case 'boats':
  steps=[`Ofen auf 200 °C Ober-/Unterhitze vorheizen. ${baseStep(f)}`,prep,'Zucchini längs halbieren, etwas Fruchtfleisch herauslösen und fein hacken. Die Hälften in eine Auflaufform legen.',proteinPan(key),'Zwiebel, gewürfeltes Gemüse und herausgelöstes Zucchinifleisch im übrigen Olivenöl weich dünsten. Mit Quinoa, gegartem Putenhack und einem Teil der passierten Tomaten vermengen. Blattgemüse unterrühren.','Zucchinihälften füllen, übrige Füllung daneben verteilen. Restliche Tomaten und etwas Wasser angießen, Feta darüberbröseln und etwa 25–30 Minuten backen, bis die Zucchini weich und die Füllung vollständig heiß ist.'];break;
 case 'roast':
  steps=[`Ofen auf 200 °C Ober-/Unterhitze vorheizen. ${['Kartoffeln','Süßkartoffel'].includes(f.base)?f.base+' waschen, schälen und in etwa 1 cm dicke Spalten schneiden.':baseStep(f)}`,prep,f.base==='Polenta'?'Passierte Tomaten für das Ofengemüse bereithalten; Milch separat für die Polenta abmessen.':sauce];
  if(f.base==='Polenta')steps.push('Festes Gemüse mit Olivenöl und der Tomatensauce in eine Form geben und etwa 25 Minuten weich rösten. Gegarte Kichererbsen in den letzten 10 Minuten hinzufügen. Die vorgegarte Polenta mit der vorgesehenen Milch cremig rühren und nochmals erhitzen; bei Bedarf Wasser ergänzen. Feta und Blattgemüse zuletzt zugeben.');
  else steps.push(`Die vorbereiteten Knollenspalten und festes Gemüse mit Olivenöl in eine Form geben und 25 Minuten vorbacken. ${pro} dazugeben und weitere ${fish.has(key)?'12–20':'20–25'} Minuten vollständig garen. ${fish.has(key)?'Fisch muss mindestens 63 °C im Kern für 2 Minuten erreichen.':'Geflügel muss mindestens 75 °C Kerntemperatur erreichen.'} Blattgemüse nur in den letzten 5 Minuten mitgaren.`);
  steps.push(f.base==='Polenta'?'Ofengemüse und Kichererbsen auf der cremigen Polenta anrichten.':`Vorbereitete Sauce über das fertige Gericht geben und kurz erhitzen.${coldDairy.length?' Den kalten Dip separat dazu reichen.':''}`);break;
 case 'tofuSteak':
  steps=[baseStep(f),prep,'Tofuscheiben dünn mit Senf bestreichen. Haferflocken fein mixen, mit gehackter Petersilie mischen und den Tofu damit panieren.','Die Hälfte des Olivenöls erhitzen und Tofusteaks bei mittlerer Hitze auf jeder Seite etwa 4 Minuten goldbraun braten. Herausnehmen.',vegetablesStep, 'Blattgemüse kurz vor Schluss unterrühren. Tofusteaks mit Hirse und Gemüse anrichten. Sojajoghurt mit Salz und Pfeffer verrühren und als Dip reichen.'];return steps;
 case 'mash':
  steps=[baseStep(f),prep,vegetablesStep,'Gegarte weiße Bohnen mit Kartoffeln und Senf grob stampfen. Etwas heißes Kartoffelwasser hinzufügen und alles vollständig erhitzen.','Blattgemüse zum übrigen Gemüse geben, kurz mitgaren und auf dem heißen Stampf anrichten. Magerquark mit etwas Wasser und Schnittlauch glatt rühren und separat dazu reichen.'];return steps;
 case 'eggPan':
  steps=[baseStep(f),prep,vegetablesStep,sauce,`${f.base} und Blattgemüse zum Gemüse geben. Falls vorhanden, die vorbereitete Sauce einrühren. Eier verquirlen, mit Hüttenkäse vermengen und unter Rühren vollständig stocken lassen. ${cheese.filter(i=>i[0]!=='Hüttenkäse').length?names(cheese.filter(i=>i[0]!=='Hüttenkäse'))+' darübergeben und schmelzen lassen.':''}`];break;
 case 'wrap':
  steps=[prep,proteinPan(key),vegetablesStep, 'Gemüsefüllung mit Paprikapulver würzen, Blattgemüse zum Schluss mitgaren und den gegarten Proteinanteil wieder hinzufügen.',baseStep(f),'Warme Füllung mit etwas Joghurtdip auf die Vollkornwraps verteilen. Seiten einschlagen, aufrollen und in einer trockenen Pfanne von beiden Seiten kurz rösten.',...finish];return steps;
 case 'onepot':case 'chili':case 'ragout':case 'fishStew':case 'pan':
  steps=[baseStep(f),prep,proteinPan(key),vegetablesStep,sauce];
  steps.push(`Vorbereitete Sauce und ${pro||'die vorbereiteten Zutaten'} zum Gemüse geben und mindestens 5 Minuten vollständig erhitzen. Blattgemüse zum Schluss hinzufügen. Vorgegarte Beilage unterrühren oder dazu servieren. ${dairy}`);
  break;
 default:throw Error('Unknown cooking style '+f.style);
 }
 return [...steps,...allFinish].filter(Boolean);
}
export const heartyRecipes=[];
for(const family of families)for(const [index,row]of vegetables.entries()){
 const [slug,label,a,b]=row;const key=family.proteins?.[index%family.proteins.length];
 const protein=key?P[key]:null;const raw=[I(family.base,family.amount,family.unit||'g'),I(a,120),I(b,120),I('Zwiebel',40),I('Olivenöl',['patty','roesti','tofuSteak'].includes(family.style)?10:5,'ml'),...(protein?[I(protein[0],protein[1])]:[]),...family.extra];
 const combined=new Map();for(const [name,amount,unit]of raw){if(combined.has(name)&&combined.get(name)[2]!==unit)throw Error('Incompatible recipe units');const previous=combined.get(name);combined.set(name,[name,(previous?.[1]||0)+amount,unit])}
 const ingredients=[...combined.values()],nutrition=ingredientNutrition(ingredients);
 if(nutrition.missing.length)throw Error('Missing hearty nutrition: '+family.id+' '+nutrition.missing.join(', '));
 const kind=family.group==='casseroles'?'casserole':family.group==='soups'?'soup':'hearty';
 const meal=['casseroles','soups'].includes(family.group)?index%2===0?'lunch':'dinner':family.group;
 heartyRecipes.push({id:`hearty-${family.id}-${slug}`,meal,name:family.title.replace('{p}',protein?.[2]||'Gemüse')+(family.title.includes(' mit ')?' und ':' mit ')+label,time:family.time,vegetarian:!rawMeat.has(key)&&!fish.has(key),kind,expansionGroup:family.group,tags:[kind==='soup'?'Suppe':kind==='casserole'?'Auflauf':'Deftig','Warm'],ingredients,steps:stepsFor(family,row,key).map(step=>step.replace(/\s+/g,' ').trim()),nutrition,kcal:Math.round(nutrition.kcal/5)*5,protein:Math.round(nutrition.protein),subtitle:'Warm, sättigend und mit viel Gemüse'});
}
