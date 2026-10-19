# ag fit

Eine persönliche Ernährungs-App für zwei: Rezepte entdecken, eure Mahlzeiten planen und entspannt einkaufen – mit eigenen Konten und einer dauerhaften Datenbank.

## Für eure Ernährung

- **270 vollständige Rezepte** für Frühstück, Mittagessen und Abendessen, mit Mengen, Kochanleitungen und ungefähren Kalorien- und Proteinwerten.
- Eine Rezeptbibliothek mit Suche nach Gericht oder Zutat, Mahlzeitenfiltern, schnellen Gerichten bis 25 Minuten, proteinreichen Gerichten ab 25 g Protein und einer eigenen Favoritenansicht.
- Lokal mitgelieferte, KI-generierte Food-Bilder. Die 16 fotoähnlichen Serviervorschläge sind Gerichtskategorien zugeordnet und in der Oberfläche als KI-Bilder gekennzeichnet; sie zeigen nicht jedes Rezept exakt. Keine externen Bildaufrufe zur Laufzeit.
- Persönlicher Tagesüberblick über geplante Kalorien und Protein pro Person. Der Kalorien-Planwert ist frei wählbar und keine automatische Bedarfsempfehlung. Die Anzeige erfasst geplante Gerichte, keine verzehrten Mahlzeiten.
- Ein sieben Tage umfassender Wochenplan mit drei wechselnden Vorschlägen je Mahlzeit. Ohne manuelles Austauschen wiederholt sich mindestens 24 Tage lang kein Vorschlag derselben Mahlzeit, auch vegetarisch. Die erste automatische Empfehlung durchläuft den gesamten passenden Bestand, statt nur einen Teil der Rezepte zu nutzen.
- Freie Mahlzeiten automatisch füllen; bereits gewählte Gerichte und „Ich esse außerhalb“ bleiben erhalten. „Neue Vorschläge“ tauscht ausschließlich die angebotenen Ideen aus.
- Rezepte für einen beliebigen Tag und jede Mahlzeit der kommenden Woche einplanen, Kochschritte abhaken und Zutaten für standardmäßig **zwei Portionen** anzeigen. Die Portionsgröße ist für das ganze Konto auf 1–6 einstellbar.
- Eine automatisch summierte Einkaufsliste mit Abhaken, Textexport und Druckansicht.
- Anmeldung und eigene Konten für euch beide. Profile, Favoriten, Wochenpläne und Einkaufslisten werden getrennt auf dem Server gespeichert und nach Anmeldung auf anderen Geräten geladen. Die beiden Konten teilen derzeit keinen Wochenplan und keine gemeinsame Liste.

Training und Workouts sind aus der Oberfläche entfernt. Bereits gespeicherte Konten und Daten bleiben beim Update erhalten; bestehende Portions- und Profilwerte werden respektiert. Alte Trainingsdaten werden nicht gelöscht, sind aber nicht mehr zugänglich über die Oberfläche.

Die Gerichte stammen aus einem hinterlegten Rezeptbestand. Es gibt keinen Live-Import fremder Rezepte oder KI-Rezeptgenerierung. Noch keine E-Mail-Verifizierung oder Passwort-Wiederherstellung. Browserdaten der ursprünglichen lokalen Version werden nicht automatisch übernommen.

## Lieblingsgerichte gezielt einplanen

1. Bei einem Rezept auf das **Herz** tippen, um es als Favorit zu speichern. Das geht auf Rezeptkarten und im geöffneten Rezept.
2. **Meine Favoriten** in der Navigation öffnen. Hier lassen sich gespeicherte Rezepte durchsuchen und filtern. Gespeicherte Favoriten bleiben auch bei einer geänderten Ernährungseinstellung sichtbar.
3. **Für einen Tag einplanen** wählen. Im Rezept den Tag innerhalb der nächsten sieben Tage und die gewünschte Mahlzeit einstellen. Ein Mittagessen-Rezept kann beispielsweise auch zum Abendessen eingeplant werden.
4. Die Auswahl übernehmen. Eine bereits belegte Mahlzeit wird im Dialog angezeigt und gezielt ersetzt. Andere Mahlzeiten und die Favoritenliste bleiben erhalten. Die Einkaufsliste berücksichtigt das gewählte Rezept und eure Portionszahl.

