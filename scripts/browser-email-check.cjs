const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const { createApp } = await import("../server.js");
  const messages = [];
  const app = createApp({
    requireVerification: true,
    publicUrl: "https://fit.example.com",
    mailer: async (m) => messages.push(m),
  });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + app.server.address().port;
  let browser;
  try {
    browser = await chromium.launch({
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
      args: ["--no-sandbox"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const mailURL = () =>
      messages
        .at(-1)
        .text.match(
          /https:\/\/fit.example.com\/#(?:verify|reset)=[a-f0-9]{64}/,
        )[0]
        .replace("https://fit.example.com", base);
    await page.goto(base);
    await page
      .getByRole("button", { name: "Noch kein Konto? Jetzt registrieren" })
      .click();
    await page.getByLabel("Dein Vorname").fill("MailTest");
    await page.getByLabel("E-Mail-Adresse").fill("mail-test@example.com");
    await page
      .getByLabel("Passwort", { exact: true })
      .fill("original-test-password");
    await page
      .getByRole("button", { name: "Konto erstellen", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Konto angelegt." })
      .waitFor();
    assert.equal(messages.length, 1);
    assert.equal(
      (await context.cookies()).filter((c) => c.name === "ag_session").length,
      0,
    );
    await page.goto(mailURL());
    await page
      .getByRole("heading", { name: "E-Mail-Adresse bestätigen" })
      .waitFor();
    assert(!page.url().includes("#verify="));
    await page.getByRole("button", { name: "Konto aktivieren" }).click();
    await page.getByRole("status").filter({ hasText: "bestätigt" }).waitFor();
    await page
      .getByRole("button", { name: "Zur Anmeldung", exact: true })
      .click();
    async function login(password) {
      await page.getByLabel("E-Mail-Adresse").fill("mail-test@example.com");
      await page.getByLabel("Passwort", { exact: true }).fill(password);
      await page.getByRole("button", { name: "Anmelden", exact: true }).click();
    }
    await login("original-test-password");
    await page.getByRole("heading", { name: /MailTest/ }).waitFor();
    await page.getByRole("button", { name: "Abmelden", exact: true }).click();
    await page
      .getByRole("button", { name: "Passwort vergessen?", exact: true })
      .click();
    await page.getByLabel("E-Mail-Adresse").fill("mail-test@example.com");
    await page
      .getByRole("button", { name: "Link zum Zurücksetzen anfordern" })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Falls ein aktives Konto" })
      .waitFor();
    assert.equal(messages.length, 2);
    const reset = mailURL();
    await page.goto(reset);
    await page
      .getByLabel("Neues Passwort", { exact: true })
      .fill("new-mail-test-password");
    await page.getByLabel("Passwort wiederholen").fill("different-password");
    await page
      .getByRole("button", { name: "Neues Passwort speichern" })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "stimmen nicht überein" })
      .waitFor();
    await page
      .getByLabel("Passwort wiederholen")
      .fill("new-mail-test-password");
    await page
      .getByRole("button", { name: "Neues Passwort speichern" })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Passwort wurde geändert" })
      .waitFor();
    await page
      .getByRole("button", { name: "Zur Anmeldung", exact: true })
      .click();
    await login("original-test-password");
    await page
      .getByRole("alert")
      .filter({ hasText: "stimmen nicht" })
      .waitFor();
    await login("new-mail-test-password");
    await page.getByRole("heading", { name: /MailTest/ }).waitFor();
    await page.goto(reset);
    await page
      .getByLabel("Neues Passwort", { exact: true })
      .fill("reuse-must-not-work");
    await page.getByLabel("Passwort wiederholen").fill("reuse-must-not-work");
    await page
      .getByRole("button", { name: "Neues Passwort speichern" })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "ungültig oder abgelaufen" })
      .waitFor();
    await context.setOffline(true);
    await page.getByRole("button", {name:"Zur Anmeldung",exact:true}).click();
    await page.getByRole("heading", {name:"Schön, dass du da bist."}).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem("ag-pending-logout")), "yes");
    await context.setOffline(false);
    await page.reload();
    await page.getByRole("heading", {name:"Schön, dass du da bist."}).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem("ag-pending-logout")), null);
    assert.deepEqual(errors, []);
    console.log(
      "PASS email registration, explicit activation, recovery, password confirmation, login and single-use links in browser",
    );
  } finally {
    await browser?.close();
    await new Promise((resolve) => app.server.close(resolve));
    await app.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
