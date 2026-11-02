import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const gate = fileURLToPath(new URL("./audit-production.mjs", import.meta.url));
function check({ dev = true, url = "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm", severity = "high", error = false } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tixflow-audit-"));
  try {
    fs.writeFileSync(path.join(directory, "package-lock.json"), JSON.stringify({
      packages: { "node_modules/braces": { dev }, "node_modules/tailwindcss": { dev } }
    }));
    fs.writeFileSync(path.join(directory, "audit.json"), JSON.stringify(error ? { error: { message: "registry unavailable" } } : {
      metadata: {}, vulnerabilities: {
        tailwindcss: { name: "tailwindcss", severity, nodes: ["node_modules/tailwindcss"], via: ["braces"] },
        braces: { name: "braces", severity, nodes: ["node_modules/braces"], via: [{ severity, url }] }
      }
    }));
    return spawnSync(process.execPath, [gate], { cwd: directory, encoding: "utf8" }).status;
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
test("reviewed build-only advisory is explicitly accepted", () => assert.equal(check(), 0));
test("same advisory in runtime is blocked", () => assert.notEqual(check({ dev: false }), 0));
test("new high advisory is blocked", () => assert.notEqual(check({ url: "https://github.com/advisories/GHSA-new" }), 0));
test("critical finding cannot use the exception", () => assert.notEqual(check({ severity: "critical" }), 0));
test("registry error fails closed", () => assert.notEqual(check({ error: true }), 0));
