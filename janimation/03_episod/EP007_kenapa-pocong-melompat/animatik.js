// EP007 — Kenapa Pocong Melompat?! Lukisan kanvas setiap scene (sari kata & tajuk dilukis oleh Remotion).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, ell, rr, poly, line, star, heart,
   cam, shake, person, runPose, speedLines, hLines, sparkles, confetti, puff, flash, vignette, skyGrad, bigText, glow, blurred, grade,
   pocong, fog, torchBeam, nightSky, moon, kampungNight, kampungHouse, palm, ground, sweat */

function hop(lt, times, dur = .5, hgt = 1) { // tinggi lompatan & squash berdasarkan senarai masa lompatan
  for (const t0 of times) { const k = (lt - t0) / dur; if (k >= 0 && k < 1) return { y: Math.sin(Math.PI * k) * hgt, sq: k < .12 ? .25 * (1 - k / .12) : k > .88 ? .3 * (k - .88) / .12 : -.12 }; }
  const land = times.some(t0 => lt - t0 >= dur && lt - t0 < dur + .12); return { y: 0, sq: land ? .25 : 0 };
}
function tupText(ctx, lt, times, x, y, s = 1) { for (const t0 of times) { const k = prog(lt, t0 + .45, t0 + .9); if (k > 0 && k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; bigText(ctx, "TUP!", x, y - k * 60, 90 * s, "#FFFFFF", .8 + .4 * easeOut(k), -.1, "#000"); ctx.restore(); } } }
function walkP(lt, k = .25, sp = 9) { const w = Math.sin(lt * sp) * k; return { la: [.15 - w, .1], ra: [.15 + w, .1], ll: [w * .6, 0], rl: [-w * .6, 0] }; }
function nightRoad(ctx, t) { kampungNight(ctx, t); road(ctx, 1500, 700, "#2C3550", false); fog(ctx, t, 1300, 5, .22); }
function torchAt(ctx, x, y, ang, T) { rr(ctx, x - 30, y - 18, 70, 36, 10, "#3A3A44", 4); torchBeam(ctx, x + 35, y, ang, 1100, T); }
function stairsHouse(ctx, T) {
  nightSky(ctx, T, "#141A3A", "#3B3A6E"); moon(ctx, 230, 280, .9);
  for (const dx of [520, 700, 880, 1060]) rr(ctx, dx, 900, 26, 600, 4, "#5A3E2B", 4);
  rr(ctx, 480, 440, 640, 470, 0, "#6E8B5A", 6); poly(ctx, [[440, 440], [800, 200], [1160, 440]], "#7A3E2E", 6);
  rr(ctx, 560, 560, 150, 350, 6, "#4A3020", 5); ell(ctx, 640, 600, 70, 30, "rgba(255,200,100,.35)");
  ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = "#0B1030"; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore();
  ground(ctx, 1500, "#24304A");
  // tangga tinggi dari tanah (kiri bawah) ke pintu
  line(ctx, 160, 1500, 560, 900, 22, "#6B4A2E"); line(ctx, 300, 1500, 700, 900, 22, "#6B4A2E");
  for (let i = 0; i <= 8; i++) { const k = i / 8; line(ctx, lerp(160, 560, k), lerp(1500, 900, k), lerp(300, 700, k), lerp(1500, 900, k), 14, "#8C6440"); }
  fog(ctx, T, 1350, 4, .2);
}
function scoreCard(ctx, x, y, s, txt) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); line(ctx, 0, 60, 0, 200, 14, "#8C6440"); rr(ctx, -110, -80, 220, 150, 16, "#FFFFFF", 7); ctx.fillStyle = "#C62828"; ctx.font = "900 90px Inter"; ctx.textAlign = "center"; ctx.fillText(txt, 0, 30); ctx.restore(); }
function starsSpin(ctx, x, y, r, t) { for (let i = 0; i < 4; i++) { const a = t * 5 + i / 4 * TAU; star(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .4, 24, "#FFD23F", 4); } }

