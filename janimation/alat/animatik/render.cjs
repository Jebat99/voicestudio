#!/usr/bin/env node
// Render animatik episod kepada MP4 1080x1920 dengan suara.
// Guna: node janimation/alat/animatik/render.cjs <folder-episod> <output.mp4> [--fps 24] [--from s] [--to s] [--stills t1,t2,... --stills-dir dir]
const fs = require("fs"), path = require("path"), { spawn, spawnSync } = require("child_process");
const { chromium } = require("playwright");

const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const ep = path.resolve(args[0]), out = path.resolve(args[1] || "out.mp4");
const fps = +(opt("--fps") || 24);
const data = JSON.parse(fs.readFileSync(path.join(ep, "adegan.json"), "utf8"));
const audio = path.join(ep, data.episod.audio); // suara sahaja: untuk lip-sync
const mixAudio = path.join(ep, data.episod.audio_campuran || data.episod.audio); // trek akhir dalam MP4
const END = data.scene[data.scene.length - 1].tamat;
const from = +(opt("--from") || 0), to = Math.min(+(opt("--to") || END), END);

// Sampul amplitud suara (untuk lip-sync), 100 nilai sesaat.
const pcm = spawnSync("ffmpeg", ["-v", "error", "-i", audio, "-f", "s16le", "-ac", "1", "-ar", "8000", "-"], { maxBuffer: 1 << 28 }).stdout;
const n = Math.floor(pcm.length / 2), win = 80, envv = [];
for (let i = 0; i + win <= n; i += win) { let s = 0; for (let k = 0; k < win; k++) { const v = pcm.readInt16LE((i + k) * 2) / 32768; s += v * v; } envv.push(Math.sqrt(s / win)); }
const peak = Math.max(...envv) || 1;
const ENV = envv.map(v => +Math.min(1, v / peak * 1.6).toFixed(3));

const here = __dirname;
const html = `<html><body style="margin:0;background:#000"><canvas id="c" width="1080" height="1920"></canvas>
<script>${fs.readFileSync(path.join(here, "lukis.js"), "utf8")}</script>
<script>${fs.readFileSync(path.join(here, "latar.js"), "utf8")}</script>
<script>${fs.readFileSync(path.join(ep, "animatik.js"), "utf8")}</script>
<script>
const DATA = ${JSON.stringify(data)}, ENVV = ${JSON.stringify(ENV)};
const env = T => { const i = T * 100, a = ENVV[Math.floor(i)] || 0, b = ENVV[Math.floor(i) + 1] || 0; return a + (b - a) * (i % 1); };
const ctx = document.getElementById("c").getContext("2d");
function draw(T) {
  const S = DATA.scene; let s = S.find(x => T < x.tamat) || S[S.length - 1];
  const lt = T - s.mula, d = s.tamat - s.mula;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
  ctx.save(); (SCENES[s.id] || (() => {}))(ctx, lt, d, T, env); ctx.restore();
  if (DATA.sari_kata) { // sari kata ikut masa suara sebenar
    const K = DATA.sari_kata; for (let i = 0; i < K.length; i++) { const k = K[i], end = Math.min(K[i + 1] ? K[i + 1].mula - .02 : 1e9, k.tamat + .35);
      if (T >= k.mula - .04 && T < end) { subtitle(ctx, k.teks, 1, 1 + .08 * (1 - easeOut(prog(T, k.mula - .04, k.mula + .14)))); break; } }
  } else subtitle(ctx, s.sari_kata, 1, 1 + .08 * (1 - easeOut(prog(lt, 0, .18))));
  // peralihan bentuk hati antara babak
  const i = S.indexOf(s), nx = S[i + 1], D = .26;
  if (nx && nx.masuk === "hati" && T > nx.mula - D) heartWipe(ctx, prog(T, nx.mula - D, nx.mula));
  if (s.masuk === "hati" && lt < D) heartWipe(ctx, -1 + prog(lt, 0, D));
}
</script></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; page.on("pageerror", e => errs.push(e.message));
  await page.setContent(html); await page.evaluate(() => document.fonts.load("900 60px Inter"));
  if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
  const stills = opt("--stills");
  if (stills) {
    const dir = path.resolve(opt("--stills-dir") || "."); fs.mkdirSync(dir, { recursive: true });
    for (const t of stills.split(",").map(Number)) {
      const b64 = await page.evaluate(t => { draw(t); return document.getElementById("c").toDataURL("image/jpeg", .85).split(",")[1]; }, t);
      fs.writeFileSync(path.join(dir, `f_${t.toFixed(2)}.jpg`), Buffer.from(b64, "base64"));
    }
    if (errs.length) console.error(errs.join("\n"));
    await browser.close(); return;
  }
  const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-ss", String(from), "-t", String(to - from), "-i", mixAudio,
    "-filter_complex", "[1:a]apad[a]", "-map", "0:v", "-map", "[a]", "-t", String(to - from),
    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(fps),
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  const total = Math.round((to - from) * fps); const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const t = from + i / fps;
    const b64 = await page.evaluate(t => { draw(t); return document.getElementById("c").toDataURL("image/jpeg", .9).split(",")[1]; }, t);
    if (!ff.stdin.write(Buffer.from(b64, "base64"))) await new Promise(r => ff.stdin.once("drain", r));
    if (i % 240 === 0) console.log(`bingkai ${i}/${total} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
  }
  ff.stdin.end(); await new Promise(r => ff.on("close", r)); await browser.close();
  console.log(`SIAP: ${out}`);
})();
