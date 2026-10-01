// Pinta <versión>/reel.html fotograma a fotograma con Chromium (Playwright) y lo codifica con ffmpeg.
//   node shared/render.mjs <versión>                 → <versión>/out/video.mp4 (sin audio) + out/events.json
//   node shared/render.mjs <versión> --still 1,9.5   → <versión>/out/still-1.png, … (revisión rápida)
//   node shared/render.mjs <versión> --events        → solo <versión>/out/events.json
// Inyecta en la página: BRAND (src/brand/brand.json), TL (timeline.json) y, si existen,
// SCRIPT (script.json: el guion de la voz) y VO (out/vo.json: duración de cada frase grabada).
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dir = resolve(here, "..", process.argv[2] || "");
if (!process.argv[2] || !existsSync(join(dir, "reel.html"))) { console.error("uso: node shared/render.mjs <versión>"); process.exit(1); }
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("/opt/node22/lib/node_modules/playwright"); }

const json = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const TL = json(join(dir, "timeline.json"));
const BRAND = json(join(here, "../../../src/brand/brand.json"));
const SCRIPT = json(join(dir, "script.json"));
const VO = json(join(dir, "out/vo.json"));
const CLIPS = json(join(here, "../assets/video/.frames/clips.json"));
const out = join(dir, "out");
mkdirSync(out, { recursive: true });

const launch = { headless: true };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
const browser = await pw.chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => { console.error("error en la página:", e.message); process.exitCode = 1; });
await page.addInitScript((d) => Object.assign(window, d), { BRAND, TL, SCRIPT, VO, CLIPS });
await page.goto(pathToFileURL(join(dir, "reel.html")).href);
await page.evaluate(async () => {
  await Promise.all([
    document.fonts.load('500 20px "Apfel"'), document.fonts.load('700 20px "Apfel Fett"'),
    document.fonts.load('400 20px "Instrument Sans"'), document.fonts.load('italic 400 20px "Instrument Sans"'),
  ]);
  await document.fonts.ready;
});
const stage = await page.$("#stage");
const shot = async (t) => {
  // pinta el instante t y espera a que estén decodificadas las imágenes visibles (fotos y fotogramas de clips)
  await page.evaluate(async (t) => {
    window.renderAt(t);
    await Promise.all([...document.images].filter((i) => i.offsetParent).map((i) => (i.complete && i.naturalWidth ? 0 : i.decode().catch(() => 0))));
  }, t);
  return stage.screenshot({ type: "png" });
};

const si = process.argv.indexOf("--still");
if (process.argv.includes("--events")) {
  // solo los eventos de sonido (para probar la mezcla sin pintar el vídeo)
  writeFileSync(join(out, "events.json"), JSON.stringify(await page.evaluate(() => window.EVENTS), null, 1));
} else if (si > 0) {
  for (const t of process.argv[si + 1].split(",").map(Number)) writeFileSync(join(out, `still-${t}.png`), await shot(t));
} else {
  writeFileSync(join(out, "events.json"), JSON.stringify(await page.evaluate(() => window.EVENTS), null, 1));
  const n = Math.round(TL.duration * TL.fps);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(TL.fps), "-i", "-",
    "-vf", "noise=c0s=7:c0f=u", // grano de papel fijo (solo luminancia): textura sin inflar el tamaño
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(TL.fps), join(out, "video.mp4")],
    { stdio: ["pipe", "inherit", "inherit"] });
  for (let i = 0; i < n; i++) {
    const png = await shot(i / TL.fps);
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) process.stdout.write(`\r${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(`\r${n}/${n} → ${process.argv[2]}/out/video.mp4`);
}
await browser.close();
