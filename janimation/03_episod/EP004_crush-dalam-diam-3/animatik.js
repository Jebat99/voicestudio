// EP004 — Crush Dalam Diam #3: Kenapa Awak Baru Nak Beritahu?! Setiap fungsi: (ctx, lt, d, T, env).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, shade, ell, rr, poly, line, star, heart,
   cam, shake, person, head, runPose, PRESET, prop, speedLines, hLines, sparkles, petals, confetti, puff, flash, vignette, skyGrad, burst, bolt,
   bigText, classroom, deskChair, bokeh, rays, glow, heartPattern, thought, beatHeart, lightLeak, sweat, blurred, corridor, canteen, canteenTable,
   steam, icon, flowersBloom, talkAmt, bekal, grade, motes, polaroid, hourglass, heartCrack, seated */

function walkP(lt, k = .22) { const w = Math.sin(lt * 9) * k; return { la: [.15 - w, .1], ra: [.15 + w, .1], ll: [w * .6, 0], rl: [-w * .6, 0] }; }
// latar dengan paralaks: kamera latar bergerak separuh daripada kamera watak
function scene2(ctx, c, bg, fg, blur = 0) {
  const cb = { x: lerp(540, c.x ?? 540, .5), y: lerp(960, c.y ?? 960, .5), z: lerp(1, c.z || 1, .5), sx: c.sx, sy: c.sy };
  cam(ctx, cb, () => (blur ? blurred(ctx, blur, bg) : bg(ctx)));
  cam(ctx, c, fg);
}
function kuih(ctx, x, y, s = 1) { ell(ctx, x, y + 20 * s, 120 * s, 34 * s, "#FFFFFF", 5); for (let i = 0; i < 3; i++) rr(ctx, x - 80 * s + i * 55 * s, y - 20 * s, 46 * s, 36 * s, 8 * s, ["#59B36A", "#F5B041", "#E85D75"][i], 4); }
function tear(ctx, x, y, s, k) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = .85; ell(ctx, x, y + k * 40, s * .6, s, "#9FD8FF", 3); ctx.restore(); }
function calendar(ctx, x, y, lt) {
  const days = ["ISNIN", "SELASA", "RABU", "KHAMIS", "JUMAAT"], i = Math.min(4, Math.floor(lt / .5)), f = (lt % .5) / .5;
  rr(ctx, x - 170, y - 150, 340, 300, 18, "#FFFFFF", 7); rr(ctx, x - 170, y - 150, 340, 80, 18, "#E53935", 7);
  ctx.fillStyle = "#FFFFFF"; ctx.font = "900 44px Inter"; ctx.textAlign = "center"; ctx.fillText(days[i], x, y - 92);
  ctx.fillStyle = INK; ctx.font = "900 120px Inter"; ctx.fillText(String(10 + i), x, y + 100); ctx.textAlign = "left";
  if (i < 4 && f > .6) { const k = (f - .6) / .4; ctx.save(); ctx.translate(x, y - 70); ctx.rotate(-k * 1.2); ctx.globalAlpha = 1 - k; rr(ctx, -170, 0, 340, 220, 10, "#FFFFFF", 6); ctx.restore(); }
}
const CANT = (dk = 0) => c => canteen(c, 0, { dusk: dk });

