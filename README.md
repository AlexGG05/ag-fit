# ag fit

Eine Ernährungs-App für euch beide – mit persönlichen Konten, gemeinsamem Haushalt, 270 Rezepten und euren eigenen Gerichten. Bestehende Konten, Favoriten, Pläne und SQLite-Daten bleiben beim Update erhalten. Trainingsfunktionen werden nicht wieder eingeführt.

## Was die App kann

- **Gemeinsam planen:** Haushalt erstellen, einmaligen Einladungscode teilen und mit dem zweiten Konto beitreten. Wochenplan, Portionen (1–6), Einkaufsliste, Vorräte, Produkte und Preise werden gemeinsam genutzt. Änderungen erscheinen auf dem anderen Gerät nach spätestens etwa fünf Sekunden oder beim erneuten Fokussieren. Profile, Ziele, Favoriten und Ernährungstagebuch bleiben persönlich. Ohne Haushalt funktioniert alles für ein Einzelkonto.
- **Rezepte entdecken:** 270 hinterlegte Gerichte, Suche nach Namen, Zutaten und Tags, Filter, Favoriten und vollständige Kochanleitungen. 16 lokal mitgelieferte KI-Bilder zeigen gekennzeichnete Serviervorschläge für Gerichtskategorien, keine exakten Fotos jedes Rezepts.
- **Intelligenter Wochenplan:** sieben Tage, drei Vorschläge je Mahlzeit, automatisch freie Felder füllen, bewusst außerhalb essen. Ernährung, Zutaten-Ausschlüsse, Allergene, Vorlieben, Kochzeit sowie optional eigene Kalorien-/Proteinziele und Budget berücksichtigen. Vorräte und baldiges MHD werden bevorzugt, geplante Wiederholungen im Umfeld vermieden. Gründe stehen bei Vorschlägen; passen keine Gerichte, bleibt das Feld mit Erklärung offen. Manuelle Auswahlen werden erhalten.
- **Eigene Rezepte:** Titel, Tags, Zutaten, Mengen, Einheiten, ursprüngliche Portionen, Dauer, Schritte und optional HTTPS-Bildadresse. Bekannte Zutaten liefern geschätzte Nährwerte; fehlende Gesamtnährwerte lassen sich ergänzen. Eigene Gerichte sind suchbar, favorisierbar und planbar. Freigabe im Haushalt ist optional, Bearbeitung nur durch die Eigentümerperson. Löschen archiviert das Gericht: bestehende Pläne und Tagebuchwerte bleiben erhalten. Ein Rezeptimport über beliebige URLs ist die ausdrücklich spätere optionale Teilfunktion; der Server ruft keine solchen URLs ab. Externe eigene Bilder lädt der Browser und sie sind offline gegebenenfalls nicht verfügbar.
- **Vorratskammer:** Mengen, Lagerort und MHD erfassen, bearbeiten, löschen; bald ablaufende Lebensmittel sehen und passende Rezepte mit fehlenden Zutaten öffnen. Einkaufsmengen ziehen vorhandene Vorräte über die ganze Woche einmalig ab. kg/g und l/ml werden exakt umgerechnet, bekannte Stückgewichte geschätzt, unvereinbare Einheiten getrennt gehalten. Erst **Verbrauch bestätigen und Vorräte abbuchen** im Rezept bucht eine Entnahme; Planen oder Tagebuchführen verbraucht nichts automatisch.
- **Tatsächlich gegessen:** geplante Mahlzeit ausdrücklich buchen, Portionen und Datum bearbeiten; Snacks, Getränke und einzelne Lebensmittel auch ohne Rezept erfassen. Kalorien, Protein, Kohlenhydrate und Fett werden getrennt vom Plan ausgewertet. Geplante Mahlzeiten lassen sich pro Termin nur einmal buchen; Bearbeitung, Löschen und vergangene Tage werden unterstützt. Historische Einträge enthalten einen eigenen Rezept-/Nährwertstand.
- **Barcode und Produkte:** Kamera liest EAN/GTIN lokal mit ZXing; alternativ Code eintippen oder Produkt vollständig manuell erfassen. Erst die optionale Suche ruft Open Food Facts vom Server auf. Produktname, Bezugsbasis und Nährwerte prüfen und bestätigen. Werte je 100 g/ml werden für Mengen, definierte Portionen und Stückgrößen umgerechnet und können ins Tagebuch oder in den Vorrat übernommen werden. Fehlende Angaben bleiben unbekannt. OFF-Ausfälle blockieren keine manuelle Eingabe. Kamera benötigt HTTPS, ein passendes Gerät und Berechtigung.
- **Budget:** freiwilliges Wochenbudget, selbst gepflegte Preise pro Bezugsmenge, geschätzte Kosten pro Portion/Rezept, für geplante Gerichte und den verbleibenden Wocheneinkauf. Vollständig bepreiste günstigere passende Alternativen lassen sich vergleichen. Fehlende Preise bedeuten eine unvollständige Summe, niemals automatisch 0 €. Es gibt keine Live-Supermarktpreise.
- **Statistiken:** Tag, Kalenderwoche und Monat mit vier mobilen Diagrammen, zugänglicher Datentabelle, individuellen Vergleichszielen und Verlauf. Tatsächliche Werte stehen getrennt vom Plan. Tage ohne Eintrag zählen nicht als 0-kcal-Tage, unvollständige Nährwerte werden markiert.
- **Installierbare App:** Manifest, Android-/iOS-Icons, Service Worker und Updatehinweis. Im angemeldeten Tab sind zuletzt bestätigter Plan, Favoriten, Einkaufsliste und Rezeptdetails offline lesbar; Schreibaktionen sind sichtbar deaktiviert.

