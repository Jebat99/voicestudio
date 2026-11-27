// EP006 — Asal Usul Pontianak: Kenapa Pontianak Suka Menjerit?! Setiap fungsi: (ctx, lt, d, T, env).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, shade, ell, rr, poly, line, star, heart,
   cam, shake, person, head, PRESET, runPose, prop, speedLines, hLines, sparkles, puff, flash, vignette, skyGrad, burst, bolt, bigText, glow,
   thought, beatHeart, sweat, blurred, grade, motes, talkAmt, owl, fog, pelita, torchBeam, nightSky, moon, spookyTree, forest, bigTree,
   kampungNight, kampungDay, stamp, heartCrack */

function sc2(ctx, c, bg, fg, blur = 0) {
  cam(ctx, { x: lerp(540, c.x ?? 540, .5), y: lerp(960, c.y ?? 960, .5), z: lerp(1, c.z || 1, .5), sx: c.sx, sy: c.sy, rot: c.rot }, () => (blur ? blurred(ctx, blur, bg) : bg(ctx)));
  cam(ctx, c, fg);
}
const PON = (o = {}) => Object.assign({}, PRESET.PONTIANAK, o);
const MARAH = Object.assign({}, PRESET.SITI, { hair: "panjang", longHair: .2 });
function walkP(lt, k = .25, sp = 9) { const w = Math.sin(lt * sp) * k; return { la: [.15 - w, .1], ra: [.15 + w, .1], ll: [w * .6, 0], rl: [-w * .6, 0] }; }
function suitcase(ctx, x, y, s) { rr(ctx, x - 90 * s, y - 120 * s, 180 * s, 130 * s, 14 * s, "#8C5A3C", 6 * s); rr(ctx, x - 30 * s, y - 145 * s, 60 * s, 30 * s, 8 * s, null, 6 * s); line(ctx, x - 90 * s, y - 60 * s, x + 90 * s, y - 60 * s, 5 * s, "#5A3A24"); }
function tears(ctx, x, y, t, s = 1) { for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sd * 60 * s, y); for (let i = 0; i <= 10; i++) { const k = i / 10; ctx.lineTo(x + sd * (60 + k * 160) * s, y + k * k * 420 * s + Math.sin(t * 20 + i) * 6); } ctx.lineWidth = 26 * s; ctx.strokeStyle = "rgba(140,210,255,.85)"; ctx.lineCap = "round"; ctx.stroke(); } }
function poster(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(ctx, -170, -230, 340, 460, 10, "#F3E2B8", 7); ctx.fillStyle = "#8B1A1A"; ctx.font = "900 70px Inter"; ctx.textAlign = "center"; ctx.fillText("DICARI", 0, -150);
  ctx.save(); ctx.translate(0, 0); head(ctx, 0, 0, 95, PRESET["SUAMI-SITI"], { eyes: "normal", mouth: "smile" }, 5, 900); ctx.restore();
  ctx.fillStyle = INK; ctx.font = "900 48px Inter"; ctx.fillText("SUAMI", 0, 175); ctx.textAlign = "left"; ctx.restore();
}
function hangDown(ctx, x, by, h, T, face) { // pontianak tergantung terbalik dari dahan
  ctx.save(); ctx.translate(x, by); ctx.scale(1, -1); person(ctx, 0, 0, h, { p: PON({ longHair: 0 }), pose: { la: [.2, .2], ra: [.2, .2], ll: [.05, 0], rl: [.05, 0] }, face, t: T, shadow: false }); ctx.restore();
  const hy = by + .885 * h; for (let i = 0; i < 11; i++) { const dx = (i - 5) * h * .022, sw = Math.sin(T * 2 + i) * h * .01; ctx.beginPath(); ctx.moveTo(x + dx, hy); ctx.quadraticCurveTo(x + dx * 1.4 + sw, hy + h * .25, x + dx * 1.2 + sw * 2, hy + h * .5); ctx.lineWidth = h * .03; ctx.strokeStyle = "#0E0B12"; ctx.lineCap = "round"; ctx.stroke(); }
}
function rain(ctx, t, a = .5) { ctx.save(); ctx.strokeStyle = `rgba(190,210,255,${a})`; ctx.lineWidth = 3; const r = rng(4); for (let i = 0; i < 90; i++) { const x = r() * W * 1.2, y = ((r() * H + t * 1800) % (H + 100)) - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 60); ctx.stroke(); } ctx.restore(); }
function bat(ctx, x, y, s, t) { const f = Math.sin(t * 18) * .5; ctx.fillStyle = "#0C0A18"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sd * 40 * s, y - (30 + f * 30) * s, x + sd * 80 * s, y - f * 20 * s); ctx.quadraticCurveTo(x + sd * 50 * s, y + 10 * s, x, y + 10 * s); ctx.fill(); } ell(ctx, x, y, 14 * s, 18 * s, "#0C0A18"); }
function villagers(ctx, T, face, opt = {}) {
  const jit = k => (opt.shake ? noise(T * 3 + k) * 12 : 0);
  person(ctx, 180 + jit(1), 2150, 1250, { p: "TOK-KAMPUNG", pose: opt.pose || { la: [.12, .05], ra: [.8, 1.2] }, face, t: T });
  if (!opt.run) pelita(ctx, 180 + 200 + jit(1), 1240, 1.1, T);
  person(ctx, 520 + jit(2), 2170, 1180, { p: "MAKCIK-KAMPUNG", pose: opt.pose || "hug", face, t: T });
  person(ctx, 820 + jit(3), 2190, 1050, { p: "PEMUDA", pose: opt.pose || "hug", face, t: T });
}

