import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
test("redeployment guard refuses a missing database rather than creating an empty replacement", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "ag-fit-mount-"));
  const database = path.join(dir, "wrong-volume", "db.sqlite");
  try {
    const result = spawnSync(process.execPath, ["server.js"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_PATH: database,
        REQUIRE_EXISTING_DATABASE: "true",
      },
      encoding: "utf8",
      timeout: 10000,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Vorhandene Datenbank fehlt/);
    await assert.rejects(stat(database), { code: "ENOENT" });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
