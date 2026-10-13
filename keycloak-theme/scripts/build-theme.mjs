import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeDir = path.resolve(__dirname, "..");
const binDir = path.join(themeDir, "node_modules", ".bin");

// Ensure mvn.cmd wrapper exists for Windows
if (process.platform === "win32") {
  const mvnCmdPath = path.join(binDir, "mvn.cmd");
  const mvnBatPath = path.join(binDir, "mvn.bat");
  const mvnContent = `@echo off
if "%~1"=="--version" (
    docker run --rm maven:3.9-eclipse-temurin-21 mvn --version
    exit /b %ERRORLEVEL%
)

docker run --rm -v "%CD%:/workspace" -w /workspace maven:3.9-eclipse-temurin-21 mvn clean install
exit /b %ERRORLEVEL%
`;
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }
  fs.writeFileSync(mvnCmdPath, mvnContent, "utf8");
  fs.writeFileSync(mvnBatPath, mvnContent, "utf8");
}

console.log("==> Building React assets...");
execSync("npm run build", { cwd: themeDir, stdio: "inherit" });

console.log("==> Packaging Keycloak theme with Keycloakify...");
execSync("npx keycloakify build", {
  cwd: themeDir,
  stdio: "inherit",
  env: {
    ...process.env,
    KEYCLOAKIFY_USE_DEFAULT_MAVEN_REPO: "true",
  },
});

const generatedJar = path.join(
  themeDir,
  "dist_keycloak",
  "keycloak-theme-for-kc-all-other-versions.jar"
);

const backendProvidersDir = path.resolve(
  themeDir,
  "../../tixflow-backend/infrastructure/keycloak/providers"
);

if (fs.existsSync(generatedJar)) {
  fs.mkdirSync(backendProvidersDir, { recursive: true });
  const targetJar = path.join(backendProvidersDir, "tixflow-theme.jar");
  fs.copyFileSync(generatedJar, targetJar);
  console.log(`==> Successfully deployed theme jar to: ${targetJar}`);
} else {
  console.warn("==> Generated JAR not found at: " + generatedJar);
}