const SCENES = {
  SC01(ctx, lt, d, T) {
    const z = lerp(.6, 1.15, easeOut(prog(lt, 0, .35)));
    cam(ctx, { x: 540, y: 900, z, ...shake(lt, 16 * (1 - prog(lt, .1, 1.4))) }, () => {
      forest(ctx, T); fog(ctx, T, 1200, 4, .3);
      person(ctx, 540, 2300, 1700, { p: PON(), pose: { la: [1.2, .8], ra: [1.2, .8] }, face: { eyes: "red", mouth: "scream" }, t: T });
    });
    speedLines(ctx, 540, 760, 40, 5, lt, "rgba(255,255,255,.55)", 340);
    flash(ctx, 1 - prog(lt, 0, .18), "#FFFFFF");
    bigText(ctx, "KENAPA PONTIANAK", W / 2, 260, 86, "#FFFFFF", easeBack(prog(lt, .25, .55)), -.03, "#7A0018");
    bigText(ctx, "SUKA MENJERIT?!", W / 2, 380, 104, "#FF4D5E", easeBack(prog(lt, .45, .75)), .03, "#000");
  },
  SC02(ctx, lt, d, T) {
    sc2(ctx, { x: 540, y: 1000, z: 1.05 + lt * .02 }, c => kampungDay(c, T), () => {
      person(ctx, 560, 2150, 1400, { p: "SITI", pose: lt > 1 && lt < 2.4 ? { la: [.12, .05], ra: [2.3 + Math.sin(lt * 10) * .25, .3] } : "holdFront", face: { eyes: "sparkle", mouth: "smile", blush: .8 }, t: T });
      sparkles(ctx, 10, 3, lt, [300, 500, 500, 500], "#FFF3C4");
    });
    grade(ctx, "#D9A86C", .28, "multiply"); vignette(ctx, .35, "60,40,20");
  },
  SC03(ctx, lt, d, T) {
    sc2(ctx, { x: 560, y: 1000, z: 1.08 }, c => kampungDay(c, T), () => {
      person(ctx, 760, 2150, 1420, { p: "SUAMI-SITI", pose: "stand", face: { eyes: "normal", mouth: "wavy", sweat: 1.2, look: 1 }, t: T });
      person(ctx, 380, 2150, 1360, { p: "SITI", pose: { la: [.3, 1.3], ra: [.9, .9] }, face: { eyes: "happy", mouth: "grin", blush: 1 }, t: T, rot: .05 });
      for (let i = 0; i < 6; i++) { const k = ((lt * .5 + i / 6) % 1); heart(ctx, 420 + Math.sin(i * 2 + lt) * 140, 900 - k * 500, 22 + 12 * k, "#FF6F91", 3); }
    }, 2);
    grade(ctx, "#D9A86C", .25, "multiply");
  },
  SC04(ctx, lt, d, T) {
    const run = lt > 3.7, x = run ? lerp(560, 1400, easeIn(prog(lt, 3.7, 4.8))) : lerp(200, 560, prog(lt, 0, 3.5));
    sc2(ctx, { x: 560, y: 1000, z: 1.05 }, c => kampungDay(c, T), () => {
      person(ctx, x, 2150, 1380, { p: "SUAMI-SITI", pose: run ? runPose(lt, 1.6) : walkP(lt, .15, 5), face: run ? { eyes: "shock", mouth: "open", sweat: 1 } : { eyes: "sus", mouth: "wavy", look: -1, sweat: .7 }, t: T });
      suitcase(ctx, x + 150, 1520, 1.3);
      if (!run) thought(ctx, 780, 480, 400, 360, () => { skyGrad(ctx, [[0, "#FFE3EC"], [1, "#F8C8DC"]]); person(ctx, 780, 760, 340, { p: "ISTERI-KEDUA", pose: { ra: [2.4, .3] }, face: { eyes: "happy", mouth: "smile" }, shadow: false }); heart(ctx, 900, 420, 26, "#FF3D6E"); });
      if (run) for (let i = 0; i < 4; i++) puff(ctx, x - 200 - i * 120, 2120 - i * 10, 60 - i * 8, "#D9C7A8", .8);
    });
    if (run) hLines(ctx, 12, 4, lt, 1, "rgba(255,255,255,.5)");
    grade(ctx, "#D9A86C", .22, "multiply");
    stamp(ctx, "KANTOI!", lt < 3.6 ? prog(lt, 3.55, 3.75) : 1 - prog(lt, 4.4, 4.8), W / 2, 330, "#C62828");
  },
  SC05(ctx, lt, d, T, env) {
    const ts = talkAmt(T, env, "SITI");
    cam(ctx, { x: 540, y: 950, z: 1.25, ...shake(lt, 10) }, () => {
      burst(ctx, 540, 820, "#C62828", "#E53935", 22, lt);
      for (let i = 0; i < 6; i++) { const x = 100 + i * 180; poly(ctx, [[x - 60, 1300], [x, 1050 - Math.sin(lt * 14 + i) * 60], [x + 60, 1300]], "#FFB300"); }
      const r = lerp(900, 1300, (lt % 1)); person(ctx, r, 1500, 380, { p: "SUAMI-SITI", pose: runPose(lt, 1.6), face: { eyes: "shock", mouth: "open" }, shadow: false });
      person(ctx, 480, 2150, 1450, { p: MARAH, pose: { la: [1.1, .7], ra: [1.2, .3] }, face: { eyes: "normal", mouth: ts > .04 ? "talk" : "open", talk: Math.max(.4, ts), vein: true, brow: "angry" }, t: T });
    });
  },
  SC06(ctx, lt, d, T) {
    sc2(ctx, { x: 540, y: 950, z: 1.2 + lt * .03 }, c => kampungNight(c, T), () => {
      const pr = person(ctx, 540, 2150, 1420, { p: "SITI-SEDIH", pose: { la: [.35, 1.55], ra: [.35, 1.55] }, face: { eyes: "half", mouth: "wavy", brow: "worried" }, t: T });
      for (const sd of [-1, 1]) { const k = (lt * 1.4 + (sd > 0 ? .5 : 0)) % 1; ell(ctx, pr.headX + sd * pr.hr * .42, pr.headY + pr.hr * (.5 + k * 1.2), 10, 16, "#9FD8FF", 3); }
    }, 2);
    rain(ctx, T); grade(ctx, "#3B4A8C", .35, "multiply");
    if (lt < .25) flash(ctx, .6 * (1 - lt * 4), "#DDE6FF");
  },
  SC07(ctx, lt, d, T) {
    const x = lerp(-150, 1250, prog(lt, 0, d));
    sc2(ctx, { x: 540, y: 1000, z: 1.02 }, c => kampungNight(c, T), () => {
      const pr = person(ctx, x, 2150, 1350, { p: "SITI-SEDIH", pose: Object.assign(walkP(lt, .2, 6), { ra: [.6, 1.2] }), face: { eyes: "closed", mouth: Math.sin(lt * 4) > .3 ? "open" : "wavy", brow: "worried" }, t: T });
      pelita(ctx, x + 230, 1300, 1.2, T);
      tears(ctx, pr.headX, pr.headY + pr.hr * .35, T, .9);
    });
    grade(ctx, "#2E3A7A", .3, "multiply"); vignette(ctx, .45, "10,10,40");
  },
  SC08(ctx, lt, d, T) {
    sc2(ctx, { x: 540, y: 1000, z: 1.05 + lt * .03 }, c => forest(c, T), () => {
      person(ctx, 380, 2150, 1380, { p: "SITI-SEDIH", face: { eyes: lt > 1.3 ? "shock" : "half", mouth: lt > 1.3 ? "o" : "flat", look: 1, brow: "up" }, t: T });
      for (let i = 0; i < 3; i++) { const k = ((lt * .8 + i / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(900, 900, 80 + k * 300, Math.PI * .8, Math.PI * 1.2); ctx.lineWidth = 10; ctx.strokeStyle = "#CFE6FF"; ctx.stroke(); ctx.restore(); }
      if (lt > 1.0) { ctx.save(); ctx.globalAlpha = .8; ctx.fillStyle = "#CFE6FF"; ctx.font = "italic 700 54px Inter"; ctx.fillText("Siti…", 760, 760 + Math.sin(lt * 3) * 10); ctx.restore(); }
    });
    vignette(ctx, .45, "10,10,40");
  },
  SC09(ctx, lt, d, T) {
    sc2(ctx, { x: 540 + lt * 40, y: 1000, z: 1.05 }, c => forest(c, T * 3), () => {
      person(ctx, 520, 2150, 1380, { p: "SITI-SEDIH", pose: runPose(lt, 1.4), face: { eyes: "normal", mouth: "open", brow: "worried" }, t: T });
      fog(ctx, T * 2, 1400, 4, .25);
    });
    hLines(ctx, 14, 5, lt, -1, "rgba(200,210,255,.35)"); vignette(ctx, .45, "10,10,40");
  },
  SC10(ctx, lt, d, T, env) {
    const ts = talkAmt(T, env, "SITI");
    sc2(ctx, { x: 540, y: 900, z: 1.45, ...shake(lt, ts * 8) }, c => forest(c, T), () => {
      person(ctx, 540, 2150, 1450, { p: "SITI-SEDIH", pose: { la: [.6, 2.4], ra: [.6, 2.4] }, face: { eyes: "closed", mouth: ts > .04 ? "talk" : "open", talk: Math.max(.3, ts), brow: "worried" }, t: T });
    }, 4);
    vignette(ctx, .45, "10,10,40");
  },
  SC11(ctx, lt, d, T) {
    const hoot = [.05, .55, 1.55, 2.05].some(h => lt > h && lt < h + .35) ? 1 : 0;
    sc2(ctx, { x: 540, y: 900, z: 1.05 }, c => forest(c, T), () => {
      rr(ctx, 300, 640, 760, 50, 25, "#2A1F2E", 6);
      owl(ctx, 720, 520, 1.6, T, hoot);
      if (hoot) { ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.font = "italic 900 60px Inter"; ctx.fillText("HOO… HOO…", 760, 330); ctx.restore(); }
      person(ctx, 360, 2150, 1300, { p: "SITI-SEDIH", face: { eyes: lt > 1.6 ? "half" : "normal", mouth: lt > 1.6 ? "flat" : "o", look: 1, brow: "up" }, t: T });
      if (lt > 2.2) { bigText(ctx, "?", 220, 800, 120 * easeBack(prog(lt, 2.2, 2.5)), "#FFFFFF", 1, -.2); bigText(ctx, "?", 470, 720, 90 * easeBack(prog(lt, 2.35, 2.65)), "#FFFFFF", 1, .2); }
    });
    vignette(ctx, .4, "10,10,40");
  },
  SC12(ctx, lt, d, T) {
    const fade = 1 - prog(lt, 2.4, 4.6);
    sc2(ctx, { x: 540, y: 1000, z: 1.05 + lt * .03 }, c => forest(c, T, { my: 380 }), () => {
      ctx.save(); ctx.globalAlpha = fade; person(ctx, 540, 1900, 900, { p: "SITI-SEDIH", flip: Math.sin(lt * 2) > 0, face: { eyes: "normal", mouth: "wavy", brow: "worried", look: Math.sin(lt * 2) }, t: T }); ctx.restore();
      fog(ctx, T, 900, 9, .45);
    });
    vignette(ctx, .55, "10,10,40");
  },
  SC13(ctx, lt, d, T) {
    sc2(ctx, { x: 560, y: 1000, z: 1.0 }, c => { nightSky(c, T); moon(c, 300, 300, .8); c.fillStyle = "#151226"; c.fillRect(-W, 1500, W * 3, H); bigTree(c, 860, 1700, .85, T); fog(c, T, 1300, 5, .3); }, () => {
      villagers(ctx, T, { eyes: "normal", mouth: "wavy", sweat: 1, look: 1, brow: "up" }, { shake: true });
      const k = (lt % 1.4) / 1.4; ctx.save(); ctx.globalAlpha = .9 * Math.sin(k * Math.PI); ctx.fillStyle = "#E8E6F0"; ctx.font = "italic 800 64px Inter"; ctx.fillText("hihihi…", 640 + k * 60, 520 - k * 40); ctx.restore();
    });
    vignette(ctx, .5, "10,10,40");
  },
  SC14(ctx, lt, d, T) {
    const turn = lt > 5.98, tilt = easeInOut(prog(lt, 0, 3.2)), zp = easeOut(prog(lt, 5.98, 6.2));
    cam(ctx, { x: lerp(700, 860, tilt), y: lerp(1700, 760, tilt) - zp * 40, z: lerp(1.05, 1.25, tilt) + zp * .9, ...shake(lt, turn ? 18 : 0) }, () => {
      nightSky(ctx, T); moon(ctx, 300, 300, .8); ctx.fillStyle = "#151226"; ctx.fillRect(-W, 1500, W * 3, H); bigTree(ctx, 860, 1700, .85, T);
      const by = 1700 - 960 * .85;
      person(ctx, 1000, by + 4, 560, { p: PON(), pose: { la: [.4, 1.6], ra: [.4, 1.6], ll: [1.1, -2.1], rl: [1.1, -2.1] }, face: turn ? { eyes: "red", mouth: "scream" } : { hairOver: 1, eyes: "red", mouth: "flat" }, t: T, shadow: false });
      fog(ctx, T, 1300, 5, .3);
    });
    vignette(ctx, .55, "10,10,40");
    if (turn) flash(ctx, 1 - prog(lt, 5.98, 6.15));
  },
  SC15(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "PENDUDUK"), run = lt > 1.3;
    sc2(ctx, { x: 540, y: 1000, z: 1.05, ...shake(lt, 10) }, c => { nightSky(c, T); c.fillStyle = "#151226"; c.fillRect(-W, 1500, W * 3, H); fog(c, T, 1300, 4, .3); }, () => {
      if (!run) villagers(ctx, T, { eyes: "shock", mouth: tp > .04 ? "jaw" : "open", sweat: 1.3, brow: "up" }, { pose: "shock", shake: true });
      else { const k = easeIn(prog(lt, 1.3, 2.2)); for (const [p, x0, h] of [["TOK-KAMPUNG", 180, 1250], ["MAKCIK-KAMPUNG", 520, 1180], ["PEMUDA", 820, 1050]]) person(ctx, x0 - k * 1400, 2160, h, { p, flip: true, pose: runPose(lt, 1.8), face: { eyes: "shock", mouth: "open" }, t: T });
        ctx.save(); ctx.translate(300 - k * 500, 900 - k * 700); ctx.rotate(lt * 10); rr(ctx, -60, -30, 120, 60, 10, "#151215", 4); ctx.restore(); }
    });
    if (run) hLines(ctx, 14, 2, lt, -1, "rgba(255,255,255,.5)");
  },
  SC16(ctx, lt, d, T) {
    const x = lerp(-300, 1400, prog(lt, 0, d));
    cam(ctx, { x: 540, y: 900, z: 1 }, () => {
      nightSky(ctx, T, "#06081C", "#1C1A40"); moon(ctx, 540, 820, 3.2);
      for (let i = 0; i < 5; i++) bat(ctx, (i * 230 + lt * 260) % 1300 - 100, 380 + i * 60 + Math.sin(lt * 3 + i) * 30, 1.2, T + i);
      ctx.save(); ctx.translate(x, 860 + Math.sin(lt * 3) * 40); ctx.rotate(-1.3); person(ctx, 0, 0, 560, { p: PON(), pose: { la: [2.8, 0], ra: [2.8, 0] }, face: { eyes: "red", mouth: "fang" }, t: T, shadow: false }); ctx.restore();
    });
  },
  SC17(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 960, z: 1 }, () => {
      skyGrad(ctx, [[0, "#1A1030"], [1, "#2E1E4E"]]); glow(ctx, 330, 900, 600, "200,180,255", .35);
      person(ctx, 330, 2050, 1450, { p: PON(), pose: { la: [.6, 1.6], ra: [1.2, .2] }, face: { eyes: "red", mouth: "fang", wink: lt > 1.4 && lt < 2.2 }, t: T });
      const items = [["RAMBUT PANJANG ✓", .55], ["BAJU PUTIH ✓", 2.0], ["JERITAN 999 dB 🔊", 3.3]];
      items.forEach(([t, t0], i) => { const k = easeBack(prog(lt, t0, t0 + .3)); if (k <= 0) return; ctx.save(); ctx.translate(740, 420 + i * 160); ctx.scale(k, k); rr(ctx, -230, -55, 460, 110, 20, "#FFFFFF", 6); ctx.fillStyle = "#7A0018"; ctx.font = "900 40px Inter"; ctx.textAlign = "center"; ctx.fillText(t, 0, 16); ctx.restore(); });
      if (lt > 4.9) { const k = easeBack(prog(lt, 4.9, 5.2)); ctx.save(); ctx.translate(820, 1150); ctx.scale(k, k); person(ctx, 0, 0, 420, { p: "TOK-KAMPUNG", face: { eyes: "half", mouth: "wavy", blush: 1, sweat: 1 }, shadow: false }); ctx.globalAlpha = .8; ell(ctx, 0, 10, 140, 26, "#8FD3FF"); for (let i = 0; i < 3; i++) ell(ctx, -20 + i * 20, -140 + ((lt * 300 + i * 40) % 120), 8, 12, "#8FD3FF"); ctx.restore(); }
    });
    vignette(ctx, .35, "10,10,40");
  },
  SC18(ctx, lt, d, T) {
    const drop = easeOut(prog(lt, 2.65, 2.95)), x = lerp(260, 420, prog(lt, 0, 2.6));
    sc2(ctx, { x: 540, y: 1000, z: 1.05, ...shake(lt, drop > 0 && drop < 1 ? 10 : 0) }, c => forest(c, T), () => {
      rr(ctx, 400, -200, 900, 70, 30, "#2A1F2E", 6);
      torchBeam(ctx, x + 180, 1350, -.35, 1000, T);
      person(ctx, x, 2150, 1300, { p: "PEMUDA", pose: drop > 0 ? "shock" : Object.assign(walkP(lt, .15, 6), { ra: [.9, .7] }), face: drop > 0 ? { eyes: "shock", mouth: "jaw", sweat: 1.3 } : { eyes: "normal", mouth: "o", look: 1, sweat: .6 }, t: T });
      rr(ctx, x + 150, 1310, 70, 36, 10, "#3A3A44", 4);
      if (drop > 0) hangDown(ctx, 800, lerp(-1000, -110, drop), 1050, T, { eyes: "red", mouth: "fang" });
    });
    if (drop > 0 && drop < 1) flash(ctx, .4, "#FFFFFF");
  },
  SC19(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "PEMUDA");
    sc2(ctx, { x: 540, y: 1050, z: 1.1 }, c => forest(c, T), () => {
      hangDown(ctx, 820, -110, 1050, T, { eyes: "red", mouth: "fang" });
      const j = noise(T * 4) * 10;
      person(ctx, 360 + j, 2300, 1300, { p: "PEMUDA", pose: { la: [.7, 2.2], ra: [.7, 2.2], ll: [1.3, -1.3], rl: [1.3, -1.3] }, face: { eyes: "shock", mouth: tp > .04 ? "talk" : "wavy", talk: tp, sweat: 1.4, pale: true }, t: T });
      for (const sd of [-1, 1]) rr(ctx, 360 + sd * 140 - 30 + j, 1680, 60, 70, 8, "#FFFFFF", 4);
    });
  },
  SC20(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "PONTIANAK");
    cam(ctx, { x: 540, y: 880, z: 1.4 + tp * .06, ...shake(lt, 6 + tp * 14) }, () => {
      burst(ctx, 540, 760, "#2A0A14", "#4A1020", 24, lt);
      person(ctx, 540, 2150, 1500, { p: PON(), pose: { la: [1.0, .6], ra: [1.0, .6] }, face: { eyes: "red", mouth: tp > .04 ? "scream" : "fang" }, t: T });
    });
    speedLines(ctx, 540, 700, 30, 9, lt, "rgba(255,200,200,.35)", 380);
  },
  SC21(ctx, lt, d, T, env) {
    const tp = talkAmt(T, env, "PONTIANAK");
    sc2(ctx, { x: 540, y: 860, z: 1.35 + lt * .07 }, c => forest(c, T), () => {
      person(ctx, 540, 2150, 1500, { p: PON(), pose: { la: [.12, .05], ra: [.5, 2.6] }, face: { eyes: "red", mouth: tp > .04 ? "talk" : "fang", talk: tp * 1.6 }, t: T, rot: Math.sin(lt * 1.2) * .04 });
    }, 4);
    vignette(ctx, .6, "30,0,20");
  },
  SC22(ctx, lt, d, T, env) {
    const tm = talkAmt(T, env, "PEMUDA"), tp = talkAmt(T, env, "PONTIANAK"), show = T > 78.86;
    sc2(ctx, { x: 560, y: 1000, z: 1.08 }, c => forest(c, T), () => {
      person(ctx, 300, 2150, 1300, { p: "PEMUDA", pose: "shock", face: { eyes: "shock", mouth: tm > .04 ? "talk" : "wavy", talk: tm, sweat: 1.2 }, t: T });
      person(ctx, 780, 2150, 1420, { p: PON(), pose: show ? "holdFront" : "stand", face: { eyes: "red", mouth: tp > .04 ? "talk" : "fang", talk: tp * 1.6, look: -1 }, t: T });
      if (show) { const k = easeBack(prog(T, 78.86, 79.2)); poster(ctx, 760, 1350, .95 * k, -.06); }
    }, 3);
  },
  SC23(ctx, lt, d, T) {
    sc2(ctx, { x: 560, y: 1000, z: 1.08 }, c => forest(c, T), () => {
      const pr = person(ctx, 720, 2150, 1420, { p: PON(), pose: "hug", face: { eyes: "closed", mouth: "open", brow: "worried" }, t: T });
      poster(ctx, 720, 1400, .7, .08); tears(ctx, pr.headX, pr.headY + pr.hr * .35, T, .9);
      person(ctx, 300, 2150, 1300, { p: "PEMUDA", pose: { la: [.12, .05], ra: [1.3, .2 + Math.sin(lt * 8) * .15] }, face: { eyes: "half", mouth: "flat", sweat: .5 }, t: T });
      heartCrack(ctx, 900, 620, 90, 1);
    }, 3);
  },
  SC24(ctx, lt, d, T) {
    skyGrad(ctx, [[0, "#1A0F26"], [1, "#2E1240"]]); glow(ctx, W / 2, 700, 700, "255,80,120", .3);
    const L = [["JANGAN MAIN-MAIN", 360, "#FFFFFF"], ["DENGAN PEREMPUAN", 480, "#FFFFFF"], ["YANG BELUM", 600, "#FFD23F"], ["MOVE ON!", 740, "#FF4D5E"]];
    L.forEach(([t, y, c], i) => bigText(ctx, t, W / 2, y, i === 3 ? 120 : 82, c, easeBack(prog(lt, .05 + i * .15, .35 + i * .15)), i % 2 ? .02 : -.02, "#000"));
    if (lt > .8) { ctx.save(); ctx.font = `${110 * easeBack(prog(lt, .8, 1.1))}px "Noto Color Emoji"`; ctx.textAlign = "center"; ctx.fillText("😂", W / 2 + 330, 300); ctx.restore(); }
    const py = lerp(2700, 2420, easeOut(prog(lt, .5, 1.2)));
    person(ctx, 540, py, 1300, { p: PON(), pose: { la: [.12, .05], ra: [2.3 + Math.sin(lt * 9) * .2, .3] }, face: { eyes: "red", mouth: "fang", wink: lt > 1.4 }, t: T, shadow: false });
  },
};
