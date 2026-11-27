// Latar belakang lokasi (lukisan 2D rata). Koordinat dunia 1080x1920, ada yang lebih lebar untuk pan.
/* eslint-disable no-unused-vars */
function ground(ctx, y, col, x0 = -W, x1 = W * 3) { ctx.fillStyle = col; ctx.fillRect(x0, y, x1 - x0, H * 3); }
function clouds(ctx, t, seed = 3, y0 = 120, n = 5) {
  const r = rng(seed); for (let i = 0; i < n; i++) { const x = ((r() * W * 1.6 + t * (12 + r() * 20)) % (W * 1.8)) - W * .3, y = y0 + r() * 380, s = 50 + r() * 60; puff(ctx, x, y, s, "#FFFFFF", .95); }
}
function tree(ctx, x, y, s, col = "#4E9A4E") { rr(ctx, x - s * .1, y - s * .9, s * .2, s * .9, s * .05, "#7A5232", 3); puff(ctx, x, y - s * 1.1, s * .5, col, 1); }
function palm(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * .15, y - s * .7, x + s * .05, y - s * 1.4); ctx.lineWidth = s * .09; ctx.strokeStyle = "#8A6A44"; ctx.stroke();
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .55; ctx.beginPath(); ctx.moveTo(x + s * .05, y - s * 1.4); ctx.quadraticCurveTo(x + Math.cos(a) * s * .5, y - s * 1.6 + Math.sin(a) * s * .2, x + Math.cos(a) * s * .75, y - s * 1.25 + Math.abs(Math.cos(a)) * s * .25); ctx.lineWidth = s * .08; ctx.strokeStyle = "#3E8E41"; ctx.stroke(); } }

