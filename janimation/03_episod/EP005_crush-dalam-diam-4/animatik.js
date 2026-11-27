// EP005 — Crush Dalam Diam #4 (episod akhir): Aku Suka Kau! Setiap fungsi: (ctx, lt, d, T, env).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, shade, ell, rr, poly, line, star, heart,
   cam, shake, person, head, PRESET, prop, speedLines, sparkles, petals, confetti, puff, flash, vignette, skyGrad, bigText, classroom, deskChair,
   bokeh, rays, glow, heartPattern, thought, beatHeart, lightLeak, sweat, blurred, bedroom, schoolGate, schoolGarden, bench, benchSeat, homeRoom,
   steam, soul, flowersBloom, talkAmt, grade, motes, polaroid, seated */

function scene2(ctx, c, bg, fg, blur = 0) {
  cam(ctx, { x: lerp(540, c.x ?? 540, .5), y: lerp(960, c.y ?? 960, .5), z: lerp(1, c.z || 1, .5), sx: c.sx, sy: c.sy, rot: c.rot }, () => (blur ? blurred(ctx, blur, bg) : bg(ctx)));
  cam(ctx, c, fg);
}
const GARDEN = (T, o) => c => schoolGarden(c, T, o);
const ABANG = Object.assign({}, PRESET["LELAKI-MISTERI"], { capShadow: false });
const IBU = { skin: "light", female: true, tudung: "#8FC9A8", eye: "#4A3224", lips: "#C2575F", top: { t: "kurung", c: "#F6D9A8" }, bot: { t: "skirt", c: "#C9A06A" }, shoe: "#8A6A4A" };
const AYAH = { skin: "tan", hair: "short", hairCol: "#2A2420", eye: "#3A2A1E", moustache: "#2A2420", top: { t: "shirt", c: "#C0553E" }, bot: { t: "pants", c: "#3B3F48" }, shoe: "#2B2B2B" };
function benchTwo(ctx, T, lt, fa, fb, o = {}) { // AMIR kiri, AINA kanan di bangku
  bench(ctx, 1980, 1);
  const a = person(ctx, o.ax ?? 330, 2150, 1300, Object.assign({ p: "AMIR", pose: "holdFront", t: T }, fa));
  const b = person(ctx, o.bx ?? 760, 2150, 1290, Object.assign({ p: "AINA", pose: "holdFront", t: T }, fb));
  benchSeat(ctx, 1660); return [a, b];
}
function heartsUp(ctx, lt, n, x0, y0, spread, col = "#FF6F91") { for (let i = 0; i < n; i++) { const k = ((lt * .5 + i / n) % 1); heart(ctx, x0 + Math.sin(i * 2.3 + lt) * spread, y0 - k * 700, 22 + 14 * k, col, 3); } }
function heartBurst(ctx, k, x, y) { if (k <= 0 || k >= 1) return; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = easeOut(k) * 620; ctx.save(); ctx.globalAlpha = 1 - k; heart(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r, 30 + 20 * (1 - k), ["#FF5C8A", "#FFB3CF", "#FFFFFF"][i % 3], 3); ctx.restore(); } }
function swirl(ctx, t, cx, cy, n = 26) { for (let i = 0; i < n; i++) { const a = t * .9 + i / n * TAU, r = 260 + 160 * Math.sin(i * 1.7) + 40 * Math.sin(t * 2 + i); ell(ctx, cx + Math.cos(a) * r * 1.2, cy + Math.sin(a) * r * .8, 16, 9, ["#FF8CC0", "#FFC4D3", "#FFFFFF"][i % 3], 2, a); } }
let _sil = null;
function silhouette(ctx, col, fn) { if (!_sil) { _sil = document.createElement("canvas"); _sil.width = W; _sil.height = H; }
  const o = _sil.getContext("2d"); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, W, H); o.setTransform(ctx.getTransform()); fn(o);
  o.setTransform(1, 0, 0, 1, 0, 0); o.globalCompositeOperation = "source-atop"; o.fillStyle = col; o.fillRect(0, 0, W, H); o.globalCompositeOperation = "source-over";
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(_sil, 0, 0); ctx.restore(); }
function wallCalendar(ctx, x, y, s, lt) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -150, -150, 300, 320, 14, "#FFFFFF", 6); rr(ctx, -150, -150, 300, 70, 14, "#E53935", 6);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const xx = -120 + c * 60, yy = -50 + r * 55; if (r * 5 + c < 12) { line(ctx, xx - 14, yy - 14, xx + 14, yy + 14, 5, "#E53935"); line(ctx, xx + 14, yy - 14, xx - 14, yy + 14, 5, "#E53935"); } else ell(ctx, xx, yy, 6, 6, "#BBB"); }
  ctx.lineWidth = 7; ctx.strokeStyle = "#FF3D6E"; ctx.beginPath(); ctx.ellipse(120 - 120 + 60 * 3 - 120 + 120, 115, 30, 26, 0, 0, TAU * Math.min(1, lt)); ctx.stroke(); ctx.restore(); }