Nährwerte und Stückgewichte sind Schätzungen, keine medizinischen Empfehlungen. Zielwerte setzt ihr selbst. Allergenfilter nutzen hinterlegte Zutaten und Hinweise und bestätigen **keine Allergenfreiheit**: Verpackungen, zusammengesetzte Zutaten und mögliche Spuren selbst prüfen. Ungeprüfte zusammengesetzte Produkte werden bei Allergen-Ausschlüssen nicht automatisch empfohlen. MHD ist kein automatisches Wegwerfdatum.

## Gemeinsam starten und Favoriten nutzen

1. Beide erstellen eigene Konten. Unter **Unser Haushalt** erstellt eine Person einen Haushalt und eine Einladung. Die andere gibt den Code dort ein. Nur die Verwaltung kann neue Einladungen erstellen; Codes sind einmalig und sieben Tage gültig.
2. Der gemeinsame Plan startet mit dem bisherigen Plan der erstellenden Person. Persönliche Pläne bleiben gespeichert und erscheinen nach dem Verlassen wieder. Der gemeinsame Plan und gemeinsame Ressourcen bleiben für verbleibende Mitglieder erhalten; die Verwaltung wird beim Verlassen weitergegeben. Persönliche Vorräte/Preise/Produkte werden separat aufbewahrt, nicht still in den Haushalt verschoben.
3. Bei Rezepten auf das Herz tippen. **Meine Favoriten → Für einen Tag einplanen** öffnet Tag und Mahlzeit. Ein Rezept kann auch mehrfach eingeplant werden; der Dialog nennt eine bestehende Auswahl, die ersetzt wird.
4. **Ernährungstagebuch** erfasst ausdrücklich gegessene Mengen. **Vorratskammer** und **Lebensmittelbudget** pflegt ihr nach Bedarf; die Einkaufsliste berechnet fehlende Mengen automatisch.

## Konten und Daten

Standardmäßig erlaubt der Server **zwei Registrierungen**, danach bleibt nur die Anmeldung offen. Es gibt keine Standardpasswörter. Für weitere Familienmitglieder `MAX_USERS` auf beispielsweise `6` setzen; `0` erlaubt unbegrenzt viele Registrierungen. Das Limit gilt serverweit, nicht pro Haushalt. Bestehende Konten bleiben unabhängig vom Limit nutzbar. Noch keine E-Mail-Verifizierung, Passwort-Wiederherstellung oder Kontolöschung. Daten der ursprünglichen rein lokalen Browser-Version werden nicht automatisch importiert.

Die SQLite-Erweiterungen sind additiv und werden beim Start idempotent angewendet (`schema_migrations`, sechs Versionen). Vorhandene Benutzerzeilen, Passwort-Hashes, Sitzungen und beliebige bisherige JSON-Daten bleiben erhalten. Neue Haushalt-, Tagebuch-, Rezept-, Vorrats-, Preis- und Produkttabellen ergänzen sie. **Vor einem Produktionsupdate ein Backup erstellen** und das vorhandene Volume unverändert weiterverwenden. Eine alte App-Version kann die neuen Funktionen nicht anzeigen; ein Rücksprung auf das alte Image löscht deren Tabellen nicht.

## Installation und Offline-Modus

Für Kamera, PWA und verschlüsselten Offline-Speicher **HTTPS** nutzen (localhost gilt für Entwicklung als sicher). Android: „App installieren“ oder Browsermenü; iPhone/iPad: Safari → Teilen → Zum Home-Bildschirm. Ein bloßer HTTP-Aufruf über eine Server-IP reicht hierfür nicht.

