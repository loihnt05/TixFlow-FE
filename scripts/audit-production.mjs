import fs from "node:fs";

// One reviewed build-only exception: Tailwind 3 uses braces for repository globs.
// The advisory has no patched braces release. Never allow it in runtime dependencies.
const audit = JSON.parse(fs.readFileSync(process.argv[2] ?? "audit.json", "utf8"));
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
if (audit.error || !audit.vulnerabilities || !audit.metadata) {
  throw new Error("npm audit did not produce a complete vulnerability report");
}
const failures = [];
const reviewed = new Set();
for (const [name, finding] of Object.entries(audit.vulnerabilities)) {
  if (!["high", "critical"].includes(finding.severity)) continue;
  const pending = [finding];
  const seen = new Set();
  while (pending.length) {
    const current = pending.pop();
    if (seen.has(current.name)) continue;
    seen.add(current.name);
    for (const reason of current.via) {
      if (typeof reason === "string") {
        if (!audit.vulnerabilities[reason]) failures.push(`${name}: unresolved advisory chain`);
        else pending.push(audit.vulnerabilities[reason]);
        continue;
      }
      if (!["high", "critical"].includes(reason.severity)) continue;
      const buildOnly = finding.nodes.length > 0 && current.nodes.length > 0 &&
        [...finding.nodes, ...current.nodes].every(node => lock.packages[node]?.dev === true);
      if (reason.url === "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm" &&
          current.name === "braces" && reason.severity === "high" && buildOnly) {
        reviewed.add(reason.url);
      } else failures.push(`${name}: ${reason.url}`);
    }
  }
}
for (const url of reviewed) console.log(`Reviewed build-only exception (Tailwind 3 repository globs): ${url}`);
if (failures.length) throw new Error(`Unapproved high/critical findings:\n${[...new Set(failures)].join("\n")}`);
console.log("Dependency gate passed; all runtime and unreviewed high/critical findings are blocked.");
