# Konten, Datenvolume und E-Mail-Zugang

## Ursache und Änderung

Die gemeldete Arcane-Datei enthielt keinen `/data`-Mount. Das im Dockerfile deklarierte `VOLUME /data` erzeugt dann anonyme Volumes, deren Wiederverwendung bei Neuerstellungen nicht gesichert ist. `compose.arcane.yaml` bindet das vom Betreiber festgelegte bisherige Volume ausdrücklich als externes Volume ein. Vor einer Umstellung muss der bisherige Volumename ermittelt und eine Sicherung erstellt werden; die Schritte stehen am Anfang der README. Bereits entfernte Datenvolumes können durch eine Codeänderung nicht wiederhergestellt werden.

Der Produktionsstart unterstützt `REQUIRE_EXISTING_DATABASE=true` und bricht damit bei einer fehlenden/leeren Datenbank ab, statt eine neue anzulegen. Lokales Compose verwendet ebenfalls einen festen, von Projektnamen unabhängigen Volumenamen; bei bestehenden Installationen ist der tatsächliche bisherige Name zu übernehmen.

Migration 7 ergänzt den Aktivierungsstatus und gehashte, befristete Kontolinks. Bestehende Konten bleiben zugelassen, alle bisherigen Daten und Sitzungen bleiben erhalten. Neue Produktionsregistrierungen benötigen standardmäßig Aktivierung. Ein Passwort-Reset beendet sämtliche Sitzungen des betroffenen Kontos, verändert aber keine Planungs-/Ernährungsdaten. Absender und öffentliche App-URL werden serverseitig konfiguriert; SMTP benötigt TLS und geprüfte Zertifikate. Passwort-Mails verraten weder in der Antwort noch durch Warten auf SMTP, ob das Konto existiert.

## Prüfung

- **44 Node-Tests erfolgreich**, einschließlich bisheriger Regressionstests, Legacy-Migration, Token-Hashing, Ablauf, Einmalverwendung, Rotation, konkurrierendem Reset, Sitzungswiderruf, erhaltenen Benutzerdaten, fehlendem SMTP, Versandfehlern, Ratenbegrenzung, SMTP-TLS-Optionen, Hintergrundversand und fehlender Datenbank.
- **Produktionsbuild erfolgreich.**
- **Browserprüfungen erfolgreich:** bestehende Haushalts-/Planungs-/Offline-Abläufe plus Registrierung ohne Sitzung, Aktivierungslink und ausdrückliche Bestätigung, Anmeldung, Passwort-Mail, Passwortwiederholung, neues/altes Passwort und Link-Wiederverwendung.
- **Produktionsimage gebaut und gestartet**, einschließlich installierter SMTP-Laufzeitabhängigkeit.
- **Arcane-Compose mit isoliertem externem Testvolume geprüft:** Bestandskonto erstellt, angemeldet, Favoriten und Plan gespeichert. Erstes Compose-Projekt entfernt, zweites Projekt mit anderem Namen und demselben externen Volume gestartet, anschließend Container nochmals neu erstellt. Konto, Sitzung, Favoriten und Plan blieben identisch. Keine echten Benutzer- oder Produktionsvolumes angefasst.

Die automatischen E-Mail-Tests verwenden aufgefangene Testmails und keinen externen Postausgang. Die reale IONOS-Zustellung ist erst nach Hinterlegen des Mailbox-Passworts auf dem Zielserver prüfbar. In der bereitgestellten Konfiguration sind `https://fit.agrosskopf.de`, Port 8082 und `noreply@agrosskopf.de` vorbereitet. Zugangsdaten gehören ausschließlich in Arcane bzw. eine nicht versionierte `.env`.
