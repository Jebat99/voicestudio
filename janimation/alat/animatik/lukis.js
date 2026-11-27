// Pustaka lukisan 2D Janimation (Canvas 2D). Watak, prop, kesan dan teks.
// Semua fungsi menerima ctx canvas. Koordinat: y ke bawah. Gaya: garisan coklat
// kehitaman tebal, cel shading 2 tona, mata anime besar.
/* eslint-disable no-unused-vars */
const W = 1080, H = 1920;
const INK = "#2B1E1A";
const TAU = Math.PI * 2;

// ---------- matematik ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const noise = (t, k = 1) => Math.sin(t * 37.1 * k) * .5 + Math.sin(t * 91.7 * k + 1.3) * .3 + Math.sin(t * 13.3 * k + 4.1) * .2;
const shade = (hex, f) => { // f<0 gelap, f>0 cerah
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
  const m = f < 0 ? 0 : 255, k = Math.abs(f);
  r = Math.round(r + (m - r) * k); g = Math.round(g + (m - g) * k); b = Math.round(b + (m - b) * k);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

// ---------- primitif ----------
function ell(ctx, x, y, rx, ry, fill, lw = 0, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
}
function rr(ctx, x, y, w, h, r, fill, lw = 0) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
}
function poly(ctx, pts, fill, lw = 0, close = true) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = "round"; ctx.stroke(); }
}
function line(ctx, x1, y1, x2, y2, w, col = INK, cap = "round") {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = cap; ctx.stroke();
}
function limb(ctx, pts, w, col, o) { // anggota dengan garis luar
  for (const [ww, cc] of [[w + 2 * o, INK], [w, col]]) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineWidth = ww; ctx.strokeStyle = cc; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
  }
}
function star(ctx, x, y, r, fill, lw = 0, pts = 5, inner = .45, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const a = rot + i * Math.PI / pts, rr_ = i % 2 ? r * inner : r;
    ctx.lineTo(x + Math.cos(a) * rr_, y + Math.sin(a) * rr_);
  }
  ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
}
function heart(ctx, x, y, s, fill, lw = 0) {
  ctx.beginPath(); ctx.moveTo(x, y + s * .35);
  ctx.bezierCurveTo(x - s * 1.1, y - s * .35, x - s * .5, y - s * 1.05, x, y - s * .45);
  ctx.bezierCurveTo(x + s * .5, y - s * 1.05, x + s * 1.1, y - s * .35, x, y + s * .35);
  ctx.fillStyle = fill; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
}

// ---------- kamera ----------
function cam(ctx, c, fn) {
  ctx.save(); ctx.translate(W / 2 + (c.sx || 0), H / 2 + (c.sy || 0));
  ctx.rotate(c.rot || 0); ctx.scale(c.z || 1, c.z || 1); ctx.translate(-(c.x ?? W / 2), -(c.y ?? H / 2));
  fn(); ctx.restore();
}
const shake = (t, amp) => ({ sx: noise(t, 1) * amp, sy: noise(t + 9, 1.3) * amp });

// ---------- watak ----------
const SKIN = { tan: ["#E7B48F", "#C98F6B"], light: ["#F2C9A5", "#D9A27E"], brown: ["#C68A5E", "#A06A44"], old: ["#D9A57E", "#B9805B"] };
const PRESET = {
  HAKIM: { skin: "tan", hair: "hakim", hairCol: "#1C1714", eye: "#5A3A22", brow: 1.25, mole: true,
    top: { t: "tee", c: "#D9A21B" }, bot: { t: "pants", c: "#3B5B8C" }, shoe: "#F4F4F2", watch: "#7A4E2D" },
  "HAKIM-NIKAH": { skin: "tan", hair: "hakim", hairCol: "#1C1714", eye: "#5A3A22", brow: 1.25, mole: true, hat: "songkok",
    top: { t: "baju", c: "#FAF7EE" }, samping: "#C9962B", bot: { t: "pants", c: "#FAF7EE" }, shoe: "#1B1716" },
  "HAKIM-JUTAWAN": { skin: "tan", hair: "hakim", hairCol: "#1C1714", eye: "#5A3A22", brow: 1.25, mole: true,
    top: { t: "suit", c: "#1E2A4A", tie: "#D9A21B" }, bot: { t: "pants", c: "#1E2A4A" }, shoe: "#111111", watch: "#E1B53C" },
  SOFEA: { skin: "light", female: true, tudung: "#E9D3B0", eye: "#5A3A22", lips: "#B8434E",
    top: { t: "blazer", c: "#F1E6CF", inner: "#FFFFFF" }, bot: { t: "pants", c: "#EADCC0" }, shoe: "#D9B79A", watch: "#E1B53C", brooch: "#F7F3EA" },
  "SOFEA-NIKAH": { skin: "light", female: true, tudung: "#FFFFFF", crown: true, eye: "#5A3A22", lips: "#B8434E",
    top: { t: "kurung", c: "#FFFFFF", trim: "#D9B04A" }, bot: { t: "skirt", c: "#FFFFFF", trim: "#D9B04A" }, shoe: "#F2E6CF" },
  PAKCIK: { skin: "old", hair: "bald", hairCol: "#F2F2F2", eye: "#3A2A1E", moustache: "#F5F5F5", headband: "#D93A3A",
    top: { t: "singlet", c: "#FAFAFA" }, bot: { t: "pants", c: "#D93A3A" }, shoe: "#F4F4F2", thin: true },
  JURUNIKAH: { skin: "tan", hair: "short", hairCol: "#2A2420", eye: "#3A2A1E", hat: "songkok", beard: "#EDEDED", glasses: "square",
    top: { t: "baju", c: "#FAF7EE" }, bot: { t: "pants", c: "#FAF7EE" }, shoe: "#1B1716", wide: true },
};
const TEE = ["#4F8FD6", "#E2574C", "#59B36A", "#8E6CC8", "#F2994A", "#3FB6B0", "#E86FA8", "#6B7A8F", "#C0392B", "#2E86AB"];
const TUD = ["#F28DB2", "#7EC8F2", "#B39DDB", "#F6C453", "#7BD389", "#FF9E7A", "#9AD0C2", "#E6E6E6", "#C7A6E8", "#F5B7B1"];
const KUR = ["#5DADE2", "#AF7AC5", "#F1948A", "#48C9B0", "#F5B041", "#EC7063", "#5499C7", "#76D7C4"];
function crowdPreset(kind, seed) {
  const r = rng(seed * 7919 + 13), pick = a => a[Math.floor(r() * a.length)];
  const skin = pick(["tan", "light", "brown", "tan", "light"]);
  if (kind === "W") return { skin, female: true, tudung: r() < .8 ? pick(TUD) : null, hairCol: pick(["#1C1714", "#3B2A20"]),
    eye: "#4A3224", lips: "#C2575F", top: { t: "kurung", c: pick(KUR) }, bot: { t: "skirt", c: pick(KUR) }, shoe: "#F1E7DA", simple: true };
  return { skin, hair: pick(["short", "short", "buzz", "side"]), hairCol: pick(["#1C1714", "#2A2420", "#3B2A20"]), eye: "#3A2A1E",
    moustache: r() < .25 ? "#2A2420" : null, top: { t: r() < .7 ? "tee" : "shirt", c: pick(TEE) },
    bot: { t: "pants", c: pick(["#3B5B8C", "#2F2F3A", "#6B5B4A", "#44546A"]) }, shoe: pick(["#F4F4F2", "#2B2B2B", "#8A6A4A"]), simple: true };
}

