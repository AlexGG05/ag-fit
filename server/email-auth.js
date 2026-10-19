import nodemailer from "nodemailer";
import { randomBytes, createHash, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { fail, transaction } from "./workspace.js";
const scrypt = promisify(scryptCallback);
const digest = (token) => createHash("sha256").update(token).digest("hex");
export function migrateEmailAuth(db) {
  transaction(db, () => {
    if (
      !db
        .prepare("PRAGMA table_info(users)")
        .all()
        .some((c) => c.name === "email_verified")
    )
      db.exec(
        "ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 1",
      );
    db.exec(
      `CREATE TABLE IF NOT EXISTS email_tokens(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),purpose TEXT NOT NULL,expires INTEGER NOT NULL,created INTEGER NOT NULL,UNIQUE(user_id,purpose));INSERT OR IGNORE INTO schema_migrations VALUES(7,datetime('now'));`,
    );
  });
}
export function emailConfig(
  env = process.env,
  createTransport = nodemailer.createTransport,
) {
  const enabled = !!env.SMTP_HOST;
  const required = env.EMAIL_VERIFICATION_REQUIRED !== "false";
  if (!enabled) return { required, mailer: null, publicUrl: null };
  const url = new URL(env.APP_URL || "");
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
  )
    throw Error("APP_URL muss eine öffentliche HTTPS-Adresse sein.");
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw Error(
      "APP_URL muss die reine App-Adresse ohne Zugangsdaten oder Pfad enthalten.",
    );
  const port = Number(env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw Error("Ungültiger SMTP_PORT.");
  if (!env.SMTP_FROM || /[\r\n]/.test(env.SMTP_FROM))
    throw Error("SMTP_FROM ist erforderlich.");
  if (!!env.SMTP_USER !== !!env.SMTP_PASSWORD)
    throw Error("SMTP_USER und SMTP_PASSWORD gemeinsam setzen.");
  const transport = createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: env.SMTP_USER
      ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
      : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  });
  return {
    required,
    publicUrl: url.origin,
    mailer: async ({ to, subject, text }) => {
      await transport.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        text,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
    },
  };
}
export function emailAuth({
  db,
  mailer,
  publicUrl,
  required = false,
  clock = Date.now,
}) {
  const pending = new Set();
  if (mailer && !publicUrl)
    throw Error("APP_URL ist für E-Mail-Links erforderlich.");
  function issue(user, purpose) {
    const now = clock();
    const recent = db
      .prepare("SELECT created FROM email_tokens WHERE user_id=? AND purpose=?")
      .get(user.id, purpose);
    if (recent && now - recent.created < 60000) return null;
    const token = randomBytes(32).toString("hex");
    db.prepare("DELETE FROM email_tokens WHERE expires<=?").run(now);
    db.prepare(
      "INSERT INTO email_tokens VALUES(?,?,?,?,?) ON CONFLICT(user_id,purpose) DO UPDATE SET token_hash=excluded.token_hash,expires=excluded.expires,created=excluded.created",
    ).run(
      digest(token),
      user.id,
      purpose,
      now + (purpose === "verify" ? 24 * 3600000 : 30 * 60000),
      now,
    );
    return token;
  }
  async function deliver(user, purpose) {
    if (!mailer) return false;
    const token = issue(user, purpose);
    if (!token) return true;
    const verify = purpose === "verify";
    try {
      await mailer({
        to: user.email,
        subject: verify
          ? "Aktiviere dein ag-fit-Konto"
          : "Dein ag-fit-Passwort zurücksetzen",
        text: `Hallo ${user.name},\n\n${verify ? "Bestätige deine E-Mail-Adresse und aktiviere dein Konto:" : "Du kannst hier ein neues Passwort festlegen:"}\n\n${publicUrl}/#${purpose}=${token}\n\nDer Link ist einmalig und ${verify ? "24 Stunden" : "30 Minuten"} gültig. Öffne ihn und bestätige die Aktion in der App. ${verify ? "Wenn du dich nicht registriert hast, ignoriere diese Nachricht." : "Falls du kein neues Passwort angefordert hast, ignoriere diese Nachricht. Dein Passwort bleibt unverändert."}\n\nag fit`,
      });
    } catch (e) {
      db.prepare("DELETE FROM email_tokens WHERE token_hash=?").run(
        digest(token),
      );
      throw e;
    }
    return true;
  }
  function find(token, purpose) {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token))
      fail(
        400,
        "Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.",
      );
    const row = db
      .prepare(
        "SELECT * FROM email_tokens WHERE token_hash=? AND purpose=? AND expires>?",
      )
      .get(digest(token), purpose, clock());
    if (!row)
      fail(
        400,
        "Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.",
      );
    return row;
  }
  return {
    required,
    enabled: !!mailer,
    deliver,
    flush: () => Promise.allSettled([...pending]),
    async route(path, b) {
      if (path === "/api/verify-email") {
        const row = find(b.token, "verify");
        transaction(db, () => {
          db.prepare("UPDATE users SET email_verified=1 WHERE id=?").run(
            row.user_id,
          );
          db.prepare(
            "DELETE FROM email_tokens WHERE user_id=? AND purpose=?",
          ).run(row.user_id, "verify");
        });
        return {
          message:
            "Deine E-Mail-Adresse ist bestätigt. Du kannst dich jetzt anmelden.",
        };
      }
      if (path === "/api/reset-password") {
        find(b.token, "reset");
        if (
          typeof b.password !== "string" ||
          b.password.length < 10 ||
          b.password.length > 128
        )
          fail(400, "Bitte ein Passwort mit 10–128 Zeichen angeben.");
        const salt = randomBytes(16).toString("hex"),
          derived = await scrypt(b.password, salt, 64);
        transaction(db, () => {
          const row = find(b.token, "reset");
          db.prepare("UPDATE users SET password=? WHERE id=?").run(
            salt + ":" + derived.toString("hex"),
            row.user_id,
          );
          db.prepare("DELETE FROM sessions WHERE user_id=?").run(row.user_id);
          db.prepare("DELETE FROM email_tokens WHERE user_id=?").run(
            row.user_id,
          );
        });
        return {
          message:
            "Dein Passwort wurde geändert. Bitte melde dich mit dem neuen Passwort an.",
        };
      }
      if (["/api/forgot-password", "/api/resend-verification"].includes(path)) {
        if (!mailer)
          fail(
            503,
            "Der E-Mail-Versand ist noch nicht eingerichtet. Bitte wende dich an die Serververwaltung.",
          );
        const email =
          typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
          fail(400, "Bitte eine gültige E-Mail-Adresse eingeben.");
        const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
        const verify = path === "/api/resend-verification";
        if (user && (verify ? !user.email_verified : !!user.email_verified)) {
          const task = deliver(user, verify ? "verify" : "reset").catch(() => {
            console.warn(
              "E-Mail-Zustellung fehlgeschlagen. SMTP-Konfiguration prüfen.",
            );
          });
          pending.add(task);
          task.finally(() => pending.delete(task));
        }
        return {
          message: verify
            ? "Falls für diese Adresse eine Aktivierung aussteht, wurde eine E-Mail angefordert. Prüfe auch den Spamordner."
            : "Falls ein aktives Konto zu dieser Adresse existiert, wurde eine E-Mail zum Zurücksetzen angefordert. Prüfe auch den Spamordner.",
        };
      }
      return null;
    },
  };
}
