import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({
  viewport: { width: 390, height: 640 },
  deviceScaleFactor: 3,
});
await page.goto("http://localhost:3000/es/app", { waitUntil: "networkidle" });
// The preview banner is scaffolding for us, not part of the product.
await page.evaluate(() => {
  document.querySelectorAll("p").forEach((el) => {
    if (el.textContent?.startsWith("Vista previa")) el.remove();
  });
});
await page.waitForTimeout(300);
await page.screenshot({ path: "shots/app-screen-es.png" });
console.log("ok");
await browser.close();
