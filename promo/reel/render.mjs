// Pinta reel.html fotograma a fotograma con Chromium (Playwright) y lo codifica con ffmpeg.
//   node render.mjs                 → out/video.mp4 (sin audio) + out/events.json (para audio.py)
//   node render.mjs --still 1,9.5   → out/still-1.png, out/still-9.5.png (revisión rápida)
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("/opt/node22/lib/node_modules/playwright"); }

const TL = JSON.parse(readFileSync(join(here, "timeline.json"), "utf8"));
const BRAND = JSON.parse(readFileSync(join(here, "../../src/brand/brand.json"), "utf8"));
const out = join(here, "out");
mkdirSync(out, { recursive: true });

const launch = { headless: true };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
const browser = await pw.chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
await page.addInitScript(({ BRAND, TL }) => { window.BRAND = BRAND; window.TL = TL; }, { BRAND, TL });
await page.goto(pathToFileURL(join(here, "reel.html")).href);
await page.evaluate(async () => {
  await Promise.all([
    document.fonts.load('500 20px "Apfel"'), document.fonts.load('700 20px "Apfel Fett"'),
    document.fonts.load('400 20px "Instrument Sans"'), document.fonts.load('italic 400 20px "Instrument Sans"'),
  ]);
  await document.fonts.ready;
});
const stage = await page.$("#stage");
const shot = async (t) => { await page.evaluate((t) => window.renderAt(t), t); return stage.screenshot({ type: "png" }); };

const si = process.argv.indexOf("--still");
if (si > 0) {
  for (const t of process.argv[si + 1].split(",").map(Number)) writeFileSync(join(out, `still-${t}.png`), await shot(t));
} else {
  writeFileSync(join(out, "events.json"), JSON.stringify(await page.evaluate(() => window.EVENTS), null, 1));
  const n = Math.round(TL.duration * TL.fps);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(TL.fps), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-r", String(TL.fps), join(out, "video.mp4")],
    { stdio: ["pipe", "inherit", "inherit"] });
  for (let i = 0; i < n; i++) {
    const png = await shot(i / TL.fps);
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) process.stdout.write(`\r${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(`\r${n}/${n} → out/video.mp4`);
}
await browser.close();
