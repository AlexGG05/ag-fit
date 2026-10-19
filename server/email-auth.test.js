import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fixture } from "./fixture.js";
import { emailConfig } from "./email-auth.js";
const token = (mail) => mail.text.match(/#(?:verify|reset)=([a-f0-9]{64})/)[1];
test("activation is required before sessions, tokens are hashed, single-use, persistent and expire", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "ag-fit-email-"));
  let now = Date.now();
  const messages = [];
  const options = {
    database: path.join(dir, "db.sqlite"),
    requireVerification: true,
    publicUrl: "https://fit.example.com",
    mailer: async (m) => messages.push(m),
    clock: () => now,
  };
  let f = await fixture(options);
  try {
    const signup = await f.register("Alex");
    assert.equal(signup.status, 200);
    assert.equal(signup.cookie, undefined);
    assert.equal(signup.data.verificationRequired, true);
    assert.equal(messages.length, 1);
    assert.match(messages[0].text, /https:\/\/fit.example.com\/#verify=/);
    assert.equal(
      (
        await f.request("/api/login", "POST", {
          email: "alex@example.com",
          password: "test-valid-password",
        })
      ).status,
      403,
    );
    const first = token(messages[0]);
    let db = new DatabaseSync(options.database);
    assert.notEqual(
      db.prepare("SELECT token_hash FROM email_tokens").get().token_hash,
      first,
    );
    assert.equal(
      db.prepare("SELECT email_verified FROM users").get().email_verified,
      0,
    );
    db.close();
    assert.equal(
      (
        await f.request("/api/resend-verification", "POST", {
          email: "alex@example.com",
        })
      ).status,
      200,
    );
    assert.equal(messages.length, 1);
    now += 61000;
    await f.request("/api/resend-verification", "POST", {
      email: "alex@example.com",
    });
    assert.equal(messages.length, 2);
    assert.equal(
      (await f.request("/api/verify-email", "POST", { token: first })).status,
      400,
    );
    const second = token(messages[1]);
    await f.close();
    f = await fixture(options);
    assert.equal(
      (await f.request("/api/verify-email", "POST", { token: second })).status,
      200,
    );
    assert.equal(
      (await f.request("/api/verify-email", "POST", { token: second })).status,
      400,
    );
    assert.equal(
      (
        await f.request("/api/login", "POST", {
          email: "alex@example.com",
          password: "test-valid-password",
        })
      ).status,
      200,
    );
    await f.register("Lena");
    const expired = token(messages.at(-1));
    now += 24 * 3600000 + 1;
    assert.equal(
      (await f.request("/api/verify-email", "POST", { token: expired })).status,
      400,
    );
  } finally {
    await f.close();
    await rm(dir, { recursive: true, force: true });
  }
});
test("password recovery hides account existence, expires and revokes every session while preserving user data", async () => {
  let now = Date.now();
  const messages = [];
  const f = await fixture({
    mailer: async (m) => messages.push(m),
    publicUrl: "https://fit.example.com",
    clock: () => now,
  });
  try {
    const a = await f.register("Alex");
    const credentials = {
      email: "alex@example.com",
      password: "test-valid-password",
    };
    const other = await f.request("/api/login", "POST", credentials);
    const state = {
      "ag-favorites": ["l1"],
      "ag-plan": { "2026-10-19:lunch": "l1" },
      legacy: { keep: true },
    };
    await f.request(
      "/api/state",
      "PUT",
      { data: state, revision: 0 },
      a.cookie,
    );
    const known = await f.request("/api/forgot-password", "POST", {
      email: credentials.email,
    });
    const unknown = await f.request("/api/forgot-password", "POST", {
      email: "missing@example.com",
    });
    assert.equal(known.status, 200);
    assert.deepEqual(known.data, unknown.data);
    assert.equal(messages.length, 1);
    const expired = token(messages[0]);
    now += 30 * 60000 + 1;
    assert.equal(
      (
        await f.request("/api/reset-password", "POST", {
          token: expired,
          password: "new-test-password",
        })
      ).status,
      400,
    );
    await f.request("/api/forgot-password", "POST", {
      email: credentials.email,
    });
    const reset = token(messages[1]);
    assert.equal(
      (
        await f.request("/api/reset-password", "POST", {
          token: reset,
          password: "short",
        })
      ).status,
      400,
    );
    const replies = await Promise.all([
      f.request("/api/reset-password", "POST", {
        token: reset,
        password: "new-test-password",
      }),
      f.request("/api/reset-password", "POST", {
        token: reset,
        password: "new-test-password",
      }),
    ]);
    assert.deepEqual(replies.map((r) => r.status).sort(), [200, 400]);
    assert.equal(
      (await f.request("/api/me", "GET", undefined, a.cookie)).status,
      401,
    );
    assert.equal(
      (await f.request("/api/me", "GET", undefined, other.cookie)).status,
      401,
    );
    assert.equal(
      (await f.request("/api/login", "POST", credentials)).status,
      401,
    );
    const login = await f.request("/api/login", "POST", {
      email: credentials.email,
      password: "new-test-password",
    });
    assert.equal(login.status, 200);
    assert.deepEqual(login.data.data, state);
    assert.equal(
      (
        await f.request("/api/reset-password", "POST", {
          token: reset,
          password: "changed-again-password",
        })
      ).status,
      400,
    );
  } finally {
    await f.close();
  }
});
test("missing SMTP prevents unverified registration, delivery failures allow resend and email endpoints are rate limited", async () => {
  let now = Date.now(),
    failed = true;
  const messages = [];
  let f = await fixture({ requireVerification: true });
  try {
    assert.equal((await f.register("Alex")).status, 503);
    assert.equal(
      (
        await f.request("/api/forgot-password", "POST", {
          email: "alex@example.com",
        })
      ).status,
      503,
    );
  } finally {
    await f.close();
  }
  f = await fixture({
    requireVerification: true,
    publicUrl: "https://fit.example.com",
    clock: () => now,
    mailer: async (m) => {
      if (failed) throw Error("SMTP unavailable");
      messages.push(m);
    },
  });
  try {
    assert.equal((await f.register("Alex")).status, 503);
    assert.equal(
      (
        await f.request("/api/login", "POST", {
          email: "alex@example.com",
          password: "test-valid-password",
        })
      ).status,
      403,
    );
    failed = false;
    now += 61000;
    assert.equal(
      (
        await f.request("/api/resend-verification", "POST", {
          email: "alex@example.com",
        })
      ).status,
      200,
    );
    assert.equal(messages.length, 1);
    for (let i = 0; i < 14; i++)
      await f.request("/api/forgot-password", "POST", {
        email: "none@example.com",
      });
    assert.equal(
      (
        await f.request("/api/forgot-password", "POST", {
          email: "none@example.com",
        })
      ).status,
      429,
    );
  } finally {
    await f.close();
  }
});
test("SMTP configuration requires trusted public URL and matching credentials", () => {
  assert.equal(emailConfig({}).required, true);
  assert.equal(
    emailConfig({ EMAIL_VERIFICATION_REQUIRED: "false" }).required,
    false,
  );
  assert.throws(() =>
    emailConfig({
      SMTP_HOST: "smtp.example.com",
      APP_URL: "https://fit.example.com",
    }),
  );
  for (const APP_URL of [
    "http://evil.example",
    "https://user:password@example.com",
    "https://example.com/path",
  ])
    assert.throws(() =>
      emailConfig({
        SMTP_HOST: "smtp.example.com",
        SMTP_FROM: "noreply@example.com",
        APP_URL,
      }),
    );
  assert.equal(
    typeof emailConfig({
      SMTP_HOST: "smtp.example.com",
      SMTP_FROM: "noreply@example.com",
      APP_URL: "https://fit.example.com",
      SMTP_PORT: "465",
    }).mailer,
    "function",
  );
});
test("SMTP sender enforces TLS and sends configured envelopes without file or URL access", async () => {
  const calls = [];
  let options;
  const env = {
    SMTP_HOST: "smtp.ionos.de",
    SMTP_FROM: "ag fit <noreply@example.com>",
    SMTP_USER: "noreply@example.com",
    SMTP_PASSWORD: "test-only-secret",
    APP_URL: "https://fit.example.com",
  };
  const config = emailConfig(env, (o) => {
    options = o;
    return { sendMail: async (message) => calls.push(message) };
  });
  await config.mailer({
    to: "recipient@example.com",
    subject: "Activation",
    text: "Test link",
  });
  assert.equal(options.port, 587);
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.auth.user, env.SMTP_USER);
  assert.equal(calls[0].from, env.SMTP_FROM);
  assert.equal(calls[0].disableFileAccess, true);
  assert.equal(calls[0].disableUrlAccess, true);
  emailConfig({ ...env, SMTP_PORT: "465" }, (o) => {
    assert.equal(o.secure, true);
    return {};
  });
});
test("recovery response does not wait for SMTP and shutdown drains queued email safely", async () => {
  let release, started;
  const delivered = new Promise((r) => (started = r));
  const blocked = new Promise((r) => (release = r));
  const f = await fixture({
    mailer: async () => {
      started();
      await blocked;
    },
    publicUrl: "https://fit.example.com",
  });
  try {
    await f.register("Alex");
    const response = await f.request("/api/forgot-password", "POST", {
      email: "alex@example.com",
    });
    assert.equal(response.status, 200);
    await delivered;
    release();
  } finally {
    release?.();
    await f.close();
  }
});
