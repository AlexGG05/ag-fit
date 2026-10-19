# ag fit

Deutschsprachige Fitness-Webapp für die ganze Familie: persönliche Konten, Trainingspläne, abwechslungsreiche Wochenplanung, Rezepte und Einkaufslisten.

## Was die App kann

- Registrierung mit Vorname, E-Mail und Passwort sowie Anmeldung und Abmeldung. Jedes Familienmitglied hat ein eigenes Konto mit getrennten Daten.
- Profile, Mahlzeiten, Einkaufslisten und Trainingsfortschritt werden in SQLite auf dem Server gespeichert und nach Anmeldung auf anderen Geräten geladen.
- Trainingsvorschläge nach Ziel, Erfahrung und 2–5 Trainingstagen.
- Planung von heute bis sechs Tage im Voraus mit drei zufällig angeordneten Vorschlägen je Mahlzeit. Die Auswahl variiert zwischen allen sieben Tagen und zwischen Personen. Ein Pool aus 26 vollständigen Rezepten liefert auch vegetarische Vorschläge.
- „Neue Vorschläge“ tauscht die Ideen einer Mahlzeit aus. Bereits gewählte Gerichte bleiben erhalten und lassen sich unter „Geplant“ öffnen oder abwählen. Die Vorschlagsfolge bleibt beim Neuladen stabil.
- Pro Mahlzeit ein Rezept oder „Ich esse außerhalb / nichts planen“. Zutaten werden für 1–6 Personen zusammengefasst. Einkaufsliste abhaken und exportieren.
- Zutatenmengen und Schritt-für-Schritt-Kochanleitungen für alle Rezepte.

Die Gerichte werden aus einem hinterlegten Rezeptbestand zusammengestellt; die App erfindet keine Rezepte mit einem KI-Dienst. Wiederkehrende einzelne Gerichte sind möglich. Konten sind getrennt; eine gemeinsam synchronisierte Familien-Einkaufsliste gibt es noch nicht. Registrierung ist für Personen offen, die den Server erreichen können. Noch keine E-Mail-Verifizierung oder Passwort-Wiederherstellung. Alte Browserdaten aus der ersten Version werden nicht automatisch einem neuen Konto zugeordnet.

## Docker Compose: lokal oder Server

Voraussetzung: Docker Engine und Compose v2.

```sh
git clone https://github.com/AlexGG05/ag-fit.git
cd ag-fit
docker compose up -d --build
```

Auf Port **8080** die App öffnen und für jede Person ein Konto erstellen. Alternativer Host-Port: `AG_FIT_PORT=8090 docker compose up -d --build`.

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

Konfiguration: `PORT` (Standard 8080), `DATABASE_PATH` (Standard `/data/ag-fit.sqlite`), `COOKIE_SECURE=true` für ausschließlich HTTPS. Sitzungen laufen nach 30 Tagen ab, Passwörter werden mit individuellen Salts und scrypt gehasht. Cookies sind HttpOnly und SameSite=Lax. Die API schützt gegen fremde Origins, begrenzt Anmeldeversuche und verhindert das stille Überschreiben zwischen Geräten: Bei einem Konflikt muss die Seite neu geladen werden.

Für Builds hinter einem Unternehmensproxy unterstützt das Dockerfile das optionale BuildKit-Secret `build_ca` mit einem vertrauenswürdigen CA-Zertifikat. Es wird nur während der Installation eingebunden und nicht im Image gespeichert. Normale Docker-Hosts und GitHub Actions benötigen es nicht.

## Hinweise

Trainingsvorschläge sind allgemeine Empfehlungen für gesunde Erwachsene. Nährwerte sind Schätzwerte; Allergien und individuelle Einschränkungen vor der Rezeptauswahl prüfen. Rezeptbilder sind lokale Illustrationen. Google Fonts werden optional geladen; ohne Zugriff verwendet die App Systemschriften.