Im Wochenplan führt **Aus Favoriten** direkt zur passenden Auswahl für die aktuelle Mahlzeit. Ein Rezept lässt sich bewusst für mehrere Tage verwenden, indem es erneut für einen weiteren Tag eingeplant wird. Entfernen aus den Favoriten löscht keine bereits geplante Mahlzeit. Favoriten werden je Konto auf dem Server gespeichert und nach Anmeldung auch auf anderen Geräten geladen.

Der Bestand enthält 89 Frühstücke, 90 Mittagessen und 91 Abendessen. Die neuen Gerichte verwenden unterschiedliche Zutatenkombinationen und wiederverwendbare, vollständige Kochmethoden. Nährwerte der Erweiterung werden aus einer internen Tabelle mit ungefähren Werten und Portionsgewichten geschätzt. Sie sind keine laborgenauen Angaben. Die Bildbibliothek zeigt weiterhin 16 gekennzeichnete Serviervorschläge für Gerichtskategorien.

## Zwei Konten, später erweiterbar

Standardmäßig erlaubt der Server **maximal zwei Registrierungen**. Danach ist die Registrierung geschlossen; beide Personen können sich weiter anmelden. Bestehende Konten bleiben unabhängig vom Limit nutzbar. Es gibt keinen voreingestellten Benutzernamen oder ein Standardpasswort: Erstellt beim ersten Aufruf eure eigenen Konten.

Für weitere Familienmitglieder später `MAX_USERS` in Compose beispielsweise auf `6` setzen und den Container neu erstellen. `MAX_USERS=0` erlaubt unbegrenzt viele Registrierungen. Das Limit gilt für alle Konten auf dieser Serverinstanz, nicht pro Haushalt. Einladungen und Kontolöschung sind noch nicht implementiert.

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

Node.js **24** (mit integriertem `node:sqlite`) und npm. Keine externe Datenbank oder API-Schlüssel nötig.

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
DATABASE_PATH=./.data/ag-fit.sqlite npm start
```

Falls Port 8080 bereits belegt ist, den dort laufenden App-Container vorher stoppen oder den Vite-Proxy und `PORT` passend setzen. `npm run preview` liefert allein das Frontend aus und bietet keine Anmeldung; für Produktion `npm start` oder Docker verwenden.

Konfiguration: `PORT` (Standard 8080), `DATABASE_PATH` (Standard `/data/ag-fit.sqlite`), `MAX_USERS` (Standard 2; 0 für unbegrenzt), `COOKIE_SECURE=true` für ausschließlich HTTPS. Sitzungen laufen nach 30 Tagen ab, Passwörter werden mit individuellen Salts und scrypt gehasht. Cookies sind HttpOnly und SameSite=Lax. Die API schützt gegen fremde Origins, begrenzt Anmeldeversuche und verhindert das stille Überschreiben zwischen Geräten: Bei einem Konflikt muss die Seite neu geladen werden.

Für Builds hinter einem Unternehmensproxy unterstützt das Dockerfile das optionale BuildKit-Secret `build_ca` mit einem vertrauenswürdigen CA-Zertifikat. Es wird nur während der Installation eingebunden und nicht im Image gespeichert. Normale Docker-Hosts und GitHub Actions benötigen es nicht.

## Hinweise

Nährwerte sind Schätzwerte. Allergien und individuelle Einschränkungen vor der Rezeptauswahl prüfen. Für Overnight-Rezepte kommt zur angegebenen aktiven Zubereitungszeit eine Kühlzeit über Nacht hinzu. Salz, Pfeffer und Wasser werden als Vorrat vorausgesetzt.

Die Bilder in `public/food/meal-photos.png` wurden für dieses Projekt mit OpenAI-Bildgenerierung erstellt. Sie dienen als gekennzeichnete, beispielhafte Serviervorschläge für 16 Gerichtskategorien. Google Fonts werden optional geladen; ohne Zugriff verwendet die App Systemschriften.