// pose: { la:[bahu,siku], ra:[bahu,siku], ll:[pinggul,lutut], rl:[...], lean, bob }
const POSE = {
  stand: { la: [.12, .05], ra: [.12, .05], ll: [.04, 0], rl: [.04, 0] },
  cheeks: { la: [.25, 2.85], ra: [.25, 2.85], ll: [.03, 0], rl: [.03, 0] },
  armsUp: { la: [2.6, .15], ra: [2.6, .15], ll: [.08, 0], rl: [.08, 0] },
  shock: { la: [.9, .5], ra: [.9, .5], ll: [.12, 0], rl: [.12, 0] },
  cupSip: { la: [.12, .05], ra: [.35, 2.7], ll: [.04, 0], rl: [.04, 0] },
  cupHold: { la: [.12, .05], ra: [.25, 1.6], ll: [.04, 0], rl: [.04, 0] },
  phone: { la: [.25, 1.9], ra: [.25, 1.9], ll: [.04, 0], rl: [.04, 0] },
  point: { la: [.12, .05], ra: [1.25, -.05], ll: [.05, 0], rl: [.05, 0] },
  thumbs: { la: [.12, .05], ra: [.45, 2.0], ll: [.05, 0], rl: [.05, 0] },
  flex: { la: [1.55, 1.7], ra: [1.55, 1.7], ll: [.12, 0], rl: [.12, 0] },
  liftUp: { la: [2.75, .1], ra: [2.75, .1], ll: [.14, 0], rl: [.14, 0] },
  liftMid: { la: [1.5, 1.6], ra: [1.5, 1.6], ll: [.14, 0], rl: [.14, 0] },
  hug: { la: [.35, 1.55], ra: [.35, 1.55], ll: [.04, 0], rl: [.04, 0] },
  wipe: { la: [.12, .05], ra: [.5, 2.75], ll: [.04, 0], rl: [.04, 0] },
  bouquetUp: { la: [.4, 1.2], ra: [2.9, 0], ll: [.06, 0], rl: [.06, 0] },
  holdFront: { la: [.3, 1.5], ra: [.3, 1.5], ll: [.04, 0], rl: [.04, 0] },
  card: { la: [.12, .05], ra: [1.0, .9], ll: [.08, 0], rl: [.08, 0] },
  sit: { la: [.3, 1.3], ra: [.3, 1.3], ll: [1.4, -1.45], rl: [1.4, -1.45] },
  umbrella: { la: [.12, .05], ra: [.5, 2.1], ll: [.04, 0], rl: [.04, 0] },
};
function runPose(t, sp = 1) {
  const p = Math.sin(t * 14 * sp);
  return { la: [.5 + p * .8, 1.4], ra: [.5 - p * .8, 1.4], ll: [p * .55, -.5 - Math.max(0, p) * .6], rl: [-p * .55, -.5 - Math.max(0, -p) * .6], bob: Math.abs(Math.cos(t * 14 * sp)) * .03 };
}