function giftBox(ctx, x, y, s, open = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (open > 0) { glow(ctx, 0, -60, 360 * open, "255,230,170", .8); sparkles(ctx, 12, 5, t, [-300, -500, 600, 500], "#FFF6C8"); }
  rr(ctx, -170, -120, 340, 250, 16, "#FF8FB1", 7); line(ctx, 0, -120, 0, 130, 34, "#FFFFFF"); ctx.restore();
  ctx.save(); ctx.translate(x + open * 260, y - 140 - open * 520); ctx.rotate(open * 1.6); ctx.scale(s, s); rr(ctx, -190, -40, 380, 70, 16, "#FFB3CF", 7); line(ctx, 0, -40, 0, 30, 34, "#FFFFFF");
  ell(ctx, -50, -60, 60, 34, "#FFFFFF", 6, -.4); ell(ctx, 50, -60, 60, 34, "#FFFFFF", 6, .4); ctx.restore();
}
function photoOfUs(ctx) { ctx.fillStyle = "#FFD6E7"; ctx.fillRect(-125, -145, 250, 240); heart(ctx, 0, -100, 26, "#FF8FB1");
  ctx.save(); ctx.translate(-52, 0); head(ctx, 0, 0, 58, PRESET.AMIR, { eyes: "happy", mouth: "grin", blush: .8 }, 4, 600); ctx.restore();
  ctx.save(); ctx.translate(55, 4); head(ctx, 0, 0, 56, PRESET.AINA, { eyes: "happy", mouth: "smile", blush: .8 }, 4, 600); ctx.restore(); }