Der Service Worker speichert ausschließlich öffentliche App-Dateien und lokale Rezeptbilder, niemals API-Antworten, Cookies oder persönliche Daten. Ein eigener, mit AES-GCM verschlüsselter IndexedDB-Snapshot enthält den zuletzt bestätigten Plan und Rezeptbestand. Der Schlüssel liegt nur im Session-Speicher des angemeldeten Tabs. Ein neuer Tab ohne diesen Schlüssel zeigt offline keine Kontodaten; nach spätestens 30 Tagen ist eine Verbindung erforderlich. Privater Modus, gelöschter Browserspeicher oder Speicherbeschränkungen können Offline-Lesen verhindern. Das Tagebuch wird nicht offline vorgehalten.

Offline-Schreibaktionen sind deaktiviert; beim Verbinden lädt die App zuerst den Serverstand. Nicht bestätigte Online-Änderungen werden nicht als erfolgreich gespeichert angezeigt: bei Netzwerkfehlern erneut speichern, bei Versionskonflikten lokale Änderungen als JSON sichern oder ausdrücklich verwerfen und den Serverstand laden. Es gibt keine automatische Konfliktüberschreibung. Beim Abmelden werden private Offline-Snapshots und Schlüssel gelöscht, andere offene Tabs informiert; eine Offline-Abmeldung merkt die Sitzungsabmeldung für die nächste Verbindung vor. Auf gemeinsam verwendeten Geräten stets abmelden. Neue Versionen erscheinen als **Neue App-Version laden**; vor dem Wechsel Änderungen fertig speichern.

## Docker Compose: lokal oder Server

Voraussetzung: Docker Engine und Compose v2.

```sh
git clone https://github.com/AlexGG05/ag-fit.git
cd ag-fit
docker compose up -d --build
```

Auf Port **8080** die App öffnen und eure beiden Konten erstellen. Alternativer Host-Port: `AG_FIT_PORT=8090 docker compose up -d --build`.

```sh
docker compose ps
docker compose logs -f
curl --fail http://localhost:8080/health
```

Die Datenbank liegt unter `/data/ag-fit.sqlite` im benannten Volume `ag-fit-data`. **Das Volume beibehalten**, auch beim Aktualisieren oder Wechseln des Images. `docker compose down` behält es; `docker compose down -v` löscht sämtliche Konten und Pläne unwiederbringlich.

## Direkt in Arcane ausrollen

### Empfohlen: fertiges GitHub-Container-Image

Bei Änderungen auf `main` führt der GitHub-Workflow **Test and publish container** Tests, Build und einen Container-Smoke-Test aus. Anschließend veröffentlicht er `ghcr.io/alexgg05/ag-fit:latest` und einen Commit-SHA-Tag für **amd64 und arm64**. Warte auf einen erfolgreichen Workflow.

Für anonymes Pulling das GitHub-Package unter **Packages → ag-fit → Package settings → Change visibility → Public** öffentlich stellen. Alternativ in Arcane Registry-Zugangsdaten für `ghcr.io` mit Leserechten hinterlegen. Der Workflow verwendet das automatisch bereitgestellte `GITHUB_TOKEN`.

In Arcane ein Compose-Projekt mit folgender vollständiger Datei erstellen:

```yaml
services:
  ag-fit:
    image: ghcr.io/alexgg05/ag-fit:latest
    ports:
      - "8080:8080"
    environment:
      MAX_USERS: "2"
    volumes:
      - ag-fit-data:/data
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:8080/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 3s
      start_period: 5s
      retries: 3
volumes:
  ag-fit-data:
```

Anschließend unter `http://DEINE-SERVER-IP:8080` öffnen. Für öffentlichen Zugriff einen Reverse Proxy mit **HTTPS** davor setzen, der den ursprünglichen `Host` und `X-Forwarded-Proto: https` weiterreicht. Dann setzt die App sichere Sitzungscookies. Optional `environment: { COOKIE_SECURE: "true" }` ergänzen, um ausschließlich HTTPS-Cookies zu erzwingen (Anmeldung über reines HTTP funktioniert damit nicht). Nur hinter einem lokalen Proxy kann die Portbindung `127.0.0.1:8080:8080` verwendet werden.

Updates: erfolgreichen Workflow abwarten, in Arcane Image neu ziehen und Projekt neu bereitstellen. **Projektname und Volume-Zuordnung beibehalten.** Auf der Kommandozeile: `docker compose pull && docker compose up -d`. Für reproduzierbare Versionen `latest` durch einen Commit-SHA-Tag ersetzen.

