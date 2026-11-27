// Render satu episod Janimation dengan Remotion.
// Guna: node render.mjs ../03_episod/EP007_kenapa-pocong-melompat ../07_output/EP007.mp4
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [, , epDir, out] = process.argv;
if (!epDir || !out) { console.error("Guna: node render.mjs <folder-episod> <output.mp4>"); process.exit(1); }
const ep = path.basename(path.resolve(epDir));
const alat = path.resolve(epDir, "../../alat/animatik");
const pub = path.resolve("public", ep);
fs.mkdirSync(pub, { recursive: true });

const data = JSON.parse(fs.readFileSync(path.join(epDir, "adegan.json"), "utf8"));
for (const [src, dst] of [[path.join(alat, "lukis.js"), "lukis.js"], [path.join(alat, "latar.js"), "latar.js"], [path.join(epDir, "animatik.js"), "animatik.js"],
  [path.join(epDir, "adegan.json"), "adegan.json"], [path.join(epDir, data.episod.audio_campuran || data.episod.audio), "campuran.wav"]]) fs.copyFileSync(src, path.join(pub, dst));

// Sampul amplitud suara (lip-sync), 100 nilai sesaat.
const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", path.join(epDir, data.episod.audio), "-f", "s16le", "-ac", "1", "-ar", "8000", "-"], { maxBuffer: 1 << 28 });
const n = Math.floor(pcm.length / 2), win = 80, env = [];
for (let i = 0; i + win <= n; i += win) { let s = 0; for (let k = 0; k < win; k++) { const v = pcm.readInt16LE((i + k) * 2) / 32768; s += v * v; } env.push(Math.sqrt(s / win)); }
const peak = Math.max(...env) || 1;
fs.writeFileSync(path.join(pub, "env.json"), JSON.stringify(env.map((v) => +Math.min(1, (v / peak) * 1.6).toFixed(3))));

const browserExecutable = process.env.REMOTION_BROWSER || "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const inputProps = { ep };
const composition = await selectComposition({ serveUrl, id: "Episod", inputProps, browserExecutable });
let last = -1;
await renderMedia({
  composition, serveUrl, codec: "h264", crf: 19, outputLocation: path.resolve(out), inputProps, browserExecutable, concurrency: 4,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`render ${p * 10}%`); } },
});
console.log(`SIAP: ${path.resolve(out)} (${composition.durationInFrames} bingkai)`);
