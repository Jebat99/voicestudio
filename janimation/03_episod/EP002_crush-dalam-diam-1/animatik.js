// EP002 — Crush Dalam Diam #1. Setiap fungsi: (ctx, lt, d, T, env).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, shade, ell, rr, poly, line, star, heart,
   cam, shake, person, head, POSE, runPose, PRESET, SKIN, murid, prop, speedLines, hLines, sparkles, petals, puff, flash, vignette, skyGrad,
   bigText, ground, classroom, deskChair, schoolGate, cloudSky, bokeh, rays, glow, heartPattern, thought, beatHeart, lightLeak, sweat, bougain */

const SCENES = {
  SC01(ctx, lt, d, T) {
    const run = lt < 1.05, x = lerp(-250, 560, easeOut(prog(lt, 0, 1.05)));
    cam(ctx, { x: lerp(420, 540, prog(lt, 0, 1.1)), y: 980, z: 1.05 }, () => {
      classroom(ctx, T, { desks: true }); bokeh(ctx, 14, 2, T);
      person(ctx, x, 2150, 1350, { p: "AMIR", pose: run ? runPose(lt, 1.3) : "stand", face: run ? { eyes: "normal", mouth: "open" } : { eyes: "sparkle", mouth: "grin", blush: .5 },
        squash: !run ? -.1 * (1 - prog(lt, 1.05, 1.3)) : 0, t: T });
      if (!run) sparkles(ctx, 10, 4, lt, [250, 500, 600, 700], "#FFF3C4");
    });
    if (run) hLines(ctx, 16, 3, lt, 1, "rgba(255,255,255,.6)");
    lightLeak(ctx, .25);
  },

  SC02(ctx, lt, d, T) {
    const drag = lt < .9, x = drag ? lerp(220, 620, easeInOut(prog(lt, 0, .9))) : 620;
    cam(ctx, { x: 560, y: 1050, z: 1.08 + lt * .03 }, () => {
      classroom(ctx, T, { desks: false });
      if (drag) { person(ctx, x - 160, 2150, 1300, { p: "AMIR", pose: "holdFront", face: { eyes: "sus", mouth: "smirk", look: 1 }, t: T, rot: -.06 }); deskChair(ctx, x + 120, 1800, 1.1); }
      else { seated(ctx, x, 1640, 1250, { p: "AMIR", pose: "holdFront", face: { eyes: "half", mouth: "flat", brow: "up", look: 1 }, hold: { both: "book" }, t: T });
        sparkles(ctx, 12, 9, lt, [380, 900, 480, 400], "#FFF3C4"); }
    });
    lightLeak(ctx, .2);
  },

  SC03(ctx, lt, d, T) {
    const wp = easeOut(prog(lt, 0, .3)), toAmir = lt > 1.25;
    if (!toAmir) cam(ctx, { x: lerp(200, 830, wp), y: 980, z: lerp(1, 1.25, easeOut(prog(lt, .3, 1.25))) }, () => {
      classroom(ctx, T); bokeh(ctx, 18, 5, T);
      seated(ctx, 860, 1600, 1250, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: "smile", look: 1 }, t: T });
      petals(ctx, 18, 3, T, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]);
    });
    else cam(ctx, { x: 540, y: 900, z: lerp(2.0, 2.25, prog(lt, 1.25, 2.1)) }, () => {
      skyGrad(ctx, PINK); flowersBloom(ctx, lt - 1.25, 7); bokeh(ctx, 14, 8, T);
      person(ctx, 540, 2150, 1400, { p: "AMIR", face: { eyes: "sparkle", mouth: "wavy", blush: 1 }, t: T });
      steam(ctx, 540, 640, T);
    });
    if (lt < .3) hLines(ctx, 20, 6, lt, 1, `rgba(255,255,255,${.8 * (1 - wp)})`);
    const hb = Math.max(0, 1 - Math.abs(T - 5.25) * 5) + Math.max(0, 1 - Math.abs(T - 5.85) * 5);
    if (lt > .5 && lt < 1.25) beatHeart(ctx, 230, 430, 90 * (1 + hb * .4), T, 0);
    if (toAmir) beatHeart(ctx, 760, 1080, 80, T, 150);
    lightLeak(ctx, .3); if (lt > 1.2 && lt < 1.3) flash(ctx, .4, "#FFE3EC");
  },

  SC04(ctx, lt, d, T) {
    const cut = lt >= .14, flat = lt > .75;
    cam(ctx, { x: 540, y: 900, z: 2.25 }, () => {
      if (!cut) { skyGrad(ctx, PINK); flowersBloom(ctx, 2, 7); } else classroom(ctx, 0, { desks: false, noRays: true });
      person(ctx, 540, 2150, 1400, { p: "AMIR", face: flat ? { eyes: "half", mouth: "flat", sweat: 1, blush: .3 } : { eyes: "sparkle", mouth: "wavy", blush: 1 }, t: cut ? 6.8 : T, live: !cut || flat });
    });
    if (cut && lt < .5) { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  },

  SC05(ctx, lt, d, T) {
    const sad = lt > 1.0, sp = prog(lt, 1.0, 1.35);
    cam(ctx, { x: 540, y: 1000, z: 1.02 }, () => {
      classroom(ctx, T, { desks: false });
      const P = sad ? Object.assign({}, PRESET.AMIR, { skin: "stone", hairCol: "#6E6E78", top: Object.assign({}, PRESET.AMIR.top, { c: "#D6D6DA", tie: "#8A8A92" }), bot: { t: "pants", c: "#8A8A92" }, backpack: "#A4A4AC" }) : "AMIR";
      ctx.save(); ctx.translate(800, 1750); ctx.scale(lerp(1, .62, easeOut(sp)), lerp(1, .62, easeOut(sp)));
      person(ctx, 0, 0, 1000, { p: P, pose: sad ? { la: [.05, 0], ra: [.05, 0] } : { la: [.12, .05], ra: [2.6 + Math.sin(lt * 18) * .35, .2] }, face: sad ? { eyes: "half", mouth: "wavy" } : { eyes: "happy", mouth: "grin" }, t: T });
      ctx.restore();
      if (sad) soul(ctx, 800, 1750 - 1000 * .62 * .82, lt);
      person(ctx, 250, 2150, 1300, { p: murid("P", 3), pose: "holdFront", face: { eyes: "happy", mouth: "open" }, t: T });
      person(ctx, 520, 2200, 1360, { p: "AINA", pose: Math.sin(lt * 6) > 0 ? "holdFront" : "stand", face: { eyes: "happy", mouth: "open", look: -1 }, t: T });
    });
  },

  SC06(ctx, lt, d, T) {
    cam(ctx, { x: lerp(540, 700, easeInOut(prog(lt, 0, 4))), y: lerp(1050, 850, easeInOut(prog(lt, 0, 4))), z: 1 + lt * .05 }, () => {
      classroom(ctx, T, { desks: false }); bokeh(ctx, 16, 11, T);
      seated(ctx, 380, 1620, 1250, { p: "AMIR", pose: { la: [.3, 1.4], ra: [.25, 2.75] }, face: { eyes: "half", mouth: "smile", blush: .8, look: 1 }, t: T });
      thought(ctx, 760, 560, 440, 380, () => { skyGrad(ctx, PINK); ctx.save(); ctx.translate(760, 600); head(ctx, 0, 0, 120, PRESET.AINA, { eyes: "sparkle", mouth: "smile", blush: .7 }, 6, 1100); ctx.restore(); });
      for (let i = 0; i < 6; i++) { const k = ((lt * .5 + i / 6) % 1); heart(ctx, 520 + Math.sin(i * 2 + lt) * 90, 1000 - k * 500, 22 + 10 * k, "#FF6F91", 3); }
    });
    lightLeak(ctx, .35);
  },

  SC07(ctx, lt, d, T) {
    const st = lt * .45, laugh = lt > 1.45;
    cam(ctx, { x: 540, y: 820, z: 1.75 + st * .12 }, () => {
      heartPattern(ctx, st); glow(ctx, 540, 760, 600, "255,255,255", .65); bokeh(ctx, 20, 4, st * 2);
      person(ctx, 540, 2150, 1400, { p: "AINA", pose: laugh ? { la: [.12, .05], ra: [.4, 2.8] } : "stand",
        face: laugh ? { eyes: "happy", mouth: "open" } : { eyes: "sparkle", mouth: "smile", look: lerp(-1, 0, easeOut(prog(lt, 0, 1))) }, t: T * .5, rot: Math.sin(st * 3) * .02 });
      petals(ctx, 26, 6, st);
    });
    sparkles(ctx, 14, 3, lt, [0, 200, W, 900], "#FFFFFF"); lightLeak(ctx, .3);
  },

  SC08(ctx, lt, d, T) {
    const got = lt > .7;
    cam(ctx, { x: 540, y: 1050, z: 1.05 }, () => {
      classroom(ctx, T, { desks: false });
      if (!got) for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(560 + i * 90, 2000 + (i % 2) * 30); ctx.rotate(i * .5 - .4); rr(ctx, -70, -50, 140, 100, 8, ["#5DADE2", "#F5B041", "#AF7AC5"][i], 5); ctx.restore(); }
      person(ctx, 800, 2150, 1300, { p: murid("P", 8), pose: got ? "holdFront" : "stand", face: got ? { eyes: "happy", mouth: "smile" } : { eyes: "normal", mouth: "o", sweat: .7, look: -1 }, hold: got ? { both: "book" } : {}, t: T });
      person(ctx, 360, 2150, 1320, { p: "AINA", pose: got ? { la: [.12, .05], ra: [1.2, .3] } : { la: [.9, .4], ra: [.9, .4] }, face: { eyes: "sparkle", mouth: "smile", look: 1 }, rot: got ? 0 : .15, t: T });
      sparkles(ctx, 10, 5, lt, [200, 600, 700, 500], "#FFF3C4");
    });
    lightLeak(ctx, .25);
  },

  SC09(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 980, z: 1.1, rot: Math.sin(lt * .8) * .03 }, () => {
      heartPattern(ctx, lt); flowersBloom(ctx, lt * .7 + .6, 21, 10); bokeh(ctx, 16, 2, T);
      person(ctx, 600, 2150, 1400, { p: "AMIR", pose: { la: [.6, 1.6], ra: [.3, 2.5] }, face: { eyes: "sparkle", mouth: "smile", blush: 1, look: 1 }, rot: Math.sin(lt * 2.4) * .04, t: T });
      rr(ctx, 120, -100, 260, 2400, 10, "#B98A5A", 8); rr(ctx, 360, -100, 40, 2400, 6, "#8C6440", 6);
      for (let i = 0; i < 8; i++) { const k = ((lt * .4 + i / 8) % 1); heart(ctx, 480 + Math.sin(i * 3 + lt) * 260, 1300 - k * 1000, 26 + 12 * k, "#FF5C8A", 3); }
    });
    lightLeak(ctx, .3);
  },

  SC10(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 1000, z: 1.04 + lt * .03 }, () => {
      classroom(ctx, T, { desks: false });
      seated(ctx, 540, 1640, 1300, { p: "AMIR", pose: "holdFront", face: lt > 3.1 ? { eyes: "sus", mouth: "smirk" } : { eyes: "half", mouth: "flat", look: Math.sin(lt * 3) }, hold: { both: "book" }, t: T });
      const icons = [["chair", 230, 520, .9], ["eraser", 540, 400, 1.7], ["hand", 850, 520, 2.5]];
      for (const [k, x, y, t0] of icons) { const s = 95 * easeBack(prog(lt, t0, t0 + .3)); if (s > 2) icon(ctx, k, x, y, s); }
      if (lt > 3.1) bulb(ctx, 540, 170 + 0, 70 * easeBack(prog(lt, 3.1, 3.4)), lt);
    });
  },

  SC11(ctx, lt, d, T) {
    const step = Math.min(5, Math.floor(lt / .33)), x = 260 + step * 70 + easeOut((lt % .33) / .33) * 0;
    cam(ctx, { x: 560, y: 1000, z: 1 }, () => {
      classroom(ctx, T, { desks: false });
      seated(ctx, 860, 1600, 1150, { p: "AINA", pose: "holdFront", face: { eyes: "half", mouth: "smile", look: -.3 }, hold: { both: "book" }, t: T });
      person(ctx, x, 2000, 1150, { p: "AMIR", pose: { la: [.4, 1.2], ra: [.4, 1.2], ll: [1.2, -1.4], rl: [1.2, -1.4] }, face: { eyes: "sus", mouth: "smirk", look: 1 }, t: T, rot: Math.sin(lt * 19) * .03 });
      rr(ctx, x - 140, 1810, 280, 34, 8, "#D9A86C", 4); for (const dx of [-120, 110]) line(ctx, x + dx, 1844, x + dx, 2010, 12, "#2F6B4F");
      if ((lt % .33) < .12) puff(ctx, x - 160, 2000, 34, "#E9E0D0", .9);
    });
  },

  SC12(ctx, lt, d, T) {
    const fall = prog(lt, .15, .55), got = lt > .85;
    cam(ctx, { x: 640, y: 1100, z: 1.12 }, () => {
      classroom(ctx, T, { desks: false });
      seated(ctx, 450, 1620, 1200, { p: "AMIR", pose: got ? "stand" : { la: [.12, .05], ra: [1.0, .6] }, face: got ? { eyes: "closed", mouth: "grin", blush: .6 } : { eyes: "sus", mouth: "smirk", look: 1 }, t: T });
      seated(ctx, 860, 1620, 1200, { p: "AINA", pose: got ? { la: [.12, .05], ra: [.2, 1.0] } : "holdFront", face: got ? { eyes: "sparkle", mouth: "smile", look: -1 } : { eyes: "normal", mouth: "o", look: -1 }, hold: got ? { l: "eraser" } : {}, t: T });
      if (!got) { const ex = lerp(640, 700, fall), ey = lerp(1500, 2020, easeIn(fall)) - (fall >= 1 ? Math.abs(Math.sin((lt - .55) * 12)) * 60 * Math.max(0, 1 - (lt - .55) * 3) : 0); ctx.save(); ctx.translate(ex, ey); ctx.rotate(lt * 8); prop(ctx, "eraser", 0, 0, 1200, lt, 1); ctx.restore(); }
      if (got) sparkles(ctx, 12, 7, lt, [250, 500, 400, 500], "#FFF3C4");
    });
  },

  SC13(ctx, lt, d, T) {
    const up = lt > .1, proud = lt > 1.7;
    cam(ctx, { x: 560, y: 980, z: up ? lerp(1, 1.08, easeOut(prog(lt, .1, .35))) : 1, ...shake(lt, up && lt < .5 ? 10 : 0) }, () => {
      classroom(ctx, T, { desks: false });
      person(ctx, 210, 2150, 1450, { p: "CIKGU-ROS", pose: { la: [.12, .05], ra: [.3, 1.4] }, face: { eyes: "half", mouth: "flat", brow: lt > 1 ? "up" : "normal", look: 1 }, hold: { r: "ruler" }, t: T });
      seated(ctx, 520, 1780, 1000, { p: "AINA", pose: "holdFront", face: { eyes: proud ? "sparkle" : "normal", mouth: "smile", look: proud ? 1 : -1 }, t: T }, 1.05);
      person(ctx, 820, 2100 - (up ? 120 : 0), 1380, { p: "AMIR", pose: up ? (proud ? "armsUp" : { la: [.12, .05], ra: [3.0, .05] }) : "stand",
        face: proud ? { eyes: "closed", mouth: "grin", blush: .7 } : { eyes: "sparkle", mouth: "open" }, squash: up ? -.15 * (1 - prog(lt, .1, .35)) : 0, t: T });
      if (up) rr(ctx, 690, 1985, 260, 34, 8, "#D9A86C", 4);
      if (proud) sparkles(ctx, 16, 8, lt, [600, 300, 450, 700], "#FFE27A");
    });
    if (up && lt < .55) speedLines(ctx, 820, 500, 26, 4, lt, "rgba(255,255,255,.8)", 250);
  },

  SC14(ctx, lt, d, T) {
    cam(ctx, { x: 560, y: 1050, z: 1.15 }, () => {
      classroom(ctx, T, { desks: false });
      seated(ctx, 540, 1640, 1300, { p: "AINA", pose: { la: [.5, 1.2], ra: [.5, 1.2 + Math.sin(lt * 14) * .3] }, face: { eyes: "normal", mouth: "wavy", brow: "worried", sweat: .8 }, t: T });
      rr(ctx, 600, 1500, 260, 200, 30, "#F7A8C4", 6); rr(ctx, 600, 1500, 260, 50, 20, "#E98DB0", 5);
      const items = [["#5DADE2", .3], ["#F5B041", .9], ["#7BD389", 1.5], ["#FFFFFF", 2.1]];
      for (const [c, t0] of items) { const k = prog(lt, t0, t0 + .7); if (k <= 0 || k >= 1) continue; const x = 730 + k * 260, y = 1500 - Math.sin(k * Math.PI) * 420; ctx.save(); ctx.translate(x, y); ctx.rotate(k * 6); rr(ctx, -55, -40, 110, 80, 10, c, 5); ctx.restore(); }
      if (lt > 1.2) { const s = easeBack(prog(lt, 1.2, 1.5)); bigText(ctx, "?", 300, 520, 160 * s, "#FFFFFF", 1, -.2); bigText(ctx, "?", 820, 440, 120 * s, "#FFFFFF", 1, .2); }
    });
  },

  SC15(ctx, lt, d, T) {
    const st = lt * .55;
    cam(ctx, { x: 560, y: 900, z: 1.15 + st * .1 }, () => {
      classroom(ctx, T * .5, { desks: false }); rays(ctx, 1080, 0, 2.3, .7, 7, 2200, T, "255,240,210", .3); bokeh(ctx, 16, 9, st * 2);
      person(ctx, 520, 2300, 1600, { p: "AMIR", pose: { la: [.12, .05], ra: [lerp(.3, 1.35, easeOut(prog(lt, 0, 1.1))), lerp(1.4, .1, easeOut(prog(lt, 0, 1.1)))] }, face: { eyes: "sparkle", mouth: "smirk" }, hold: { r: "pen" }, t: T * .5 });
      petals(ctx, 20, 2, st, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]);
    });
    const tw = Math.max(0, Math.sin(lt * 7)); if (lt > .9) star(ctx, 990, 760, 40 + tw * 30, "#FFFFFF", 0, 4, .2);
    lightLeak(ctx, .25);
  },

  SC16(ctx, lt, d, T, env) {
    const talk = T > 40.9 && T < 41.8 ? env(T) : 0;
    cam(ctx, { x: 540, y: 820, z: 1.7 + lt * .05 }, () => {
      heartPattern(ctx, lt, "#FFE9F1", "#FFC9DC"); glow(ctx, 540, 780, 640, "255,255,255", .7); flowersBloom(ctx, lt, 41, 14); bokeh(ctx, 18, 7, T);
      person(ctx, 540, 2150, 1400, { p: "AINA", pose: "holdFront", face: { eyes: talk > .04 ? "happy" : "sparkle", mouth: talk > .04 ? "talk" : "smile", talk, blush: 1 }, hold: { both: "pen" }, t: T });
    });
    if (T > 40.9) { sparkles(ctx, 18, 5, lt, [0, 150, W, 1000], "#FFFFFF"); }
    lightLeak(ctx, .3);
  },

  SC17(ctx, lt, d, T) {
    const hb = Math.max(0, 1 - Math.abs(T - 42.05) * 6) + Math.max(0, 1 - Math.abs(T - 42.6) * 6);
    cam(ctx, { x: 540, y: 950, z: 1.9 + hb * .06 }, () => {
      skyGrad(ctx, [[0, "#FF9EBB"], [1, "#FFD1E0"]]); flowersBloom(ctx, 2, 13);
      person(ctx, 540, 2150, 1400, { p: Object.assign({}, PRESET.AMIR, { skin: "light" }), pose: "cheeks", face: { eyes: "happy", mouth: "wavy", blush: 1.4, sweat: .5 }, t: T });
      ctx.save(); ctx.globalAlpha = .35; ell(ctx, 540, 920, 160, 150, "#FF3D6E"); ctx.restore();
      steam(ctx, 540, 650, T, 4);
      beatHeart(ctx, 540, 1350, 110 * (1 + hb * .5), T, 0);
    });
  },

  SC18(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: lerp(1050, 900, lt / d), z: 1 }, () => {
      cloudSky(ctx, T);
      const by = Math.sin(lt * 2.2) * 30;
      puff(ctx, 540, 1720 + by, 230, "#FFFFFF", 1); puff(ctx, 350, 1760 + by, 150, "#FFF2F7", 1); puff(ctx, 740, 1760 + by, 160, "#FFF2F7", 1);
      person(ctx, 540, 1660 + by, 1250, { p: "AMIR", pose: { la: [2.4 + Math.sin(lt * 4) * .15, .3], ra: [2.4 - Math.sin(lt * 4) * .15, .3], ll: [.3 + Math.sin(lt * 6) * .3, -.4], rl: [-.2, 0] }, face: { eyes: "happy", mouth: "grin", blush: 1 }, t: T, rot: Math.sin(lt * 1.5) * .06 });
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + lt * .7; heart(ctx, 540 + Math.cos(a) * 420, 1000 + Math.sin(a) * 360 + by, 26 + 6 * Math.sin(lt * 4 + i), "#FF6F91", 3); }
    });
    lightLeak(ctx, .3);
  },

  SC19(ctx, lt, d, T) {
    const stop = lt > 1.3, x = stop ? lerp(700, 640, easeOut(prog(lt, 1.3, 1.6))) : lerp(1000, 700, prog(lt, 0, 1.3));
    cam(ctx, { x: 560, y: 1000, z: 1.02 }, () => {
      classroom(ctx, T, { dusk: 1, desks: true });
      const walk = stop ? null : Math.sin(lt * 9) * .3;
      person(ctx, x, 2150, 1380, { p: "AMIR", flip: true, pose: walk === null ? "stand" : { la: [.15 - walk, .1], ra: [.15 + walk, .1], ll: [walk * .6, 0], rl: [-walk * .6, 0] }, face: stop ? { eyes: "normal", mouth: "flat", look: 1 } : { eyes: "happy", mouth: "o" }, t: T });
      if (!stop) for (let i = 0; i < 3; i++) { const k = ((lt * 1.2 + i / 3) % 1); ctx.fillStyle = INK; ctx.font = `900 ${50 + k * 10}px Inter`; ctx.globalAlpha = 1 - k; ctx.fillText("♪", x - 200 - k * 60, 850 - k * 200); ctx.globalAlpha = 1; }
    });
    vignette(ctx, lerp(.15, .55, prog(lt, .1, 1.5)), "40,10,30");
  },

  SC20(ctx, lt, d, T) {
    cam(ctx, { x: lerp(560, 610, lt / d), y: lerp(1050, 1000, lt / d), z: 1 + lt * .04 }, () => {
      schoolGate(ctx, T);
      person(ctx, 520, 1680, 760, { p: "AINA", pose: Math.sin(lt * 4) > .3 ? { la: [.12, .05], ra: [.4, 2.6] } : "holdFront", face: { eyes: "happy", mouth: Math.sin(lt * 7) > 0 ? "open" : "smile", look: 1 }, t: T });
      person(ctx, 720, 1690, 860, { p: "LELAKI-MISTERI", pose: { la: [.12, .05], ra: [.6 + Math.sin(lt * 3) * .3, 1.1] }, face: { eyes: "normal", mouth: "smile", look: -1 }, t: T });
      rr(ctx, -140, -200, 400, 2400, 14, "#E8DCC8", 8); rr(ctx, 200, -200, 60, 2400, 6, "#CBBEA8", 6);
      person(ctx, 250, 2450, 1700, { p: "AMIR", pose: { la: [.12, .05], ra: [1.6, 1.4] }, face: { eyes: "sus", mouth: "flat", look: 1 }, t: T });
      rr(ctx, -140, -200, 330, 2400, 14, "#E8DCC8", 8);
    });
    vignette(ctx, .5, "40,10,30");
  },

  SC21(ctx, lt, d, T) {
    const give = prog(lt, .4, 1.3), got = lt > 1.3;
    cam(ctx, { x: lerp(560, 580, give), y: lerp(1000, 880, give), z: 1.05 + give * .25 }, () => {
      schoolGate(ctx, T);
      person(ctx, 770, 2200, 1550, { p: "LELAKI-MISTERI", pose: got ? "stand" : { la: [.12, .05], ra: [lerp(.3, 1.1, give), lerp(1.4, .7, give)] }, face: { eyes: "normal", mouth: "smile", look: -1 }, hold: got ? {} : { r: "giftPink" }, t: T });
      person(ctx, 360, 2200, 1400, { p: "AINA", pose: got ? "hug" : "stand", face: got ? { eyes: "sparkle", mouth: "open", blush: 1 } : { eyes: "normal", mouth: "o", look: 1 }, hold: got ? { both: "giftPink" } : {}, t: T });
      if (got) sparkles(ctx, 14, 3, lt, [180, 900, 400, 500], "#FFF3C4");
    });
    vignette(ctx, .45, "40,10,30");
  },

  SC22(ctx, lt, d, T) {
    const stone = lt > .12, sp = prog(lt, .12, .35);
    cam(ctx, { x: 540, y: 1000, z: 1.05, ...shake(lt, stone && lt < .4 ? 8 : 0) }, () => {
      schoolGate(ctx, T);
      ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .7 * sp; ctx.fillStyle = "#808080"; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore();
      const P = stone ? Object.assign({}, PRESET.AMIR, { skin: "stone", hairCol: "#7C7C86", eye: "#6E6E78", top: Object.assign({}, PRESET.AMIR.top, { c: "#D2D2D6", tie: "#8E8E96", tieStripe: "#B8B8C0" }), bot: { t: "pants", c: "#8E8E96" }, shoe: "#C9C9CC", backpack: null, pen: "#9A9AA2" }) : "AMIR";
      person(ctx, 540, 2150, 1450, { p: P, face: stone ? { eyes: "shock", mouth: "flat" } : { eyes: "normal", mouth: "smile" }, t: stone ? 0 : T, live: !stone });
      if (stone) { ctx.save(); ctx.lineWidth = 6; ctx.strokeStyle = INK; for (const [a, b, c2, e] of [[470, 600, 520, 700], [520, 700, 480, 780], [620, 1000, 660, 1120], [660, 1120, 600, 1250], [430, 1300, 470, 1420]]) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c2, e); ctx.stroke(); } ctx.restore();
        const by = lerp(1250, 2050, easeIn(prog(lt, .2, .7))); rr(ctx, 260, by - 200, 220, 280, 40, "#3D7DD8", 6); }
      const lx = lerp(1200, -200, prog(lt, .3, 1.5)); ell(ctx, lx, 900 + Math.sin(lt * 6) * 40, 40, 20, "#C77B3C", 4, lt * 4);
    });
    vignette(ctx, .55, "20,10,30");
  },

  SC23(ctx, lt, d, T) {
    const beats = [57.4, 58.05, 58.65, 59.2, 59.7, 60.15]; let hb = 0; for (const b of beats) hb = Math.max(hb, 1 - Math.abs(T - b) * 7);
    cam(ctx, { x: 540, y: 860, z: 1 + lt * .07 + hb * .03 }, () => {
      skyGrad(ctx, [[0, "#D9A27E"], [1, "#C98F6B"]]);
      line(ctx, 160, 420, 900, 380, 46, "#1B1620");
      ctx.save(); ctx.beginPath(); ctx.moveTo(110, 860); ctx.quadraticCurveTo(540, 470, 970, 860); ctx.quadraticCurveTo(540, 1180, 110, 860); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.clip();
      const g = ctx.createRadialGradient(540, 880, 40, 540, 880, 280); g.addColorStop(0, "#2A160C"); g.addColorStop(.55, "#6B3E26"); g.addColorStop(1, "#3A2012"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(540, 880, 280, 0, TAU); ctx.fill();
      ell(ctx, 540, 880, 120 + hb * 14, 120 + hb * 14, "#0B0604");
      ctx.save(); ctx.globalAlpha = .55; // pantulan AINA + lelaki
      ctx.beginPath(); ctx.arc(480, 960, 34, Math.PI, TAU); ctx.lineTo(530, 1060); ctx.lineTo(430, 1060); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      rr(ctx, 570, 930, 50, 26, 8, "#FFFFFF"); ell(ctx, 600, 965, 26, 28, "#FFFFFF"); rr(ctx, 575, 990, 60, 80, 12, "#FFFFFF"); rr(ctx, 520, 1000, 36, 30, 4, "#FF8FB1");
      ctx.restore();
      ell(ctx, 450, 770, 70, 55, "#FFFFFF"); ell(ctx, 640, 990, 26, 22, "#FFFFFF");
      const tear = prog(lt, 1.4, 2.6); if (tear > 0) { ctx.save(); ctx.globalAlpha = .55 * tear; ctx.fillStyle = "#9FD8FF"; ctx.fillRect(0, 1030 - 80 * tear, W, 300); ctx.restore(); }
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(110, 860); ctx.quadraticCurveTo(540, 470, 970, 860); ctx.lineWidth = 22; ctx.strokeStyle = "#1B1620"; ctx.stroke();
      for (let i = 0; i < 7; i++) { const u = .2 + i * .1, x = (1 - u) ** 2 * 110 + 2 * (1 - u) * u * 540 + u * u * 970, y = (1 - u) ** 2 * 860 + 2 * (1 - u) * u * 470 + u * u * 860;
        line(ctx, x, y, x + (u - .5) * 120, y - 70 - Math.sin(u * Math.PI) * 20, 12, "#1B1620"); }
      ctx.beginPath(); ctx.moveTo(110, 860); ctx.quadraticCurveTo(540, 1180, 970, 860); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
      if (lt > 2.6) { const k = prog(lt, 2.6, 3.4); ctx.beginPath(); ctx.moveTo(700, 1030 + k * 500); ctx.quadraticCurveTo(735, 1090 + k * 500, 700, 1110 + k * 500); ctx.quadraticCurveTo(665, 1090 + k * 500, 700, 1030 + k * 500); ctx.fillStyle = "#9FD8FF"; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
    });
    vignette(ctx, .7, "30,0,10"); if (hb > .6) flash(ctx, (hb - .6) * .4, "#7A0018");
  },

  SC24(ctx, lt, d, T) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    const beats = [60.78, 61.5, 62.25, 63.0]; let hb = 0; for (const b of beats) hb = Math.max(hb, 1 - Math.abs(T - b) * 5);
    ctx.save(); ctx.globalAlpha = .25 + hb * .35; glow(ctx, W / 2, 760, 600, "200,0,40", 1); ctx.restore();
    const s1 = easeBack(prog(lt, .03, .3)) * (1 + hb * .08);
    if (s1 > 0) { const sx = noise(lt, 2) * 6 * hb; bigText(ctx, "SIAPA LELAKI", W / 2 + sx, 700, 118, "#FF2D55", s1, -.03, "#000"); bigText(ctx, "TU?!", W / 2 + sx, 860, 170, "#FF2D55", s1, .03, "#000"); }
    const a2 = prog(T, 61.4, 61.9);
    if (a2 > 0) { ctx.save(); ctx.globalAlpha = a2; ctx.font = "800 64px Inter"; ctx.textAlign = "center"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("BERSAMBUNG KE", W / 2, 1100); ctx.fillText("EPISOD 2…", W / 2, 1185); ctx.restore(); }
  },
};