### Alternative: direkt aus GitHub bauen

Bei öffentlichem Repository und Unterstützung von Compose-Builds in Arcane:

```yaml
services:
  ag-fit:
    build:
      context: https://github.com/AlexGG05/ag-fit.git#main
    ports:
      - "8080:8080"
    environment:
      MAX_USERS: "2"
    volumes:
      - ag-fit-data:/data
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
volumes:
  ag-fit-data:
```

Der Docker-Host benötigt Zugriff auf GitHub, Docker Hub und die npm-Registry. Für private Repositories die Image-Variante mit Registry-Anmeldung verwenden. Zugangsdaten niemals in Compose-URLs schreiben. Nach Änderungen neu bauen; für einen festen Stand `#main` durch `#COMMIT-SHA` ersetzen.

## Sicherung

Die gesamte Datenbank einschließlich möglicher WAL-Dateien im gestoppten Zustand sichern:

```sh
docker compose stop ag-fit
docker compose cp ag-fit:/data ./ag-fit-backup
docker compose start ag-fit
```

Das Backup sicher aufbewahren: Es enthält Kontodaten, Passwort-Hashes und persönliche Pläne. Auch Sitzungen sind enthalten. Eine Wiederherstellung erfordert das Kopieren des vollständigen gesicherten Datenverzeichnisses in das gestoppte Volume mit Eigentümer UID/GID 1000. Bei Host-Bind-Mounts muss `/data` für UID 1000 beschreibbar sein; benannte Volumes werden automatisch vorbereitet.

## Entwicklung

Node.js **24** (mit integriertem `node:sqlite`) und npm. Keine externe Datenbank oder API-Schlüssel nötig. Nur die optionale Produktsuche benötigt ausgehendes HTTPS zu `world.openfoodfacts.org`; bei fehlender Verbindung bleibt die manuelle Erfassung verfügbar.

```sh
npm ci
npm run dev:server  # API auf Port 8080; Datenbank in .data/
```

In einem zweiten Terminal:

```sh
npm run dev         # Vite auf Port 5173; /api wird auf Port 8080 weitergeleitet
```

```sh
npm test
npm run build
npx playwright install --with-deps chromium # einmalig für Browserprüfungen
npm run test:browser
DATABASE_PATH=./.data/ag-fit.sqlite npm start
```

Falls Port 8080 bereits belegt ist, den dort laufenden App-Container vorher stoppen oder den Vite-Proxy und `PORT` passend setzen. `npm run preview` liefert allein das Frontend aus und bietet keine Anmeldung; für Produktion `npm start` oder Docker verwenden.

Konfiguration: `PORT` (Standard 8080), `DATABASE_PATH` (Standard `/data/ag-fit.sqlite`), `MAX_USERS` (Standard 2; 0 für unbegrenzt), `COOKIE_SECURE=true` für ausschließlich HTTPS. Sitzungen laufen nach 30 Tagen ab, Passwörter werden mit individuellen Salts und scrypt gehasht. Cookies sind HttpOnly und SameSite=Lax. Die API schützt gegen fremde Origins, begrenzt Anmeldeversuche und verhindert das stille Überschreiben zwischen Geräten: Bei einem Konflikt werden weitere Speicherungen angehalten. Lokale Änderungen können als JSON gesichert werden; anschließend den Serverstand ausdrücklich laden. Geteilte Ressourcen verwenden Versionsprüfungen.

Für Builds hinter einem Unternehmensproxy unterstützt das Dockerfile das optionale BuildKit-Secret `build_ca` mit einem vertrauenswürdigen CA-Zertifikat. Es wird nur während der Installation eingebunden und nicht im Image gespeichert. Normale Docker-Hosts und GitHub Actions benötigen es nicht.

## Hinweise

Nährwerte sind Schätzwerte. Allergien und individuelle Einschränkungen vor der Rezeptauswahl prüfen. Für Overnight-Rezepte kommt zur angegebenen aktiven Zubereitungszeit eine Kühlzeit über Nacht hinzu. Salz, Pfeffer und Wasser werden als Vorrat vorausgesetzt.

Die Bilder in `public/food/meal-photos.png` wurden für dieses Projekt mit OpenAI-Bildgenerierung erstellt. Sie dienen als gekennzeichnete, beispielhafte Serviervorschläge für 16 Gerichtskategorien. Google Fonts werden optional geladen; ohne Zugriff verwendet die App Systemschriften.
