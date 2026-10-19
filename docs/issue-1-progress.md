## Auftrag an Codex
Implementiere die folgenden neun Erweiterungen in **AG Fit**. Arbeite schrittweise, teste jede Änderung und hake die Punkte erst nach erfolgreicher Implementierung ab. Bestehende Konten, Favoriten, Wochenpläne und SQLite-Daten müssen bei Updates erhalten bleiben. Keine Trainingsfunktionen wieder einführen.

### 1. Gemeinsamer Haushaltsplan
- [x] Haushalte erstellen und zweiten Account einladen/verbinden.
- [x] Gemeinsamer, synchronisierter Wochenplan und gemeinsame Einkaufsliste mit Änderungen durch beide Nutzer.
- [x] Persönliche Profile, Ziele und Favoriten bleiben individuell; Berechtigungen für Haushaltsmitglieder prüfen.
- [x] Einzelkonten ohne Haushalt weiterhin unterstützen.

### 2. Intelligenter Wochenplaner
- [x] Vorschläge nach Ernährungsform, Allergenen/Ausschlüssen, Vorlieben, Kochzeit, Kalorien-/Proteinzielen und optional Budget filtern.
- [x] Vorhandene Vorräte bevorzugen, Wiederholungen vermeiden und Vielfalt sichern.
- [x] Manuell geplante Mahlzeiten und „Ich esse außerhalb“ nicht überschreiben.
- [x] Vorschläge nachvollziehbar anzeigen; fehlende passende Rezepte sauber behandeln.

### 3. Vorratskammer/Kühlschrank
- [x] Vorräte mit Produkt, Menge, Einheit, optional Lagerort und MHD erfassen, ändern, löschen.
- [x] Bald ablaufende Lebensmittel hervorheben.
- [x] Rezeptvorschläge mit vorhandenen Zutaten und fehlenden Mengen.
- [x] Einkaufslisten um verfügbare Vorräte reduzieren; Mengen/Einheiten sauber normalisieren.
- [x] Verbrauch nur nach ausdrücklicher Bestätigung buchen.

### 4. Barcode-Scanner
- [x] Mobilen Kamerascanner sowie manuelle EAN-Eingabe anbieten.
- [x] Open Food Facts als optionale Produktdatenquelle integrieren; fehlende Produkte manuell erfassen.
- [x] Portionsgrößen, Einheiten und Nährwerte je 100 g/ml korrekt umrechnen.
- [x] Fehlerfälle, fehlende Nährwerte, Kameraberechtigung und API-Ausfall abfangen.
- [x] Keine ungeprüften Produktallergene als sicher deklarieren.

### 5. Ernährungstagebuch
- [x] Geplante Mahlzeiten als tatsächlich gegessen markieren; Datum, Portionen und Mengen ändern.
- [x] Snacks, Getränke und einzelne Lebensmittel unabhängig vom Plan erfassen.
- [x] Tatsächliche Kalorien, Protein, Kohlenhydrate und Fett getrennt von geplanten Werten darstellen.
- [x] Einträge bearbeiten/löschen, vergangene Tage anzeigen und doppelte Buchungen verhindern.
- [x] Nährwerte als Schätzwerte kennzeichnen; keine automatischen medizinischen Empfehlungen.

### 6. Lebensmittelbudget
- [x] Optionales Wochenbudget pro Haushalt festlegen.
- [x] Rezept- und Einkaufslistenpreise anhand editierbarer Produkt-/Einheitspreise schätzen.
- [x] Kosten pro Rezept, Portion und Woche anzeigen; günstigere passende Alternativen vorschlagen.
- [x] Fehlende Preise kenntlich machen, nicht als 0 € interpretieren; keine unbelegten Live-Supermarktpreise behaupten.

### 7. Eigene Rezepte
- [x] Rezepte mit Titel, Zutaten, Mengen, Einheiten, Portionen, Schritten, Dauer, Tags und optional Bild anlegen/bearbeiten/löschen.
- [x] Nährwerte aus hinterlegten Zutaten berechnen, fehlende Werte manuell ergänzen.
- [x] Eigene Rezepte in Suche, Favoriten, Wochenplan und Einkaufsliste integrieren.
- [x] Optional URL-Import als spätere Teilfunktion, mit Vorschau und manueller Bestätigung; keine beliebigen Server-URL-Abrufe ohne SSRF-Schutz.
- [x] Eigentümerschaft und Haushaltsfreigabe berücksichtigen.

### 8. Ernährungsstatistiken
- [x] Tages-, Wochen- und Monatsansichten für tatsächlich erfasste Kalorien und Makros.
- [x] Vergleich mit individuell gesetzten Zielen und zeitliche Entwicklung.
- [x] Geplante und tatsächlich gegessene Werte klar unterscheiden.
- [x] Fehlende Tage nicht als 0-kcal-Tage interpretieren; mobile Diagramme und barrierearme Tabellen anbieten.

### 9. Installierbare PWA
- [x] Web-App-Manifest, Icons und Service Worker ergänzen.
- [x] Installation auf Android/iOS ermöglichen; offline Rezeptdetails und letzten Wochenplan lesen.
- [x] Schreibaktionen offline entweder sicher synchronisieren (Konfliktlösung) oder sichtbar deaktivieren; keine stillen Datenverluste.
- [x] Aktualisierungshinweise und sichere Cache-Strategie; keine fremden persönlichen Kontodaten im Offline-Cache.