function skyline(ctx, base, s = 1, col = "#8FB8D9") {
  const r = rng(11); ctx.fillStyle = col;
  for (let x = -200; x < W + 200; x += 70 * s) { const h = (120 + r() * 300) * s; ctx.fillRect(x, base - h, 64 * s, h + 10); }
}
function twinTowers(ctx, x, base, s = 1) {
  for (const dx of [-90, 90]) {
    const cx = x + dx * s, col = "#C9D6E3", sh = "#9FB3C8";
    poly(ctx, [[cx - 55 * s, base], [cx + 55 * s, base], [cx + 45 * s, base - 700 * s], [cx + 30 * s, base - 820 * s], [cx + 12 * s, base - 900 * s], [cx - 12 * s, base - 900 * s], [cx - 30 * s, base - 820 * s], [cx - 45 * s, base - 700 * s]], col, 4 * s);
    poly(ctx, [[cx, base], [cx + 55 * s, base], [cx + 45 * s, base - 700 * s], [cx + 30 * s, base - 820 * s], [cx + 12 * s, base - 900 * s], [cx, base - 900 * s]], sh);
    line(ctx, cx, base - 900 * s, cx, base - 1060 * s, 8 * s, "#7F93A8");
    for (let y = base - 60 * s; y > base - 680 * s; y -= 46 * s) line(ctx, cx - 44 * s, y, cx + 44 * s, y, 2 * s, "rgba(43,30,26,.25)");
  }
  rr(ctx, x - 50 * s, base - 470 * s, 100 * s, 22 * s, 6 * s, "#9FB3C8", 3 * s); // jambatan
}
function kltower(ctx, x, base, s = 1) {
  poly(ctx, [[x - 20 * s, base], [x + 20 * s, base], [x + 10 * s, base - 560 * s], [x - 10 * s, base - 560 * s]], "#C9D6E3", 4 * s);
  ell(ctx, x, base - 590 * s, 55 * s, 42 * s, "#9FB3C8", 4 * s); line(ctx, x, base - 630 * s, x, base - 800 * s, 6 * s, "#7F93A8");
}
function terraceRow(ctx, x0, base, n, s = 1, seed = 5, dusk = 0) {
  const r = rng(seed), cols = ["#F7C8C8", "#C8E3F7", "#F7EBC0", "#D3F0D0", "#E6D3F7", "#FFD9B3"];
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 300 * s, c = shade(cols[Math.floor(r() * cols.length)], -dusk * .45);
    rr(ctx, x, base - 520 * s, 300 * s, 520 * s, 0, c, 4 * s);
    poly(ctx, [[x - 20 * s, base - 520 * s], [x + 150 * s, base - 660 * s], [x + 320 * s, base - 520 * s]], shade("#B5543C", -dusk * .4), 4 * s);
    for (const [wx, wy] of [[40, -460], [180, -460]]) rr(ctx, x + wx * s, base + wy * s, 80 * s, 90 * s, 6 * s, dusk > .5 ? "#FFE39A" : "#A9D6F5", 3 * s);
    rr(ctx, x + 40 * s, base - 260 * s, 90 * s, 160 * s, 4 * s, "#8C5A3C", 3 * s);
    rr(ctx, x + 170 * s, base - 250 * s, 90 * s, 90 * s, 4 * s, dusk > .5 ? "#FFE39A" : "#A9D6F5", 3 * s);
    // pagar
    ctx.strokeStyle = "#FFFFFF"; for (let k = 0; k < 15; k++) line(ctx, x + k * 20 * s, base - 90 * s, x + k * 20 * s, base, 5 * s, "#FFFFFF");
    line(ctx, x, base - 85 * s, x + 300 * s, base - 85 * s, 6 * s, "#FFFFFF");
    if (r() < .6) for (let k = 0; k < 4; k++) ell(ctx, x + (20 + k * 25) * s, base - 100 * s, 18 * s, 14 * s, "#E84393", 0);
  }
}
function road(ctx, y, h, col = "#6B6E75", stripe = true, x0 = -W, x1 = W * 3) {
  ctx.fillStyle = col; ctx.fillRect(x0, y, x1 - x0, h);
  if (stripe) for (let x = x0; x < x1; x += 160) rr(ctx, x, y + h / 2 - 6, 90, 12, 4, "#F4F4F2");
}
function shophouses(ctx, x0, base, n, s = 1, seed = 8, signs = true) {
  const r = rng(seed), cols = ["#F2D7B6", "#CFE3D4", "#F4C7A1", "#D6D6F2", "#F7E4A8"];
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 280 * s, c = cols[Math.floor(r() * cols.length)];
    rr(ctx, x, base - 900 * s, 280 * s, 900 * s, 0, c, 4 * s);
    for (let f = 0; f < 2; f++) for (let k = 0; k < 3; k++) rr(ctx, x + (25 + k * 85) * s, base - (840 - f * 220) * s, 60 * s, 120 * s, 6 * s, "#A9D6F5", 3 * s);
    if (signs) rr(ctx, x + 15 * s, base - 410 * s, 250 * s, 60 * s, 8 * s, ["#E74C3C", "#2E86AB", "#27AE60", "#F39C12"][i % 4], 3 * s);
    rr(ctx, x, base - 330 * s, 280 * s, 30 * s, 0, "#7A7F88", 3 * s); // kaki lima bumbung
    rr(ctx, x + 30 * s, base - 290 * s, 220 * s, 290 * s, 4 * s, "#3B3F48", 3 * s);
  }
}
function busStop(ctx, x, base, s = 1) {
  rr(ctx, x, base - 520 * s, 620 * s, 40 * s, 8 * s, "#2E86AB", 4 * s);
  for (const dx of [20, 580]) rr(ctx, x + dx * s, base - 480 * s, 20 * s, 480 * s, 4 * s, "#5A6270", 3 * s);
  rr(ctx, x + 60 * s, base - 170 * s, 500 * s, 24 * s, 6 * s, "#8A93A3", 3 * s);
}
function kampungHouse(ctx, x, base, s = 1) {
  for (const dx of [20, 140, 260, 380]) rr(ctx, x + dx * s, base - 160 * s, 20 * s, 160 * s, 3 * s, "#6B4A2E", 3 * s);
  rr(ctx, x, base - 520 * s, 420 * s, 360 * s, 0, "#6FBF73", 4 * s);
  for (let k = 0; k < 8; k++) line(ctx, x + k * 52 * s, base - 520 * s, x + k * 52 * s, base - 160 * s, 3 * s, "rgba(43,30,26,.3)");
  poly(ctx, [[x - 50 * s, base - 520 * s], [x + 210 * s, base - 760 * s], [x + 470 * s, base - 520 * s]], "#B5543C", 4 * s);
  rr(ctx, x + 60 * s, base - 440 * s, 110 * s, 120 * s, 4 * s, "#F7D046", 3 * s); rr(ctx, x + 250 * s, base - 440 * s, 110 * s, 120 * s, 4 * s, "#F7D046", 3 * s);
  rr(ctx, x + 160 * s, base - 160 * s, 100 * s, 30 * s, 2 * s, "#BDBDBD", 3 * s); rr(ctx, x + 175 * s, base - 130 * s, 70 * s, 130 * s, 2 * s, "#BDBDBD", 3 * s);
}
function stall(ctx, x, base, s = 1, col = "#2E86AB") {
  poly(ctx, [[x - 20 * s, base - 380 * s], [x + 320 * s, base - 380 * s], [x + 290 * s, base - 300 * s], [x + 10 * s, base - 300 * s]], col, 4 * s);
  for (let k = 0; k < 6; k++) poly(ctx, [[x + (k * 56 - 14) * s, base - 380 * s], [x + (k * 56 + 14) * s, base - 380 * s], [x + (k * 56 + 18) * s, base - 300 * s], [x + (k * 56 - 4) * s, base - 300 * s]], "#FFFFFF");
  for (const dx of [10, 280]) rr(ctx, x + dx * s, base - 300 * s, 12 * s, 300 * s, 2 * s, "#5A6270", 2 * s);
  rr(ctx, x, base - 150 * s, 300 * s, 30 * s, 4 * s, "#C49A6C", 3 * s);
  const r = rng(x | 0); for (let k = 0; k < 7; k++) ell(ctx, x + (25 + k * 40) * s, base - 165 * s, 18 * s, 16 * s, ["#E74C3C", "#27AE60", "#F39C12", "#8E44AD"][Math.floor(r() * 4)], 2 * s);
}
function mamakBg(ctx) {
  skyGrad(ctx, [[0, "#FFE7B8"], [1, "#F5C88A"]]);
  rr(ctx, 0, 300, W, 120, 0, "#2E7D5B", 4); // papan
  rr(ctx, 80, 470, 420, 260, 10, "#3B3F48", 6); ell(ctx, 290, 600, 60, 40, "#4CAF50"); // TV bola
  rr(ctx, 600, 470, 420, 330, 10, "#F7C873", 5); for (let k = 0; k < 4; k++) rr(ctx, 630 + k * 95, 520, 80, 60, 8, ["#E67E22", "#D35400", "#F4D03F", "#A04000"][k], 3);
  ell(ctx, 950, 380, 60, 60, "#DDD", 4); line(ctx, 950, 380, 1000, 330, 6); // kipas
  ground(ctx, 1150, "#C9B79C");
}
function gymBg(ctx) {
  skyGrad(ctx, [[0, "#DCE3EA"], [1, "#B9C4CF"]]);
  rr(ctx, 60, 260, 960, 700, 8, "#E8F4FB", 6); line(ctx, 100, 300, 300, 900, 10, "rgba(255,255,255,.8)"); // cermin
  for (let k = 0; k < 6; k++) { rr(ctx, 120 + k * 150, 1000, 110, 22, 6, "#5A6270", 3); for (const s of [-1, 1]) rr(ctx, 175 + k * 150 + s * 55 - 14, 985, 28, 52, 6, "#2F2F2F", 3); }
  ground(ctx, 1240, "#2B2B30");
}
function weddingStreet(ctx, t) {
  skyGrad(ctx, [[0, "#9ED8F7"], [1, "#E8F6FF"]]); clouds(ctx, t * 8, 4, 100, 4);
  const shops = [["#F8C8D8", "#E23B5A"], ["#FFFFFF", "#C9A0DC"], ["#FFE3B3", "#E67E22"]];
  shops.forEach(([c, a], i) => { const x = 30 + i * 345; rr(ctx, x, 380, 330, 900, 0, c, 5); rr(ctx, x + 20, 430, 290, 70, 10, a, 4);
    rr(ctx, x + 30, 620, 270, 380, 8, "#A9D6F5", 4);
    if (i === 0) for (let k = 0; k < 5; k++) { rr(ctx, x + 40 + k * 55, 1150, 44, 70, 4, "#8C8C8C", 3); for (let j = 0; j < 4; j++) ell(ctx, x + 50 + k * 55 + (j % 2) * 18, 1135 - j * 10, 14, 14, j % 2 ? "#FFFFFF" : "#E23B5A", 2); }
    if (i === 1) { poly(ctx, [[x + 165, 680], [x + 205, 760], [x + 250, 990], [x + 80, 990], [x + 125, 760]], "#FFFFFF", 4); ell(ctx, x + 165, 670, 26, 26, "#E6D3C2", 3); }
    if (i === 2) for (let k = 0; k < 3; k++) { rr(ctx, x + 50 + k * 85, 900, 70, 14, 4, "#C0C4CC", 3); ell(ctx, x + 85 + k * 85, 890, 30, 12, "#F5B041", 2); } });
  ground(ctx, 1280, "#B7B2A8");
}
function butikBg(ctx) {
  skyGrad(ctx, [[0, "#FDEFF4"], [1, "#F6D6E2"]]);
  ell(ctx, W / 2, 220, 110, 40, "#FFE9A8", 4); for (let k = -3; k <= 3; k++) line(ctx, W / 2 + k * 30, 250, W / 2 + k * 34, 320, 4, "#E1B53C");
  line(ctx, 40, 520, 1040, 520, 12, "#C9A66B");
  for (let k = 0; k < 9; k++) { const x = 90 + k * 112; line(ctx, x, 520, x, 560, 4); poly(ctx, [[x - 30, 560], [x + 30, 560], [x + 55, 900], [x - 55, 900]], ["#FFFFFF", "#F6E7C1", "#FCEFF4"][k % 3], 4); }
  rr(ctx, 760, 980, 280, 220, 10, "#D9B48F", 5); // meja
  ground(ctx, 1200, "#E8C9B8");
}
function dewanBg(ctx, t) {
  skyGrad(ctx, [[0, "#FFF5E1"], [1, "#F3DDB6"]]);
  for (let k = 0; k < 7; k++) { ctx.save(); ctx.globalAlpha = .7; ell(ctx, 80 + k * 160, 140, 40, 40, "#FFF1C1", 3); ctx.restore(); line(ctx, 80 + k * 160, 0, 80 + k * 160, 100, 3); }
  for (let i = 0; i < 3; i++) { const x = -260 + i * 800;
    rr(ctx, x + 40, 420, 640, 520, 30, "#FFFFFF", 5); ctx.beginPath(); ctx.arc(x + 360, 420, 320, Math.PI, TAU); ctx.fillStyle = "#F6E7C1"; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    for (let k = 0; k < 9; k++) ell(ctx, x + 60 + k * 75, 430, 26, 26, k % 2 ? "#FFFFFF" : "#E8C24A", 3);
    rr(ctx, x + 120, 820, 480, 120, 14, "#E8C24A", 5); }
  ground(ctx, 940, "#D8C3A0", -W, W * 3);
  for (let k = 0; k < 8; k++) ell(ctx, -200 + k * 330, 1160, 140, 50, "#FFFFFF", 4);
}
function officeNikahBg(ctx) {
  skyGrad(ctx, [[0, "#EAF2E3"], [1, "#D3E3C8"]]);
  rr(ctx, 620, 260, 360, 360, 8, "#FFFFFF", 5); rr(ctx, 620, 260, 360, 70, 8, "#2E7D5B", 5);
  for (let rI = 0; rI < 5; rI++) for (let c = 0; c < 7; c++) { rr(ctx, 640 + c * 48, 350 + rI * 52, 40, 42, 4, "#F7F7F7", 2); line(ctx, 646 + c * 48, 356 + rI * 52, 674 + c * 48, 386 + rI * 52, 5, "#E53935"); line(ctx, 674 + c * 48, 356 + rI * 52, 646 + c * 48, 386 + rI * 52, 5, "#E53935"); }
  rr(ctx, 80, 300, 240, 420, 10, "#FFFFFF", 5); for (let k = 0; k < 3; k++) line(ctx, 200, 300, 200, 720, 4);
  ground(ctx, 1180, "#BFA98A");
}
function desk(ctx, x, base, s = 1, stack = 1, t = 0) {
  rr(ctx, x - 300 * s, base - 260 * s, 600 * s, 60 * s, 8 * s, "#8C5A3C", 5 * s);
  rr(ctx, x - 280 * s, base - 200 * s, 40 * s, 200 * s, 4 * s, "#7A4E2D", 3 * s); rr(ctx, x + 240 * s, base - 200 * s, 40 * s, 200 * s, 4 * s, "#7A4E2D", 3 * s);
  for (const dx of [-200, 170]) for (let k = 0; k < 18 * stack; k++) { const sw = Math.sin(t * 5 + k * .4) * k * .6 * s; rr(ctx, x + dx * s + sw, base - (300 + k * 38) * s, 130 * s, 36 * s, 4 * s, k % 2 ? "#3E8E41" : "#5DB85F", 3 * s); }
}
function banglo(ctx, t) {
  skyGrad(ctx, [[0, "#FFC46B"], [.6, "#FFE7B0"], [1, "#FFF6DC"]]);
  ell(ctx, 860, 300, 110, 110, "#FFF1B8", 0);
  palm(ctx, 120, 1180, 520); palm(ctx, 980, 1150, 480);
  rr(ctx, 160, 520, 780, 640, 0, "#FFFFFF", 6); rr(ctx, 100, 480, 900, 50, 6, "#E6E6E6", 5); rr(ctx, 280, 360, 540, 130, 0, "#FFFFFF", 6); rr(ctx, 240, 330, 620, 40, 6, "#E6E6E6", 5);
  for (let k = 0; k < 4; k++) rr(ctx, 200 + k * 185, 600, 160, 240, 6, "#9AD7F5", 4); rr(ctx, 440, 900, 220, 260, 6, "#8FD0F0", 4);
  ground(ctx, 1160, "#8BCB6A"); rr(ctx, -50, 1230, 520, 130, 60, "#5BC0EB", 5);
  // kereta sport
  const cx = 700, cy = 1330; poly(ctx, [[cx - 260, cy], [cx - 230, cy - 80], [cx - 90, cy - 130], [cx + 120, cy - 130], [cx + 250, cy - 70], [cx + 270, cy]], "#E02424", 6);
  poly(ctx, [[cx - 70, cy - 120], [cx + 100, cy - 120], [cx + 170, cy - 80], [cx - 130, cy - 80]], "#2B2B38", 4);
  for (const dx of [-160, 170]) { ell(ctx, cx + dx, cy, 58, 58, "#1B1B1B", 5); ell(ctx, cx + dx, cy, 26, 26, "#C0C4CC", 3); }
  line(ctx, cx - 200, cy - 60, cx + 220, cy - 50, 4, "rgba(255,255,255,.6)");
}
function towerOffice(ctx, t) {
  skyGrad(ctx, [[0, "#8EC9F0"], [1, "#DDF0FB"]]);
  skyline(ctx, 1000, 1.1, "#B8D3E6"); twinTowers(ctx, 720, 1000, .55); kltower(ctx, 260, 1000, .7);
  for (let k = 0; k <= 5; k++) line(ctx, k * 216, 0, k * 216, 1250, 14, "#5A6270");
  line(ctx, 0, 1000, W, 1000, 10, "#5A6270");
  ground(ctx, 1250, "#E9E4DC"); for (let k = 0; k < 8; k++) line(ctx, k * 160 - 100, 1250, k * 260 - 400, 1920, 3, "rgba(43,30,26,.15)");
  rr(ctx, 300, 1120, 480, 70, 10, "#3B2A20", 5); // meja eksekutif
}
function studioBg(ctx, t) { burst(ctx, W / 2, H * .45, "#FFD23F", "#FFE27A", 28, t * .25); }