// Lukis seorang watak. x,y = kaki di tanah. h = tinggi badan (px).
// o: { p: preset, pose, face:{eyes,mouth,brow,blush,sweat,soot,talk,look}, hold:{l,r}, flip, squash }
function person(ctx, x, y, h, o) {
  const P = typeof o.p === "string" ? PRESET[o.p] : o.p;
  const pose = Object.assign({}, POSE.stand, typeof o.pose === "string" ? POSE[o.pose] : o.pose || {});
  const [sk, skS] = SKIN[P.skin];
  const ow = Math.max(2, h * .011);
  const sq = o.squash || 0; // + memampat, - meregang
  ctx.save(); ctx.translate(x, y - (pose.bob || 0) * h);
  ctx.scale((o.flip ? -1 : 1) * (1 + sq * .25), 1 - sq * .25);
  if (o.rot) ctx.rotate(o.rot);
  const wide = P.wide ? 1.15 : P.thin ? .88 : 1;
  const hipY = -.45 * h, shY = -.75 * h, headY = -.885 * h, hr = .105 * h;
  const shW = .145 * h * wide, hipW = .115 * h * wide;
  const legW = .07 * h * wide, armW = .055 * h * (P.thin ? .85 : 1);
  const seg = (ox, oy, a1, a2, L1, L2, side) => {
    const e = [ox + Math.sin(a1) * L1 * side, oy + Math.cos(a1) * L1];
    const a = a1 + a2; const hnd = [e[0] + Math.sin(a) * L2 * side, e[1] + Math.cos(a) * L2];
    return [[ox, oy], e, hnd];
  };
  // kaki
  const legs = [-1, 1].map(s => seg(s * hipW * .5, hipY, (s < 0 ? pose.ll : pose.rl)[0], (s < 0 ? pose.ll : pose.rl)[1], .22 * h, .23 * h, s));
  const skirt = P.bot.t === "skirt";
  const pantC = P.bot.c;
  if (!skirt) {
    for (const L of legs) limb(ctx, L, legW, pantC, ow);
  }
  for (const L of legs) { const f = L[2]; ell(ctx, f[0] + (f[0] < 0 ? -1 : 1) * h * .015, f[1] + h * .005, h * .05, h * .025, P.shoe, ow); }
  if (skirt) {
    poly(ctx, [[-hipW * 1.05, hipY - h * .02], [hipW * 1.05, hipY - h * .02], [hipW * 1.5, -h * .02], [-hipW * 1.5, -h * .02]], pantC, ow);
    if (P.bot.trim) line(ctx, -hipW * 1.45, -h * .05, hipW * 1.45, -h * .05, h * .012, P.bot.trim);
  }
  // lengan (dilukis sebelum badan untuk bahagian belakang? kekal di hadapan untuk kejelasan)
  const arms = [-1, 1].map(s => seg(s * shW * .92, shY + h * .02, (s < 0 ? pose.la : pose.ra)[0], (s < 0 ? pose.la : pose.ra)[1], .16 * h, .15 * h, s));
  const longSleeve = ["suit", "baju", "blazer", "kurung", "shirtL"].includes(P.top.t);
  // badan
  const topC = P.top.c, topS = shade(topC, -.18);
  const torso = [[-shW, shY], [shW, shY], [hipW * 1.02, hipY + h * .03], [-hipW * 1.02, hipY + h * .03]];
  if (P.top.t === "kurung") { torso[2] = [hipW * 1.25, hipY + h * .12]; torso[3] = [-hipW * 1.25, hipY + h * .12]; }
  if (P.top.t === "baju") { torso[2] = [hipW * 1.12, hipY + h * .09]; torso[3] = [-hipW * 1.12, hipY + h * .09]; }
  // leher
  rr(ctx, -h * .028, shY - h * .05, h * .056, h * .07, h * .02, sk, ow);
  poly(ctx, torso, topC, ow);
  ctx.save(); ctx.clip(); poly(ctx, [[shW * .35, shY], [shW, shY], [hipW * 1.3, hipY + h * .15], [hipW * .45, hipY + h * .15]], topS); ctx.restore();
  poly(ctx, torso, null, ow);
  if (P.top.t === "singlet") { ell(ctx, 0, shY + h * .01, shW * .55, h * .04, sk); ell(ctx, -shW * .78, shY + h * .03, shW * .25, h * .06, sk); ell(ctx, shW * .78, shY + h * .03, shW * .25, h * .06, sk); }
  if (P.top.t === "tee" || P.top.t === "shirt") line(ctx, -h * .04, shY + h * .005, h * .04, shY + h * .005, ow * 1.2);
  if (P.top.t === "shirt") { line(ctx, 0, shY + h * .02, 0, hipY + h * .02, ow * .8); for (let i = 0; i < 3; i++) ell(ctx, h * .012, shY + h * (.06 + i * .07), h * .007, h * .007, INK); }
  if (P.top.t === "suit") {
    poly(ctx, [[-h * .045, shY], [h * .045, shY], [0, shY + h * .15]], "#F5F5F5", ow * .7);
    poly(ctx, [[-h * .012, shY + h * .02], [h * .012, shY + h * .02], [h * .018, shY + h * .17], [0, shY + h * .2], [-h * .018, shY + h * .17]], P.top.tie, ow * .7);
    line(ctx, -h * .045, shY, -h * .01, shY + h * .2, ow); line(ctx, h * .045, shY, h * .01, shY + h * .2, ow);
    rr(ctx, shW * .35, shY + h * .05, h * .05, h * .012, 2, "#111");
  }
  if (P.top.t === "blazer") {
    poly(ctx, [[-h * .05, shY], [h * .05, shY], [h * .02, shY + h * .2], [-h * .02, shY + h * .2]], P.top.inner, ow * .7);
    line(ctx, -h * .05, shY, -h * .015, shY + h * .22, ow); line(ctx, h * .05, shY, h * .015, shY + h * .22, ow);
    ell(ctx, h * .005, shY + h * .23, h * .008, h * .008, INK);
  }
  if (P.top.t === "baju") { line(ctx, 0, shY + h * .01, 0, shY + h * .12, ow * .8); for (let i = 0; i < 3; i++) ell(ctx, 0, shY + h * (.03 + i * .035), h * .006, h * .006, "#C9962B"); }
  if (P.top.t === "kurung" && P.top.trim) { line(ctx, -h * .03, shY + h * .01, h * .03, shY + h * .01, h * .012, P.top.trim); line(ctx, -hipW * 1.2, hipY + h * .1, hipW * 1.2, hipY + h * .1, h * .01, P.top.trim); }
  if (P.samping) { poly(ctx, [[-hipW * 1.15, hipY - h * .02], [hipW * 1.15, hipY - h * .02], [hipW * 1.2, hipY + h * .14], [-hipW * 1.2, hipY + h * .14]], P.samping, ow);
    for (let i = -2; i <= 2; i++) star(ctx, i * hipW * .45, hipY + h * .06, h * .012, "#FFF3C4", 0, 4, .4); }
  // lengan
  for (const A of arms) {
    limb(ctx, A, armW, sk, ow);
    if (longSleeve) limb(ctx, [A[0], A[1], [lerp(A[1][0], A[2][0], .82), lerp(A[1][1], A[2][1], .82)]], armW * 1.15, topC, ow);
    else if (P.top.t !== "singlet") limb(ctx, [A[0], [lerp(A[0][0], A[1][0], .55), lerp(A[0][1], A[1][1], .55)]], armW * 1.3, topC, ow);
    ell(ctx, A[2][0], A[2][1], armW * .62, armW * .62, sk, ow);
  }
  if (P.watch) { const A = arms[0]; ell(ctx, lerp(A[1][0], A[2][0], .78), lerp(A[1][1], A[2][1], .78), armW * .62, armW * .4, P.watch, ow * .7); }
  if (P.top.t === "suit" || P.top.t === "blazer") for (const A of arms) ell(ctx, lerp(A[1][0], A[2][0], .82), lerp(A[1][1], A[2][1], .82), armW * .62, armW * .5, "#FFFFFF", ow * .5);
  // kepala
  const face = Object.assign({ eyes: "normal", mouth: "smile" }, o.face || {});
  head(ctx, 0, headY, hr, P, face, ow, h);
  if (P.brooch) ell(ctx, 0, headY + hr * 1.42, hr * .12, hr * .12, P.brooch, ow * .6);
  // pegangan
  const hold = o.hold || {};
  for (const [k, A] of [["l", arms[0]], ["r", arms[1]]]) if (hold[k]) prop(ctx, hold[k], A[2][0], A[2][1], h, o.t || 0, k === "l" ? -1 : 1);
  if (hold.both) prop(ctx, hold.both, (arms[0][2][0] + arms[1][2][0]) / 2, (arms[0][2][1] + arms[1][2][1]) / 2, h, o.t || 0, 1);
  ctx.restore();
  return { headX: x, headY: y + headY, hr, arms };
}

