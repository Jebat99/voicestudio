// EP003 — Crush Dalam Diam #2: Strategi Nak Dekat Dengan Aina! Setiap fungsi: (ctx, lt, d, T, env).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, shade, ell, rr, poly, line, star, heart,
   cam, shake, person, head, runPose, PRESET, murid, prop, speedLines, hLines, sparkles, petals, confetti, puff, flash, vignette, skyGrad,
   bigText, classroom, deskChair, bokeh, rays, glow, heartPattern, thought, beatHeart, lightLeak, sweat, blurred, stamp, bedroom,
   strategyBoard, corridor, seated, steam, icon, bulb, flowersBloom, PINK, talkAmt, cape, bekal, openBook */

const KELAS = (o = {}) => (c, T) => classroom(c, T, o);
function bgBlur(ctx, T, px = 3, o = {}) { blurred(ctx, px, c => classroom(c, T, o)); }
function marks(ctx, lt, pts) { for (const [x, y, s, r] of pts) bigText(ctx, "?", x, y, s * easeBack(prog(lt, 0, .3)), "#FFFFFF", 1, r); }
function walkPose(lt, k = .25) { const w = Math.sin(lt * 9) * k; return { la: [.15 - w, .1], ra: [.15 + w, .1], ll: [w * .6, 0], rl: [-w * .6, 0] }; }