// ---------- Crush Dalam Diam ----------
function bougain(ctx, x, y, s, seed = 1) { const r = rng(seed); for (let i = 0; i < 14; i++) { const a = r() * TAU, d = r() * s; ell(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * .7, s * .22, s * .18, ["#FF5FA2", "#FF8CC0", "#E0408A"][i % 3], 0); } for (let i = 0; i < 6; i++) { const a = r() * TAU, d = r() * s; ell(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * .7, s * .16, s * .1, "#4E9A4E", 0, a); } }
function deskChair(ctx, x, y, s, top = "#D9A86C") {
  rr(ctx, x - 150 * s, y - 40 * s, 300 * s, 46 * s, 8 * s, top, 4 * s); rr(ctx, x - 140 * s, y + 6 * s, 280 * s, 70 * s, 4 * s, shade(top, -.25), 3 * s);
  for (const dx of [-130, 120]) rr(ctx, x + dx * s, y + 70 * s, 12 * s, 150 * s, 3 * s, "#2F6B4F", 3 * s);
}
function classroom(ctx, t, o = {}) {
  const dusk = o.dusk || 0;
  ctx.fillStyle = shade("#F6EBD5", -dusk * .25); ctx.fillRect(-W, -H, W * 3, H * 3);
  rr(ctx, 120, 330, 560, 330, 10, "#2F5D46", 7); rr(ctx, 120, 650, 560, 22, 4, "#B98A5A", 4); // papan hitam
  for (let i = 0; i < 3; i++) line(ctx, 170 + i * 30, 400 + i * 50, 420 + i * 40, 410 + i * 45, 5, "rgba(255,255,255,.5)");
  ell(ctx, 400, 250, 50, 50, "#FFFFFF", 5); line(ctx, 400, 250, 400, 220, 5); line(ctx, 400, 250, 422, 262, 5);
  rr(ctx, -120, 380, 200, 260, 6, "#E9C07A", 5); for (let i = 0; i < 4; i++) rr(ctx, -100 + (i % 2) * 90, 400 + Math.floor(i / 2) * 110, 70, 90, 3, ["#FFB3CF", "#A9D6F5", "#FFF1A8", "#C8F0C8"][i], 2);
  // tingkap kanan
  for (let i = 0; i < 2; i++) { const x = 740 + i * 260; rr(ctx, x, 250, 240, 520, 6, shade("#BFE6FA", -dusk * .1), 7);
    if (dusk) { const g = ctx.createLinearGradient(0, 250, 0, 770); g.addColorStop(0, "#FF9E6E"); g.addColorStop(1, "#FFD39A"); ctx.fillStyle = g; ctx.fillRect(x + 4, 254, 232, 512); }
    bougain(ctx, x + 120, 330, 90, i + 3); bougain(ctx, x + 40, 520, 70, i + 9);
    line(ctx, x + 120, 250, x + 120, 770, 8, "#2F6B4F"); line(ctx, x, 510, x + 240, 510, 8, "#2F6B4F"); rr(ctx, x, 250, 240, 520, 6, null, 7);
    const sw = Math.sin(t * 1.3 + i) * 12; poly(ctx, [[x - 20, 230], [x + 40, 230], [x + 30 + sw, 800], [x - 30 + sw, 800]], "#F7C6D9", 4); }
  ground(ctx, 1150, shade("#D9C2A0", -dusk * .2));
  for (let k = -6; k <= 6; k++) line(ctx, 540 + k * 60, 1150, 540 + k * 420, 2600, 3, "rgba(43,30,26,.12)");
  if (!o.noRays) rays(ctx, 1100, 200, 2.25, .5, 5, 1900, t, dusk ? "255,190,140" : "255,248,220", .2);
  if (o.desks !== false) { deskChair(ctx, 300, 1230, .8); deskChair(ctx, 780, 1230, .8); }
}
function schoolGate(ctx, t) {
  skyGrad(ctx, [[0, "#6B5BA8"], [.45, "#F08A8A"], [.8, "#FFC37A"], [1, "#FFE3A3"]], -200, 1150);
  ell(ctx, 300, 900, 120, 120, "#FFE9B0"); glow(ctx, 300, 900, 420, "255,214,160", .45);
  rr(ctx, -100, 560, 900, 560, 0, "#C98F7A", 5); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) rr(ctx, -60 + c * 140, 600 + r * 160, 90, 100, 6, "#FFD58A", 4);
  rr(ctx, -120, 520, 940, 50, 6, "#8E4E44", 5);
  tree(ctx, 900, 1150, 520, "#3E7C4A");
  ground(ctx, 1150, "#8A8D93");
  for (let x = -60; x < 1200; x += 46) line(ctx, x, 980, x, 1300, 10, "#2F6B4F");
  line(ctx, -60, 1000, 1200, 1000, 14, "#2F6B4F"); line(ctx, -60, 1270, 1200, 1270, 14, "#2F6B4F");
  rr(ctx, 360, 900, 90, 420, 8, "#E8DCC8", 6); rr(ctx, 700, 900, 90, 420, 8, "#E8DCC8", 6);
  ground(ctx, 1320, "#B7B2A8");
}
function cloudSky(ctx, t) {
  skyGrad(ctx, [[0, "#C7A6E8"], [.5, "#FFB3CF"], [1, "#FFE3EC"]]);
  sparkles(ctx, 26, 12, t, [0, 0, W, H], "#FFFFFF");
  const r = rng(5); for (let i = 0; i < 7; i++) { const x = ((r() * 1500 - t * (30 + r() * 30)) % 1500 + 1500) % 1500 - 200, y = 200 + r() * 1500; puff(ctx, x, y, 70 + r() * 60, "#FFFFFF", .9); }
}