const SCENES = {
  SC01(ctx, lt, d, T) {
    scene2(ctx, { x: 540, y: 1000, z: 1.05 }, c => corridor(c, T), () => {
      person(ctx, 540, 2170 - Math.abs(Math.sin(lt * 9)) * 16, 1380, { p: "AMIR", pose: lt > .8 && lt < 1.8 ? { la: [.12, .05], ra: [.55, 2.8] } : walkP(lt), face: { eyes: lt > .8 && lt < 1.8 ? "closed" : "happy", mouth: "grin", blush: .7 }, t: T });
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + lt; heart(ctx, 540 + Math.cos(a) * 380, 900 + Math.sin(a) * 260, 22 + 6 * Math.sin(lt * 5 + i), "#FF6F91", 3); }
    });
    lightLeak(ctx, .25);
    const k = easeBack(prog(lt, .05, .35)); if (k > 0) { bigText(ctx, "EPISOD 3", W / 2, 230, 70, "#FFFFFF", k, -.03, "#E0407A"); bigText(ctx, "KENAPA AWAK BARU", W / 2, 340, 68, "#FFD23F", easeBack(prog(lt, .2, .5)), .02); bigText(ctx, "NAK BERITAHU?!", W / 2, 430, 74, "#FFD23F", easeBack(prog(lt, .3, .6)), -.02); }
  },

  SC02(ctx, lt, d, T) {
    const j = prog(lt, .3, .8);
    scene2(ctx, { x: 540, y: 980, z: 1.15 + .05 * easeOut(prog(lt, .3, .6)) }, c => corridor(c, T), () => {
      person(ctx, 540, 2170 - Math.sin(Math.PI * j) * 160, 1420, { p: "AMIR", pose: j > 0 && j < 1 ? "armsUp" : { la: [.12, .05], ra: [.5, 2.3] }, face: { eyes: "sparkle", mouth: "grin", blush: .6 }, squash: j > 0 && j < 1 ? -.12 : 0, t: T });
      sparkles(ctx, 14, 3, lt, [200, 400, 680, 800], "#FFF3C4");
    }, 2);
  },

  SC03(ctx, lt, d, T) {
    scene2(ctx, { x: 540, y: 1000, z: 1.03 + lt * .02 }, c => corridor(c, T), () => {
      flowersBloom(ctx, lt * .7 + .3, 61, 10); bokeh(ctx, 12, 5, T);
      person(ctx, 380, 2170 - Math.abs(Math.sin(lt * 9)) * 14, 1320, { p: "AMIR", pose: walkP(lt), face: { eyes: "happy", mouth: Math.sin(lt * 8) > 0 ? "open" : "grin", look: 1 }, t: T });
      person(ctx, 720, 2170 - Math.abs(Math.sin(lt * 9 + 1.5)) * 14, 1300, { p: "AINA", pose: walkP(lt + .3, .18), face: { eyes: "happy", mouth: "smile", look: -1 }, t: T });
      petals(ctx, 14, 2, T);
    });
    lightLeak(ctx, .25);
  },

  SC04(ctx, lt, d, T) {
    const funny = lt > 1.6;
    scene2(ctx, { x: 560, y: 1050, z: 1.06 }, CANT(), () => {
      const a = person(ctx, 330, 2150, 1330, { p: "AMIR", pose: funny ? "cheeks" : { la: [.3, 1.4], ra: [1.0, .6] }, face: funny ? { eyes: "spiral", mouth: "open" } : { eyes: "happy", mouth: "grin", look: 1 }, t: T });
      if (funny) ell(ctx, a.headX, a.headY + a.hr * .95, a.hr * .13, a.hr * .18, "#E86B6B", 4);
      person(ctx, 770, 2150, 1310, { p: "AINA", pose: funny ? { la: [.3, 1.4], ra: [.4, 2.8] } : "holdFront", face: funny ? { eyes: "happy", mouth: "open", blush: 1 } : { eyes: "sparkle", mouth: "smile", look: -1 }, t: T, rot: funny ? Math.sin(lt * 12) * .02 : 0 });
      canteenTable(ctx, 1640); kuih(ctx, funny ? 560 : lerp(420, 600, easeOut(prog(lt, .2, 1.0))), 1600, .9);
      if (funny) for (let i = 0; i < 5; i++) { const k = ((lt * .8 + i / 5) % 1); heart(ctx, 770 + Math.sin(i * 2 + lt) * 140, 800 - k * 400, 22 + 10 * k, "#FF6F91", 3); }
    });
  },

  SC05(ctx, lt, d, T) {
    scene2(ctx, { x: 540, y: 900, z: 1.45 }, CANT(), () => {
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: lt > .9 ? { la: [.12, .05], ra: [.3, 2.4] } : "stand", face: { eyes: "normal", wink: lt > .5, mouth: "smirk", blush: .4 }, hold: lt > .9 ? { r: "thumbsUp" } : {}, t: T });
    }, 4);
    [[180, 380, .2], [180, 520, .6], [180, 660, 1.0]].forEach(([x, y, t0]) => { const s = easeBack(prog(lt, t0, t0 + .3)); if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -50, -50, 100, 100, 18, "#FFFFFF", 6); ctx.lineWidth = 14; ctx.strokeStyle = "#27AE60"; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(-5, 22); ctx.lineTo(30, -25); ctx.stroke(); ctx.restore(); });
  },

  SC06(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 980, z: 1.1, rot: Math.sin(lt * .9) * .03 }, () => {
      heartPattern(ctx, lt); bokeh(ctx, 16, 6, T); flowersBloom(ctx, lt * .6 + .4, 71, 10);
      person(ctx, 540, 2150, 1400, { p: "AMIR", pose: "hug", face: { eyes: "sparkle", mouth: "smile", blush: 1.2 }, t: T, rot: Math.sin(lt * 2.4) * .04 });
      ctx.save(); ctx.translate(540, 1420); ctx.rotate(-.1); rr(ctx, -150, -90, 300, 180, 12, "#FFC7DA", 7); poly(ctx, [[-150, -90], [0, 20], [150, -90]], null, 7); heart(ctx, 0, 10, 34, "#FF3D6E", 4); ctx.restore();
      for (let i = 0; i < 8; i++) { const k = ((lt * .4 + i / 8) % 1); heart(ctx, 540 + Math.sin(i * 3 + lt) * 300, 1300 - k * 1000, 26 + 12 * k, "#FF5C8A", 3); }
    });
    lightLeak(ctx, .3);
  },

  SC07(ctx, lt, d, T) {
    scene2(ctx, { x: 560, y: 1080, z: 1.02 }, CANT(), () => {
      person(ctx, 330, 2150, 1300, { p: "AMIR", pose: "holdFront", face: { eyes: "happy", mouth: Math.sin(lt * 8) > 0 ? "open" : "grin", look: 1, blush: .6 }, t: T });
      person(ctx, 770, 2150, 1290, { p: "AINA", pose: Math.sin(lt * 4) > .2 ? { la: [.3, 1.4], ra: [.4, 2.8] } : "holdFront", face: { eyes: "happy", mouth: "open", look: -1 }, t: T });
      canteenTable(ctx, 1640); kuih(ctx, 540, 1600, .8);
    });
    calendar(ctx, W / 2, 360, lt);
  },

  SC08(ctx, lt, d, T) {
    const shy = lt > 2.2;
    scene2(ctx, { x: 560, y: 1050, z: 1.06 + lt * .025 }, CANT(), () => {
      person(ctx, 330, 2150, 1310, { p: "AMIR", pose: shy ? { la: [.3, 1.4], ra: [.55, 2.85] } : "holdFront", face: shy ? { eyes: "closed", mouth: "wavy", blush: 1.2 } : { eyes: "sparkle", mouth: Math.sin(lt * 7) > 0 ? "open" : "smile", look: 1 }, t: T });
      person(ctx, 770, 2150, 1300, { p: "AINA", pose: shy ? { la: [.3, 1.4], ra: [.4, 2.8] } : "holdFront", face: shy ? { eyes: "happy", mouth: "open", blush: 1 } : { eyes: "sparkle", mouth: Math.sin(lt * 7 + 1.6) > 0 ? "open" : "smile", look: -1 }, t: T });
      canteenTable(ctx, 1640);
    }, 2);
    [["star", 240, .3], ["house", 540, .9], ["cam", 840, 1.5]].forEach(([k, x, t0]) => { const s = easeBack(prog(lt, t0, t0 + .3)); if (s <= 0) return; ctx.save(); ctx.translate(x, 380); ctx.scale(s, s); ell(ctx, 0, 0, 95, 95, "#FFFFFF", 6);
      if (k === "star") star(ctx, 0, 0, 58, "#FFD23F", 5);
      if (k === "house") { poly(ctx, [[-60, -5], [0, -60], [60, -5]], "#E85D75", 5); rr(ctx, -45, -5, 90, 60, 4, "#F7E7B4", 5); rr(ctx, -12, 15, 24, 40, 3, "#8C5A3C", 3); }
      if (k === "cam") { rr(ctx, -60, -35, 120, 80, 12, "#5A6270", 5); ell(ctx, 0, 5, 26, 26, "#A9D6F5", 5); rr(ctx, -30, -50, 40, 18, 4, "#5A6270", 4); }
      ctx.restore(); });
    lightLeak(ctx, .25);
  },

  SC09(ctx, lt, d, T) {
    const g = prog(lt, 0, 1.4);
    scene2(ctx, { x: 560, y: 900, z: 1.35 + lt * .07 }, CANT(.2), () => {
      person(ctx, 560, 2150, 1450, { p: "AINA", pose: "holdFront", face: lt < .5 ? { eyes: "happy", mouth: "smile" } : { eyes: "half", mouth: "flat", blush: .2 }, t: T });
    }, 4);
    ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .55 * g; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore();
    vignette(ctx, lerp(.15, .5, g), "20,10,40");
  },

  SC10(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 880, z: 1.5 + lt * .05 }, CANT(.3), () => {
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: "holdFront", face: { eyes: "half", mouth: talk > .04 ? "talk" : "flat", talk, blush: .2, brow: "worried" }, t: T });
    }, 5);
    ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .45; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore();
    vignette(ctx, .5, "20,10,40");
  },

  SC11(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 520, y: 950, z: 1.3, ...shake(lt, 3) }, CANT(.2), () => {
      person(ctx, 420, 2150, 1450, { p: "AMIR", pose: "shock", face: { eyes: lt < .5 ? "normal" : "shock", mouth: talk > .04 ? "talk" : "wavy", talk, sweat: 1.2, brow: "up" }, t: T });
      thought(ctx, 820, 520, 380, 330, () => { skyGrad(ctx, [[0, "#B9B6C6"], [1, "#DAD7E2"]]);
        person(ctx, 780, 740, 300, { p: "LELAKI-MISTERI", pose: { ra: [.9, .6] }, shadow: false, face: { mouth: "smile" } }); rr(ctx, 860, 590, 54, 46, 8, "#FF8FB1", 4); line(ctx, 887, 590, 887, 636, 6, "#FFFFFF"); });
      if (lt > 1.0) bigText(ctx, "?!", 860, 300, 130 * easeBack(prog(lt, 1.0, 1.3)), "#FF3D6E", 1, .15);
    }, 4);
  },

  SC12(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA"), laugh = lt < .9;
    scene2(ctx, { x: 540, y: 880, z: 1.5 + lt * .06 }, CANT(.35), () => {
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: laugh ? { la: [.3, 1.4], ra: [.4, 2.8] } : "holdFront", face: laugh ? { eyes: "happy", mouth: talk > .04 ? "talk" : "smile", talk, blush: .6 } : { eyes: "half", mouth: talk > .04 ? "talk" : "flat", talk, brow: "worried" }, t: T, rot: laugh ? Math.sin(lt * 16) * .03 : 0 });
    }, 5);
    if (!laugh) { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .45; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    vignette(ctx, laugh ? .2 : .5, "20,10,40");
  },

  SC13(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AMIR"), zp = easeOut(prog(lt, 0, .2));
    cam(ctx, { x: 540, y: lerp(1000, 880, zp), z: lerp(1.2, 1.65, zp), ...shake(lt, 22 * (1 - prog(lt, .1, 1.2))) }, () => {
      burst(ctx, 540, 820, "#2A1F4A", "#3E2F6E", 22, lt * .8);
      for (const [x, y] of [[150, 380], [930, 330], [900, 880], [170, 900]]) bolt(ctx, x, y, 100, "#FFD23F");
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: "shock", face: { eyes: "shock", mouth: talk > .04 ? "jaw" : "o", sweat: 1.3, brow: "up", pale: true }, squash: -.15 * (1 - prog(lt, 0, .3)), t: T });
    });
    flash(ctx, 1 - prog(lt, 0, .15));
  },

  SC14(ctx, lt, d, T) {
    scene2(ctx, { x: 540, y: 1000, z: 1.2 }, CANT(.6), () => {
      person(ctx, 540, 2150, 1400, { p: "AMIR", face: { eyes: "half", mouth: "flat", pale: true }, t: 0, live: false });
      const lx = lerp(1200, -200, prog(lt, 0, 1.6)); ell(ctx, lx, 800 + Math.sin(lt * 6) * 40, 40, 20, "#C77B3C", 4, lt * 4);
    }, 3);
    ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .7; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore();
    vignette(ctx, .6, "20,10,40");
  },

  SC15(ctx, lt, d, T) {
    cam(ctx, { x: 760, y: 1050, z: 1.15 + lt * .04 }, () => {
      classroom(ctx, T, { dusk: 1, desks: false });
      deskChair(ctx, 860, 1690, 1.3); rr(ctx, 750, 1450, 220, 200, 20, "#C9A26E", 6); for (const dx of [770, 950]) line(ctx, dx, 1650, dx, 1900, 14, "#2F6B4F");
      motes(ctx, 40, 4, T, [500, 200, 700, 1400]); petals(ctx, 10, 8, T * .6, ["#FF8CC0", "#FFC4D3"]);
    });
    grade(ctx, "#FFB27A", .2, "soft-light"); vignette(ctx, .55, "40,10,30");
  },

  SC16(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 900, z: 1.45 + lt * .03 }, CANT(.7), () => {
      const pr = person(ctx, 540, 2150, 1450, { p: "AINA", pose: { la: [.35, 1.55], ra: [.35, 1.55] }, face: { eyes: "half", mouth: talk > .04 ? "talk" : "flat", talk, brow: "worried", look: 0 }, t: T, rot: .03 });
      for (let i = 0; i < 2; i++) ell(ctx, 540 + Math.sin(lt * 6 + i * 2) * 30, 1520 + i * 10, 26, 22, "#F2C9A5", 4);
    }, 5);
    rays(ctx, 1080, 100, 2.4, .5, 5, 1800, T, "255,180,120", .18); grade(ctx, "#FF9E6E", .18, "soft-light");
  },

  SC17(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 540, y: 880, z: 1.5 }, CANT(.6), () => {
      glow(ctx, 540, 800, 560, "255,220,190", .5);
      const pr = person(ctx, 540, 2150, 1450, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: talk > .04 ? "talk" : "smile", talk, blush: 1 }, t: T });
      tear(ctx, pr.headX - pr.hr * .62, pr.headY + pr.hr * .45, 14, prog(lt, 1.2, 3.5)); tear(ctx, pr.headX + pr.hr * .62, pr.headY + pr.hr * .45, 14, prog(lt, 1.8, 3.8));
      petals(ctx, 16, 3, T * .7, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]);
    }, 5);
    grade(ctx, "#FFB27A", .15, "soft-light"); lightLeak(ctx, .25);
  },

  SC18(ctx, lt, d, T) {
    scene2(ctx, { x: 540, y: 900, z: 1.45 + lt * .04 }, CANT(.8), () => {
      const pr = person(ctx, 540, 2150, 1450, { p: "AMIR", face: { eyes: "half", mouth: "smile", blush: .3 }, t: T });
      tear(ctx, pr.headX + pr.hr * .5, pr.headY + pr.hr * .45, 13, prog(lt, 2.4, 4.2));
      heartCrack(ctx, 540, 1400, 120, prog(lt, .8, 3.2));
    }, 5);
    grade(ctx, "#5A4E8C", .2, "multiply"); vignette(ctx, .55, "20,10,40");
  },

  SC19(ctx, lt, d, T) {
    cam(ctx, { x: lerp(500, 580, lt / d), y: 960, z: 1.02 }, () => {
      skyGrad(ctx, [[0, "#FFD9B8"], [1, "#FFC1CF"]]); bokeh(ctx, 18, 3, T); motes(ctx, 30, 6, T);
      const P = [[260, 420, -.12, 0], [800, 380, .1, .4], [300, 980, .08, .8], [790, 960, -.1, 1.2]];
      P.forEach(([x, y, r, t0], i) => { const s = easeOut(prog(lt, t0, t0 + .5)); if (s <= 0) return; polaroid(ctx, x, y + Math.sin(lt * 1.2 + i) * 14, s * 1.05, r, () => {
        if (i === 0) { ctx.save(); ctx.rotate(.6); rr(ctx, -16, -100, 32, 180, 10, "#E53935", 5); ell(ctx, 0, -100, 16, 10, "#FFFFFF"); ctx.restore(); }
        if (i === 1) { rr(ctx, -95, -110, 190, 190, 8, "#FFFDF4", 4); ctx.fillStyle = "#2E4BB5"; ctx.font = "italic 800 40px Inter"; ctx.fillText("AINA", -70, -50); heart(ctx, 50, -62, 16, "#FF3D6E"); for (let k = 0; k < 3; k++) line(ctx, -70, -10 + k * 35, 60, -10 + k * 35, 4, "#2E4BB5"); }
        if (i === 2) bekal(ctx, 0, -10, .8);
        if (i === 3) { rr(ctx, -100, -110, 200, 190, 6, "#D8AE78", 4); ctx.fillStyle = "#D7263D"; ctx.font = "900 46px Inter"; ctx.textAlign = "center"; ctx.fillText("MISI", 0, -20); ctx.textAlign = "left"; heart(ctx, 0, 30, 24, "#FF3D6E"); }
      }); });
      person(ctx, 540, 2250, 1100, { p: "AMIR", face: { eyes: "half", mouth: "smile", blush: .5, look: 0 }, t: T });
    });
    grade(ctx, "#E8B07A", .18, "soft-light");
  },

  SC20(ctx, lt, d, T) {
    scene2(ctx, { x: 540, y: 1000, z: 1.05 + lt * .03 }, CANT(.85), () => {
      person(ctx, 540, 2150, 1330, { p: "AMIR", pose: { la: [.3, 1.4], ra: [.3, 2.7] }, face: { eyes: "half", mouth: "wavy", look: -.4 }, t: T });
      canteenTable(ctx, 1660, .5);
    }, 4);
    hourglass(ctx, W / 2, 560, 1.15, lerp(.35, .9, lt / d), T);
    grade(ctx, "#5A4E8C", .2, "multiply"); vignette(ctx, .5, "20,10,40");
  },

  SC21(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AMIR");
    scene2(ctx, { x: 540, y: 900, z: 1.45 + lt * .04 }, CANT(.8), () => {
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: "holdFront", face: { eyes: "normal", mouth: talk > .04 ? "talk" : "wavy", talk, blush: 1.1, sweat: .8, brow: "worried", look: .4 }, t: T });
      beatHeart(ctx, 860, 1180, 70, T, 120);
    }, 5);
    grade(ctx, "#FF9E6E", .15, "soft-light");
  },

  SC22(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    scene2(ctx, { x: 560, y: 1040, z: 1.08 + lt * .045 }, CANT(.8), () => {
      glow(ctx, 540, 700, 700, "255,190,140", .45);
      person(ctx, 330, 2150, 1310, { p: "AMIR", pose: "holdFront", face: { eyes: "normal", mouth: "wavy", blush: 1, sweat: .6, look: 1 }, t: T });
      person(ctx, 770, 2150, 1300, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: talk > .04 ? "talk" : "o", talk, brow: "up", look: -1, blush: .6 }, t: T });
      canteenTable(ctx, 1640, .4);
      if (lt > .2) bigText(ctx, "?", 880, 520, 120 * easeBack(prog(lt, .2, .5)), "#FFFFFF", 1, .15);
      beatHeart(ctx, 550, 760, 60, T, 110);
    }, 3);
    grade(ctx, "#FF9E6E", .15, "soft-light");
  },

  SC23(ctx, lt, d, T) {
    scene2(ctx, { x: 560, y: 1040, z: 1.27 + lt * .02 }, CANT(.9), () => {
      person(ctx, 330, 2150, 1310, { p: "AMIR", pose: "holdFront", face: { eyes: "normal", mouth: "wavy", blush: 1, look: 1 }, t: T });
      person(ctx, 770, 2150, 1300, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: "o", look: -1, blush: .6 }, t: T });
      canteenTable(ctx, 1640, .5);
    }, 3);
    ctx.fillStyle = `rgba(0,0,0,${.88 * easeInOut(prog(lt, 0, 1.6))})`; ctx.fillRect(0, 0, W, H);
    const a = prog(lt, .4, 1.0); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.font = "800 64px Inter"; ctx.textAlign = "center"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("BERSAMBUNG KE", W / 2, 720); ctx.fillText("EPISOD 4…", W / 2, 805); ctx.restore(); }
  },

  SC24(ctx, lt, d, T) {
    ctx.fillStyle = "#0E0A14"; ctx.fillRect(0, 0, W, H);
    glow(ctx, W / 2, 820, 620, "255,90,150", .35); sparkles(ctx, 18, 4, lt, [0, 200, W, 1200], "#FFD6E7");
    bigText(ctx, "EPISOD AKHIR", W / 2, 520, 78, "#FFFFFF", easeBack(prog(lt, .05, .35)), -.02, "#E0407A");
    bigText(ctx, "AKU SUKA KAU", W / 2, 700, 110, "#FF5C8A", easeBack(prog(lt, .3, .6)), .02, "#000");
    if (lt > .5) beatHeart(ctx, W / 2, 920, 110 * easeBack(prog(lt, .5, .8)), T, 90);
  },
};