const SCENES = {
  SC01(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 1000, z: 1.05 + lt * .03 }, () => {
      blurred(ctx, 3, c => bedroom(c, T));
      person(ctx, 380, 1700, 1150, { p: "AMIR", pose: "hug", face: { eyes: "half", mouth: "flat", look: 1, blush: .2 }, t: T, shadow: false });
      rr(ctx, 230, 1380, 300, 220, 60, "#FFFFFF", 7);
      rr(ctx, -100, 1560, 900, 420, 40, "#C9B6E8", 7); rr(ctx, -100, 1660, 900, 80, 0, "#B7A1DD");
      thought(ctx, 770, 560, 440, 380, () => { skyGrad(ctx, [[0, "#9C9AA8"], [1, "#C9C7D2"]]);
        person(ctx, 700, 760, 300, { p: Object.assign({}, PRESET["LELAKI-MISTERI"], { top: { t: "jacket", c: "#6E7380", inner: "#A0A0A8" } }), pose: { ra: [.9, .6] }, shadow: false });
        rr(ctx, 790, 590, 60, 50, 8, "#D9A3B8", 4); line(ctx, 820, 590, 820, 640, 6, "#FFFFFF"); });
    });
    vignette(ctx, .35, "20,10,50");
  },

  SC02(ctx, lt, d, T) {
    const fade = lerp(1, .22, easeInOut(prog(lt, .6, 2.6))), ax = lerp(1150, -120, prog(lt, 1.0, 4.4));
    cam(ctx, { x: 540, y: 1000, z: 1.05 }, () => {
      bgBlur(ctx, T, 2, { desks: false });
      ctx.save(); ctx.globalAlpha = fade;
      person(ctx, 400, 2150, 1350, { p: "AMIR", pose: lt < 2 ? { la: [.12, .05], ra: [2.6 + Math.sin(lt * 14) * .3, .2] } : "stand", face: lt < 2 ? { eyes: "happy", mouth: "grin" } : { eyes: "half", mouth: "wavy", look: 1 }, t: T });
      ctx.restore();
      person(ctx, ax, 2170, 1360, { p: "AINA", flip: true, pose: walkPose(lt), face: { eyes: "happy", mouth: "smile" }, t: T });
      if (lt > 2.4) { ctx.save(); ctx.globalAlpha = .7 * prog(lt, 2.4, 2.8); bigText(ctx, "…", 400, 560, 120, "#FFFFFF"); ctx.restore(); }
    });
    ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = "#3B4A8C"; ctx.fillRect(0, 0, W, H); ctx.restore();
  },

  SC03(ctx, lt, d, T) {
    const jump = prog(lt, .15, .5), up = lt > .15, shades = lt > .95;
    cam(ctx, { x: 540, y: 1000, z: 1.1 + .1 * easeOut(prog(lt, .15, .4)), ...shake(lt, up && lt < .6 ? 10 : 0) }, () => {
      blurred(ctx, 2, c => bedroom(c, T));
      if (up) speedLines(ctx, 540, 820, 30, 8, lt, "rgba(255,240,200,.6)", 300);
      const y = 2150 - Math.sin(Math.PI * jump) * 220;
      person(ctx, 540, y, 1450, { p: "AMIR", pose: up ? (lt > 1.4 ? { la: [.12, .05], ra: [.6, 2.4] } : "armsUp") : "hug", face: shades ? { eyes: "normal", shades: true, mouth: "smirk" } : { eyes: "sparkle", mouth: "grin", brow: "angry" },
        squash: up ? (jump < .5 ? -.2 : .08 * (1 - prog(lt, .5, .7))) : .15, t: T });
      if (shades) sparkles(ctx, 8, 2, lt, [380, 700, 340, 200], "#FFFFFF");
    });
    if (lt > .15 && lt < .3) flash(ctx, .5, "#FFF6C8");
  },

  SC04(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 900, z: 1.02 }, () => {
      strategyBoard(ctx, T);
      ctx.save(); ctx.translate(540, 760); head(ctx, 0, 0, 95, PRESET.AINA, { eyes: "sparkle", mouth: "smile", blush: .7 }, 5, 900); ctx.restore();
      heart(ctx, 610, 640, 30, "#FF3D6E", 3);
      icon(ctx, "chair", 250, 520, 60); icon(ctx, "eraser", 820, 470, 60); icon(ctx, "hand", 300, 950, 60);
      ctx.save(); ctx.translate(780, 960); ctx.fillStyle = "#2E4BB5"; ctx.font = "700 34px Inter"; ctx.textAlign = "center"; ctx.fillText("KANTIN?", 0, 10); ctx.restore();
      person(ctx, 230, 2200, 1250, { p: "AMIR", pose: { la: [.12, .05], ra: [2.2, .2] }, face: { eyes: "normal", shades: true, mouth: "smirk" }, hold: { r: "ruler" }, t: T });
    });
    const k = easeBack(prog(lt, .05, .35));
    if (k > 0) { bigText(ctx, "MISI DEKATI", W / 2, 300, 100, "#FFFFFF", k, -.04, "#D7263D"); bigText(ctx, "AINA!", W / 2, 420, 130, "#FF3D6E", easeBack(prog(lt, .2, .5)), .04); }
  },

  SC05(ctx, lt, d, T) {
    const run = lt > .9 && lt < 2.5, x = lerp(-250, 600, easeOut(prog(lt, .9, 2.5)));
    cam(ctx, { x: 540, y: 1000, z: 1.03 }, () => {
      classroom(ctx, T, { desks: true }); bokeh(ctx, 10, 3, T);
      if (lt > .9) person(ctx, x, 2150, 1350, { p: "AMIR", pose: run ? runPose(lt, 1.3) : { la: [.12, .05], ra: [.5, 2.6] }, face: run ? { eyes: "normal", mouth: "open" } : { eyes: "sparkle", mouth: "grin", look: Math.sin(lt * 3) }, t: T });
    });
    if (run) hLines(ctx, 14, 4, lt, 1, "rgba(255,255,255,.55)");
    const k = lt < 1.6 ? prog(lt, 0, .22) : 1 - prog(lt, 1.6, 1.9); stamp(ctx, "STRATEGI #1", k);
  },

  SC06(ctx, lt, d, T) {
    const drop = prog(lt, .5, .9), proud = lt > 1.4;
    cam(ctx, { x: 620, y: 1050, z: 1.08 + lt * .02 }, () => {
      classroom(ctx, T, { desks: false });
      deskChair(ctx, 880, 1690, 1.3); rr(ctx, 600, 1640, 180, 34, 8, "#D9A86C", 4); for (const dx of [610, 760]) line(ctx, dx, 1674, dx, 1900, 14, "#2F6B4F");
      const by = lerp(1250, 1500, easeIn(drop)) - (drop >= 1 ? Math.abs(Math.sin((lt - .9) * 10)) * 40 * Math.max(0, 1 - (lt - .9) * 2) : 0);
      rr(ctx, 620, by, 150, 150, 36, "#3D7DD8", 6); rr(ctx, 645, by + 70, 100, 60, 14, "#2C64B8", 5);
      person(ctx, 380, 2150, 1380, { p: "AMIR", pose: proud ? { la: [.12, .05], ra: [.55, 2.75 + Math.sin(lt * 6) * .1] } : { la: [.12, .05], ra: [1.0, .3] }, face: proud ? { eyes: "closed", mouth: "smirk", blush: .5 } : { eyes: "normal", mouth: "smile", look: 1 }, t: T });
      if (proud) sparkles(ctx, 12, 6, lt, [220, 450, 360, 360], "#FFF3C4");
    });
    lightLeak(ctx, .2);
  },

  SC07(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    cam(ctx, { x: 540, y: 900, z: 1.35 + lt * .03 }, () => {
      bgBlur(ctx, T, 4); bokeh(ctx, 16, 9, T);
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: { la: [.12, .05], ra: [2.2 + Math.sin(lt * 10) * .25, .4] }, face: { eyes: "sparkle", mouth: talk > .04 ? "talk" : "smile", talk, blush: .9 }, t: T, rot: Math.sin(lt * 2) * .015 });
    });
    lightLeak(ctx, .3);
  },

  SC08(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AMIR");
    cam(ctx, { x: 540, y: 900, z: 1.45 + .08 * easeOut(prog(lt, 0, .25)) }, () => {
      bgBlur(ctx, T, 4);
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: { la: [.12, .05], ra: [.55, 2.85] }, face: { eyes: "normal", mouth: talk > .04 ? "talk" : "wavy", talk, blush: 1.2, sweat: 1, look: .6 }, t: T, rot: noise(lt * 2) * .02 });
      steam(ctx, 540, 520, T);
    });
  },

  SC09(ctx, lt, d, T) {
    const step = Math.min(4, Math.floor(prog(lt, 1.0, 3.6) * 5)), bx = 170 + step * 45;
    cam(ctx, { x: 560, y: 1000, z: 1.02 }, () => {
      classroom(ctx, T, { desks: false });
      person(ctx, 700, 2120, 1250, { p: murid("P", 12), pose: "holdFront", face: { eyes: "happy", mouth: "open", look: 1 }, t: T });
      person(ctx, 930, 2150, 1300, { p: "AINA", pose: Math.sin(lt * 5) > 0 ? { la: [.12, .05], ra: [.4, 2.8] } : "holdFront", face: { eyes: "happy", mouth: Math.sin(lt * 7) > 0 ? "open" : "smile", look: -1 }, t: T });
      person(ctx, bx, 2150, 1300, { p: "AMIR", face: { eyes: "sus", shades: lt < 0, mouth: "flat", look: 1 }, t: T });
      rr(ctx, bx - 220, 1180, 440, 560, 18, "#8E44AD", 9); rr(ctx, bx - 190, 1230, 380, 80, 10, "#F7E7B4", 4); line(ctx, bx - 220, 1460, bx + 220, 1460, 6, "#6C2E8A");
    });
    const k = lt < 1.5 ? prog(lt, 0, .22) : 1 - prog(lt, 1.5, 1.8); stamp(ctx, "STRATEGI #2", k);
  },

  SC10(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 960, z: 1 + lt * .015, rot: -.03 }, () => {
      skyGrad(ctx, [[0, "#D9C2A0"], [1, "#C9AE88"]]);
      rr(ctx, 110, 170, 860, 1180, 20, "#FFFDF4", 8); for (let i = 0; i < 14; i++) line(ctx, 170, 330 + i * 72, 930, 330 + i * 72, 3, "rgba(80,120,200,.35)");
      for (let i = 0; i < 11; i++) ell(ctx, 110, 230 + i * 100, 22, 30, null, 7); line(ctx, 230, 170, 230, 1350, 3, "rgba(229,57,53,.5)");
      ctx.fillStyle = "#2E4BB5"; ctx.font = "italic 800 66px Inter"; ctx.fillText("AINA", 270, 300); heart(ctx, 470, 280, 26, "#FF3D6E", 3);
      const items = [["Suka coklat", .55, "choc"], ["Suka kucing", 2.45, "cat"], ["Suka tengok filem", 3.25, "film"]];
      items.forEach(([txt, t0, ic], i) => {
        const k = prog(lt, t0, t0 + .55); if (k <= 0) return; const y = 470 + i * 260;
        ctx.save(); ctx.beginPath(); ctx.rect(250, y - 70, 560 * k, 100); ctx.clip(); ctx.fillStyle = "#2E4BB5"; ctx.font = "italic 700 60px Inter"; ctx.fillText(txt, 270, y); ctx.restore();
        const s = easeBack(prog(lt, t0 + .4, t0 + .7));
        if (s > 0) { ctx.save(); ctx.translate(820, y - 20); ctx.scale(s, s);
          if (ic === "choc") { rr(ctx, -70, -40, 140, 80, 8, "#6B3E26", 5); rr(ctx, -70, -40, 60, 80, 8, "#C9302C", 4); }
          if (ic === "cat") { ell(ctx, 0, 0, 62, 54, "#F5B041", 5); poly(ctx, [[-55, -25], [-40, -78], [-15, -45]], "#F5B041", 5); poly(ctx, [[55, -25], [40, -78], [15, -45]], "#F5B041", 5); ell(ctx, -22, -5, 8, 10, INK); ell(ctx, 22, -5, 8, 10, INK); line(ctx, -8, 20, 8, 20, 4); }
          if (ic === "film") { ell(ctx, 0, 0, 60, 60, "#3A3A44", 5); for (let a = 0; a < 5; a++) ell(ctx, Math.cos(a * 1.26) * 32, Math.sin(a * 1.26) * 32, 13, 13, "#FFFFFF", 3); }
          ctx.restore();
          ctx.save(); ctx.globalAlpha = s > 1 ? 1 : s; ctx.lineWidth = 12; ctx.strokeStyle = "#27AE60"; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(185, y - 30); ctx.lineTo(205, y - 5); ctx.lineTo(240, y - 60); ctx.stroke(); ctx.restore(); }
      });
      const cur = items.filter(it => lt > it[1]).length - 1, it = items[Math.max(0, cur)], k = prog(lt, it[1], it[1] + .55);
      const px = 270 + 560 * k, py = 470 + Math.max(0, cur) * 260; ctx.save(); ctx.translate(px, py - 10); ctx.rotate(.6); rr(ctx, -14, -190, 28, 200, 8, "#F7D046", 5); poly(ctx, [[-14, 10], [14, 10], [0, 50]], "#F4E3C1", 4); ctx.restore();
    });
  },

  SC11(ctx, lt, d, T) {
    const choc = lt > 1.5;
    cam(ctx, { x: 540, y: 1000, z: 1.12 }, () => {
      bgBlur(ctx, T, 3, { desks: false });
      seated(ctx, 540, 1640, 1350, { p: "AMIR", pose: choc ? { la: [.3, 1.4], ra: [1.3, .3] } : { la: [.3, 1.4], ra: [.35, 1.3 + Math.sin(lt * 30) * .2] }, face: choc ? { eyes: "sparkle", mouth: "grin", blush: .5 } : { eyes: "sus", mouth: "flat" }, hold: choc ? { r: "choc", l: "book" } : { l: "book" }, t: T, rot: choc ? 0 : Math.sin(lt * 9) * .03 });
    });
    if (!choc) hLines(ctx, 6, 3, lt, 1, "rgba(255,255,255,.4)");
  },

  SC12(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 980, z: 1.08 + lt * .03 }, () => {
      classroom(ctx, T, { desks: false }); rays(ctx, 540, 600, -Math.PI / 2, TAU, 14, 1400, T, "255,240,180", .25);
      cape(ctx, 540, 2200, 1500, T);
      person(ctx, 540, 2200, 1500, { p: "AMIR", pose: { la: [.9, -1.6], ra: [.9, -1.6] }, face: { eyes: "sparkle", mouth: "grin" }, t: T });
      sparkles(ctx, 14, 5, lt, [200, 300, 680, 700], "#FFF3C4");
    });
    const k = lt < 1.5 ? prog(lt, 0, .22) : 1 - prog(lt, 1.5, 1.8); stamp(ctx, "STRATEGI #3", k);
  },

  SC13(ctx, lt, d, T) {
    const enter = easeOut(prog(lt, 1.6, 2.2)), here = lt > 1.6;
    cam(ctx, { x: 600, y: 1050, z: 1.08 }, () => {
      classroom(ctx, T, { desks: false });
      seated(ctx, 820, 1640, 1300, { p: "AINA", pose: here ? "holdFront" : { la: [.3, 1.4], ra: [.5, 2.9 + Math.sin(lt * 14) * .1] }, face: here ? { eyes: "sparkle", mouth: "smile", look: -1, blush: .8 } : { eyes: "normal", mouth: "wavy", brow: "worried", sweat: .7 }, t: T });
      openBook(ctx, 820, 1560, .55, false);
      if (!here) marks(ctx, lt, [[700, 620, 110, -.2], [960, 560, 90, .2]]);
      if (here) { const x = lerp(-200, 380, enter); cape(ctx, x, 2150, 1350, T); person(ctx, x, 2150, 1350, { p: "AMIR", pose: { la: [.12, .05], ra: [1.1, .2] }, face: { eyes: "sparkle", mouth: "grin" }, t: T }); sparkles(ctx, 10, 4, lt, [x - 200, 600, 400, 700], "#FFF3C4"); }
    });
  },

  SC14(ctx, lt, d, T) {
    const zp = easeOut(prog(lt, .6, .9));
    cam(ctx, { x: 540, y: lerp(1000, 1300, zp), z: lerp(1.15, 1.6, zp) }, () => {
      bgBlur(ctx, T, 3, { desks: false });
      person(ctx, 540, 2150, 1450, { p: "AMIR", pose: "holdFront", face: { eyes: zp > .5 ? "shock" : "normal", mouth: "wavy", sweat: 1.2, blush: .3 }, t: T });
      openBook(ctx, 540, 1440, .8, true);
    });
    if (lt > .9) for (let i = 0; i < 3; i++) sweat(ctx, 200 + i * 340, 400 + ((lt * 300 + i * 120) % 500), 34);
  },

  SC15(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    cam(ctx, { x: 540, y: 950, z: 1.3 }, () => {
      bgBlur(ctx, T, 4);
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: talk > .04 ? "talk" : "smile", talk, look: .3 }, t: T, rot: .03 });
      rr(ctx, 380, 1290, 320, 400, 16, "#5DADE2", 8); rr(ctx, 410, 1340, 260, 70, 8, "#FFFFFF", 4);
      ctx.fillStyle = "#2E4BB5"; ctx.font = "900 40px Inter"; ctx.textAlign = "center"; ctx.fillText("MATEMATIK", 540, 1390); ctx.textAlign = "left";
      ctx.fillStyle = "#FFFFFF"; ctx.font = "900 90px Inter"; ctx.textAlign = "center"; ctx.fillText("x²", 540, 1560); ctx.textAlign = "left";
    });
    lightLeak(ctx, .25);
  },

  SC16(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AMIR");
    cam(ctx, { x: 540, y: 950, z: 1.3 }, () => {
      bgBlur(ctx, T, 4);
      person(ctx, 500, 2150, 1450, { p: "AMIR", pose: lt > .9 ? { la: [.12, .05], ra: [.3, 2.4] } : "stand", face: { eyes: "sparkle", mouth: talk > .04 ? "talk" : "grin", talk, sweat: .45 }, hold: lt > .9 ? { r: "thumbsUp" } : {}, t: T });
      if (lt > .9) star(ctx, 900, 980, 40 + 20 * Math.abs(Math.sin(lt * 6)), "#FFFFFF", 0, 4, .25);
    });
  },

  SC17(ctx, lt, d, T) {
    cam(ctx, { x: 540, y: 960, z: 1.02, ...shake(lt, 6) }, () => {
      skyGrad(ctx, [[0, "#3A2A22"], [1, "#5A4636"]]);
      rr(ctx, -100, -100, W + 200, 620, 0, "#8C6440", 8); for (let i = 0; i < 6; i++) line(ctx, -100, 80 + i * 80, W + 100, 70 + i * 82, 4, "rgba(43,30,26,.35)");
      ell(ctx, 260, 1900, 330, 260, "#24452F", 8); ell(ctx, 820, 1900, 330, 260, "#24452F", 8);
      openBook(ctx, 540, 1300, 1.2, false);
      const fl = (lt * 3.2) % 1; ctx.save(); ctx.translate(540, 1300); ctx.scale(Math.cos(fl * Math.PI), 1); poly(ctx, [[0, -195], [270, -215], [270, 180], [0, 205]], "#FFFFFF", 7); ctx.restore();
      ell(ctx, 300, 1520, 70, 60, "#E7B48F", 7); ell(ctx, 780 - fl * 240, 1480 - Math.sin(fl * Math.PI) * 120, 70, 60, "#E7B48F", 7);
      const sy = [["x²+y²", 220, 760, "#E53935"], ["π", 840, 700, "#2E86AB"], ["√9", 520, 620, "#8E44AD"], ["÷", 900, 960, "#27AE60"], ["?!", 160, 1000, "#FFFFFF"]];
      sy.forEach(([t, x, y, c], i) => bigText(ctx, t, x + Math.sin(lt * 3 + i) * 25, y + Math.cos(lt * 2.5 + i) * 25, 90, c, 1, Math.sin(lt * 2 + i) * .2));
      for (let i = 0; i < 4; i++) sweat(ctx, 200 + i * 220, 600 + ((lt * 500 + i * 160) % 900), 30);
    });
  },

  SC18(ctx, lt, d, T) {
    cam(ctx, { x: 620, y: 1050, z: 1.1 }, () => {
      classroom(ctx, T, { desks: false });
      seated(ctx, 420, 1640, 1300, { p: "AMIR", pose: { la: [.3, 1.4], ra: [.55, 2.85 + Math.sin(lt * 16) * .12] }, face: { eyes: "spiral", mouth: "wavy", sweat: 1, blush: .4 }, t: T });
      seated(ctx, 860, 1640, 1300, { p: "AINA", pose: { la: [.3, 1.4], ra: [.4, 2.8] }, face: { eyes: "happy", mouth: "open", look: -1, blush: .9 }, t: T, rot: Math.sin(lt * 10) * .02 });
      sparkles(ctx, 10, 8, lt, [700, 600, 380, 400], "#FFF3C4");
    });
  },

  SC19(ctx, lt, d, T) {
    cam(ctx, { x: 620, y: 1050, z: 1.05 + lt * .03 }, () => {
      classroom(ctx, T, { desks: false }); bokeh(ctx, 18, 4, T);
      seated(ctx, 420, 1640, 1300, { p: "AMIR", pose: "holdFront", face: { eyes: Math.sin(lt * 4) > .6 ? "happy" : "sparkle", mouth: Math.sin(lt * 9) > 0 ? "open" : "grin", look: 1, blush: .7 }, t: T });
      seated(ctx, 860, 1640, 1300, { p: "AINA", pose: Math.sin(lt * 3) > .5 ? { la: [.3, 1.4], ra: [.4, 2.8] } : "holdFront", face: { eyes: "happy", mouth: Math.sin(lt * 7 + 1) > 0 ? "open" : "smile", look: -1 }, t: T });
      petals(ctx, 18, 9, T, ["#FF8CC0", "#FFC4D3", "#FFFFFF"]);
    });
    lightLeak(ctx, .3);
  },

  SC20(ctx, lt, d, T) {
    const g = easeOut(prog(lt, .1, 1.1)), bloom = easeBack(prog(lt, .95, 1.35));
    cam(ctx, { x: 540, y: 1000, z: 1.0 }, () => {
      blurred(ctx, 5, c => { classroom(c, T, { desks: false });
        seated(c, 360, 1500, 1150, { p: "AMIR", pose: "holdFront", face: { eyes: "happy", mouth: Math.sin(lt * 8) > 0 ? "open" : "grin", look: 1, blush: .6 }, t: T });
        seated(c, 760, 1500, 1150, { p: "AINA", pose: Math.sin(lt * 4) > .3 ? { la: [.3, 1.4], ra: [.4, 2.8] } : "holdFront", face: { eyes: "happy", mouth: "open", look: -1 }, t: T }); });
      rr(ctx, -60, 1520, 1200, 500, 20, "#D9A86C", 8);
      poly(ctx, [[440, 1440], [640, 1440], [610, 1600], [470, 1600]], "#C0553E", 7); rr(ctx, 425, 1420, 230, 40, 10, "#D86A50", 6);
      const top = 1430 - 520 * g; line(ctx, 540, 1430, 540 + Math.sin(lt * 2) * 10, top, 14, "#3E8E41");
      for (const [k, s] of [[.4, -1], [.65, 1]]) if (g > k) ell(ctx, 540 + s * 60, 1430 - 520 * k, 60 * easeOut(prog(g, k, k + .2)), 26, "#59B36A", 5, s * .5);
      if (bloom > 0) { glow(ctx, 540, top, 260 * bloom, "255,170,200", .6); heart(ctx, 540, top + 20, 110 * bloom, "#FF5C8A", 7); sparkles(ctx, 10, 3, lt, [340, top - 200, 400, 300], "#FFFFFF"); }
    });
    lightLeak(ctx, .3);
  },

  SC21(ctx, lt, d, T) {
    const ax = lerp(1250, 800, easeOut(prog(lt, 0, 2.2))), walking = lt < 2.2, startle = lt > 2.4;
    const pf = prog(lt, 2.5, 3.6), penY = 1400 - Math.sin(pf * Math.PI) * 420, penR = pf * 12;
    cam(ctx, { x: 600, y: 1050, z: 1.05 }, () => {
      classroom(ctx, T, { desks: false }); bokeh(ctx, 12, 7, T);
      seated(ctx, 400, 1640, 1300, { p: "AMIR", pose: startle ? (pf < 1 && pf > 0 ? "shock" : "holdFront") : { la: [.3, 1.4], ra: [.4, 1.3 + Math.sin(lt * 20) * .15] }, face: startle ? (pf < 1 ? { eyes: "shock", mouth: "o", sweat: .8, brow: "up" } : { eyes: "sparkle", mouth: "grin", blush: 1 }) : { eyes: "half", mouth: "flat" }, hold: pf >= 1 ? { r: "pen" } : {}, t: T });
      if (pf > 0 && pf < 1) { ctx.save(); ctx.translate(560, penY); ctx.rotate(penR); prop(ctx, "pen", 0, 0, 1300, lt, 1); ctx.restore(); }
      person(ctx, ax, 2170, 1360, { p: "AINA", flip: true, pose: walking ? walkPose(lt, .2) : "holdFront", face: { eyes: "sparkle", mouth: "smile", look: -1, blush: .8 }, t: T });
      bekal(ctx, ax - 10, 1500, .9);
    });
  },

  SC22(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AINA");
    cam(ctx, { x: 540, y: 900, z: 1.35 + lt * .04 }, () => {
      heartPattern(ctx, lt, "#FFE9F1", "#FFC9DC"); glow(ctx, 540, 780, 640, "255,255,255", .7); flowersBloom(ctx, lt, 31, 12); bokeh(ctx, 16, 2, T);
      person(ctx, 540, 2150, 1450, { p: "AINA", pose: "holdFront", face: { eyes: "sparkle", mouth: talk > .04 ? "talk" : "smile", talk, blush: 1 }, t: T, rot: .025 });
      bekal(ctx, 540, 1450, 1.1);
    });
    lightLeak(ctx, .3);
  },

  SC23(ctx, lt, d, T, env) {
    const talk = talkAmt(T, env, "AMIR"), j = prog(lt, .05, .7);
    cam(ctx, { x: 540, y: 950, z: 1.2 + .1 * easeOut(prog(lt, 0, .2)) }, () => {
      blurred(ctx, 3, c => classroom(c, T, { desks: false })); confetti(ctx, 40, 5, lt);
      person(ctx, 540, 2150 - Math.sin(Math.PI * j) * 200, 1450, { p: "AMIR", pose: "armsUp", face: { eyes: "star", mouth: talk > .04 ? "talk" : "open", talk: Math.max(.35, talk), blush: 1 }, squash: j < .15 ? .15 : j > .9 ? .12 : -.1, t: T });
    });
    if (lt < .12) flash(ctx, .4, "#FFF6C8");
  },

  SC24(ctx, lt, d, T) {
    const b = Math.sin(lt * 9);
    cam(ctx, { x: 540, y: 1000, z: 1.02 + lt * .02 }, () => {
      corridor(ctx, T); flowersBloom(ctx, lt * .8 + .3, 51, 14); bokeh(ctx, 14, 3, T);
      person(ctx, 380, 2170 - Math.abs(b) * 14, 1320, { p: "AMIR", pose: walkPose(lt, .22), face: { eyes: "happy", mouth: "grin", blush: .9 }, t: T });
      person(ctx, 720, 2170 - Math.abs(Math.sin(lt * 9 + 1.5)) * 14, 1300, { p: "AINA", pose: { la: [.3, 1.5], ra: [.3, 1.5] }, face: { eyes: "sparkle", mouth: "smile", look: -1 }, t: T });
      bekal(ctx, 720, 1580, .8);
      sparkles(ctx, 16, 4, lt, [0, 300, W, 900], "#FFF3C4");
    });
    lightLeak(ctx, .35);
  },

  SC25(ctx, lt, d, T) {
    const grey = prog(lt, 0, 1.2);
    cam(ctx, { x: 560, y: 900, z: 1.3 + lt * .06 }, () => {
      blurred(ctx, 4, c => corridor(c, T));
      person(ctx, 560, 2150, 1450, { p: "AINA", pose: "holdFront", face: lt > .5 ? { eyes: "half", mouth: "flat", look: -1, blush: 0 } : { eyes: "sparkle", mouth: "smile", look: -1 }, t: T, live: lt < .5 || lt > 1.4 });
      bekal(ctx, 560, 1450, 1.0);
    });
    ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .6 * grey; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore();
    vignette(ctx, lerp(.2, .6, grey), "20,10,40");
  },

  SC26(ctx, lt, d, T) {
    const beats = [79.35, 79.9, 80.4]; let hb = 0; for (const b of beats) hb = Math.max(hb, 1 - Math.abs(T - b) * 7);
    cam(ctx, { x: 540, y: 880, z: 1.5 + lt * .1 + hb * .03 }, () => {
      blurred(ctx, 4, c => corridor(c, T));
      person(ctx, 540, 2150, 1450, { p: "AMIR", face: { eyes: "normal", mouth: "o", brow: "worried", sweat: .8, look: 1 }, t: T });
    });
    ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .55; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore();
    marks(ctx, lt, [[230, 420, 120, -.2], [860, 360, 100, .2], [900, 640, 80, .1]]);
    vignette(ctx, .65, "20,10,40");
  },

  SC27(ctx, lt, d, T) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    const beats = [81.1, 81.9, 82.6]; let hb = 0; for (const b of beats) hb = Math.max(hb, 1 - Math.abs(T - b) * 5);
    ctx.save(); ctx.globalAlpha = .25 + hb * .35; glow(ctx, W / 2, 760, 620, "255,60,120", 1); ctx.restore();
    const s1 = easeBack(prog(lt, .03, .3)) * (1 + hb * .08), sx = noise(lt, 2) * 6 * hb;
    if (s1 > 0) { bigText(ctx, "APA YANG AINA", W / 2 + sx, 690, 104, "#FF5C8A", s1, -.03, "#000"); bigText(ctx, "NAK BERITAHU?!", W / 2 + sx, 840, 112, "#FF5C8A", s1, .03, "#000"); }
    const a2 = prog(lt, .6, 1.0);
    if (a2 > 0) { ctx.save(); ctx.globalAlpha = a2; ctx.font = "800 64px Inter"; ctx.textAlign = "center"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("BERSAMBUNG KE", W / 2, 1090); ctx.fillText("EPISOD 3…", W / 2, 1175); ctx.restore(); }
  },
};
