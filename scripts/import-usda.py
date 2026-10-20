#!/usr/bin/env python3
"""Reproduce the selected USDA SR28 reference facts; no recipe text is imported."""
import hashlib,json,pathlib,urllib.request,argparse
PIN='1e457b599af101ce463a195867574eba16c81acb'
EXPECTED={'FOOD_DES.txt': 'bb2047218cdad1d830da69e760386409fde3b7afabceae604c5479f280d4fa2e', 'NUT_DATA.txt': '506c9ee39a276ac8f53565d270597e430944ec3363adb53a91cc6ee8c061fac5'}
BASE=f'https://raw.githubusercontent.com/alyssaq/usda-sqlite/{PIN}/data/'
# German ingredient -> exact USDA NDB number. Closely matching commodity foods,
# not branded products; the original English description is retained for review.
MAPPING={
'Haferflocken':'08120','Hafermehl':'20132','Weizenvollkornmehl':'20080','Roggenvollkornmehl':'20063','Buchweizenmehl':'20011','Reismehl':'20061','Hirse':'20031','Buchweizen':'20008','Quinoa':'20035','Dinkelkörner':'20140','Polenta':'20020','Vollkorngrieß':'20466','Speisestärke':'20027','Backpulver':'18370','Trockenhefe':'18375',
'Milch':'01082','Naturjoghurt':'01117','Griechischer Joghurt, fettarm':'01256','Hüttenkäse':'01015','Ricotta':'01037','Frischkäse':'43274','Feta':'01019','Mozzarella':'01028','Gouda':'01022','Parmesan, vegetarisch':'01033','Eier':'01123','Mandelmilch, ungesüßt':'14091','Sojadrink':'16120','Kokosmilch':'12118','Tofu':'16126',
'Apfel':'09003','Birne':'09252','Banane':'09040','Pfirsich':'09236','Nektarine':'09191','Aprikosen':'09021','Pflaumen':'09279','Kiwi':'09148','Orange':'09200','Mango':'09176','Ananas':'09266','Kirschen, entsteint':'09070','Erdbeeren':'09316','Himbeeren':'09302','Heidelbeeren':'09050','Brombeeren':'09042','Granatapfelkerne':'09286','Papaya':'09226','Trauben':'09132','Datteln':'09087','Feigen, getrocknet':'09094','Rosinen':'09298',
'Walnüsse':'12155','Haselnüsse':'12120','Pistazien, geschält':'12151','Cashewkerne':'12087','Mandeln':'12061','Chiasamen':'12006','Leinsamen':'12220','Sesam':'12023','Kürbiskerne':'12014','Sonnenblumenkerne':'12036','Kokosraspeln':'12108','Erdnussmus':'16398','Mandelmus':'12195','Tahini':'12166','Backkakao':'19165','Honig':'19296','Ahornsirup':'19353','Zucker':'19335','Zimt':'02010','Vanilleextrakt':'02050','Ingwer':'11216','Zitronensaft':'09152','Limettensaft':'09160',
'Kichererbsen':'16057','Linsen, gekocht':'16070','Rote Linsen':'16069','Weiße Bohnen, gekocht':'16050','Kidneybohnen, gekocht':'16033','Schwarze Bohnen, gekocht':'16015','Erbsen, TK':'11312','Edamame, geschält, TK':'11211',
'Hähnchenbrust':'05314','Putenbrust':'05219','Lachsfilet':'15236','Kabeljaufilet':'15015','Rinderhackfleisch, 5 % Fett':'23557','Schweinefilet':'10060',
'Süßkartoffel':'11507','Kartoffeln':'11352','Brokkoli':'11090','Blumenkohl':'11135','Karotten':'11124','Zucchini':'11477','Aubergine':'11209','Spinat':'11457','Champignons':'11260','Fenchel':'11957','Lauch':'11246','Tomaten':'11529','Paprika':'11821','Weißkohl':'11109','Grünkohl':'11233','Sellerieknolle':'11141','Rote Bete, gegart':'11081','Gurke':'11205','Avocado':'09037','Rucola':'11959','Römersalat':'11251','Radieschen':'11429','Mangold':'11147','Hokkaidokürbis':'11422','Mais':'11167','Zwiebel':'11282','Knoblauch':'11215','Petersilie':'11297','Basilikum':'02044','Dill':'02045','Minze':'02064','Kreuzkümmel':'02014','Paprikapulver':'02028','Currypulver':'02015','Oregano, getrocknet':'02027',
'Olivenöl':'04053','Rapsöl':'04582','Senf':'02046','Sojasauce':'16123','Oliven, entsteint':'09193','Tomaten, passiert':'11547','Naturreis':'20036','Reis':'20044','Perlgraupen':'20005','Bulgur':'20012','Couscous':'20028','Vollkornpasta':'20124','Vollkornbrot':'18075','Roggenbrot':'18060','Knäckebrot':'18216','Maistortillas':'18363','Wasser':'14411','Kaffee, aufgebrüht':'14209','Grüner Tee, aufgebrüht':'14278','Schwarzer Tee, aufgebrüht':'14355','Orangensaft':'09206'}
DENSITY={'Milch':1.03,'Mandelmilch, ungesüßt':1,'Sojadrink':1.02,'Kokosmilch':1.01,'Olivenöl':.91,'Rapsöl':.92,'Sojasauce':1.16,'Wasser':1,'Kaffee, aufgebrüht':1,'Grüner Tee, aufgebrüht':1,'Schwarzer Tee, aufgebrüht':1,'Zitronensaft':1.03,'Limettensaft':1.03,'Orangensaft':1.04}
WEIGHTS={'Eier':60,'Apfel':150,'Banane':120,'Birne':160,'Avocado':150,'Paprika':150,'Gurke':300}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--cache',default='/tmp/ag-fit-usda');args=parser.parse_args();cache=pathlib.Path(args.cache);cache.mkdir(parents=True,exist_ok=True)
 files={}
 for name in ['FOOD_DES.txt','NUT_DATA.txt']:
  path=cache/name
  if not path.exists():
   with urllib.request.urlopen(BASE+name,timeout=60) as response:path.write_bytes(response.read())
  files[name]=path.read_bytes()
  if hashlib.sha256(files[name]).hexdigest()!=EXPECTED[name]:raise ValueError('USDA source checksum mismatch: '+name)
 foods={}
 for line in files['FOOD_DES.txt'].decode('latin1').splitlines():
  p=[s.strip('~') for s in line.split('^')];foods[p[0]]=p[2]
 nutrients={};keys={'208':'kcal','203':'protein','205':'carbs','204':'fat'}
 for line in files['NUT_DATA.txt'].decode('latin1').splitlines():
  p=[s.strip('~') for s in line.split('^')]
  if p[1] in keys:nutrients.setdefault(p[0],{})[keys[p[1]]]=float(p[2])
 facts=[]
 for name,ndb in MAPPING.items():
  assert ndb in foods, (name,ndb)
  values={k:nutrients.get(ndb,{}).get(k) for k in keys.values()}
  facts.append({'name':name,'ndb':ndb,'sourceDescription':foods[ndb],'mappingNote':'Zugeordneter Referenzwert; Sorte und konkretes Produkt können abweichen.','basis':'g',**values,'density':DENSITY.get(name),'unitWeight':WEIGHTS.get(name),'estimated':True})
 out={'source':'USDA National Nutrient Database for Standard Reference, Release 28 (2015/2016)','sourceUrl':'https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR/SR28/sr28_doc.pdf','mirrorCommit':PIN,'files':{k:hashlib.sha256(v).hexdigest() for k,v in files.items()},'license':'US government nutrient data; public domain. German ingredient mappings and density assumptions are AG Fit estimates.','facts':facts}
 target=pathlib.Path(__file__).resolve().parents[1]/'src/catalogue/usda-sr28.json';target.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(f'{len(facts)} traceable ingredient references -> {target.name}')
if __name__=='__main__':main()
