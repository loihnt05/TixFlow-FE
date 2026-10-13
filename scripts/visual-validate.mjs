import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\hongu\\.gemini\\antigravity-cli\\brain\\8ffbb259-2fc0-4eb3-a88f-5198a8db1e35";

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function run() {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
  });

  const page = await browser.newPage();

  // 1. Zipevent Login Desktop
  try {
    console.log("Capturing Zipevent Login (Desktop)...");
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto("https://www.zipeventapp.com/account/login", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "zipevent-login-desktop.png"),
      fullPage: false,
    });
    console.log("Saved zipevent-login-desktop.png");

    // Zipevent Login Mobile
    console.log("Capturing Zipevent Login (Mobile)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "zipevent-login-mobile.png"),
      fullPage: false,
    });
    console.log("Saved zipevent-login-mobile.png");
  } catch (err) {
    console.warn("Could not capture Zipevent (network error):", err.message);
  }

  // 2. TixFlow Keycloak Login Page (Desktop)
  const keycloakLoginUrl =
    "http://localhost:8180/realms/tixflow/protocol/openid-connect/auth?client_id=tixflow-web&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=openid&code_challenge=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk&code_challenge_method=S256&prompt=login";

  console.log("Capturing TixFlow Keycloak Login (Desktop)...");
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(keycloakLoginUrl, {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, "tixflow-login-desktop.png"),
    fullPage: false,
  });
  console.log("Saved tixflow-login-desktop.png");

  // 3. TixFlow Keycloak Login Page (Mobile)
  console.log("Capturing TixFlow Keycloak Login (Mobile)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, "tixflow-login-mobile.png"),
    fullPage: false,
  });
  console.log("Saved tixflow-login-mobile.png");

  // 4. Test Invalid Password Error State
  console.log("Testing Invalid Password submission...");
  await page.setViewport({ width: 1280, height: 900 });
  await page.type("#username", "nonexistent@tixflow.com");
  await page.type("#password", "wrongpassword123");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click("#kc-login"),
  ]);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, "tixflow-login-error.png"),
    fullPage: false,
  });
  console.log("Saved tixflow-login-error.png");

  // 5. Test Forgot Password
  console.log("Capturing Forgot Password page...");
  const forgotLink = await page.$('a[href*="login-reset-credentials"]');
  if (forgotLink) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      forgotLink.click(),
    ]);
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "tixflow-forgot-password.png"),
      fullPage: false,
    });
    console.log("Saved tixflow-forgot-password.png");
  }

  // 6. Test Register Page
  console.log("Capturing Registration page...");
  const keycloakRegUrl =
    "http://localhost:8180/realms/tixflow/protocol/openid-connect/registrations?client_id=tixflow-web&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=openid&code_challenge=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk&code_challenge_method=S256";
  await page.goto(keycloakRegUrl, {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, "tixflow-register-desktop.png"),
    fullPage: false,
  });
  console.log("Saved tixflow-register-desktop.png");

  await browser.close();
  console.log("All visual validation screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Visual validation failed:", err);
  process.exit(1);
});