function head(ctx, cx, cy, r, P, f, ow, h) {
  const [sk, skS] = SKIN[P.skin];
  const fem = P.female;
  if (P.tudung) { // kain di belakang kepala, jatuh ke bahu
    poly(ctx, [[-r * 1.25, cy - r * .2], [r * 1.25, cy - r * .2], [r * 1.75, cy + r * 1.95], [0, cy + r * 2.25], [-r * 1.75, cy + r * 1.95]], P.tudung, ow);
    ell(ctx, cx, cy - r * .1, r * 1.22, r * 1.25, P.tudung, ow);
  } else if (P.hair === "hakim" || P.hair === "short" || P.hair === "side") {
    ell(ctx, cx, cy - r * .12, r * 1.08, r * 1.08, P.hairCol, ow);
  }
  // telinga
  if (!P.tudung) { ell(ctx, cx - r * .98, cy + r * .1, r * .17, r * .24, sk, ow); ell(ctx, cx + r * .98, cy + r * .1, r * .17, r * .24, sk, ow); }
  // muka
  ctx.beginPath(); ctx.ellipse(cx, cy, r * .95, r * 1.02, 0, 0, TAU);
  ctx.fillStyle = sk; ctx.fill();
  ctx.save(); ctx.clip(); ell(ctx, cx + r * 1.05, cy + r * .1, r * .4, r * 1.2, skS); ctx.restore();
  if (f.soot) { ctx.save(); ctx.globalAlpha = .75; ell(ctx, cx, cy + r * .1, r * .9, r * .9, "#2A2A2A"); ctx.restore(); }
  if (f.pale) { ctx.save(); ctx.globalAlpha = .35; ell(ctx, cx, cy - r * .3, r * .95, r * .7, "#6C7BD9"); ctx.restore(); }
  ell(ctx, cx, cy, r * .95, r * 1.02, null, ow);
  // rambut depan / topi
  if (P.tudung) {
    ctx.beginPath(); ctx.ellipse(cx, cy - r * .05, r * 1.18, r * 1.2, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(cx + r * .9, cy - r * .35);
    ctx.quadraticCurveTo(cx, cy - r * .78, cx - r * .9, cy - r * .35); ctx.closePath(); ctx.fillStyle = P.tudung; ctx.fill(); ctx.lineWidth = ow; ctx.strokeStyle = INK; ctx.stroke();
    // bingkai pipi
    ctx.beginPath(); ctx.moveTo(cx - r * .95, cy - r * .3); ctx.quadraticCurveTo(cx - r * 1.05, cy + r * .8, cx - r * .35, cy + r * 1.1);
    ctx.lineTo(cx - r * 1.2, cy + r * 1.2); ctx.lineTo(cx - r * 1.2, cy - r * .3); ctx.closePath(); ctx.fillStyle = P.tudung; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + r * .95, cy - r * .3); ctx.quadraticCurveTo(cx + r * 1.05, cy + r * .8, cx + r * .35, cy + r * 1.1);
    ctx.lineTo(cx + r * 1.2, cy + r * 1.2); ctx.lineTo(cx + r * 1.2, cy - r * .3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ell(ctx, cx, cy + r * 1.18, r * .5, r * .22, P.tudung, ow);
    if (P.crown) { star(ctx, cx, cy - r * 1.12, r * .22, "#E8C24A", ow * .6, 5, .5); ell(ctx, cx - r * .3, cy - r * 1.02, r * .08, r * .08, "#E8C24A", ow * .5); ell(ctx, cx + r * .3, cy - r * 1.02, r * .08, r * .08, "#E8C24A", ow * .5); }
  } else if (P.hair === "hakim") {
    ctx.beginPath(); ctx.moveTo(cx - r * 1.0, cy - r * .05); ctx.quadraticCurveTo(cx - r * 1.05, cy - r * 1.1, cx - r * .1, cy - r * 1.12);
    ctx.quadraticCurveTo(cx + r * .2, cy - r * 1.75, cx + r * .75, cy - r * 1.62); // jambul
    ctx.quadraticCurveTo(cx + r * .35, cy - r * 1.35, cx + r * .45, cy - r * 1.08);
    ctx.quadraticCurveTo(cx + r * 1.05, cy - r * 1.0, cx + r * 1.0, cy - r * .05);
    ctx.quadraticCurveTo(cx + r * .8, cy - r * .55, cx + r * .2, cy - r * .62); ctx.lineTo(cx, cy - r * .45); ctx.lineTo(cx - r * .2, cy - r * .62);
    ctx.quadraticCurveTo(cx - r * .8, cy - r * .55, cx - r * 1.0, cy - r * .05);
    ctx.fillStyle = P.hairCol; ctx.fill(); ctx.lineWidth = ow; ctx.strokeStyle = INK; ctx.stroke();
    line(ctx, cx + r * .05, cy - r * 1.25, cx + r * .45, cy - r * 1.45, ow * .6, "#4A3E36");
  } else if (P.hair === "short" || P.hair === "side") {
    ctx.beginPath(); ctx.moveTo(cx - r * 1.0, cy); ctx.quadraticCurveTo(cx - r * 1.0, cy - r * 1.15, cx, cy - r * 1.15);
    ctx.quadraticCurveTo(cx + r * 1.0, cy - r * 1.15, cx + r * 1.0, cy);
    ctx.quadraticCurveTo(cx + r * .6, cy - r * .5, P.hair === "side" ? cx - r * .4 : cx, cy - r * .55); ctx.quadraticCurveTo(cx - r * .6, cy - r * .5, cx - r * 1.0, cy);
    ctx.fillStyle = P.hairCol; ctx.fill(); ctx.lineWidth = ow; ctx.strokeStyle = INK; ctx.stroke();
  } else if (P.hair === "buzz") {
    ctx.beginPath(); ctx.ellipse(cx, cy - r * .15, r * .97, r * .92, 0, Math.PI, TAU); ctx.fillStyle = shade(P.hairCol, .15); ctx.fill(); ctx.lineWidth = ow; ctx.strokeStyle = INK; ctx.stroke();
  } else if (P.hair === "bald") {
    ell(ctx, cx - r * .35, cy - r * .7, r * .25, r * .12, "#FFFFFF", 0, -.5);
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) ell(ctx, cx + s * r * (.9 + i * .04), cy - r * (.35 - i * .22), r * .16, r * .14, P.hairCol, ow * .6);
  }
  if (P.headband) rr(ctx, cx - r * 1.0, cy - r * .62, r * 2.0, r * .25, r * .1, P.headband, ow);
  if (P.hat === "songkok") { rr(ctx, cx - r * .92, cy - r * 1.42, r * 1.84, r * .78, r * .18, "#151215", ow); line(ctx, cx - r * .85, cy - r * .82, cx + r * .85, cy - r * .82, ow * .6, "#3A3540"); }
  // ciri muka
  face(ctx, cx, cy, r, P, f, ow);
}