## Technische Anforderungen und Abnahme
- SQLite-Datenmodell mit migrationssicheren Erweiterungen; bestehende Daten und Accounts erhalten.
- Bestehende React/Vite/Node-Architektur und Docker/Arcane/GHCR-Deployment weiterhin unterstützen.
- API-Endpunkte mit Authentifizierung, Haushaltsberechtigungen, Validierung und Tests absichern.
- Mobile-first, responsive UI und konsistente deutsche Texte.
- Unit-/Integrationstests für Portionsrechnung, gemeinsame Daten, Einkaufsmengen, Nährwerte und Zugriffsschutz.
- `npm test` und `npm run build` erfolgreich; README und relevante Deployment-Hinweise aktualisieren.
- In sinnvoller Reihenfolge implementieren: **1 → 5 → 7 → 3 → 2 → 6 → 4 → 8 → 9**. Bei größeren Änderungen in nachvollziehbare Teil-Commits/PRs aufteilen.
- Im Issue nach jedem abgeschlossenen Abschnitt Checkboxes aktualisieren und offene Punkte dokumentieren.

## Nachweise und GitHub-Synchronisierung

- Abschnitt 1: `node --test server/household.test.js` erfolgreich; Produktionsbuild erfolgreich. Geprüft: Einladungen, gemeinsame Änderungen, Konflikte, Berechtigungen und Erhalt persönlicher Daten.
- Die GitHub-API ist aktuell durch die Netzwerkregel für `api.github.com` blockiert (CONNECT 403). Diese Datei dokumentiert den Stand; die Checklisten im Online-Issue wurden noch nicht geändert.

- Abschnitte 5 und 7: `node --test server/diary-recipes.test.js` erfolgreich; Produktionsbuild erfolgreich. Geprüft: Portions-/100-ml-Rechnung, Duplikatschutz, Eintragsbearbeitung, Fremdzugriff, Freigabe, unbekannte Nährwerte und historische Snapshots. URL-Import bleibt ausdrücklich die im Issue erlaubte spätere Teilfunktion; es gibt keinen Server-Abruf beliebiger Rezept-URLs.

- Abschnitt 3: `node --test src/pantry.test.js server/pantry.test.js` erfolgreich. Geprüft: kg/g und l/ml, inkompatible Einheiten, MHD-Reihenfolge, Eigentümerschaft/Haushalt, Versionskonflikte und ausdrückliche, idempotente Entnahme.

- Abschnitte 2 und 6: `node --test src/planner.test.js src/pricing.test.js server/prices.test.js` erfolgreich. Geprüft: Ernährungs-/Allergen-/Ziel- und Kochzeitfilter, Vorratspriorisierung, leere Treffer, geschützte manuelle Pläne, Preisbezugsrechnung, unbekannte Preise, Budget ohne doppelte Vorratsanrechnung, Zugriffsschutz und Versionskonflikte.

- Abschnitte 4 und 8: Barcode-/Produkt- und Statistiktests erfolgreich. Geprüft: EAN-Prüfziffer, feste OFF-Zieladresse ohne Weiterleitungen, API-Ausfall/fehlende Werte, Produktrechte, 100-ml-/Portionsrechnung, tatsächliche Werte, fehlende Tage und Kalendergrenzen. Der reale OFF-Abruf antwortet in dieser Cloud mit HTTP 403; die Integration ist mit kontrollierten Antworten und Ausfällen getestet, die manuelle Erfassung bleibt nutzbar. Reale Kameraerkennung benötigt eine Kamera und HTTPS; Berechtigungs-/Nichtverfügbarkeitsfälle werden abgefangen.

- Abschnitt 9: Chromium-Prüfung für Desktop und 390-px-Mobilansicht erfolgreich: registrierter Service Worker, ausschließlich öffentliche Cache-Einträge, verschlüsselter Snapshot, Offline-Neuladen von Plan und Rezept auch acht Tage nach dem gespeicherten Stand, deaktivierte Schreibaktionen, Offline-Abmeldung und Wiederverbindung sowie Kontowechsel ohne fremde Favoriten. Android-/iOS-Installation erfolgt über die jeweiligen Browser; eine physische Geräteprüfung ist in dieser Cloud nicht möglich.
- Migration: Eine Datenbank im ursprünglichen Schema wurde mit bestehendem Passwort, Sitzung, Favoriten, Wochenplan und zusätzlichen Alt-Daten aktualisiert. Alle sechs Migrationen, sämtliche neuen Ressourcen, Neustart und `PRAGMA integrity_check` wurden geprüft. Bestehende Benutzerzeilen bleiben unverändert.

- Gesamtabnahme: 37 Node-Unit-/Integrationstests und Produktionsbuild erfolgreich. `npm run test:browser` prüft die vollständigen Konto-/Haushalt-/Rezept-/Tagebuch-/Vorrats-/Produkt-/Offline-Abläufe, mobile Darstellung und explizites PWA-Update; dieser Test läuft künftig in GitHub Actions. Docker-Image gebaut, Compose mit isoliertem Testvolume gestartet und nach Container-Neuerstellung auf unveränderte Testdaten und Sitzung geprüft. Produktionsvolumes wurden nicht verändert.
- Für die blockierten Online-Abfragen sind `api.github.com` und `world.openfoodfacts.org` im Cloud-Umgebungsentwurf ergänzt. Der Entwurf muss in den Umgebungseinstellungen geprüft, gespeichert und veröffentlicht werden; das Speichern des Entwurfs allein aktiviert keine Freigabe. Bis dahin bleibt die Online-Issue-Synchronisierung offen.