const SCENES = {
  SC01(ctx, lt, d, T) {
    const hops = [.3, 1.05, 1.8, 2.55], k = prog(lt, 0, 3.1), h = lerp(420, 1500, easeIn(k)), j = hop(lt, hops, .55, h * .22);
    cam(ctx, { x: 540, y: 980, z: 1, ...shake(lt, j.sq > .2 ? 8 : 0) }, () => {
      blurred(ctx, 3, c => nightRoad(c, T));
      pocong(ctx, 540, lerp(1500, 2150, easeIn(k)) - j.y, h, { t: T, squash: j.sq, face: { eyes: lt > 2.6 ? "red" : "half", mouth: lt > 2.6 ? "open" : "flat" } });
    });
    tupText(ctx, lt, hops, 820, 600, 1.1); vignette(ctx, .55, "5,5,25");
    if (lt > 3.05 && lt < 3.25) flash(ctx, .6, "#FFFFFF");
  },
  SC02(ctx, lt, d, T) {
    const x = lerp(280, 620, lt / d);
    cam(ctx, { x: lerp(440, 640, lt / d), y: 1000, z: 1.02 }, () => {
      nightRoad(ctx, T);
      person(ctx, x, 2150, 1350, { p: "JAMIL", pose: Object.assign(walkP(lt, .18, 6), { ra: [.9, .7] }), face: { eyes: "normal", mouth: "flat", look: 1 }, t: T });
      torchAt(ctx, x + 195, 1335, -.2, T);
    });
    vignette(ctx, .5, "5,5,25");
  },
  SC03(ctx, lt, d, T) {
    const tups = [3.51, 3.96, 4.41].map(x => x - .15);
    cam(ctx, { x: 560, y: 1000, z: 1.05 + lt * .03 }, () => {
      nightRoad(ctx, T);
      if (lt > 3.2) { const j = hop(lt, tups, .4, 60); ctx.save(); ctx.globalAlpha = .75; pocong(ctx, 160, 1560 - j.y, 330, { t: T, squash: j.sq, shadow: false, face: { eyes: "half" } }); ctx.restore(); }
      person(ctx, 620, 2150, 1380, { p: "JAMIL", pose: { la: [.12, .05], ra: [.9, .7] }, face: lt > 1.4 ? { eyes: "shock", mouth: "o", sweat: .8, look: -1 } : { eyes: "normal", mouth: "flat", look: 1 }, t: T });
      torchAt(ctx, 815, 1350, -.2, T);
    });
    tupText(ctx, lt, tups, 220, 1150, .8); vignette(ctx, .55, "5,5,25");
  },
  SC04(ctx, lt, d, T, env) {
    const tj = talkAmt(T, env, "JAMIL");
    cam(ctx, { x: 540, y: 900, z: 1.45 }, () => {
      blurred(ctx, 4, c => nightRoad(c, T));
      person(ctx, 540, 2150, 1450, { p: "JAMIL", flip: true, pose: { la: [.12, .05], ra: [.9, .7] }, face: { eyes: "normal", mouth: tj > .04 ? "talk" : "wavy", talk: tj, sweat: 1, brow: "worried", look: 1 }, t: T });
      glow(ctx, 300, 1330, 380, "255,240,200", .35);
    });
    vignette(ctx, .55, "5,5,25");
  },
  SC05(ctx, lt, d, T) {
    if (lt < 1.4) { cam(ctx, { x: 540, y: 1000, z: 1.1 }, () => { nightRoad(ctx, T); torchBeam(ctx, 540, 2200, -Math.PI / 2 + Math.sin(lt * 2.5) * .5, 1500, T); }); vignette(ctx, .6, "5,5,25"); return; }
    const x = lerp(260, 760, prog(lt, 1.4, d));
    cam(ctx, { x: 560, y: 1000, z: 1.03 }, () => {
      nightRoad(ctx, T);
      person(ctx, x, 2150, 1350, { p: "JAMIL", pose: Object.assign(walkP(lt, .3, 13), { ra: [.9, .7] }), face: { eyes: Math.sin(lt * 2) > .7 ? "shock" : "normal", mouth: "wavy", sweat: 1, look: Math.sin(lt * 2) > .7 ? -1 : 1 }, t: T });
      torchAt(ctx, x + 195, 1335, -.2, T);
    });
    vignette(ctx, .5, "5,5,25");
  },
  SC06(ctx, lt, d, T) {
    const hops = [.1, .9, 1.7, 2.5, 3.0, 3.56, 3.84, 4.11, 4.36].filter(x => x < d), k = prog(lt, 0, d), j = hop(lt, hops, .4, 90);
    cam(ctx, { x: 560, y: 1000, z: 1.03 }, () => {
      nightRoad(ctx, T);
      pocong(ctx, lerp(120, 300, k), lerp(1600, 1900, k) - j.y, lerp(380, 900, easeIn(k)), { t: T, squash: j.sq, face: { eyes: k > .6 ? "red" : "half" } });
      person(ctx, 780, 2150, 1350, { p: "JAMIL", pose: Object.assign(walkP(lt, .3, 14), { ra: [.9, .7] }), face: { eyes: "normal", mouth: "wavy", sweat: 1.2, brow: "worried" }, t: T });
      torchAt(ctx, 975, 1335, -.2, T);
    });
    tupText(ctx, lt, hops, 260, 1000, .9); vignette(ctx, .6, "5,5,25");
  },
  SC07(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "POCONG");
    cam(ctx, { x: 540, y: 820, z: 1 + lt * .06 }, () => {
      skyGrad(ctx, [[0, "#06081C"], [1, "#151A36"]]); fog(ctx, T, 400, 8, .3);
      glow(ctx, 540, 1300, 700, "220,230,255", .25);
      pocong(ctx, 540, 2600, 2300, { t: T, face: { eyes: "red", mouth: tp > .04 ? "talk" : "flat", talk: tp * 1.6 } });
    });
    vignette(ctx, .7, "0,0,10");
  },
  SC08(ctx, lt, d, T, env) {
    const tj = talkAmt(T, env, "JAMIL"), zp = easeOut(prog(lt, 0, .2));
    cam(ctx, { x: 540, y: lerp(1000, 860, zp), z: lerp(1.2, 1.6, zp), ...shake(lt, 18) }, () => {
      burst(ctx, 540, 760, "#1A1240", "#2E1E5E", 22, lt);
      for (let i = 0; i < 9; i++) line(ctx, 420 + i * 30, 560, 400 + i * 34, 420 - Math.abs(i - 4) * 10, 10, "#1C1714");
      person(ctx, 540, 2150, 1450, { p: "JAMIL", pose: "shock", face: { eyes: "shock", mouth: tj > .04 ? "jaw" : "open", sweat: 1.4, brow: "up", pale: true }, t: T });
    });
    speedLines(ctx, 540, 700, 34, 3, lt, "rgba(255,255,255,.6)", 360); flash(ctx, 1 - prog(lt, 0, .15));
  },
  SC09(ctx, lt, d, T) {
    const jumpT = 31.4 - 27.864, LJ = lt > jumpT && lt < jumpT + 1.0, hops = Array.from({ length: 13 }, (_, i) => .14 + i * .45).filter(x => !(x > jumpT - .2 && x < jumpT + 1));
    const j = LJ ? { y: Math.sin(Math.PI * (lt - jumpT)) * 520, sq: -.15 } : hop(lt, hops, .38, 120);
    cam(ctx, { x: 540, y: 960, z: 1.02, ...shake(lt, 6) }, () => {
      nightSky(ctx, T); moon(ctx, 800, 300, .8);
      poly(ctx, [[-300, 1920], [1380, 1920], [620, 900], [460, 900]], "#2C3550"); poly(ctx, [[-2000, 1920], [-300, 1920], [460, 900], [-2000, 900]], "#1E2A3E"); poly(ctx, [[1380, 1920], [3000, 1920], [3000, 900], [620, 900]], "#1E2A3E");
      for (const x of [-60, 120, 960, 1140]) palm(ctx, x, 920, 520);
      pocong(ctx, LJ ? lerp(260, 820, lt - jumpT) : 830 + Math.sin(lt * 2) * 60, 1450 - j.y, 620, { t: T, squash: j.sq, rot: LJ ? -.3 : 0, face: { eyes: "red", mouth: LJ ? "open" : "flat" } });
      if (LJ) sparkles(ctx, 10, 2, lt, [300, 600, 500, 500], "#FFF3C4");
      person(ctx, 540, 2250, 1500, { p: "JAMIL", pose: runPose(lt, 1.5), face: { eyes: "shock", mouth: "open", sweat: 1.3 }, t: T });
      if (lt > jumpT + .8) scoreCard(ctx, 900, 600, easeBack(prog(lt, jumpT + .8, jumpT + 1.1)), "9.8");
    });
    speedLines(ctx, 540, 900, 26, 7, lt, "rgba(255,255,255,.45)", 420);
  },
  SC10(ctx, lt, d, T) {
    const up = easeInOut(prog(lt, 0, 2.6)), jx = lerp(130, 560, up), jy = lerp(1560, 960, up), slip = 38.7 - 33.806, fallen = lt > slip + .8;
    const tries = [36.8 - 33.806, 37.5 - 33.806], j = hop(lt, tries, .45, 160);
    cam(ctx, { x: 560, y: 1050, z: 1.0 }, () => {
      stairsHouse(ctx, T);
      if (up < 1) person(ctx, jx, jy + 10, 900, { p: "JAMIL", pose: runPose(lt, .9), face: { eyes: "shock", mouth: "open", sweat: 1 }, t: T });
      else person(ctx, 640, 925, 640, { p: "JAMIL", pose: "hug", face: { eyes: "shock", mouth: "wavy", sweat: 1.2 }, t: T });
      const rot = lt > slip ? -Math.min(1.45, (lt - slip) * 3) : 0, px = lt > slip ? lerp(300, 820, prog(lt, slip, slip + .6)) : 300;
      pocong(ctx, px, 1500 - j.y, 760, { t: T, squash: j.sq, rot, face: { eyes: lt > slip ? "spiral" : "red", mouth: lt > slip ? "jaw" : "flat" } });
      if (fallen) starsSpin(ctx, 200, 1400, 90, T);
    });
    vignette(ctx, .45, "5,5,25");
  },
  SC11(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "POCONG");
    cam(ctx, { x: 540, y: 1100, z: 1.25 }, () => {
      blurred(ctx, 3, c => stairsHouse(c, T));
      pocong(ctx, 1000, 1650, 900, { t: T, rot: -1.45, shadow: false, face: { eyes: "spiral", mouth: tp > .04 ? "talk" : "wavy", talk: tp } });
      starsSpin(ctx, 262, 1400, 140, T);
    });
  },
  SC12(ctx, lt, d, T, env) {
    const tj = talkAmt(T, env, "JAMIL");
    cam(ctx, { x: 640, y: 700, z: 1.6 }, () => {
      stairsHouse(ctx, T);
      person(ctx, 640 + noise(T * 4) * 8, 925, 640, { p: "JAMIL", pose: "hug", face: { eyes: "normal", mouth: tj > .04 ? "talk" : "wavy", talk: tj, sweat: 1.2, brow: "worried", look: -1 }, t: T });
    });
  },
  SC13(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "POCONG");
    cam(ctx, { x: 480, y: 1050, z: 1.15 + lt * .04 }, () => {
      stairsHouse(ctx, T);
      person(ctx, 640, 925, 640, { p: "JAMIL", pose: "hug", face: { eyes: "normal", mouth: "o", sweat: .8, look: -1 }, t: T });
      pocong(ctx, 380, 1900, 1150, { t: T, face: { eyes: "sparkle", mouth: tp > .04 ? "talk" : "wavy", talk: tp, blush: true, glowTies: true }, rot: Math.sin(lt * 2) * .03 });
    });
  },
  SC14(ctx, lt, d, T, env) {
    const tj = talkAmt(T, env, "JAMIL"), tp = talkAmt(T, env, "POCONG"), itch = T > 49.4;
    cam(ctx, { x: 540, y: 1000, z: 1.12 }, () => {
      blurred(ctx, 3, c => stairsHouse(c, T));
      person(ctx, 270, 2150, 1300, { p: "JAMIL", pose: "stand", face: { eyes: itch ? "half" : "normal", mouth: tj > .04 ? "talk" : "flat", talk: tj, brow: "up", look: 1 }, t: T });
      pocong(ctx, 770, 2150, 1500, { t: T, rot: itch ? Math.sin(lt * 18) * .04 : 0, face: { eyes: itch ? "closed" : "sparkle", mouth: tp > .04 ? "talk" : "wavy", talk: tp, nose: itch } });
      if (itch) { bigText(ctx, "!!", 960, 640, 110, "#FF6B6B", 1, .2); }
    });
  },
  SC15(ctx, lt, d, T) {
    const sx = Math.sin(lt * 14) * 30;
    cam(ctx, { x: 560, y: 980, z: 1.12 }, () => {
      blurred(ctx, 3, c => stairsHouse(c, T));
      person(ctx, 300, 2150, 1300, { p: "JAMIL", pose: { la: [.12, .05], ra: [1.25, .05] }, face: { eyes: "half", mouth: "smile", look: 1 }, t: T });
      line(ctx, 560, 1150, 700 + sx, 1020, 14, "#8C6440");
      pocong(ctx, 790, 2150, 1500, { t: T, face: { eyes: "happy", mouth: "smile", blush: true } });
      sparkles(ctx, 12, 4, lt, [600, 500, 400, 600], "#FFF3C4");
      for (let i = 0; i < 5; i++) { const k = ((lt * .5 + i / 5) % 1); heart(ctx, 800 + Math.sin(i * 2 + lt) * 140, 700 - k * 400, 20 + 12 * k, "#FF8FB1", 3); }
    });
    vignette(ctx, .35, "5,5,25");
  },
  SC16(ctx, lt, d, T) {
    const j = hop(lt, [.2, .9, 1.6, 2.3, 3.0], .4, 120);
    cam(ctx, { x: 540, y: 980, z: 1.08 }, () => {
      nightSky(ctx, T); moon(ctx, 540, 520, 1.6); ground(ctx, 1500, "#24304A"); confetti(ctx, 30, 4, lt);
      person(ctx, 320, 2150, 1300, { p: "JAMIL", pose: { la: [.12, .05], ra: [2.4 + Math.sin(lt * 10) * .3, .3] }, face: { eyes: "happy", mouth: "grin" }, t: T });
      pocong(ctx, 760, 2150 - j.y, 1400, { t: T, squash: j.sq, face: { eyes: "happy", mouth: "smile", blush: true } });
    });
  },
  SC17(ctx, lt, d, T) {
    skyGrad(ctx, [[0, "#0C0A1E"], [1, "#22183E"]]); glow(ctx, W / 2, 800, 700, "200,200,255", .25);
    const py = lerp(2700, 2350, easeOut(prog(lt, .4, 1.1)));
    pocong(ctx, 540, py, 1300, { t: T, face: { eyes: "half", wink: lt > 1.3, mouth: "smile" }, shadow: false });
  },
};