function eye(ctx, x, y, r, P, f, side, ow) {
  const ex = r * .2, ey = r * .27, type = (f.wink && side > 0) ? "wink" : f.eyes;
  const col = P.eye || "#4A3224";
  const look = f.look || 0;
  if (type === "normal" || type === "half" || type === "sus" || type === "sleepy") {
    ell(ctx, x, y, ex, ey, "#FFFFFF", ow * .8);
    ell(ctx, x + look * ex * .3, y + ey * .12, ex * .72, ey * .78, col);
    ell(ctx, x + look * ex * .3, y + ey * .18, ex * .38, ey * .42, "#140C08");
    ell(ctx, x + look * ex * .3 - ex * .28, y - ey * .2, ex * .22, ey * .2, "#FFFFFF");
    ell(ctx, x + look * ex * .3 + ex * .25, y + ey * .4, ex * .1, ey * .09, "#FFFFFF");
    if (type !== "normal") { // kelopak
      const k = type === "sleepy" ? .62 : type === "half" ? .45 : .5;
      ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, ex * 1.05, ey * 1.05, 0, 0, TAU); ctx.clip();
      ctx.fillStyle = SKIN[P.skin][0]; ctx.fillRect(x - ex * 1.2, y - ey * 1.2, ex * 2.4, ey * 2.4 * k); ctx.restore();
      line(ctx, x - ex * 1.05, y - ey + ey * 2 * k, x + ex * 1.05, y - ey + ey * 2 * k, ow * 1.2);
    } else line(ctx, x - ex * 1.1, y - ey * .95, x + ex * 1.05, y - ey * 1.05, ow * 1.4);
    if (P.female) { line(ctx, x + side * ex * .9, y - ey * .9, x + side * ex * 1.35, y - ey * 1.25, ow * .9); }
  } else if (type === "closed" || type === "happy") {
    ctx.beginPath(); ctx.arc(x, y + ey * .3, ex * .9, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = ow * 1.4; ctx.strokeStyle = INK; ctx.lineCap = "round"; ctx.stroke();
  } else if (type === "wink") {
    ctx.beginPath(); ctx.moveTo(x - ex, y); ctx.lineTo(x + ex * .2, y + ey * .2); ctx.lineTo(x - ex * .9, y + ey * .5); ctx.lineWidth = ow * 1.4; ctx.strokeStyle = INK; ctx.lineJoin = "round"; ctx.stroke();
  } else if (type === "shock") {
    ell(ctx, x, y, ex * 1.15, ey * 1.15, "#FFFFFF", ow);
    ell(ctx, x, y, ex * .16, ey * .14, "#140C08");
  } else if (type === "star") {
    star(ctx, x, y, ex * 1.35, "#FFD23F", ow * .8); star(ctx, x - ex * .3, y - ey * .3, ex * .3, "#FFFFFF", 0, 4, .4);
  } else if (type === "money") {
    ell(ctx, x, y, ex * 1.1, ey * 1.05, "#FFFFFF", ow * .8);
    ctx.fillStyle = "#1E8E3E"; ctx.font = `900 ${ey * 1.6}px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("$", x, y + ey * .08);
  } else if (type === "diamond") {
    poly(ctx, [[x, y - ey * 1.1], [x + ex * 1.05, y], [x, y + ey * 1.1], [x - ex * 1.05, y]], "#7FE3F0", ow * .8);
    poly(ctx, [[x, y - ey * 1.1], [x + ex * .35, y], [x, y + ey * 1.1], [x - ex * .35, y]], "#C9F6FB");
  } else if (type === "spiral") {
    ell(ctx, x, y, ex * 1.05, ey * 1.05, "#FFFFFF", ow * .8);
    ctx.beginPath(); for (let a = 0; a < TAU * 2.2; a += .2) { const rr_ = a / (TAU * 2.2) * ex * .9; ctx.lineTo(x + Math.cos(a) * rr_, y + Math.sin(a) * rr_ * 1.2); }
    ctx.lineWidth = ow * .7; ctx.strokeStyle = INK; ctx.stroke();
  } else if (type === "heart") {
    heart(ctx, x, y + ey * .2, ex * 1.2, "#FF5C8A", ow * .6);
  }
}

function face(ctx, cx, cy, r, P, f, ow) {
  const ey = cy + r * .12, ex = r * .4;
  if (f.glassesBehind !== true) {}
  eye(ctx, cx - ex, ey, r, P, f, -1, ow); eye(ctx, cx + ex, ey, r, P, f, 1, ow);
  // kening
  const bw = (P.brow || 1) * ow * 1.4, by = ey - r * .43;
  const browType = f.brow || (f.eyes === "shock" ? "up" : f.eyes === "sus" ? "angry" : "normal");
  for (const s of [-1, 1]) {
    const x0 = cx + s * ex * .45, x1 = cx + s * ex * 1.45;
    let y0 = by, y1 = by;
    if (browType === "up") { y0 -= r * .18; y1 -= r * .12; }
    if (browType === "angry") { y0 += r * .1; y1 -= r * .06; }
    if (browType === "worried") { y0 -= r * .1; y1 += r * .06; }
    line(ctx, x0, y0, x1, y1, bw);
  }
  // hidung
  line(ctx, cx + r * .02, cy + r * .38, cx - r * .05, cy + r * .46, ow * .8);
  if (P.mole) ell(ctx, cx + ex + r * .05, ey + r * .33, r * .04, r * .04, "#3B2A20");
  // mulut
  const my = cy + r * .66, m = f.mouth, lip = P.lips || "#8E3B3B";
  ctx.lineWidth = ow * 1.2; ctx.strokeStyle = INK; ctx.lineCap = "round";
  if (f.talk !== undefined && m === "talk") {
    const a = clamp(f.talk);
    if (a < .08) { ctx.beginPath(); ctx.arc(cx, my - r * .08, r * .22, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); }
    else { ell(ctx, cx, my, r * (.18 + a * .08), r * (.05 + a * .2), "#7A2A2A", ow); ell(ctx, cx, my + r * (.02 + a * .1), r * .1, r * a * .07, "#E86B6B"); }
  } else if (m === "smile") { ctx.beginPath(); ctx.arc(cx, my - r * .14, r * .26, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); }
  else if (m === "grin") {
    ctx.beginPath(); ctx.moveTo(cx - r * .34, my - r * .06); ctx.quadraticCurveTo(cx, my + r * .38, cx + r * .34, my - r * .06); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); line(ctx, cx - r * .3, my + r * .02, cx + r * .3, my + r * .02, ow * .6);
  } else if (m === "open") { ell(ctx, cx, my + r * .05, r * .2, r * .17, "#7A2A2A", ow); ell(ctx, cx, my + r * .13, r * .11, r * .06, "#E86B6B"); }
  else if (m === "o") { ell(ctx, cx, my, r * .09, r * .11, "#7A2A2A", ow); }
  else if (m === "jaw") { ell(ctx, cx, my + r * .35, r * .26, r * .5, "#7A2A2A", ow); ell(ctx, cx, my + r * .62, r * .16, r * .14, "#E86B6B"); }
  else if (m === "flat") { line(ctx, cx - r * .18, my, cx + r * .18, my, ow * 1.2); }
  else if (m === "smirk") { ctx.beginPath(); ctx.moveTo(cx - r * .2, my); ctx.quadraticCurveTo(cx + r * .1, my + r * .08, cx + r * .26, my - r * .1); ctx.stroke(); }
  else if (m === "wavy") { ctx.beginPath(); for (let i = 0; i <= 8; i++) ctx.lineTo(cx - r * .26 + i * r * .065, my + (i % 2 ? r * .06 : -r * .04)); ctx.stroke(); }
  else if (m === "lips") { ctx.beginPath(); ctx.arc(cx, my - r * .1, r * .2, .22 * Math.PI, .78 * Math.PI); ctx.lineWidth = ow * 1.6; ctx.strokeStyle = lip; ctx.stroke(); }
  if (P.female && (m === "smile" || m === "lips")) { ctx.beginPath(); ctx.arc(cx, my - r * .1, r * .2, .22 * Math.PI, .78 * Math.PI); ctx.lineWidth = ow * 1.5; ctx.strokeStyle = lip; ctx.stroke(); }
  if (P.moustache) { ctx.beginPath(); ctx.moveTo(cx, my - r * .2); ctx.quadraticCurveTo(cx - r * .3, my - r * .32, cx - r * .48, my + r * .02); ctx.quadraticCurveTo(cx - r * .2, my - r * .1, cx, my - r * .1);
    ctx.quadraticCurveTo(cx + r * .2, my - r * .1, cx + r * .48, my + r * .02); ctx.quadraticCurveTo(cx + r * .3, my - r * .32, cx, my - r * .2); ctx.fillStyle = P.moustache; ctx.fill(); ctx.lineWidth = ow * .8; ctx.strokeStyle = INK; ctx.stroke(); }
  if (P.beard) { ctx.beginPath(); ctx.moveTo(cx - r * .7, cy + r * .5); ctx.quadraticCurveTo(cx, cy + r * 1.55, cx + r * .7, cy + r * .5); ctx.quadraticCurveTo(cx, cy + r * 1.05, cx - r * .7, cy + r * .5);
    ctx.fillStyle = P.beard; ctx.fill(); ctx.lineWidth = ow * .8; ctx.strokeStyle = INK; ctx.stroke(); }
  if (P.glasses === "square") for (const s of [-1, 1]) rr(ctx, cx + s * ex - r * .28, ey - r * .24, r * .56, r * .45, r * .06, "rgba(255,255,255,.12)", ow * 1.6);
  if (P.glasses === "square") line(ctx, cx - ex + r * .28, ey - r * .05, cx + ex - r * .28, ey - r * .05, ow * 1.4);
  if (f.shades) { for (const s of [-1, 1]) rr(ctx, cx + s * ex - r * .32, ey - r * .22, r * .64, r * .4, r * .14, "#111", ow); line(ctx, cx - ex + r * .3, ey - r * .1, cx + ex - r * .3, ey - r * .1, ow * 1.4); line(ctx, cx - ex - r * .35, ey - r * .14, cx + ex - r * .5, ey - r * .14, ow * .6, "rgba(255,255,255,.5)"); }
  if (f.blush) { ctx.save(); ctx.globalAlpha = .55; for (const s of [-1, 1]) { ell(ctx, cx + s * r * .58, cy + r * .45, r * .2, r * .1, "#FF6F8E"); for (let i = 0; i < 3; i++) line(ctx, cx + s * r * .58 - r * .12 + i * r * .1, cy + r * .4, cx + s * r * .58 - r * .16 + i * r * .1, cy + r * .5, ow * .6, "#D9405F"); } ctx.restore(); }
  if (f.sweat) sweat(ctx, cx + r * .95, cy - r * .55, r * .32 * f.sweat);
  if (f.vein) { for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line(ctx, cx + r * .55 + dx * r * .06, cy - r * .7 + dy * r * .06, cx + r * .55 + dx * r * .16, cy - r * .7 + dy * r * .16, ow * 1.2, "#D93A3A"); }
  if (f.shadow) { ctx.save(); ctx.globalAlpha = .45 * f.shadow; ctx.beginPath(); ctx.ellipse(cx, cy, r * .97, r * 1.04, 0, Math.PI, TAU); ctx.lineTo(cx + r, cy + r * .15); ctx.lineTo(cx - r, cy + r * .15); ctx.fillStyle = "#1A1240"; ctx.fill(); ctx.restore(); }
}

function sweat(ctx, x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y - s * 1.2); ctx.quadraticCurveTo(x + s * .9, y + s * .2, x, y + s * .7); ctx.quadraticCurveTo(x - s * .9, y + s * .2, x, y - s * 1.2);
  ctx.fillStyle = "#9FD8FF"; ctx.fill(); ctx.lineWidth = Math.max(2, s * .12); ctx.strokeStyle = INK; ctx.stroke(); ell(ctx, x - s * .2, y + s * .15, s * .15, s * .22, "#FFFFFF");
}

// ---------- prop ----------
function prop(ctx, k, x, y, h, t, side) {
  const u = h * .1, ow = Math.max(2, h * .01);
  switch (k) {
    case "cup": rr(ctx, x - u * .35, y - u * .55, u * .7, u * .75, u * .12, "#F7F3EA", ow); rr(ctx, x - u * .3, y - u * .5, u * .6, u * .14, u * .05, "#6B3E26"); break;
    case "phone": rr(ctx, x - u * .38, y - u * .9, u * .76, u * 1.3, u * .12, "#1F1F28", ow); ctx.save(); ctx.globalAlpha = .8 + .2 * Math.sin(t * 30); rr(ctx, x - u * .3, y - u * .8, u * .6, u * 1.1, u * .08, "#FF7EB0"); ctx.restore(); heart(ctx, x, y - u * .2, u * .22, "#FFFFFF"); break;
    case "bouquet": for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; ell(ctx, x + Math.cos(a) * u * .35, y - u * .9 + Math.sin(a) * u * .25, u * .22, u * .22, ["#E23B5A", "#FF6F91", "#FFFFFF"][i % 3], ow * .6); } line(ctx, x, y - u * .6, x, y + u * .2, u * .25, "#4E9A4E"); poly(ctx, [[x - u * .4, y - u * .55], [x + u * .4, y - u * .55], [x + u * .12, y + u * .25], [x - u * .12, y + u * .25]], "#F2D7E3", ow * .7); break;
    case "bouquetW": for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; ell(ctx, x + Math.cos(a) * u * .32, y - u * .55 + Math.sin(a) * u * .22, u * .2, u * .2, ["#FFFFFF", "#F6EBD0"][i % 2], ow * .6); } break;
    case "gift": rr(ctx, x - u * .5, y - u * .8, u, u * .8, u * .06, "#E85D75", ow); line(ctx, x, y - u * .8, x, y, u * .14, "#FFD23F"); line(ctx, x - u * .5, y - u * .4, x + u * .5, y - u * .4, u * .14, "#FFD23F"); break;
    case "choc": rr(ctx, x - u * .55, y - u * .3, u * 1.1, u * .5, u * .05, "#6B3E26", ow); rr(ctx, x - u * .55, y - u * .3, u * .45, u * .5, u * .05, "#C9302C", ow * .6); break;
    case "menu": rr(ctx, x - u * .9, y - u * 1.4, u * 1.8, u * 1.6, u * .08, "#C0392B", ow); rr(ctx, x - u * .7, y - u * 1.2, u * 1.4, u * .3, u * .05, "#F7E7B4"); break;
    case "dumbbell": line(ctx, x - u * 1.0, y, x + u * 1.0, y, u * .16, "#888"); for (const s of [-1, 1]) rr(ctx, x + s * u * 1.0 - u * .2, y - u * .4, u * .4, u * .8, u * .08, "#3A3A3A", ow); break;
    case "umbrella": line(ctx, x, y, x, y - u * 3.2, u * .1, INK); ctx.beginPath(); ctx.arc(x, y - u * 3.1, u * 2.2, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = "#3FB6B0"; ctx.fill(); ctx.lineWidth = ow; ctx.strokeStyle = INK; ctx.stroke(); break;
    case "card": rr(ctx, x - u * .75, y - u * 1.0, u * 1.5, u * .95, u * .1, "#141414", ow); rr(ctx, x - u * .55, y - u * .8, u * .35, u * .25, u * .04, "#E1B53C"); star(ctx, x + u * .45, y - u * .82, u * .18, "#FFFFFF", 0, 4, .35); break;
    case "handbag": rr(ctx, x - u * .7, y - u * .3, u * 1.4, u * 1.0, u * .12, "#1B1716", ow); ctx.beginPath(); ctx.arc(x, y - u * .3, u * .45, Math.PI, TAU); ctx.lineWidth = u * .12; ctx.strokeStyle = "#1B1716"; ctx.stroke(); rr(ctx, x - u * .12, y - u * .1, u * .24, u * .14, u * .03, "#E1B53C"); break;
    case "hanky": ell(ctx, x, y - u * .1, u * .35, u * .3, "#FFFFFF", ow * .7); break;
    case "trays": for (let i = 0; i < 5; i++) { const sw = Math.sin(t * 9 + i * .6) * u * .12 * i; rr(ctx, x - u * 1.1 + sw, y - u * (.35 + i * .45), u * 2.2, u * .18, u * .06, "#C0C4CC", ow * .7); ell(ctx, x + sw, y - u * (.48 + i * .45), u * .6, u * .14, ["#F5B041", "#E74C3C", "#F7DC6F"][i % 3]); } break;
    case "gowns": for (let i = 0; i < 3; i++) { const dx = (i - 1) * u * .6; poly(ctx, [[x + dx - u * .2, y - u * 1.6], [x + dx + u * .2, y - u * 1.6], [x + dx + u * .55, y + u * .6], [x + dx - u * .55, y + u * .6]], ["#FFFFFF", "#F6E7C1", "#FCEFF4"][i], ow * .7); } break;
    case "fingerGun": { // tunjuk ke arah penonton: telunjuk mendatar + ibu jari ke atas
      const k = u * 1.0; ctx.save(); ctx.translate(x, y); ctx.scale(side, 1);
      rr(ctx, -k * .1, -k * .38, k * 1.25, k * .3, k * .15, "#E7B48F", ow); // telunjuk
      rr(ctx, -k * .1, -k * .62, k * .26, k * .5, k * .13, "#E7B48F", ow); // ibu jari
      rr(ctx, -k * .45, -k * .35, k * .75, k * .7, k * .25, "#E7B48F", ow); // genggaman
      for (let i = 0; i < 2; i++) line(ctx, -k * .05, -k * (.05 - i * .17), k * .28, -k * (.05 - i * .17), ow * .8);
      ctx.restore(); break; }
    case "thumbsUp": { // genggaman melintang, ibu jari ke atas di sisi
      const k = u * 1.0; ctx.save(); ctx.translate(x, y);
      rr(ctx, -k * .42, -k * .3, k * .84, k * .62, k * .2, "#E7B48F", ow);
      for (let i = 0; i < 3; i++) line(ctx, k * .05, -k * (.15 - i * .17), k * .38, -k * (.15 - i * .17), ow * .8);
      ctx.save(); ctx.translate(-k * .28, -k * .3); ctx.rotate(-.18); rr(ctx, -k * .14, -k * .55, k * .3, k * .62, k * .15, "#E7B48F", ow); ctx.restore();
      ctx.restore(); break; }
    case "ring": ell(ctx, x, y - u * .2, u * .25, u * .25, null, 0); ctx.lineWidth = u * .08; ctx.strokeStyle = "#E1B53C"; ctx.stroke(); star(ctx, x, y - u * .5, u * .15, "#BFF3FF", ow * .4, 4, .5); break;
  }
}

// ---------- kesan ----------
function speedLines(ctx, cx, cy, n, seed, t, col = "rgba(255,255,255,.85)", inner = 360) {
  const r = rng(seed); ctx.save(); ctx.strokeStyle = col; ctx.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, w = 3 + r() * 9, d0 = inner + r() * 260 + ((t * 2400 + r() * 900) % 400), len = 140 + r() * 380;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * d0, cy + Math.sin(a) * d0); ctx.lineTo(cx + Math.cos(a) * (d0 + len), cy + Math.sin(a) * (d0 + len)); ctx.stroke();
  }
  ctx.restore();
}
function hLines(ctx, n, seed, t, dir = 1, col = "rgba(255,255,255,.7)") {
  const r = rng(seed); ctx.save(); ctx.strokeStyle = col; ctx.lineCap = "round";
  for (let i = 0; i < n; i++) { const y = r() * H, len = 200 + r() * 500, x = ((r() * W * 2 + t * 3000 * dir) % (W * 2 + len)) - len; ctx.lineWidth = 3 + r() * 6; line(ctx, x, y, x + len, y, ctx.lineWidth, col); }
  ctx.restore();
}
function sparkles(ctx, n, seed, t, area = [0, 0, W, H], col = "#FFF6C8") {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = area[0] + r() * area[2], y = area[1] + r() * area[3], ph = r() * TAU, s = (18 + r() * 30) * (.5 + .5 * Math.sin(t * 6 + ph)); if (s > 4) star(ctx, x, y, s, col, 0, 4, .25); }
}
function petals(ctx, n, seed, t, col = ["#FF9EB8", "#FFC4D3", "#FFFFFF"]) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = (r() * W + Math.sin(t * 1.5 + i) * 60), y = ((r() * H + t * (120 + r() * 160)) % (H + 100)) - 50; ell(ctx, x, y, 14, 8, col[i % col.length], 2, t * 2 + i); }
}
function confetti(ctx, n, seed, t) {
  const r = rng(seed), cols = ["#E85D75", "#4F8FD6", "#59B36A", "#FFFFFF", "#8E6CC8", "#F2994A"];
  for (let i = 0; i < n; i++) { const x = r() * W + Math.sin(t * 2 + i) * 40, y = ((r() * H + t * (90 + r() * 120)) % (H + 60)) - 30; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i); rr(ctx, -10, -5, 20, 10, 2, cols[i % cols.length]); ctx.restore(); }
}
function puff(ctx, x, y, r, col = "#EDEDED", a = 1) {
  ctx.save(); ctx.globalAlpha = a; for (const [dx, dy, k] of [[0, 0, 1], [-.8, .2, .7], [.8, .25, .75], [-.4, -.5, .65], [.45, -.45, .6]]) ell(ctx, x + dx * r, y + dy * r, r * k, r * k, col, Math.max(2, r * .05)); ctx.restore();
}
function bill(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -s, -s * .5, s * 2, s, s * .1, "#7BC67B", 3); ell(ctx, 0, 0, s * .3, s * .3, "#5AA65A", 2); ctx.restore(); }
function bolt(ctx, x, y, s, col = "#FFD23F") { poly(ctx, [[x, y - s], [x - s * .45, y + s * .1], [x - s * .05, y + s * .1], [x - s * .3, y + s], [x + s * .45, y - s * .2], [x + s * .05, y - s * .2]], col, 4); }
function flash(ctx, a, col = "#FFFFFF") { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function burst(ctx, cx, cy, col1, col2, n = 24, rot = 0) {
  ctx.fillStyle = col1; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.fillStyle = col2;
  for (let i = 0; i < n; i++) { const a0 = rot + i / n * TAU, a1 = a0 + TAU / n / 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0) * 3000, cy + Math.sin(a0) * 3000); ctx.lineTo(cx + Math.cos(a1) * 3000, cy + Math.sin(a1) * 3000); ctx.closePath(); ctx.fill(); }
}
function vignette(ctx, a, col = "0,0,0") { const g = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function skyGrad(ctx, stops, y0 = 0, y1 = H) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([p, c]) => g.addColorStop(p, c)); ctx.fillStyle = g; ctx.fillRect(-W * 2, -H * 2, W * 5, H * 5); }

// ---------- teks ----------
function wrapWords(ctx, words, maxW) {
  const lines = [[]]; for (const w of words) { const L = lines[lines.length - 1]; const test = [...L, w].map(x => x.t).join(" "); if (ctx.measureText(test).width > maxW && L.length) lines.push([w]); else L.push(w); } return lines;
}
function subtitle(ctx, text, alpha = 1, pop = 1) {
  if (!text) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const fs = 62; ctx.font = `900 ${fs}px Inter`; ctx.textBaseline = "alphabetic"; ctx.lineJoin = "round";
  const words = text.split(/\s+/).map(t => ({ t, cap: /[A-Z]{2,}/.test(t) && t === t.toUpperCase() }));
  const maxW = W * .74, lines = wrapWords(ctx, words, maxW), cx = W * .465, top = H * .63;
  ctx.translate(cx, top); ctx.scale(pop, pop);
  lines.forEach((L, i) => {
    const s = L.map(x => x.t).join(" "), wTot = ctx.measureText(s).width; let x = -wTot / 2; const y = i * fs * 1.18 + fs;
    for (const w of L) { const ww = ctx.measureText(w.t + " ").width;
      ctx.lineWidth = 14; ctx.strokeStyle = "#000"; ctx.strokeText(w.t, x, y); ctx.fillStyle = w.cap ? "#FFD23F" : "#FFFFFF"; ctx.fillText(w.t, x, y); x += ww; }
  });
  ctx.restore();
}
function bigText(ctx, text, x, y, size, fill = "#FFD23F", s = 1, rot = 0, stroke = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.font = `900 ${size}px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
  ctx.lineWidth = size * .22; ctx.strokeStyle = stroke; ctx.strokeText(text, 0, 0); ctx.lineWidth = size * .1; ctx.strokeStyle = "#FFFFFF"; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
}
