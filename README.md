# ag fit

Eine responsive, deutschsprachige Fitness-Webapp mit persönlichem Trainingsplan, sieben Tagen Mahlzeitenplanung, Rezeptanleitungen und automatischer Einkaufsliste.

## Funktionen

- Trainingsvorschläge nach Ziel, Erfahrung und 2–5 Trainingstagen; Einheiten als absolviert markieren.
- Planung von heute bis sechs Tage im Voraus: drei Vorschläge für Frühstück, Mittagessen und Abendessen. Auch die vegetarische Auswahl bietet drei passende Vorschläge pro Mahlzeit.
- Pro Mahlzeit genau ein Gericht oder „Ich esse außerhalb / nichts planen“. Ausgewählte Rezepte lassen sich wieder abwählen.
- Zutaten aller gewählten Gerichte der kommenden sieben Tage werden addiert und auf 1–6 Personen skaliert. Einkaufsliste abhaken und als Text exportieren.
- Rezeptdetails mit Zutatenmengen und Schritt-für-Schritt-Anleitung.
- Profil, Mahlzeiten, Einkaufsstatus und Trainingsfortschritt werden lokal im Browser gespeichert.

**Datenmodell:** Diese erste Version arbeitet ohne Serverkonto, Datenbank oder KI-Dienst. Die Pläne entstehen aus festen Regeln und elf hinterlegten Rezepten. Browser und Geräte teilen keine Daten; beim Löschen des Browser-Speichers gehen die Einträge verloren. Auf gemeinsam genutzten Geräten sind die Einträge für andere Nutzer desselben Browserprofils sichtbar. Eine neue Domain hat einen eigenen Speicher.

## Docker Compose: lokal oder auf einem Server

Voraussetzung: Docker Engine mit Compose v2.

```sh
git clone https://github.com/AlexGG05/ag-fit.git
cd ag-fit
docker compose up -d --build
```

Die App ist auf Port **8080** erreichbar. Alternativer Host-Port: `AG_FIT_PORT=8090 docker compose up -d --build`.

```sh
docker compose ps
docker compose logs -f
curl --fail http://localhost:8080/health
docker compose down
```

Es sind keine Umgebungsvariablen, Zugangsschlüssel oder Volumes erforderlich. Ein Container-Neustart löscht den Browser-Speicher nicht.

## Direkt in Arcane ausrollen

### Empfohlen: fertiges GitHub-Container-Image

Nach einem Push auf `main` führt GitHub Actions Tests, einen Build und einen Container-Smoke-Test aus. Anschließend veröffentlicht der Workflow `ghcr.io/alexgg05/ag-fit:latest` sowie einen Commit-SHA-Tag für **amd64 und arm64**. Warte, bis der Workflow **Test and publish container** erfolgreich abgeschlossen ist.

Für anonymes Pulling muss das Container-Package auf GitHub unter **Packages → ag-fit → Package settings → Change visibility → Public** öffentlich sein. GitHub veröffentlicht neue Packages häufig zunächst privat. Alternativ hinterlege in Arcane Registry-Zugangsdaten für `ghcr.io` mit Leserechten auf das Package. Bei privaten Repositories ist auch der Zugriff auf das Repository entsprechend einzurichten. Der Workflow verwendet automatisch das von GitHub bereitgestellte `GITHUB_TOKEN`; keine Secrets im Repository ablegen.

In Arcane ein Compose-Projekt anlegen und diese vollständige Datei einfügen:

```yaml
services:
  ag-fit:
    image: ghcr.io/alexgg05/ag-fit:latest
    ports:
      - "8080:8080"
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/health"]
      interval: 30s
      timeout: 3s
      start_period: 5s
      retries: 3
```

Projekt deployen. Anschließend ist die App über `http://DEINE-SERVER-IP:8080` erreichbar. Für eine öffentliche Domain einen Reverse Proxy mit HTTPS vor Port 8080 schalten. Soll ausschließlich der lokale Reverse Proxy Zugriff haben, verwende `127.0.0.1:8080:8080` als Port-Bindung. Für reproduzierbare Versionen `latest` durch den gewünschten Commit-SHA-Tag ersetzen.

Updates: erfolgreichen GitHub-Workflow abwarten, dann in Arcane das Image neu ziehen und das Projekt neu bereitstellen. Auf der Kommandozeile: `docker compose pull && docker compose up -d`.

### Alternative: direkt aus GitHub bauen

Wenn das Repository öffentlich ist und Arcane Compose-Builds unterstützt, kann folgende Datei ohne vorherige Veröffentlichung eines Images verwendet werden:

```yaml
services:
  ag-fit:
    build:
      context: https://github.com/AlexGG05/ag-fit.git#main
    ports:
      - "8080:8080"
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
```

Für diese Variante muss der Docker-Host GitHub, Docker Hub und die npm-Registry erreichen. Bei privaten Repositories ist die Image-Variante mit Registry-Anmeldung einfacher. Zugangsdaten niemals in die Compose-URL schreiben. Nach Änderungen den Build in Arcane erneut ausführen. Für einen festen Stand `#main` durch `#COMMIT-SHA` ersetzen.

## Entwicklung

Node.js 24 und npm:

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run preview` startet den erzeugten Produktionsbuild. Vite bindet für die Cloud-Entwicklung an alle Interfaces. Der Produktionscontainer liefert die gebauten Dateien mit Nginx auf Port 8080 aus und läuft ohne Root-Rechte. `/health` liefert `ok`.

## Hinweise

Trainingsvorschläge sind allgemeine Empfehlungen für gesunde Erwachsene und keine medizinische Beratung. Kalorien und Protein sind Schätzwerte. Allergien und individuelle Einschränkungen vor der Rezeptauswahl prüfen. Ein Ziel wie Gewichtsreduktion ersetzt keine individuelle Bedarfsermittlung.

Rezeptbilder sind lokal mitgelieferte, schematische Illustrationen. Schriften werden optional von Google Fonts geladen; ohne Zugriff nutzt die App eine Systemschrift. Die App benötigt zur Laufzeit keinen externen API-Dienst.

Für Builds hinter einem eigenen Unternehmensproxy unterstützt das Dockerfile optional ein BuildKit-Secret `build_ca` mit dem vertrauenswürdigen CA-Zertifikat. Es wird nur während der Installation eingebunden und nicht ins Image übernommen. Für normale Docker-Hosts und GitHub Actions ist es nicht erforderlich.
