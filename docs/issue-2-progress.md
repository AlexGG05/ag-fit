# Issue #2: Rezeptbestand auf 2.500 erweitern

Auftrag: https://github.com/AlexGG05/ag-fit/issues/2

## Akzeptanzkriterien

- [x] Mindestens 2.500 unterschiedliche Rezepte tatsächlich abrufbar.
- [x] Vollständige Zutatenlisten und Zubereitung.
- [x] Nährwerte plausibel und berechnet bzw. als Schätzung gekennzeichnet.
- [x] Keine Duplikate und kein Überschreiben bestehender Nutzerdaten.
- [x] App-UI kann alle Rezepte suchen, filtern und anzeigen.
- [x] Import und Validierung dokumentiert.

## Bestandsaufnahme und Ergänzung

Vorher: 1.300 eingebaute Rezepte (166 Frühstücke, 566 Mittagessen, 568 Abendessen). Ein separater privater/haushaltsweiter Rezeptbestand liegt in `custom_recipes`. Die ursprünglichen Kataloge waren JavaScript-Module und wurden bisher nicht als Systemkatalog in SQLite importiert.

| Kategorie | Vorhanden | Ergänzt | Gesamt |
|---|---:|---:|---:|
| Frühstück | 166 | 234 | 400 |
| Mittagessen | 566 | 84 | 650 |
| Abendessen | 568 | 82 | 650 |
| Snacks | 0 | 300 | 300 |
| Desserts | 0 | 200 | 200 |
| Meal-Prep | 0 | 200 | 200 |
| Getränke/Smoothies | 0 | 100 | 100 |
| **Gesamt** | **1.300** | **1.200** | **2.500** |

Die 1.200 Ergänzungen verteilen sich auf 121 Zubereitungsfamilien mit abgestimmten Frucht-/Kern- bzw. Protein-/Gemüse-Zusammensetzungen. Sie verwenden feste IDs, unterschiedliche Hauptzutaten, Basen, Konsistenzen und Methoden. Weder zufällige Umbenennung noch Mengenänderungen oder zusätzliche Gewürze erzeugen neue Einträge. Normalisierte Namen und Zutatenmengen-unabhängige Zutatenkombinationen sind im gesamten Katalog eindeutig. Die Originaltexte stammen aus dieser Implementierung; neue Bilder sind eigene grafische Platzhalter.

Die bisherigen 1.300 Rezeptobjekte bleiben unverändert; ihr vollständiger SHA-256-Fingerabdruck ist `8a3fec5ea7f841024555658b93b092a27c993402ca3cc418327b936a25000f14`. Zusätzliche Beschreibungen, Kategorie, Portionen, Tags/Ernährungsform, Allergene, Quellen- und Nährwertmetadaten ergänzt `src/catalogue/metadata.js` getrennt von den Originaldateien.

## Nährwerte und Quellen

145 exakt referenzierte Lebensmitteleinträge aus USDA SR28 liegen in `src/catalogue/usda-sr28.json`, einschließlich NDB-Nummer, originaler Lebensmittelbezeichnung, Referenzwerten, Quellen-Commit und SHA-256-Prüfsummen. `scripts/import-usda.py` reproduziert diese Auswahl aus den geprüften Quelldateien. Die README enthält die Quellenlinks sowie Hinweise zu Referenzprodukten, Sorten und geschätzten Flüssigkeitsdichten.

Für jede Ergänzung werden kcal, Protein, Kohlenhydrate und Fett aus Menge × Zutatenreferenz berechnet, jeweils pro Portion. Alle Werte bleiben ausdrücklich Schätzungen. Fehlende Werte werden als `null` samt fehlendem Zutatennamen gekennzeichnet. Bestandswerte bleiben `legacy-estimate`; neue Berechnungen tragen `usda-sr28`. Allergene sind aus Zutaten abgeleitet und ersetzen keine Verpackungs-/Spurenprüfung.

## Import, API und UI

- Migration 9 erstellt `builtin_recipes` und Import-Fingerprints. Transaktionaler, idempotenter Import beim Start; UNIQUE-Schutz für ID, normalisierten Namen und Zutatenkombination. Keine Änderungen an Benutzer-/Haushalts-/Sitzungs-/Tagebuchtabellen.
- `npm run recipes:validate` prüft ohne Schreibzugriff. `DATABASE_PATH=... npm run recipes:seed` importiert gezielt. Das Werkzeug ist auch im Produktionsimage enthalten.
- Authentifizierte API: `/api/catalogue` mit Offset/Limit (maximal 100), Kategorie, Suche, Ernährungsform, Gerichtart, Kochzeit- und Proteinfilter; `/api/catalogue/:id` liefert vollständige Details.
- Sieben UI-Kategorien, normalisierte Suche mit zwischengespeicherten Suchtexten und schrittweise Trefferanzeige (zunächst 18). Eigene Rezepte bleiben privat bzw. nur im berechtigten Haushalt verfügbar.
- Vollständige Details einschließlich Makronährstoffen, Quelle, Allergenhinweisen und eindeutigem Bild-Platzhalter. Snacks, Desserts und Getränke können einer aktiven Tagesmahlzeit zugeordnet werden. Persönliche Mahlzeiten-Einstellungen und Offline-Lesemodus bleiben erhalten.
- Meal-Prep enthält konkrete Kühl-, Gefrier- und Wiedererwärmungshinweise; Wochenplanung ist keine einwöchige Kühlschrankhaltbarkeit.

## Prüfnachweise

- `npm run recipes:validate`: 2.500 valide Rezepte; exakt passende Kategorien; 2.500 eindeutige IDs, normalisierte Namen und Zutatenkombinationen.
- `npm test`: 67 Tests erfolgreich. Darunter Neuberechnung aller 1.200 Nährwertsätze, Portionsskalierung, Negativfälle der Validierung, Schutz der gesamten Bestandsrezepte, authentifizierter Abruf aller 2.500 DB-Rezepte, Filter, wiederholter Import und unveränderte Nutzerdaten nach Neustart.
- `npm run build`: erfolgreich.
- `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`: Desktop-/Mobiltests einschließlich sieben Kategorien, Suche, Nachladen, neuer Rezeptdetails und Planung; vorhandene Haushalts-, Profil-, Einkaufs-, Tagebuch-, E-Mail- und Offline-Flows bleiben geprüft.
- Seed-CLI gegen eine isolierte temporäre Datenbank: erster Lauf 2.500 neue Einträge, zweiter Lauf 0.
- Produktions-Dockerimage: Katalog und Details abrufbar, mehrfacher CLI-Import ohne Duplikate, Konten/Sitzungen/Profil/Favoriten/Pläne/private Rezepte nach Container-Neuerstellung mit demselben temporären Volume erhalten. Der Schutz `REQUIRE_EXISTING_DATABASE=true` bleibt funktionsfähig.

Die Tests verwenden isolierte Datenbanken und Testvolumes. Das Produktionsvolume wird nicht angefasst. Für Arcane genügt nach der Image-Veröffentlichung ein Redeployment mit demselben `/data`-Volume; der Katalogimport läuft automatisch.
