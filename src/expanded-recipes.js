// Curated combinations with reusable cooking methods, stable IDs and per-person quantities.
// These are complete recipes, not runtime-generated permutations.
const I=(name,amount,unit='g')=>[name,amount,unit];
const kcalProtein={
'Haferflocken':[370,13],'Dinkelflocken':[350,14],'Hirse':[360,11],'Buchweizen':[340,13],'Quinoa':[370,14],'Milch':[47,3.4],'Haferdrink':[45,1],'Naturjoghurt':[65,4],'Skyr':[65,11],'Magerquark':[70,12],'Sojajoghurt':[50,4],'Hüttenkäse':[100,12],'Frischkäse':[240,6],'Ricotta':[170,11],
'Banane':[90,1],'Apfel':[52,.3],'Birne':[57,.4],'Mango':[60,.8],'Pfirsich':[40,.9],'Nektarine':[44,1],'Aprikosen':[48,1],'Pflaumen':[46,.7],'Erdbeeren':[32,.7],'Himbeeren':[45,1],'Heidelbeeren':[50,.7],'Beeren':[45,1],'Kiwi':[61,1],'Orange':[47,.9],'Ananas':[50,.5],'Trauben':[69,.7],'Kirschen, entsteint':[60,1],
'Walnüsse':[650,15],'Mandeln':[600,21],'Pistazien, geschält':[570,20],'Haselnüsse':[630,15],'Cashewkerne':[560,18],'Kürbiskerne':[560,30],'Sonnenblumenkerne':[580,21],'Sesam':[570,18],'Chiasamen':[490,17],'Leinsamen':[530,18],'Kokosraspeln':[660,7],'Erdnussmus':[600,25],'Mandelmus':[620,21],'Honig':[300,0],'Backkakao':[350,20],'Zimt':[250,4],
'Vollkornbrot':[240,9],'Vollkornwraps':[310,9],'Vollkornpita':[270,9],'Eier':[145,13],'Avocado':[160,2],'Hummus':[240,7],'Tofu':[145,16],'Hähnchenbrust':[110,23],'Putenbrust':[110,24],'Lachsfilet':[205,20],'Kabeljaufilet':[80,18],'Garnelen, geschält':[85,20],'Thunfisch, Konserve, abgetropft':[115,25],
'Reis':[350,7],'Basmatireis':[350,7],'Naturreis':[350,8],'Couscous':[350,12],'Bulgur':[340,12],'Perlgraupen':[340,10],'Hirse':[360,11],'Risottoreis':[350,7],'Vollkornpasta':[350,13],'Vollkornspaghetti':[350,13],'Vollkornnudeln':[350,13],'Orzo-Nudeln':[350,12],'Reisnudeln':[350,6],'Soba-Nudeln':[350,13],'Gnocchi':[160,4],
'Linsen, gekocht':[115,9],'Rote Linsen':[350,25],'Kichererbsen':[130,7],'Weiße Bohnen, gekocht':[110,8],'Kidneybohnen, gekocht':[110,8],'Edamame, geschält, TK':[125,12],'Erbsen, TK':[80,5],'Mais':[85,3],
'Kartoffeln':[75,2],'Süßkartoffel':[85,2],'Karotten':[40,1],'Brokkoli':[35,3],'Blumenkohl':[25,2],'Zucchini':[20,1.5],'Aubergine':[25,1],'Hokkaidokürbis':[65,2],'Spinat':[25,3],'Paprika':[30,1],'Tomaten':[20,1],'Tomaten, passiert':[30,1],'Gurke':[15,.7],'Champignons':[25,3],'Lauch':[35,1.5],'Fenchel':[30,1],'Mangold':[20,2],'Grünkohl':[45,4],'Rote Bete, gegart':[45,2],'Rucola':[25,2.5],'Römersalat':[15,1],'Rotkohl':[30,1],'Weißkohl':[25,1],'Zuckererbsen':[40,3],'Grüne Bohnen':[30,2],'Radieschen':[15,1],'Sellerieknolle':[35,1.5],
'Feta':[260,15],'Mozzarella':[250,18],'Gouda':[350,25],'Parmesan, vegetarisch':[390,32],'Halloumi, vegetarisch':[320,22],'Olivenöl':[880,0],'Rapsöl':[880,0],'Kokosmilch':[180,2],'Tahini':[600,17],'Sojasauce':[55,8],'Senf':[80,5],'Zitrone':[30,1],'Limette':[30,.5],'Petersilie':[35,3],'Basilikum':[25,3],'Schnittlauch':[30,3],'Dill':[40,3],'Minze':[40,3],'Ingwer':[80,2],'Currypulver':[300,12],'Paprikapulver':[280,14],'Kreuzkümmel':[375,18],'Knoblauch':[140,6],'Zwiebel':[40,1],'Rosinen':[300,3]
};
const unitWeight={'Eier':60,'Banane':120,'Apfel':150,'Birne':160,'Mango':300,'Pfirsich':140,'Nektarine':140,'Aprikosen':40,'Pflaumen':50,'Kiwi':80,'Orange':160,'Paprika':150,'Gurke':300,'Avocado':150,'Zitrone':100,'Limette':70,'Vollkornwraps':60,'Vollkornpita':80,'Zwiebel':100,'Knoblauch':5};
function nutrition(ingredients){let kcal=0,protein=0;for(const [name,amount,unit]of ingredients){const fact=kcalProtein[name];if(!fact)throw Error('Missing nutrition reference: '+name);const weight=unit==='Stk.'?amount*(unitWeight[name]||100):amount;kcal+=fact[0]*weight/100;protein+=fact[1]*weight/100;}return {kcal:Math.round(kcal/5)*5,protein:Math.round(protein)}}
export const expandedRecipes=[];
function add(slug,meal,name,time,ingredients,steps,vegetarian=true){expandedRecipes.push({id:`collection-${slug}`,meal,name,time,vegetarian,ingredients,steps,...nutrition(ingredients),subtitle:'Neue Lieblingsgerichte für euren Alltag'})}
const wash='Frisches Obst oder Gemüse vor dem Schneiden gründlich waschen.';
const porridge=[
['dinkel-himbeer','Dinkelporridge mit Himbeeren und Haselnüssen','Dinkelflocken','Himbeeren','Haselnüsse'],
['hafer-ananas','Ananas-Kokos-Porridge','Haferflocken','Ananas','Kokosraspeln'],
['hirseschoko-birne','Schoko-Hirse mit Birne','Hirse','Birne','Mandeln'],
['buchweizen-kirsch','Buchweizen-Kirsch-Brei mit Pistazien','Buchweizen','Kirschen, entsteint','Pistazien, geschält'],
['quinoa-apfel','Apfel-Quinoa mit Walnüssen','Quinoa','Apfel','Walnüsse'],
['dinkel-pflaume','Dinkelbrei mit Pflaumen und Mandeln','Dinkelflocken','Pflaumen','Mandeln'],
['hirse-mango-kokos','Mango-Kokos-Hirse','Hirse','Mango','Kokosraspeln'],
['buchweizen-nektarine','Buchweizenbrei mit Nektarine und Cashews','Buchweizen','Nektarine','Cashewkerne'],
['hafer-orange','Orangen-Porridge mit Mandelmus','Haferflocken','Orange','Mandelmus'],
['dinkel-banane','Dinkelporridge mit Banane und Kakao','Dinkelflocken','Banane','Erdnussmus'],
['quinoa-aprikose','Aprikosen-Quinoa mit Kürbiskernen','Quinoa','Aprikosen','Kürbiskerne'],
['hirse-traube','Hirsebrei mit Trauben und Haselnüssen','Hirse','Trauben','Haselnüsse']
];
for(const [id,name,grain,fruit,nuts]of porridge){const needsRinse=['Hirse','Quinoa','Buchweizen'].includes(grain);const cocoa=/schoko|kakao/i.test(name);add(id,'breakfast',name,needsRinse?25:15,[I(grain,60),I('Milch',200,'ml'),I(fruit,130),I(nuts,15),...(cocoa?[I('Backkakao',5)]:[])],[needsRinse?'Getreide in einem feinen Sieb gründlich abspülen. Milch mit 100 ml Wasser aufkochen.':'Milch mit 50 ml Wasser aufkochen und die Flocken einrühren.',`${grain} nach Packungsangabe bei geringer Hitze weich garen und regelmäßig umrühren. Bei Bedarf Wasser ergänzen.${cocoa?' Kakao einrühren.':''}`,`${wash} Obst bei Bedarf schälen und entkernen, klein schneiden und auf den Brei geben. Mit ${nuts} servieren.`])}
const yogurt=[
['skyr-ananas-cashew','Ananas-Skyr mit Cashewcrunch','Skyr','Ananas','Cashewkerne'],
['quark-nektarine-mandel','Nektarinenquark mit Mandeln','Magerquark','Nektarine','Mandeln'],
['soja-kirsch-pistazie','Kirsch-Sojajoghurt mit Pistazien','Sojajoghurt','Kirschen, entsteint','Pistazien, geschält'],
['joghurt-traube-walnuss','Traubenjoghurt mit Walnüssen','Naturjoghurt','Trauben','Walnüsse'],
['skyr-pflaume-haselnuss','Pflaumen-Skyr mit Haselnüssen','Skyr','Pflaumen','Haselnüsse'],
['quark-kiwi-kokos','Kiwi-Kokos-Quark','Magerquark','Kiwi','Kokosraspeln'],
['soja-birne-kuerbis','Birnen-Sojabowl mit Kürbiskernen','Sojajoghurt','Birne','Kürbiskerne'],
['ricotta-himbeer','Himbeer-Ricotta mit Mandelcrunch','Ricotta','Himbeeren','Mandeln'],
['skyr-aprikose-sesam','Aprikosen-Skyr mit Sesam','Skyr','Aprikosen','Sesam'],
['joghurt-apfel-cashew','Apfeljoghurt mit Cashewcrunch','Naturjoghurt','Apfel','Cashewkerne']
];
for(const [id,name,base,fruit,nuts]of yogurt)add(id,'breakfast',name,10,[I(base,200),I(fruit,150),I('Haferflocken',40),I(nuts,15)],[`${wash} Obst bei Bedarf schälen und entkernen, anschließend klein schneiden.`,`${base} in einer Schüssel mit den Haferflocken verrühren. Quark bei Bedarf mit etwas Wasser cremig rühren.`,`${nuts} nach Wunsch hacken und mit dem Obst auf der Bowl verteilen.`]);
const overnight=[
['oats-apfel-erdnuss','Apfel-Erdnuss Overnight Oats','Apfel','Erdnussmus'],
['oats-kirsch-kakao','Kirsch-Kakao Overnight Oats','Kirschen, entsteint','Mandeln'],
['oats-birne-mandel','Birnen-Mandel Overnight Oats','Birne','Mandelmus'],
['oats-nektarine-pistazie','Nektarinen-Pistazien Overnight Oats','Nektarine','Pistazien, geschält'],
['oats-traube-walnuss','Trauben-Walnuss Overnight Oats','Trauben','Walnüsse'],
['oats-aprikose-kokos','Aprikosen-Kokos Overnight Oats','Aprikosen','Kokosraspeln'],
['oats-kiwi-cashew','Kiwi-Cashew Overnight Oats','Kiwi','Cashewkerne'],
['oats-pflaume-zimt','Pflaumen-Zimt Overnight Oats','Pflaumen','Haselnüsse'],
['oats-ananas-leinsamen','Ananas Overnight Oats mit Leinsamen','Ananas','Leinsamen'],
['oats-orange-kakao','Orangen-Kakao Overnight Oats','Orange','Kürbiskerne']
];
for(const [id,name,fruit,nuts]of overnight){const cocoa=name.includes('Kakao');add(id,'breakfast',name,10,[I('Haferflocken',55),I('Milch',130,'ml'),I('Skyr',120),I(fruit,130),I(nuts,15),...(cocoa?[I('Backkakao',5)]:name.includes('Zimt')?[I('Zimt',2)]:[])],[`Haferflocken mit Milch und Skyr${cocoa?' sowie Kakao':''} in einem verschließbaren Glas verrühren.`,`${wash} Obst bei Bedarf schälen und entkernen und klein schneiden. Obst und ${nuts} auf die Hafermischung geben.`,`Über Nacht abgedeckt im Kühlschrank quellen lassen. Vor dem Essen umrühren.${name.includes('Zimt')?' Mit Zimt abschmecken.':''}`])}
const toast=[
['brot-ricotta-pfirsich','Ricotta-Pfirsich-Brot mit Pistazien','Ricotta','Pfirsich','Pistazien, geschält'],
['brot-huettenkaese-tomate','Hüttenkäse-Tomaten-Brot mit Kürbiskernen','Hüttenkäse','Tomaten','Kürbiskerne'],
['brot-frischkaese-birne','Birnen-Frischkäse-Brot mit Walnüssen','Frischkäse','Birne','Walnüsse'],
['brot-hummus-rotebete','Hummus-Brot mit Roter Bete und Sesam','Hummus','Rote Bete, gegart','Sesam'],
['brot-ricotta-traube','Trauben-Ricotta-Brot mit Mandeln','Ricotta','Trauben','Mandeln'],
['brot-huettenkaese-paprika','Paprika-Hüttenkäse-Brot mit Sonnenblumenkernen','Hüttenkäse','Paprika','Sonnenblumenkerne'],
['brot-frischkaese-kiwi','Kiwi-Frischkäse-Brot mit Pistazien','Frischkäse','Kiwi','Pistazien, geschält'],
['brot-hummus-gurke','Gurken-Hummus-Brot mit Kürbiskernen','Hummus','Gurke','Kürbiskerne'],
['brot-ricotta-pflaume','Pflaumen-Ricotta-Brot mit Haselnüssen','Ricotta','Pflaumen','Haselnüsse'],
['brot-huettenkaese-avocado','Avocado-Hüttenkäse-Brot mit Sesam','Hüttenkäse','Avocado','Sesam']
];
for(const [id,name,base,topping,nuts]of toast)add(id,'breakfast',name,10,[I('Vollkornbrot',100),I(base,80),I(topping,100),I(nuts,10)],[`${wash} Belag bei Bedarf schälen und entkernen und in dünne Scheiben schneiden. Bereits gegarte Rote Bete direkt in Scheiben schneiden.`, `Vollkornbrot nach Wunsch toasten und mit ${base} bestreichen.`,`${topping} darauf verteilen und mit ${nuts} bestreuen. Herzhafte Varianten nach Geschmack mit Salz und Pfeffer würzen.`]);
const eggs=[
['omelett-zucchini-feta','Zucchini-Feta-Omelett','Zucchini','Feta'],
['omelett-tomate-mozzarella','Tomaten-Mozzarella-Omelett','Tomaten','Mozzarella'],
['omelett-paprika-gouda','Paprika-Gouda-Omelett','Paprika','Gouda'],
['omelett-erbsen-feta','Erbsen-Feta-Omelett','Erbsen, TK','Feta'],
['omelett-lauch-gouda','Lauch-Gouda-Omelett','Lauch','Gouda'],
['omelett-mangold-ricotta','Mangold-Ricotta-Omelett','Mangold','Ricotta'],
['omelett-brokkoli-feta','Brokkoli-Feta-Omelett','Brokkoli','Feta'],
['omelett-mais-mozzarella','Mais-Mozzarella-Omelett','Mais','Mozzarella']
];
for(const [id,name,veg,cheese]of eggs)add(id,'breakfast',name,25,[I('Eier',2,'Stk.'),I(veg,130),I(cheese,40),I('Vollkornbrot',70),I('Olivenöl',5,'ml')],[`${wash} Frisches Gemüse klein schneiden. Brokkoli 6–8 Minuten vorgaren; Tiefkühlerbsen nach Packungsangabe garen; Mais aus der Dose abtropfen lassen.`,`${veg} in Öl bei mittlerer Hitze gar dünsten. Eier verquirlen, würzen und über das Gemüse gießen.`,`${cheese} klein schneiden und darübergeben. Zugedeckt bei kleiner Hitze vollständig stocken lassen und mit Vollkornbrot servieren.`]);
const salads=[
['quinoa-rotebete-linse','Quinoa-Rote-Bete-Salat mit Linsen','Quinoa','Rote Bete, gegart','Linsen, gekocht','Feta'],
['bulgur-fenchel-kichererbse','Fenchel-Bulgur-Salat mit Kichererbsen','Bulgur','Fenchel','Kichererbsen','Feta'],
['couscous-karotte-bohne','Karotten-Couscous mit weißen Bohnen','Couscous','Karotten','Weiße Bohnen, gekocht','Feta'],
['reis-gurke-edamame','Naturreis-Gurken-Salat mit Edamame','Naturreis','Gurke','Edamame, geschält, TK','Tofu'],
['hirse-paprika-linse','Hirse-Paprika-Salat mit Linsen','Hirse','Paprika','Linsen, gekocht','Feta'],
['graupen-rotebete-bohne','Graupensalat mit Roter Bete und Bohnen','Perlgraupen','Rote Bete, gegart','Weiße Bohnen, gekocht','Feta'],
['quinoa-zucchini-edamame','Quinoa-Zucchini-Salat mit Edamame','Quinoa','Zucchini','Edamame, geschält, TK','Tofu'],
['bulgur-rotkohl-kidney','Rotkohl-Bulgur-Salat mit Kidneybohnen','Bulgur','Rotkohl','Kidneybohnen, gekocht','Feta'],
['couscous-tomate-linse','Tomaten-Couscous-Salat mit Linsen','Couscous','Tomaten','Linsen, gekocht','Mozzarella'],
['reis-paprika-kichererbse','Reissalat mit Paprika und Kichererbsen','Naturreis','Paprika','Kichererbsen','Feta'],
['hirse-gurke-bohne','Gurken-Hirse-Salat mit weißen Bohnen','Hirse','Gurke','Weiße Bohnen, gekocht','Feta'],
['graupen-karotte-edamame','Karotten-Graupensalat mit Edamame','Perlgraupen','Karotten','Edamame, geschält, TK','Tofu']
];
for(const [id,name,grain,veg,pulse,cheese]of salads)add(id,'lunch',name,35,[I(grain,65),I(veg,150),I(pulse,120),I(cheese,50),I('Olivenöl',10,'ml'),I('Zitrone',.5,'Stk.')],[`${grain} nach Packungsangabe garen und kurz abkühlen lassen. Edamame nach Packungsangabe vollständig garen; andere bereits gekochte Hülsenfrüchte abspülen.`,`${wash} Gemüse klein schneiden. Zucchini in einer beschichteten Pfanne mit wenig Wasser gar dünsten und abkühlen lassen. Gegarte Rote Bete direkt würfeln.`,`${grain}, ${veg}, ${pulse} und gewürfelten ${cheese} mit Öl und Zitronensaft vermengen. Würzen und direkt servieren oder abgedeckt kalt stellen.`]);
const bowls=[
['reis-brokkoli-kichererbse','Brokkoli-Kichererbsen-Reisbowl','Reis','Brokkoli','Kichererbsen'],
['quinoa-kuerbis-tofu','Kürbis-Tofu-Bowl mit Quinoa','Quinoa','Hokkaidokürbis','Tofu'],
['bulgur-blumenkohl-bohne','Blumenkohl-Bulgur-Bowl mit Bohnen','Bulgur','Blumenkohl','Weiße Bohnen, gekocht'],
['hirse-zucchini-linse','Zucchini-Hirse-Bowl mit Linsen','Hirse','Zucchini','Linsen, gekocht'],
['reis-mangold-tofu','Mangold-Tofu-Reisbowl','Naturreis','Mangold','Tofu'],
['couscous-aubergine-kichererbse','Auberginen-Couscous-Bowl mit Kichererbsen','Couscous','Aubergine','Kichererbsen'],
['quinoa-fenchel-bohne','Fenchel-Quinoa-Bowl mit weißen Bohnen','Quinoa','Fenchel','Weiße Bohnen, gekocht'],
['bulgur-pilz-tofu','Pilz-Tofu-Bowl mit Bulgur','Bulgur','Champignons','Tofu'],
['hirse-brokkoli-kidney','Brokkoli-Hirse-Bowl mit Kidneybohnen','Hirse','Brokkoli','Kidneybohnen, gekocht'],
['reis-gruenkohl-kichererbse','Grünkohl-Kichererbsen-Reisbowl','Naturreis','Grünkohl','Kichererbsen'],
['couscous-lauch-tofu','Lauch-Tofu-Couscous-Bowl','Couscous','Lauch','Tofu'],
['quinoa-suesskartoffel-linse','Süßkartoffel-Quinoa-Bowl mit Linsen','Quinoa','Süßkartoffel','Linsen, gekocht']
];
for(const [id,name,grain,veg,protein]of bowls)add(id,'lunch',name,35,[I(grain,70),I(veg,220),I(protein,150),I('Tahini',15),I('Zitrone',.5,'Stk.'),I('Olivenöl',5,'ml')],[`${grain} nach Packungsangabe garen. ${wash} Gemüse klein schneiden, Süßkartoffeln schälen und Kürbis entkernen.`,`${veg} in Öl anbraten und mit wenig Wasser zugedeckt weich dünsten; feste Gemüse benötigen etwa 15–20 Minuten, Blattgemüse nur wenige Minuten. ${protein==='Tofu'?'Tofu würfeln, in einer beschichteten Pfanne anbraten und dazugeben.':'Bereits gekochte Hülsenfrüchte abspülen, zum Gemüse geben und vollständig erhitzen.'}`,`Tahini mit Zitronensaft und 2–3 EL Wasser cremig rühren. Getreide, Gemüse und ${protein} mit der Sauce in einer Bowl anrichten.`]);
const wraps=[
['wrap-rotebete-linse','Rote-Bete-Linsen-Wrap','Rote Bete, gegart','Linsen, gekocht','Feta'],
['wrap-rotkohl-tofu','Rotkohl-Tofu-Wrap mit Joghurt','Rotkohl','Tofu','Naturjoghurt'],
['wrap-zucchini-halloumi','Zucchini-Halloumi-Wrap','Zucchini','Halloumi, vegetarisch','Hummus'],
['wrap-karotte-edamame','Karotten-Edamame-Wrap','Karotten','Edamame, geschält, TK','Hummus'],
['wrap-pilz-bohne','Pilz-Bohnen-Wrap','Champignons','Weiße Bohnen, gekocht','Frischkäse'],
['wrap-kuerbis-kichererbse','Kürbis-Kichererbsen-Wrap','Hokkaidokürbis','Kichererbsen','Naturjoghurt'],
['wrap-paprika-linse','Paprika-Linsen-Wrap mit Hummus','Paprika','Linsen, gekocht','Hummus'],
['wrap-brokkoli-tofu','Brokkoli-Tofu-Wrap mit Frischkäse','Brokkoli','Tofu','Frischkäse'],
['wrap-gurke-kidney','Gurken-Kidneybohnen-Wrap','Gurke','Kidneybohnen, gekocht','Feta'],
['wrap-mangold-kichererbse','Mangold-Kichererbsen-Wrap','Mangold','Kichererbsen','Naturjoghurt']
];
for(const [id,name,veg,protein,sauce]of wraps)add(id,'lunch',name,30,[I('Vollkornwraps',2,'Stk.'),I(veg,150),I(protein,120),I(sauce,50),I('Olivenöl',5,'ml')],[`${wash} Gemüse klein schneiden. Kürbis entkernen und 15–20 Minuten weich dünsten. Pilze, Zucchini, Brokkoli und Mangold in wenig Öl und Wasser vollständig garen; anderes Gemüse kann roh bzw. bereits gegart verwendet werden.`,`${protein==='Tofu'||protein==='Halloumi, vegetarisch'?'Tofu oder Halloumi würfeln und in einer beschichteten Pfanne anbraten.':protein==='Edamame, geschält, TK'?'Edamame nach Packungsangabe vollständig garen.':'Bereits gekochte Hülsenfrüchte abspülen und nach Wunsch kurz erwärmen.'} Wraps nach Packungsangabe erwärmen.`, `Wraps mit ${sauce} bestreichen oder mit zerbröseltem Käse belegen. Gemüse und ${protein} darauf verteilen, restliches Öl darübergeben, würzen und fest einrollen.`]);
const pastaLunch=[
['pasta-fenchel-bohne','Fenchel-Bohnen-Pasta','Fenchel','Weiße Bohnen, gekocht'],
['pasta-brokkoli-ricotta','Brokkoli-Ricotta-Pasta','Brokkoli','Ricotta'],
['pasta-kuerbis-linse','Kürbis-Linsen-Pasta','Hokkaidokürbis','Linsen, gekocht'],
['pasta-zucchini-huettenkaese','Zucchini-Pasta mit Hüttenkäse','Zucchini','Hüttenkäse'],
['pasta-paprika-tofu','Paprika-Tofu-Pasta','Paprika','Tofu'],
['orzo-mangold-bohne','Mangold-Orzo mit weißen Bohnen','Mangold','Weiße Bohnen, gekocht'],
['pasta-aubergine-mozzarella','Auberginen-Mozzarella-Pasta','Aubergine','Mozzarella'],
['pasta-karotte-kichererbse','Karotten-Kichererbsen-Pasta','Karotten','Kichererbsen'],
['orzo-lauch-feta','Lauch-Feta-Orzo','Lauch','Feta'],
['pasta-rotebete-ricotta','Rote-Bete-Ricotta-Pasta','Rote Bete, gegart','Ricotta']
];
for(const [id,name,veg,protein]of pastaLunch){const noodle=id.startsWith('orzo')?'Orzo-Nudeln':'Vollkornpasta';add(id,'lunch',name,30,[I(noodle,90),I(veg,180),I(protein,100),I('Tomaten, passiert',120),I('Olivenöl',5,'ml')],[`${noodle} nach Packungsangabe kochen und eine Tasse Kochwasser aufbewahren. ${wash} Gemüse klein schneiden und Kürbis entkernen.`,`${veg} in Öl anbraten. Mit passierten Tomaten und etwas Wasser zugedeckt weich garen; Auberginen und Kürbis etwa 15–20 Minuten garen. Tofu bei Verwendung zuvor würfeln und anbraten.`,`${protein} klein schneiden oder gekochte Hülsenfrüchte abspülen. In die Sauce geben und erhitzen, dann Nudeln unterheben. Mit Kochwasser die Konsistenz anpassen und würzen.`])}
const soupsLunch=[
['suppe-fenchel-bohne','Fenchel-Bohnen-Suppe','Fenchel','Weiße Bohnen, gekocht'],
['suppe-kuerbis-kichererbse','Kürbis-Kichererbsen-Suppe','Hokkaidokürbis','Kichererbsen'],
['suppe-blumenkohl-linse','Blumenkohl-Linsen-Suppe','Blumenkohl','Linsen, gekocht'],
['suppe-brokkoli-edamame','Brokkoli-Edamame-Suppe','Brokkoli','Edamame, geschält, TK'],
['suppe-sellerie-bohne','Sellerie-Bohnen-Suppe','Sellerieknolle','Weiße Bohnen, gekocht'],
['suppe-lauch-kichererbse','Lauch-Kichererbsen-Suppe','Lauch','Kichererbsen']
];
for(const [id,name,veg,pulse]of soupsLunch)add(id,'lunch',name,35,[I(veg,250),I(pulse,160),I('Kartoffeln',100),I('Milch',100,'ml'),I('Vollkornbrot',60),I('Olivenöl',5,'ml')],[`${wash} Kartoffeln und Sellerie bei Verwendung schälen, Kürbis entkernen und alles klein schneiden. Lauch gründlich zwischen den Blättern waschen.`,`Gemüse und Kartoffeln in Öl anschwitzen. 350–450 ml Wasser angießen und 20 Minuten weich kochen. ${pulse==='Edamame, geschält, TK'?'Edamame nach Packungsangabe separat vollständig garen.':'Bereits gekochte Hülsenfrüchte abspülen.'}`,`${pulse} und Milch dazugeben und vollständig erhitzen. Nach Wunsch teilweise pürieren, würzen und mit Brot servieren.`]);
const oven=[
['ofen-fenchel-kichererbse','Fenchel-Kichererbsen-Blech mit Feta','Fenchel','Kichererbsen','Feta'],
['ofen-blumenkohl-tofu','Blumenkohl-Tofu-Blech mit Kartoffeln','Blumenkohl','Tofu','Naturjoghurt'],
['ofen-kuerbis-kidney','Kürbis-Kidneybohnen-Blech mit Feta','Hokkaidokürbis','Kidneybohnen, gekocht','Feta'],
['ofen-karotte-halloumi','Karotten-Halloumi-Blech','Karotten','Halloumi, vegetarisch','Naturjoghurt'],
['ofen-aubergine-bohne','Auberginen-Bohnen-Blech mit Mozzarella','Aubergine','Weiße Bohnen, gekocht','Mozzarella'],
['ofen-brokkoli-kichererbse','Brokkoli-Kichererbsen-Blech mit Joghurt','Brokkoli','Kichererbsen','Naturjoghurt'],
['ofen-rotebete-tofu','Rote-Bete-Tofu-Blech mit Tahini','Rote Bete, gegart','Tofu','Tahini'],
['ofen-paprika-bohne','Paprika-Bohnen-Blech mit Feta','Paprika','Weiße Bohnen, gekocht','Feta'],
['ofen-zucchini-kidney','Zucchini-Kidneybohnen-Blech mit Gouda','Zucchini','Kidneybohnen, gekocht','Gouda'],
['ofen-lauch-kichererbse','Lauch-Kichererbsen-Blech mit Ricotta','Lauch','Kichererbsen','Ricotta'],
['ofen-suesskartoffel-halloumi','Süßkartoffel-Halloumi-Blech mit Brokkoli','Brokkoli','Halloumi, vegetarisch','Naturjoghurt'],
['ofen-sellerie-linse','Sellerie-Linsen-Blech mit Feta','Sellerieknolle','Linsen, gekocht','Feta']
];
for(const [id,name,veg,protein,extra]of oven){const carb=id.includes('suesskartoffel')?'Süßkartoffel':'Kartoffeln';add(id,'dinner',name,45,[I(carb,200),I(veg,200),I(protein,130),I(extra,extra==='Tahini'?20:50),I('Olivenöl',10,'ml')],[`Ofen auf 200 °C Ober-/Unterhitze vorheizen. ${wash} Kartoffeln oder Süßkartoffeln klein schneiden, Sellerie schälen und Kürbis entkernen.`,`Kartoffeln bzw. Süßkartoffeln mit Öl 15 Minuten vorbacken. Gemüse, gewürfelten Tofu oder Halloumi bzw. abgespülte, gekochte Hülsenfrüchte dazugeben und weitere 20–25 Minuten backen, bis alles weich ist.`,extra==='Naturjoghurt'?'Mit Salz und Pfeffer abschmecken und mit Naturjoghurt servieren.':extra==='Tahini'?'Tahini mit etwas Wasser cremig rühren, abschmecken und über das fertige Blech geben.':`${extra} in den letzten 10 Minuten über das Blech geben. Abschmecken und heiß servieren.`])}
const curries=[
['curry-blumenkohl-kidney','Blumenkohl-Kidneybohnen-Curry','Blumenkohl','Kidneybohnen, gekocht'],
['curry-kuerbis-edamame','Kürbis-Edamame-Curry','Hokkaidokürbis','Edamame, geschält, TK'],
['curry-aubergine-tofu','Auberginen-Tofu-Curry','Aubergine','Tofu'],
['curry-fenchel-kichererbse','Fenchel-Kichererbsen-Curry','Fenchel','Kichererbsen'],
['curry-brokkoli-linse','Brokkoli-Linsen-Curry','Brokkoli','Linsen, gekocht'],
['curry-mangold-bohne','Mangold-Bohnen-Curry','Mangold','Weiße Bohnen, gekocht'],
['curry-karotte-tofu','Karotten-Tofu-Curry','Karotten','Tofu'],
['curry-zucchini-edamame','Zucchini-Edamame-Curry','Zucchini','Edamame, geschält, TK'],
['curry-lauch-kidney','Lauch-Kidneybohnen-Curry','Lauch','Kidneybohnen, gekocht'],
['curry-suesskartoffel-bohne','Süßkartoffel-Bohnen-Curry','Süßkartoffel','Weiße Bohnen, gekocht'],
['curry-gruenkohl-kichererbse','Grünkohl-Kichererbsen-Curry','Grünkohl','Kichererbsen'],
['curry-zuckererbse-tofu','Zuckererbsen-Tofu-Curry','Zuckererbsen','Tofu']
];
for(const [id,name,veg,protein]of curries)add(id,'dinner',name,35,[I(veg,200),I(protein,160),I('Reis',65),I('Kokosmilch',100,'ml'),I('Currypulver',5),I('Ingwer',10)],[`Reis nach Packungsangabe garen. ${wash} Gemüse klein schneiden, Süßkartoffeln schälen, Kürbis entkernen und Ingwer fein hacken.`,`Kokosmilch mit 150 ml Wasser, Ingwer und Currypulver aufkochen. Gemüse und gewürfelten Tofu bzw. abgespülte, gekochte Hülsenfrüchte dazugeben.`,`Bei niedriger Hitze 15–25 Minuten köcheln lassen, bis das Gemüse weich ist. Edamame und Zuckererbsen bei Verwendung nach Packungsangabe vollständig durchgaren. Mit Reis servieren.`]);
const risottos=[
['risotto-erbse-zitrone','Erbsen-Zitronen-Risotto','Erbsen, TK'],
['risotto-kuerbis','Kürbisrisotto mit Kürbiskernen','Hokkaidokürbis'],
['risotto-zucchini','Zucchinirisotto mit Basilikum','Zucchini'],
['risotto-fenchel','Fenchelrisotto mit Zitrone','Fenchel'],
['risotto-karotte','Karottenrisotto mit Petersilie','Karotten'],
['risotto-lauch','Lauchrisotto mit Parmesan','Lauch'],
['risotto-brokkoli','Brokkolirisotto mit Zitrone','Brokkoli'],
['risotto-tomate','Tomatenrisotto mit Basilikum','Tomaten']
];
for(const [id,name,veg]of risottos){const herb=name.includes('Basilikum')?'Basilikum':name.includes('Petersilie')?'Petersilie':null;add(id,'dinner',name,35,[I('Risottoreis',85),I(veg,200),I('Parmesan, vegetarisch',35),I('Olivenöl',10,'ml'),...(name.includes('Zitrone')?[I('Zitrone',.5,'Stk.')]:[]),...(name.includes('Kürbiskernen')?[I('Kürbiskerne',15)]:[]),...(herb?[I(herb,10)]:[])],[`${wash} Gemüse klein schneiden und Kürbis bei Verwendung entkernen. Reis und Gemüse in Öl kurz anschwitzen.`,`Nach und nach etwa 400–500 ml heißes Wasser angießen und bei mittlerer Hitze 20–25 Minuten unter häufigem Rühren garen. Erbsen erst gegen Ende zufügen und vollständig durchgaren.`,`Vegetarischen Parmesan unterrühren, mit Salz und Pfeffer abschmecken.${herb?' Gewaschene, gehackte Kräuter unterheben.':''}${name.includes('Zitrone')?' Zitronensaft dazugeben.':''}${name.includes('Kürbiskernen')?' Kürbiskerne darüberstreuen.':''}`])}
const pastaDinner=[
['spaghetti-paprika-bohne','Spaghetti mit Paprika-Bohnen-Sauce','Paprika','Weiße Bohnen, gekocht'],
['spaghetti-lauch-ricotta','Spaghetti mit Lauch und Ricotta','Lauch','Ricotta'],
['nudel-blumenkohl-feta','Blumenkohl-Feta-Nudeln','Blumenkohl','Feta'],
['orzo-kuerbis-tofu','Kürbis-Tofu-Orzo','Hokkaidokürbis','Tofu'],
['spaghetti-mangold-mozzarella','Mangold-Mozzarella-Spaghetti','Mangold','Mozzarella'],
['nudel-fenchel-linse','Fenchel-Linsen-Nudeln','Fenchel','Linsen, gekocht'],
['orzo-pilz-kichererbse','Pilz-Kichererbsen-Orzo','Champignons','Kichererbsen'],
['spaghetti-gruenkohl-ricotta','Grünkohl-Ricotta-Spaghetti','Grünkohl','Ricotta']
];
for(const [id,name,veg,protein]of pastaDinner){const noodle=id.startsWith('orzo')?'Orzo-Nudeln':id.startsWith('spaghetti')?'Vollkornspaghetti':'Vollkornnudeln';add(id,'dinner',name,35,[I(noodle,90),I(veg,200),I(protein,120),I('Tomaten, passiert',150),I('Olivenöl',10,'ml')],[`${noodle} nach Packungsangabe garen. Etwas Kochwasser aufbewahren. ${wash} Gemüse klein schneiden und Kürbis entkernen.`,`Gemüse in Öl anbraten, Tomaten und etwas Wasser dazugeben und 10–20 Minuten weich garen. Tofu bei Verwendung vorher würfeln und in einer beschichteten Pfanne anbraten.`,`${protein} unterheben; gekochte Hülsenfrüchte vorher abspülen. Vollständig erhitzen, Nudeln einrühren, bei Bedarf Kochwasser ergänzen und abschmecken.`])}
const animalDinners=[
['haehnchen-fenchel-reis','Hähnchen-Fenchel-Pfanne mit Reis','Hähnchenbrust','Fenchel','Reis'],
['pute-brokkoli-bulgur','Puten-Brokkoli-Pfanne mit Bulgur','Putenbrust','Brokkoli','Bulgur'],
['haehnchen-kuerbis-couscous','Kürbis-Hähnchen mit Couscous','Hähnchenbrust','Hokkaidokürbis','Couscous'],
['pute-lauch-quinoa','Puten-Lauch-Pfanne mit Quinoa','Putenbrust','Lauch','Quinoa'],
['lachs-fenchel-reis','Lachs mit Fenchel und Naturreis','Lachsfilet','Fenchel','Naturreis'],
['kabeljau-brokkoli-couscous','Kabeljau mit Brokkoli-Couscous','Kabeljaufilet','Brokkoli','Couscous'],
['garnelen-zucchini-reis','Garnelen-Zucchini-Pfanne mit Reis','Garnelen, geschält','Zucchini','Reis'],
['haehnchen-mangold-bulgur','Hähnchen-Mangold-Pfanne mit Bulgur','Hähnchenbrust','Mangold','Bulgur'],
['lachs-paprika-quinoa','Lachs mit Paprika und Quinoa','Lachsfilet','Paprika','Quinoa'],
['garnelen-zuckererbse-nudel','Garnelen mit Zuckererbsen und Reisnudeln','Garnelen, geschält','Zuckererbsen','Reisnudeln']
];
for(const [id,name,protein,veg,carb]of animalDinners){const poultry=/brust/.test(protein);add(id,'dinner',name,35,[I(protein,180),I(veg,220),I(carb,75),I('Olivenöl',10,'ml'),I('Zitrone',.5,'Stk.')],[`${carb} nach Packungsangabe zubereiten. ${wash} Gemüse klein schneiden und Kürbis entkernen.`,`${veg} mit der Hälfte des Öls anbraten und mit wenig Wasser zugedeckt weich garen. Zuckererbsen bei Verwendung vollständig durchgaren.`,poultry?`${protein} auf einem separaten Brett in Stücke schneiden und im restlichen Öl vollständig auf mindestens 75 °C Kerntemperatur durchbraten. Mit Zitronensaft würzen und mit Gemüse und ${carb} servieren.`:protein==='Garnelen, geschält'?`Garnelen bei Bedarf im Kühlschrank auftauen und trocken tupfen. Im restlichen Öl vollständig durchgaren, bis sie fest und undurchsichtig sind. Mit Zitronensaft, Gemüse und ${carb} servieren.`:`Fisch auf Gräten prüfen und im restlichen Öl von beiden Seiten vollständig durchgaren, bis er sich leicht zerteilen lässt. Mit Zitronensaft, Gemüse und ${carb} servieren.`],false)}