const SCENES = {
  SC01(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 1000, z: 1.05 + lt * .02 }, () => {
      bedroom(ctx, T); wallCalendar(ctx, 470, 470, .8, 0);
      person(ctx, 380, 1700, 1150, { p: "AMIR", pose: "hug", face: { eyes: "normal", mouth: "wavy", look: Math.sin(lt * 1.5), brow: "worried" }, t: T, shadow: false });
      rr(ctx, 230, 1380, 300, 220, 60, "#FFFFFF", 7); rr(ctx, -100, 1560, 900, 420, 40, "#C9B6E8", 7);
    });
    vignette(ctx, .45, "20,10,50");
  },
  SC02(ctx, lt, d, T) {
    const x = 540 + Math.sin(lt * 2.4) * 280, dir = Math.cos(lt * 2.4) < 0;
    cam(ctx, { x: 540, y: 1000, z: 1.03 }, () => { bedroom(ctx, T); wallCalendar(ctx, 470, 470, .8, 0);
      const w = Math.sin(lt * 10) * .25; person(ctx, x, 2150, 1350, { p: "AMIR", flip: dir, pose: { la: [.15 - w, .1], ra: [.15 + w, .1], ll: [w * .6, 0], rl: [-w * .6, 0] }, face: { eyes: "normal", mouth: "wavy", sweat: 1, brow: "worried" }, t: T }); });
    vignette(ctx, .4, "20,10,50");
  },
  SC03(ctx, lt, d, T) {
    const fist = lt > 2.0;
    cam(ctx, { x: fist ? 540 : 480, y: fist ? 1000 : 600, z: fist ? 1.1 : 1.7 }, () => {
      bedroom(ctx, T); wallCalendar(ctx, 470, 470, .8, prog(lt, .3, 1.4));
      person(ctx, 640, 2150, 1400, { p: "AMIR", pose: fist ? { la: [.12, .05], ra: [.55, 2.4] } : "stand", face: fist ? { eyes: "sparkle", mouth: "smirk", brow: "angry" } : { eyes: "normal", mouth: "o", look: -1 }, t: T });
    });
    if (fist) sparkles(ctx, 12, 3, lt, [400, 500, 500, 500], "#FFF3C4");
  },
  SC04(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 540, y: 1100, z: 1.02 + lt * .02 }, GARDEN(T), () => {
      benchTwo(ctx, T, lt, { pose: { la: [.3, 1.4], ra: [.55, 2.85] }, face: { eyes: "normal", mouth: ta > .04 ? "talk" : "wavy", talk: ta, look: 1, sweat: .5, blush: .4 } }, { face: { eyes: "sparkle", mouth: "smile", look: -1 } });
      motes(ctx, 24, 5, T, [0, 400, W, 1200]);
    }, 2);
    lightLeak(ctx, .25);
  },
  SC05(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 560, y: 1050, z: 1.1 }, GARDEN(T), () => {
      benchTwo(ctx, T, lt, { face: { eyes: "normal", mouth: "o", look: 1, brow: "up" } }, { pose: { la: [.3, 1.4], ra: [.4, 2.8] }, face: { eyes: "happy", mouth: ti > .04 ? "talk" : "open", talk: Math.max(.3, ti), blush: 1 }, rot: Math.sin(lt * 14) * .025 });
      bigText(ctx, "?", 360, 640, 110 * easeBack(prog(lt, .4, .7)), "#FFFFFF", 1, -.2);
      sparkles(ctx, 12, 4, lt, [600, 600, 400, 500], "#FFF3C4");
    }, 2);
  },
  SC06(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 950, z: 1.3 }, GARDEN(T), () => {
      person(ctx, 360, 2150, 1400, { p: "AINA", pose: "holdFront", face: { eyes: "happy", mouth: ti > .04 ? "talk" : "smile", talk: ti, blush: .8 }, t: T });
      thought(ctx, 770, 560, 420, 380, () => { skyGrad(ctx, [[0, "#FFF1C1"], [1, "#FFD6E7"]]);
        person(ctx, 770, 830, 380, { p: ABANG, pose: { la: [.12, .05], ra: [2.8, .3] }, face: { eyes: "happy", mouth: "grin" }, shadow: false }); });
    }, 4);
    bigText(ctx, "ABANG!", 770, 300, 92, "#FFD23F", easeBack(prog(lt, .1, .4)), .05);
  },
  SC07(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 1000, z: 1.02 + lt * .025 }, () => {
      homeRoom(ctx);
      person(ctx, 180, 2150, 1300, { p: AYAH, face: { eyes: "happy", mouth: "grin" }, t: T });
      person(ctx, 400, 2150, 1260, { p: IBU, pose: "holdFront", face: { eyes: "happy", mouth: "smile" }, t: T });
      person(ctx, 870, 2150, 1420, { p: ABANG, pose: { la: [.12, .05], ra: [lerp(.3, 1.0, prog(lt, .3, 1.2)), lerp(1.4, .6, prog(lt, .3, 1.2))] }, face: { eyes: "happy", mouth: "grin", look: -1 }, hold: lt < 1.6 ? { r: "giftPink" } : {}, t: T });
      person(ctx, 630, 2150, 1300, { p: "AINA", pose: lt > 1.6 ? "hug" : "stand", face: { eyes: "sparkle", mouth: "open", blush: 1 }, hold: lt > 1.6 ? { both: "giftPink" } : {}, t: T });
      if (lt > 1.6) heartsUp(ctx, lt, 6, 630, 900, 200);
    });
    grade(ctx, "#C8A070", .35, "multiply"); grade(ctx, "#FFE0B0", .2, "screen");
    ctx.save(); ctx.lineWidth = 60; ctx.strokeStyle = "#FBF6EC"; ctx.strokeRect(30, 30, W - 60, H - 60); ctx.restore(); vignette(ctx, .35, "60,40,20");
  },
  SC08(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR"), relief = lt > .8;
    scene2(ctx, { x: 540, y: 900, z: 1.45 }, GARDEN(T), () => {
      const pr = person(ctx, 540, 2150, 1450, { p: "AMIR", face: relief ? { eyes: "happy", mouth: ta > .04 ? "talk" : "grin", talk: ta, blush: .5 } : { eyes: "shock", mouth: ta > .04 ? "talk" : "o", talk: ta, brow: "up" }, t: T });
      if (relief) { ctx.save(); ctx.globalAlpha = 1 - prog(lt, .8, 1.6); soul(ctx, 540, pr.headY - 80 + prog(lt, .8, 1.6) * 200, lt); ctx.restore(); }
    }, 4);
  },
  SC09(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 540, y: 900, z: 1.45 }, GARDEN(T), () => {
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: { la: [.12, .05], ra: [.55, 2.85 + Math.sin(lt * 12) * .1] }, face: { eyes: "happy", mouth: ta > .04 ? "talk" : "grin", talk: ta, sweat: .9, blush: .8 }, t: T });
    }, 4);
  },
  SC10(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 900, z: 1.45, rot: .02 }, GARDEN(T), () => {
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: { la: [.12, .05], ra: [1.1, .5] }, face: { eyes: "normal", wink: lt > .5, mouth: ti > .04 ? "talk" : "smirk", talk: ti, blush: .7, look: -.5 }, t: T, rot: .03 });
      if (lt > .5) heart(ctx, 860, 760, 40 * easeBack(prog(lt, .5, .8)), "#FF5C8A", 4);
    }, 4);
  },
  SC11(ctx, lt, d, T) {
    const k = easeOut(prog(lt, .1, .4));
    scene2(ctx, { x: 540, y: 1000, z: 1.2 }, GARDEN(T, { pink: .5 }), () => {
      ctx.save(); ctx.translate(540, 2150); ctx.scale(lerp(1, .7, k), lerp(1, .7, k));
      person(ctx, 0, 0, 1400, { p: Object.assign({}, PRESET.AMIR, { skin: "light" }), pose: "cheeks", face: { eyes: "closed", mouth: "wavy", blush: 1.6 }, t: T }); ctx.restore();
      steam(ctx, 540, 2150 - 1400 * lerp(1, .7, k) * .98, T, 4);
    }, 3);
  },
  SC12(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 540, y: 900, z: 1.5 + lt * .03 }, GARDEN(T, { pink: .2 }), () => {
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: "holdFront", face: { eyes: "normal", mouth: ta > .04 ? "talk" : "flat", talk: ta, blush: .9, brow: "worried" }, t: T });
      petals(ctx, 14, 3, T, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]);
    }, 4);
  },
  SC13(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR"), st = lt * .6;
    scene2(ctx, { x: 540, y: 880, z: 1.55 + st * .1 }, GARDEN(T, { pink: lerp(.3, .85, prog(lt, 0, .8)) }), () => {
      glow(ctx, 540, 800, 700, "255,255,255", .55); bokeh(ctx, 22, 4, T);
      swirl(ctx, T, 540, 900);
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: "holdFront", face: { eyes: "sparkle", mouth: ta > .04 ? "talk" : "smile", talk: ta, blush: 1.2 }, t: T * .6 });
    }, 4);
    lightLeak(ctx, .35);
  },
  SC14(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 540, y: 900, z: 1.5 }, GARDEN(T, { pink: .6 }), () => {
      bokeh(ctx, 16, 7, T);
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: { la: [.35, 1.55], ra: [.35, 1.55] }, face: { eyes: "half", mouth: ta > .04 ? "talk" : "wavy", talk: ta, blush: 1.3, sweat: .4 }, t: T, rot: -.02 });
      petals(ctx, 18, 5, T, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]);
    }, 4);
    lightLeak(ctx, .3);
  },
  SC15(ctx, lt, d, T) {
    const sm = prog(lt, 1.2, 2.4);
    scene2(ctx, { x: 540, y: 900, z: 1.5 + lt * .04 }, GARDEN(T, { pink: .6 }), () => {
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: "holdFront", face: sm > 0 ? { eyes: "sparkle", mouth: "smile", blush: lerp(.6, 1.4, sm) } : { eyes: "normal", mouth: "o", blush: .6 }, t: T });
      beatHeart(ctx, 840, 1150, 70, T, 100);
    }, 4);
    if (lt < 1.2) { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .35; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  },
  SC16(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA"), love = T > 43.5;
    scene2(ctx, { x: 540, y: 880, z: 1.5 + lt * .04 }, c => { heartPattern(c, lt, "#FFE3EC", "#FFC0D6"); }, () => {
      rays(ctx, 540, 760, -Math.PI / 2, TAU, 16, 1500, T, "255,240,210", .25); glow(ctx, 540, 760, 650, "255,255,255", .65);
      flowersBloom(ctx, lt, 81, 16); bokeh(ctx, 20, 2, T);
      const pr = person(ctx, 540, 2150, 1450, { p: "AINA", pose: "hug", face: { eyes: love ? "sparkle" : "half", mouth: ti > .04 ? "talk" : "smile", talk: ti, blush: 1.4 }, t: T });
      ell(ctx, pr.headX - pr.hr * .62, pr.headY + pr.hr * .5 + prog(lt, 1, 3) * 40, 9, 14, "#9FD8FF", 3);
    });
    heartBurst(ctx, prog(T, 43.5, 44.7), W / 2, 820); lightLeak(ctx, .3);
  },
  SC17(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 900, z: 1.45 }, GARDEN(T), () => {
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: { la: [.35, 1.55], ra: [.35, 1.55] }, face: { eyes: "half", mouth: ti > .04 ? "talk" : "smile", talk: ti, blush: .8, brow: "worried" }, t: T });
      motes(ctx, 30, 9, T);
    }, 5);
    grade(ctx, "#FF9E6E", .18, "soft-light");
  },
  SC18(ctx, lt, d, T, env) {
    const ta = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 540, y: 900, z: 1.45 }, GARDEN(T), () => {
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: "holdFront", face: { eyes: "sparkle", mouth: ta > .04 ? "talk" : "o", talk: ta, blush: .8 }, t: T });
    }, 5);
  },
  SC19(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 950, z: 1.3 }, GARDEN(T), () => {
      person(ctx, 380, 2150, 1400, { p: "AINA", pose: lt > 2.8 ? { la: [.3, 1.4], ra: [.4, 2.8] } : { la: [.12, .05], ra: [1.2, .3] }, face: { eyes: "happy", mouth: ti > .04 ? "talk" : "open", talk: Math.max(.25, ti), blush: 1 }, t: T, rot: Math.sin(lt * 10) * .02 });
      thought(ctx, 780, 560, 440, 400, () => { skyGrad(ctx, [[0, "#1C1A3A"], [1, "#2E2A5A"]]); sparkles(ctx, 16, 2, lt, [560, 360, 440, 400], "#FFFFFF");
        ell(ctx, 720, 610, 90, 90, "#4F8FD6", 5); ell(ctx, 700, 580, 40, 26, "#59B36A"); ell(ctx, 745, 640, 30, 20, "#59B36A");
        ell(ctx, 880, 470, 46, 46, "#F5B041", 4); ctx.save(); ctx.translate(880, 470); ctx.rotate(-.3); ctx.beginPath(); ctx.ellipse(0, 0, 80, 18, 0, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = "#E8C24A"; ctx.stroke(); ctx.restore();
        const rx = lerp(640, 900, (lt % 2) / 2), ry = lerp(700, 420, (lt % 2) / 2); ctx.save(); ctx.translate(rx, ry); ctx.rotate(-.8); rr(ctx, -16, -40, 32, 80, 16, "#FFFFFF", 4); poly(ctx, [[-16, 30], [0, 70], [16, 30]], "#FF6B3D"); ctx.restore(); });
      if (lt > 2.6) bigText(ctx, "✗", 860, 480, 160 * easeBack(prog(lt, 2.6, 2.9)), "#FF3D6E", 1, 0);
    }, 3);
  },
  SC20(ctx, lt, d, T) {
    scene2(ctx, { x: 545, y: 1080, z: 1.05 }, GARDEN(T), () => {
      benchTwo(ctx, T, lt, { pose: { la: [.3, 1.4], ra: [.4, 2.8] }, face: { eyes: "happy", mouth: "open", blush: .8 }, rot: Math.sin(lt * 12) * .02 }, { pose: { la: [.3, 1.4], ra: [.4, 2.8] }, face: { eyes: "happy", mouth: "open", blush: 1 }, rot: Math.sin(lt * 12 + 1) * .02 });
      heartsUp(ctx, lt, 8, 545, 1000, 300); sparkles(ctx, 14, 7, lt, [100, 400, 880, 700], "#FFF3C4");
    }, 2);
    lightLeak(ctx, .3);
  },
  SC21(ctx, lt, d, T) {
    const give = prog(lt, .8, 2.2);
    scene2(ctx, { x: 560, y: 1050, z: 1.05 + lt * .03 }, c => schoolGate(c, T), () => {
      person(ctx, 330, 2150, 1380, { p: "AMIR", pose: give >= 1 ? "holdFront" : "stand", face: { eyes: "sparkle", mouth: give > .5 ? "o" : "smile", look: 1, blush: .7 }, hold: give >= 1 ? { both: "giftPink" } : {}, t: T });
      person(ctx, 760, 2150, 1360, { p: "AINA", pose: give < 1 ? { la: [.12, .05], ra: [lerp(.3, 1.0, give), lerp(1.4, .6, give)] } : "holdFront", face: { eyes: "sparkle", mouth: "smile", look: -1, blush: .9 }, hold: give < 1 ? { r: "giftPink" } : {}, t: T });
      motes(ctx, 26, 4, T); sparkles(ctx, 10, 3, lt, [300, 900, 500, 500], "#FFF3C4");
    }, 2);
    grade(ctx, "#FFB27A", .2, "soft-light");
  },
  SC22(ctx, lt, d, T, env) {
    const ti = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 900, z: 1.4 }, c => schoolGate(c, T), () => {
      glow(ctx, 540, 760, 600, "255,220,170", .5);
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: ti > .04 ? "talk" : "smile", talk: ti, blush: 1.1 }, t: T });
      giftBox(ctx, 540, 1420, .7, 0, T);
    }, 5);
    grade(ctx, "#FFB27A", .18, "soft-light"); lightLeak(ctx, .25);
  },
  SC23(ctx, lt, d, T) {
    const op = easeOut(prog(lt, .1, .6));
    cam(ctx, { x: 540, y: 1000, z: 1.05, ...shake(lt, lt > .1 && lt < .4 ? 6 : 0) }, () => {
      blurred(ctx, 6, c => schoolGate(c, T));
      for (const s of [-1, 1]) { ell(ctx, 540 + s * 330, 1350, 90, 110, "#E7B48F", 7); }
      giftBox(ctx, 540, 1250, 1.3, op, lt);
    });
    flash(ctx, .5 * (1 - prog(lt, .1, .35)), "#FFF6C8");
  },
  SC24(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 960, z: 1 + lt * .04 }, () => {
      skyGrad(ctx, [[0, "#FFE3EC"], [1, "#FFD1DF"]]); bokeh(ctx, 18, 3, T);
      ctx.save(); ctx.translate(700, 1150); ctx.rotate(.12); rr(ctx, -230, -150, 460, 300, 14, "#FFC7DA", 6); for (let i = 0; i < 4; i++) line(ctx, -180, -80 + i * 55, 180, -80 + i * 55, 5, "rgba(46,75,181,.55)"); heart(ctx, 160, 100, 24, "#FF3D6E"); ctx.restore();
      polaroid(ctx, 430, 760, 1.45 * easeBack(prog(lt, .1, .6)), -.08, () => photoOfUs(ctx));
      sparkles(ctx, 14, 9, lt, [100, 300, 880, 1100], "#FFFFFF");
    });
    lightLeak(ctx, .3);
  },
  SC25(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 960, z: 1.02 }, () => {
      skyGrad(ctx, [[0, "#FFE9F1"], [1, "#FFD6E4"]]);
      rr(ctx, 90, 260, 900, 900, 30, "#FFF7FA", 8); for (let i = 0; i < 9; i++) line(ctx, 150, 420 + i * 80, 930, 420 + i * 80, 3, "rgba(255,140,180,.35)");
      const L = ["Terima kasih sebab", "pernah buat hari-hari", "saya lebih bahagia."], len = [18, 21, 19], tot = 58, a0 = 70.49 - 70.356, a1 = 74.0 - 70.356;
      let done = 0; ctx.font = "italic 700 70px Inter"; ctx.fillStyle = "#C2185B";
      L.forEach((s, i) => { const k = clamp((prog(lt, a0, a1) * tot - done) / len[i]); done += len[i]; if (k <= 0) return; const w = ctx.measureText(s).width;
        ctx.save(); ctx.beginPath(); ctx.rect(150, 420 + i * 160 - 80, w * k + 10, 110); ctx.clip(); ctx.fillText(s, 150, 420 + i * 160); ctx.restore(); });
      if (lt > a1 - .2) { ctx.save(); ctx.globalAlpha = prog(lt, a1 - .2, a1 + .2); ctx.font = "italic 800 60px Inter"; ctx.fillText("— Aina", 560, 1000); heart(ctx, 880, 980, 34, "#FF3D6E", 3); ctx.restore(); }
      petals(ctx, 12, 4, T * .6, ["#FF8CC0", "#FFC4D3"]);
    });
  },
  SC26(ctx, lt, d, T) {
    scene2(ctx, { x: 560, y: 1000, z: 1.12 + lt * .03 }, c => schoolGate(c, T), () => {
      person(ctx, 330, 2150, 1380, { p: "AMIR", pose: "hug", face: { eyes: "sparkle", mouth: "smile", look: 1, blush: 1.1 }, t: T });
      polaroid(ctx, 330, 1420, .55, -.1, () => photoOfUs(ctx));
      person(ctx, 760, 2150, 1360, { p: "AINA", pose: "holdFront", face: { eyes: "happy", mouth: "smile", look: -1, blush: 1.1 }, t: T });
      heartsUp(ctx, lt, 6, 545, 1000, 160);
    }, 3);
    grade(ctx, "#FFB27A", .18, "soft-light"); lightLeak(ctx, .3);
  },
  SC27(ctx, lt, d, T) {
    const x = lerp(-40, 90, lt / d);
    cam(ctx, { x: 540, y: 960, z: 1 }, () => {
      skyGrad(ctx, [[0, "#3B2F6E"], [.45, "#E9799A"], [.8, "#FFB27A"], [1, "#FFD9A0"]]);
      ell(ctx, 540, 1330, 260, 260, "#FFE9B0"); glow(ctx, 540, 1330, 760, "255,200,140", .55);
      for (let i = 0; i < 4; i++) { const bx = ((i * 260 + lt * 60) % 1300) - 100, by = 420 + i * 70; ctx.beginPath(); ctx.moveTo(bx - 26, by); ctx.quadraticCurveTo(bx - 10, by - 18, bx, by); ctx.quadraticCurveTo(bx + 10, by - 18, bx + 26, by); ctx.lineWidth = 6; ctx.strokeStyle = "#2A1B3D"; ctx.stroke(); }
      ctx.fillStyle = "#2A1B3D"; ctx.fillRect(-W, 1520, W * 3, H); for (const tx of [-60, 70, 1010, 1140]) tree(ctx, tx, 1530, 360, "#2A1B3D");
      silhouette(ctx, "#2A1B3D", o => { const w1 = Math.sin(lt * 7) * .2; person(o, 450 + x, 1535, 640, { p: "AMIR", pose: { la: [.15 - w1, .1], ra: [.15 + w1, .1], ll: [w1 * .6, 0], rl: [-w1 * .6, 0] }, shadow: false });
        person(o, 600 + x, 1535, 620, { p: "AINA", pose: { la: [.15 + w1, .1], ra: [.15 - w1, .1], ll: [-w1 * .6, 0], rl: [w1 * .6, 0] }, shadow: false }); });
      heart(ctx, 525 + x, 780 + Math.sin(lt * 2) * 20, 46, "#FF8FB1", 4);
    });
  },
  SC28(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 960, z: 1.05 + lt * .03 }, () => {
      skyGrad(ctx, [[0, "#FFB3CF"], [.6, "#FFD6A8"], [1, "#FFF1C9"]]); bokeh(ctx, 24, 6, T); sparkles(ctx, 20, 3, lt, [0, 0, W, 1400], "#FFFFFF");
      glow(ctx, 540, 900, 520, "255,120,170", .55); beatHeart(ctx, 540, 900, 150, T, 80);
      person(ctx, 250, 2150, 1300, { p: "AMIR", pose: { la: [.12, .05], ra: [1.0, .9] }, face: { eyes: "sparkle", mouth: "smile", look: 1, blush: 1 }, t: T });
      person(ctx, 830, 2150, 1280, { p: "AINA", pose: { la: [1.0, .9], ra: [.12, .05] }, face: { eyes: "sparkle", mouth: "smile", look: -1, blush: 1 }, t: T });
      swirl(ctx, T, 540, 900, 18);
    });
    lightLeak(ctx, .3);
  },
  SC29(ctx, lt, d, T) {
    cam(ctx, { x: 620, y: 1050, z: 1.05 + lt * .02 }, () => {
      classroom(ctx, T, { desks: false }); bokeh(ctx, 16, 8, T);
      const look = Math.sin(lt * .9) > 0;
      seated(ctx, 450, 1640, 1300, { p: "AMIR", pose: "holdFront", face: { eyes: look ? "happy" : "sparkle", mouth: "grin", look: 1, blush: .9 }, t: T });
      seated(ctx, 860, 1640, 1300, { p: "AINA", pose: lt > 3.5 && lt < 4.6 ? { la: [.12, .05], ra: [2.2 + Math.sin(lt * 10) * .2, .4] } : "holdFront", face: { eyes: look ? "happy" : "sparkle", mouth: "smile", look: -1, blush: .9 }, t: T });
      petals(ctx, 20, 5, T, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]); heartsUp(ctx, lt, 5, 650, 1100, 200);
    });
    lightLeak(ctx, .3);
  },
  SC30(ctx, lt, d, T) {
    ctx.fillStyle = "#1A0F1F"; ctx.fillRect(0, 0, W, H);
    glow(ctx, W / 2, 820, 700, "255,110,170", .4); confetti(ctx, 30, 9, lt); sparkles(ctx, 20, 6, lt, [0, 0, W, H], "#FFD6E7");
    bigText(ctx, "TAMAT", W / 2, 560, 150, "#FFFFFF", easeBack(prog(lt, .05, .35)), -.03, "#E0407A");
    bigText(ctx, "CRUSH DALAM DIAM", W / 2, 740, 84, "#FF8FB1", easeBack(prog(lt, .25, .55)), .02, "#000");
    if (lt > .5) beatHeart(ctx, W / 2, 960, 110 * easeBack(prog(lt, .5, .8)), T, 80);
  },
};
