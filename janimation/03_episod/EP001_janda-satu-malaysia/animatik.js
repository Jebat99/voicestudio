// EP001 — animasi setiap scene. Setiap fungsi: (ctx, lt = masa dalam scene, d = durasi, T = masa mutlak, env = amplitud suara).
/* global W, H, INK, TAU, clamp, lerp, prog, easeOut, easeIn, easeInOut, easeBack, rng, noise, shade, ell, rr, poly, line, star, heart,
   cam, shake, person, head, crowdPreset, POSE, runPose, PRESET, prop, speedLines, hLines, sparkles, petals, confetti, puff, bill, bolt,
   flash, burst, vignette, skyGrad, bigText, ground, clouds, tree, palm, skyline, twinTowers, kltower, terraceRow, road, shophouses,
   busStop, kampungHouse, stall, mamakBg, gymBg, weddingStreet, butikBg, dewanBg, officeNikahBg, desk, banglo, towerOffice, studioBg, sweat */

function crowd(ctx, list, t) { list.sort((a, b) => a.y - b.y).forEach(c => person(ctx, c.x, c.y, c.h, Object.assign({ t }, c))); }
function walkers(n, seed, y0, y1, h0, h1, t, speed = 60) {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) {
    const dir = r() < .5 ? -1 : 1, y = lerp(y0, y1, r()), k = (y - y0) / Math.max(1, y1 - y0), h = lerp(h0, h1, k);
    const x = ((r() * (W + 400) + dir * t * speed * (.6 + r() * .6)) % (W + 400) + W + 400) % (W + 400) - 200;
    const p = crowdPreset(r() < .85 ? "W" : "M", seed * 100 + i);
    const ph = r() * 10, sw = Math.sin((t + ph) * 7) * .25;
    out.push({ x, y, h, p, flip: dir < 0, pose: { la: [.15 - sw, .1], ra: [.15 + sw, .1], ll: [sw * .6, 0], rl: [-sw * .6, 0] }, face: { eyes: "happy", mouth: "smile" } });
  }
  return out;
}

const SCENES = {
  SC01(ctx, lt) {
    const zp = easeIn(prog(lt, .85, 1.85)), z = lerp(1, 4.3, zp) + prog(lt, 1.85, 3) * .25;
    cam(ctx, { x: lerp(540, 540, zp), y: lerp(960, 1470, zp), z, ...shake(lt, zp > 0 && zp < 1 ? 10 : 0) }, () => {
      skyGrad(ctx, [[0, "#8EC9F0"], [.55, "#CDEBFA"], [1, "#FFF4DA"]], 0, 1100);
      ell(ctx, 880, 260, 80, 80, "#FFF1B8"); clouds(ctx, lt * 10, 2, 120, 4);
      skyline(ctx, 1110, 1, "#A9C6DD"); kltower(ctx, 230, 1110, 1); twinTowers(ctx, 640, 1110, .95);
      ground(ctx, 1100, "#8BCB6A");
      for (let rI = 0; rI < 5; rI++) {
        const ry = 1150 + rI * 180; rr(ctx, -200, ry + 100, W + 400, 54, 0, "#7A7D84");
        for (let k = 0; k < 14; k++) { rr(ctx, -120 + k * 92, ry, 84, 90, 4, ["#C0533A", "#B5543C", "#A94A33"][(k + rI) % 3], 3); rr(ctx, -120 + k * 92, ry + 60, 84, 32, 0, ["#F7C8C8", "#C8E3F7", "#F7EBC0", "#D3F0D0"][(k * 3 + rI) % 4], 2); }
        const r = rng(40 + rI);
        for (let i = 0; i < 16; i++) { const dir = r() < .5 ? -1 : 1; const x = ((r() * 1400 + dir * lt * 40) % 1400 + 1400) % 1400 - 150;
          const sw = Math.sin(lt * 9 + i) * .3; person(ctx, x, ry + 150, 46, { p: crowdPreset("W", rI * 50 + i), flip: dir < 0, pose: { ll: [sw, 0], rl: [-sw, 0] }, face: { eyes: "happy" } }); }
      }
    });
    if (zp > 0 && zp < 1) speedLines(ctx, W / 2, H * .52, 46, 7, lt, "rgba(255,255,255,.9)", 260);
    const tp = easeBack(prog(lt, .1, .45));
    bigText(ctx, "APA JADI", W * .47, 300, 118, "#FFFFFF", tp, -.04);
    bigText(ctx, "KALAU…?", W * .47, 440, 150, "#FFD23F", easeBack(prog(lt, .25, .6)), .03);
  },

  SC02(ctx, lt) {
    const S = 4.32, shock = lt >= S, sp = prog(lt, S, S + .25);
    const z = shock ? lerp(1, 1.55, easeOut(sp)) : 1 + lt * .01;
    cam(ctx, { x: shock ? lerp(540, 360, easeOut(sp)) : 540, y: shock ? lerp(960, 760, easeOut(sp)) : 960, z, ...shake(lt, shock ? 14 * (1 - prog(lt, S + .3, S + .8)) : 0) }, () => {
      skyGrad(ctx, [[0, "#9ED8F7"], [1, "#E8F6FF"]], 0, 1100); clouds(ctx, lt * 6, 5, 80, 3);
      terraceRow(ctx, -160, 1100, 5, .82, 5); road(ctx, 1100, 520, "#7A7D84");
      crowd(ctx, walkers(12, 21, 1180, 1560, 330, 470, lt, 70), lt);
      const sleepy = lt < 3.6;
      const pose = shock ? "shock" : (lt > 1.6 && lt < 3.4) ? "cupSip" : "cupHold";
      const face = shock ? { eyes: "shock", mouth: "jaw", sweat: 1, brow: "up" } : sleepy ? { eyes: "sleepy", mouth: lt < 1.4 ? "o" : "flat" } : { eyes: "normal", mouth: "flat", look: 1 };
      const pr = person(ctx, 330, 2150, 1550, { p: "HAKIM", pose, face, hold: shock ? {} : { r: "cup" }, squash: shock ? -.15 * (1 - sp) : 0, t: lt });
      if (shock) { // kopi tersembur + cawan terbang
        const k = lt - S;
        for (let i = 0; i < 26; i++) { const a = -1.2 + (i / 26) * .9, v = 1100 + (i % 5) * 160; const x = pr.headX + 40 + Math.cos(a) * v * k, y = pr.headY + pr.hr * .7 + Math.sin(a) * v * k + 1400 * k * k;
          ell(ctx, x, y, 16 - i % 3 * 3, 12, "#6B3E26", 3); }
        const cx = 600 + k * 900, cy = 1500 - k * 900 + 1800 * k * k; ctx.save(); ctx.translate(cx, cy); ctx.rotate(k * 9); prop(ctx, "cup", 0, 0, 1550, lt, 1); ctx.restore();
      }
    });
    if (shock) { speedLines(ctx, 360, 760, 40, 3, lt); flash(ctx, (1 - prog(lt, S, S + .2)) * .85, "#FFF6C8"); }
  },

  SC03(ctx, lt) {
    const wp = easeOut(prog(lt, 0, .35));
    cam(ctx, { x: lerp(1500, 540, wp), y: 960, z: 1 }, () => {
      skyGrad(ctx, [[0, "#9ED8F7"], [1, "#F2FAFF"]], 0, 1250); clouds(ctx, lt * 8, 9, 120, 4);
      palm(ctx, 980, 1250, 620); palm(ctx, 1700, 1250, 700); palm(ctx, -80, 1250, 560);
      kampungHouse(ctx, 40, 1250, 1); stall(ctx, 640, 1250, 1.1, "#E67E22");
      ground(ctx, 1250, "#9CCB6A"); road(ctx, 1380, 260, "#8A8D93", false);
      crowd(ctx, [...walkers(6, 33, 1290, 1420, 380, 450, lt, 30), ...[700, 820, 940].map((x, i) => ({ x, y: 1300, h: 430, p: crowdPreset("W", 70 + i), face: { eyes: "happy", mouth: "smile" } }))], lt);
      // pak cik berbasikal
      const bx = lerp(1250, 560, easeOut(prog(lt, .2, 1.4))), wob = Math.sin(lt * 18) * .12 * prog(lt, 1.2, 1.5) * (1 - prog(lt, 2.2, 2.7)), by = 1820;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(wob);
      for (const dx of [-170, 170]) { ell(ctx, dx, 0, 120, 120, null, 10); ell(ctx, dx, 0, 14, 14, INK); }
      line(ctx, -170, 0, 0, -150, 12, "#C0392B"); line(ctx, 0, -150, 170, 0, 12, "#C0392B"); line(ctx, -170, 0, 40, 0, 12, "#C0392B"); line(ctx, 120, -230, 170, 0, 12, "#C0392B");
      const old = Object.assign({}, crowdPreset("M", 5), { skin: "old", hair: "buzz", hairCol: "#BDBDBD", moustache: "#F2F2F2", top: { t: "shirt", c: "#5DADE2" } });
      const shocked = lt > 1.25;
      person(ctx, 0, 10, 720, { p: old, pose: { la: [.9, 1.1], ra: [.9, 1.1], ll: [1.2, -1.6], rl: [.9, -1.2] }, face: shocked ? { eyes: "shock", mouth: "o", brow: "up", sweat: .7 } : { eyes: "normal", mouth: "smile" } });
      ctx.restore();
    });
    if (wp < 1) hLines(ctx, 30, 4, lt, -1, `rgba(255,255,255,${.8 * (1 - wp)})`);
  },

  SC04(ctx, lt) {
    const p = easeInOut(prog(lt, .2, 2.6));
    cam(ctx, { x: 540, y: lerp(1450, 1150, p), z: lerp(1.35, .82, p) }, () => {
      skyGrad(ctx, [[0, "#BFE6FA"], [1, "#FFF2D6"]], -400, 900);
      shophouses(ctx, -400, 900, 7, .85, 3, false);
      for (let k = -1; k < 5; k++) stall(ctx, k * 330 - 100, 1050, 1.05, k % 2 ? "#2E86AB" : "#E67E22");
      ground(ctx, 1050, "#C9C2B5");
      const list = [];
      for (let rI = 0; rI < 9; rI++) { const y = 1150 + rI * 140, h = 300 + rI * 70, n = 9 - Math.floor(rI / 3);
        for (let i = 0; i < n + 2; i++) { const x = -260 + (i + (rI % 2) * .5) * (1600 / (n + 1)) + Math.sin(lt * 3 + i + rI) * 20;
          list.push({ x, y, h, p: crowdPreset("W", rI * 31 + i), flip: (i + rI) % 2 === 0, pose: { la: [.3, 1.2], ra: [.15, .1] }, face: { eyes: (i + rI) % 3 ? "happy" : "normal", mouth: (i * rI) % 4 ? "smile" : "open" }, hold: (i + rI) % 4 === 0 ? { l: "gift" } : {} }); } }
      crowd(ctx, list, lt);
    });
    const tp = easeBack(prog(lt, 1.9, 2.25)); if (tp > 0) bigText(ctx, "x100", 760, 330, 150, "#FFD23F", tp, .12);
  },

  SC05(ctx, lt) {
    const S = .28, shock = lt >= S;
    cam(ctx, { x: 540, y: 960, z: shock ? 1.06 : 1, ...shake(lt, shock ? 16 * (1 - prog(lt, S + .9, 2)) + 4 : 0) }, () => {
      if (shock) { burst(ctx, 540, 760, "#FFD23F", "#FFF0A0", 22, lt * .6); for (const [x, y] of [[150, 360], [930, 300], [880, 760], [190, 820]]) bolt(ctx, x, y, 90 + noise(lt + x) * 20); }
      else { skyGrad(ctx, [[0, "#9ED8F7"], [1, "#E8F6FF"]], 0, 1300); shophouses(ctx, -120, 1300, 5, 1, 4); ground(ctx, 1300, "#B7B2A8"); }
      const men = [[150, 1980, 1150, 11], [360, 2010, 1180, 12], [760, 2010, 1180, 14], [960, 1980, 1150, 15]];
      const f = shock ? { eyes: "shock", mouth: "jaw", sweat: 1, brow: "up" } : { eyes: "normal", mouth: "smile", look: 1 };
      for (const [x, y, h, s] of men) person(ctx, x, y, h, { p: crowdPreset("M", s), pose: shock ? "shock" : "stand", face: f, squash: shock ? -.12 * (1 - prog(lt, S, S + .25)) : 0 });
      person(ctx, 560, 2080, 1320, { p: "HAKIM", pose: shock ? "shock" : "stand", face: f, squash: shock ? -.15 * (1 - prog(lt, S, S + .25)) : 0 });
    });
    if (shock) flash(ctx, (1 - prog(lt, S, S + .15)), "#FFFFFF");
  },

  SC06(ctx, lt) {
    const bp = prog(lt, 0, .45);
    cam(ctx, { x: 540 + Math.sin(lt * 1.4) * 30, y: 960, z: 1.02 + lt * .025, rot: Math.sin(lt * 1.2) * .025 }, () => {
      skyGrad(ctx, [[0, "#9ED8F7"], [1, "#E8F6FF"]], 0, 1100); terraceRow(ctx, -160, 1100, 5, .82, 5); road(ctx, 1100, 900, "#7A7D84");
      ctx.save(); ctx.globalAlpha = bp; skyGrad(ctx, [[0, "#FFB6D5"], [.5, "#FFD6E8"], [1, "#FFF0F6"]]); ctx.restore();
      sparkles(ctx, 26, 8, lt, [0, 0, W, H], "#FFFFFF");
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + lt * .6; heart(ctx, 540 + Math.cos(a) * 430, 760 + Math.sin(a) * 300, 34 + 8 * Math.sin(lt * 4 + i), "#FF6F91", 3); }
      person(ctx, 540, 2120, 1500, { p: "HAKIM", pose: "cheeks", face: { eyes: "star", mouth: "grin", blush: 1 }, rot: Math.sin(lt * 3) * .035, squash: Math.sin(lt * 5) * .04 });
      petals(ctx, 34, 5, lt);
    });
  },

  SC07(ctx, lt) {
    cam(ctx, { x: 540, y: 1050, z: 1 + lt * .06 }, () => {
      skyGrad(ctx, [[0, "#9ED8F7"], [1, "#E8F6FF"]], 0, 1400); shophouses(ctx, -200, 1400, 6, .9, 6); ground(ctx, 1400, "#B7B2A8");
      busStop(ctx, 80, 1660, 1.5);
      const ppl = [[230, 1980, 1050, 41, "heart"], [560, 2020, 1100, 42, "shock"], [880, 1980, 1050, 43, "star"]];
      for (const [x, y, h, s, e] of ppl) {
        const jx = noise(lt * 2 + s) * 10;
        const pr = person(ctx, x + jx, y, h, { p: crowdPreset("M", s), pose: "phone", face: { eyes: e, mouth: e === "shock" ? "open" : "grin", blush: e !== "shock" }, hold: { both: "phone" }, t: lt });
        ctx.save(); ctx.globalAlpha = .25; ell(ctx, x, pr.headY + pr.hr * 1.4, 160, 110, "#FF7EB0"); ctx.restore();
        for (let i = 0; i < 4; i++) { const k = ((lt * 1.3 + i * .25 + s * .1) % 1); heart(ctx, x + Math.sin(i * 2 + lt * 3) * 80, pr.headY + pr.hr * 2 - k * 500, 24 + k * 16, "#FF5C8A", 3); }
        for (let i = 0; i < 2; i++) { const k = ((lt * 2 + i * .5 + s * .2) % 1); ctx.save(); ctx.globalAlpha = 1 - k; ell(ctx, x + 110 + i * 30, pr.headY - k * 160, 26 + k * 10, 26 + k * 10, "#E53935", 3); ctx.restore(); }
      }
    });
  },

  SC08(ctx, lt) {
    const boom = .78, after = lt > boom;
    cam(ctx, { x: 540, y: 960, z: after ? 1 : 1 + lt * .05, ...shake(lt, after ? 18 * (1 - prog(lt, boom, boom + .6)) : lt > .3 ? 4 : 0) }, () => {
      skyGrad(ctx, [[0, "#2A2D45"], [1, "#4A3F6B"]]);
      if (!after) {
        const red = lt > .3 && Math.sin(lt * 40) > 0;
        rr(ctx, 270, 330, 540, 1000, 60, "#1F1F28", 10); rr(ctx, 300, 380, 480, 880, 30, red ? "#FF3B3B" : "#FF7EB0");
        for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) heart(ctx, 380 + c * 160, 520 + r * 180, 46, "#FFFFFF", 3);
        if (lt > .55) { for (const [a, b, c2, d] of [[540, 700, 420, 520], [540, 700, 700, 900], [540, 700, 340, 980], [540, 700, 760, 480]]) line(ctx, a, b, c2, d, 6, "#FFFFFF"); }
        for (const s of [-1, 1]) { ell(ctx, 540 + s * 300, 1150, 80, 120, "#E7B48F", 6); } ell(ctx, 540, 1360, 300, 120, "#E7B48F", 6);
        if (lt > .3) bigText(ctx, "SERVER OVERLOADED", 540, 1000, 58, "#FFFFFF", 1, -.06, "#B00020");
      } else {
        const k = lt - boom;
        ctx.save(); ctx.translate(540, 980); ctx.scale(1.0, 1.0);
        const P = Object.assign({}, crowdPreset("M", 42), { hair: "buzz", hairCol: "#111" });
        head(ctx, 0, 0, 300, P, { eyes: Math.floor(k * 4) % 3 === 2 ? "closed" : "half", mouth: "flat", soot: true }, 9, 2800);
        for (let i = 0; i < 12; i++) { const a = Math.PI + i / 11 * Math.PI; line(ctx, Math.cos(a) * 250, Math.sin(a) * 280 - 60, Math.cos(a) * 420, Math.sin(a) * 430 - 60, 22, "#111"); }
        ctx.restore();
        for (let i = 0; i < 4; i++) puff(ctx, 260 + i * 190, 420 - k * 260 - (i % 2) * 60, 46 + k * 30, "#9A9A9A", clamp(.65 - k * .5));
      }
    });
    if (after) { puff(ctx, 540, 820, 380 * easeOut(prog(lt, boom, boom + .3)), "#D0D0D0", 1 - prog(lt, boom + .05, boom + .35)); flash(ctx, 1 - prog(lt, boom, boom + .18));
      bigText(ctx, "SERVER OVERLOADED", 540, 330, 66, "#FF3B3B", easeBack(prog(lt, boom, boom + .3)), -.05); }
  },

  SC09(ctx, lt) {
    const hide = lt > 2.4, hp = easeOut(prog(lt, 2.4, 2.7));
    cam(ctx, { x: hide ? lerp(540, 470, hp) : 540, y: 1000, z: 1.02 + lt * .015 }, () => {
      mamakBg(ctx);
      const seats = [[230, 41, -1], [540, 0, 0], [850, 43, 1]], out = [];
      for (const [x, s, side] of seats) {
        const lean = hide ? 0 : side * -.08 * Math.sin(Math.min(1, lt) * Math.PI / 2);
        const pr = person(ctx, x, 2050, 1180, { p: s ? crowdPreset("M", s) : "HAKIM", pose: hide ? "holdFront" : "stand", rot: lean,
          face: hide ? { eyes: "sus", mouth: "flat", look: -1 } : { eyes: "half", mouth: Math.sin(lt * 8 + x) > .3 ? "o" : "flat", look: -side * .8 } });
        out.push(pr);
      }
      ell(ctx, 540, 1600, 520, 150, "#B9BEC6", 7); ell(ctx, 540, 1580, 500, 130, "#D5D9DF");
      for (const x of [330, 540, 750]) { rr(ctx, x - 40, 1450, 80, 120, 14, "rgba(255,255,255,.6)", 5); rr(ctx, x - 36, 1480, 72, 86, 10, "#D19A5B"); ell(ctx, x, 1478, 36, 12, "#F7E7C9"); }
      rr(ctx, 440, 1560, 200, 110, 6, "#FFFFFF", 4); line(ctx, 470, 1600, 610, 1590, 4, "#2E86AB"); line(ctx, 470, 1630, 580, 1640, 4, "#E53935");
      if (hide) for (const pr of out) { ctx.save(); ctx.translate(0, (1 - hp) * 300); rr(ctx, pr.headX - 170, pr.headY + pr.hr * .35, 340, 380, 12, "#C0392B", 6); rr(ctx, pr.headX - 140, pr.headY + pr.hr * .55, 280, 70, 8, "#F7E7B4"); ctx.restore(); }
    });
    vignette(ctx, hide ? .35 : .15);
  },

  SC10(ctx, lt) {
    const tp = easeInOut(prog(lt, 0, 1.5)), flex = lt > 2.7, fp = prog(lt, 2.7, 2.9);
    cam(ctx, { x: 540, y: lerp(1800, 1000, tp), z: lerp(1.3, 1, tp) + (flex ? .12 * easeOut(prog(lt, 3.3, 3.5)) : 0) }, () => {
      gymBg(ctx);
      const lifting = lt < 2.7, up = lt > 1.0;
      const jit = lifting && up ? noise(lt * 3) * 12 : 0;
      if (flex) { sparkles(ctx, 18, 3, lt, [100, 300, 880, 900], "#FFE27A"); }
      person(ctx, 540 + jit, 2150, 1450, { p: "PAKCIK", pose: flex ? "flex" : up ? "liftUp" : "liftMid",
        face: flex ? { eyes: "normal", wink: lt > 3.3, mouth: "grin" } : up ? { eyes: "closed", mouth: "grin", vein: true, sweat: 1, blush: true } : { eyes: "normal", mouth: "flat", brow: "angry" },
        hold: flex ? {} : { both: "dumbbell" }, squash: flex ? -.1 * (1 - fp) : 0 });
      if (flex) { ctx.save(); ctx.globalAlpha = .9; for (let i = 0; i < 3; i++) sweat(ctx, 380 + i * 160, 700 - (lt * 120 % 80), 22); ctx.restore(); }
    });
    if (lt > 3.3 && lt < 3.45) flash(ctx, .5, "#FFF6C8");
  },

  SC11(ctx, lt) {
    const sky = prog(lt, 0, 3.1);
    cam(ctx, { x: 540, y: 960, z: 1 }, () => {
      weddingStreet(ctx, lt);
      ctx.save(); ctx.globalAlpha = sky * .35; ctx.fillStyle = "#FFB347"; ctx.fillRect(0, 0, W, 380); ctx.restore();
      const r = rng(77);
      const list = [];
      for (let i = 0; i < 22; i++) { const dir = r() < .5 ? -1 : 1, y = 1330 + r() * 320, h = 380 + (y - 1330) * .9; const x = ((r() * 1600 + dir * lt * 900) % 1600 + 1600) % 1600 - 260;
        const pr = runPose(lt + i, 1.6); list.push({ x, y, h, p: crowdPreset(r() < .65 ? "M" : "W", 300 + i), flip: dir < 0, pose: pr, face: { eyes: "happy", mouth: "open" }, hold: i % 3 === 0 ? { r: "bouquet" } : i % 3 === 1 ? { r: "gift" } : {} }); }
      crowd(ctx, list, lt);
    });
    hLines(ctx, 18, 9, lt, 1, "rgba(255,255,255,.5)");
    const gp = easeOut(prog(lt, .6, 2.4)); // graf naik
    if (gp > 0) { ctx.save(); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.lineJoin = "round"; ctx.lineCap = "round";
      const pts = [[120, 640], [300, 560], [420, 600], [620, 380], [800, 250]]; ctx.beginPath(); ctx.moveTo(...pts[0]);
      let L = 0; const tot = 4; for (let i = 1; i < pts.length; i++) { const k = clamp(gp * tot - (i - 1)); if (k <= 0) break; ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); }
      ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = "#2ECC71"; ctx.stroke(); ctx.restore();
      if (gp >= 1) poly(ctx, [[840, 210], [780, 250], [820, 290]].map(([x, y]) => [x, y]), "#2ECC71", 6); }
  },

  SC12(ctx, lt) {
    cam(ctx, { x: 540, y: 1000, z: 1.02 }, () => {
      butikBg(ctx);
      // mesin jahit + asap
      rr(ctx, 820, 900, 160, 80, 12, "#2E2E3A", 5); rr(ctx, 840, 830, 40, 80, 8, "#2E2E3A", 5); rr(ctx, 840, 830, 140, 34, 10, "#2E2E3A", 5);
      line(ctx, 950, 865, 950, 900 + Math.sin(lt * 80) * 8, 6, "#C0C4CC");
      for (let i = 0; i < 3; i++) puff(ctx, 900 + i * 30, 780 - ((lt * 220 + i * 60) % 260), 30 + i * 8, "#BDBDBD", .8 - ((lt * 220 + i * 60) % 260) / 400);
      const spin = Math.floor(lt * 7) % 2 === 0;
      person(ctx, 420 + Math.sin(lt * 7) * 60, 2050, 1300, { p: Object.assign({}, crowdPreset("W", 90), { tudung: "#F28DB2", top: { t: "kurung", c: "#8E6CC8" }, bot: { t: "skirt", c: "#5B3E99" } }),
        pose: "holdFront", flip: spin, face: { eyes: "happy", mouth: "open", sweat: .8 }, hold: { both: "gowns" }, rot: Math.sin(lt * 14) * .05 });
    });
    hLines(ctx, 14, 12, lt, Math.floor(lt * 7) % 2 ? 1 : -1, "rgba(255,255,255,.55)");
  },

  SC13(ctx, lt) {
    const px = lerp(400, 1500, easeInOut(prog(lt, 0, 2.88)));
    cam(ctx, { x: px, y: 960, z: 1 }, () => {
      dewanBg(ctx, lt);
      for (let i = 0; i < 3; i++) { const cx = 100 + i * 800;
        person(ctx, cx - 90, 930, 420, { p: Object.assign({}, crowdPreset("M", 120 + i), { top: { t: "baju", c: ["#FFFFFF", "#D6EAF8", "#FADBD8"][i] }, bot: { t: "pants", c: ["#FFFFFF", "#D6EAF8", "#FADBD8"][i] }, hat: "songkok" }), face: { eyes: "happy", mouth: "grin" } });
        person(ctx, cx + 90, 930, 400, { p: Object.assign({}, crowdPreset("W", 130 + i), { tudung: "#FFFFFF", top: { t: "kurung", c: ["#FFFFFF", "#D6EAF8", "#FADBD8"][i] }, bot: { t: "skirt", c: ["#FFFFFF", "#D6EAF8", "#FADBD8"][i] } }), face: { eyes: "happy", mouth: "smile" } }); }
      const guests = []; for (let i = 0; i < 14; i++) guests.push({ x: -300 + i * 190, y: 1230 + (i % 2) * 30, h: 360, p: crowdPreset(i % 2 ? "W" : "M", 150 + i), pose: Math.sin(lt * 12 + i) > 0 ? "cheeks" : "holdFront", face: { eyes: "happy", mouth: "open" } });
      crowd(ctx, guests, lt);
      const run = runPose(lt, 1.3);
      person(ctx, px + Math.sin(lt * 5) * 220, 1960, 980, { p: Object.assign({}, crowdPreset("M", 160), { top: { t: "shirt", c: "#FFFFFF" }, bot: { t: "pants", c: "#2F2F3A" } }), pose: Object.assign({}, run, { la: [2.5, .2], ra: [2.5, .2] }), face: { eyes: "spiral", mouth: "wavy", sweat: 1 }, hold: { both: "trays" }, t: lt });
    });
  },

  SC14(ctx, lt) {
    const zo = easeInOut(prog(lt, 3.0, 4.6));
    cam(ctx, { x: 540, y: lerp(1050, 1200, zo), z: lerp(1, .4, zo) }, () => {
      officeNikahBg(ctx);
      for (const dx of [-2500, -1250, 1250, 2500]) { ctx.save(); ctx.translate(dx, 0);
        rr(ctx, 80, 300, 900, 440, 0, "#E0EAD8"); person(ctx, 540, 2250, 1400, { p: "JURUNIKAH", pose: "wipe", face: { eyes: "spiral", mouth: "wavy", sweat: 1 }, hold: { r: "hanky" } }); desk(ctx, 540, 1950, 1.4, 1, lt + dx); ctx.restore(); }
      const wipe = lt > 1.5;
      person(ctx, 540, 2250, 1400, { p: "JURUNIKAH", pose: wipe ? { la: [.12, .05], ra: [.5, 2.75 + Math.sin(lt * 14) * .15] } : "stand",
        face: wipe ? { eyes: "spiral", mouth: "wavy", sweat: 1.2 } : { eyes: "normal", mouth: "o", look: 1, brow: "worried", sweat: .6 }, hold: wipe ? { r: "hanky" } : {} });
      desk(ctx, 540, 1950, 1.4, 1, lt);
    });
  },

  SC15(ctx, lt) {
    const F0 = .22, F1 = 1.22, frozen = lt >= F0 && lt < F1, at = frozen ? F0 : lt < F0 ? lt : lt - (F1 - F0);
    cam(ctx, { x: 560, y: 960, z: 1 + at * .045, rot: -.06 }, () => {
      skyGrad(ctx, [[0, "#3B3A6E"], [.55, "#C0587E"], [1, "#FF9E5E"]], 0, 1150);
      terraceRow(ctx, -200, 1150, 6, .85, 5, .85); road(ctx, 1150, 900, "#4A4C5A");
      const r = rng(5); for (let i = 0; i < 14; i++) { const x = ((r() * 1400 + at * 500) % 1400) - 150, y = 1250 + r() * 700 + Math.sin(at * 4 + i) * 30; ell(ctx, x, y, 22, 12, ["#A0522D", "#CD853F", "#8B4513"][i % 3], 3, at * 5 + i); }
      const look = lt > F1 + .4;
      person(ctx, 560, 2150, 1500, { p: "HAKIM", pose: "stand", face: look ? { eyes: "sus", mouth: "flat", brow: "angry", shadow: 1, look: 0 } : { eyes: "normal", mouth: "flat", look: -1 } });
    });
    vignette(ctx, .6, "20,10,40");
    if (frozen) { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.restore(); flash(ctx, .15, "#1A1240"); }
  },

  SC16(ctx, lt) {
    cam(ctx, { x: 560, y: 960, z: 1, ...shake(lt, 6) }, () => {
      skyGrad(ctx, [[0, "#9ED8F7"], [1, "#E8F6FF"]], 0, 1000); terraceRow(ctx, -40, 1000, 5, .75, 9); road(ctx, 1000, 1200, "#7A7D84", false);
      const q = [], items = ["bouquet", "gift", "choc", "bouquet", "gift"];
      for (let i = 11; i >= 0; i--) { const k = i / 11, x = 230 + i * 70 + noise(lt * 1.5 + i) * 26, y = 2050 - i * 85, h = 1150 * (1 - k * .62);
        if (i === 3) q.push({ x, y, h, p: "HAKIM", pose: "bouquetUp", face: { eyes: "shock", mouth: "wavy", sweat: 1.2, brow: "worried" }, hold: { r: "bouquet" }, rot: noise(lt * 2) * .06 });
        else q.push({ x, y, h, p: crowdPreset("M", 200 + i), pose: "holdFront", face: { eyes: i % 2 ? "sus" : "normal", mouth: i % 3 ? "flat" : "open", vein: i % 4 === 1, look: -1 }, hold: { both: items[i % 5] }, rot: noise(lt * 2 + i) * .05 }); }
      crowd(ctx, q, lt);
      // percikan elektrik antara dua pesaing
      const a = q.find(c => c.y === 2050 - 85), b = q.find(c => c.y === 2050);
      if (a && b) { const y1 = a.y - a.h * .88, y2 = b.y - b.h * .88; ctx.beginPath(); for (let i = 0; i <= 8; i++) ctx.lineTo(lerp(a.x, b.x, i / 8), lerp(y1, y2, i / 8) + (i % 2 ? -1 : 1) * 30 * Math.sin(lt * 40 + i)); ctx.lineWidth = 9; ctx.strokeStyle = "#FFD23F"; ctx.stroke(); }
    });
  },

  SC17(ctx, lt) {
    const day = 1 - prog(lt, .2, 1.6), zo = easeInOut(prog(lt, 1.7, 3.2));
    cam(ctx, { x: 540, y: lerp(960, 300, zo), z: lerp(1, .28, zo) }, () => {
      const sky = [[0, day > .5 ? "#5DB9F0" : "#141B3C"], [1, day > .5 ? "#FFE7A8" : "#3B3A6E"]];
      skyGrad(ctx, sky, -4000, 1300);
      ctx.save(); ctx.globalAlpha = 1 - day; sparkles(ctx, 60, 4, lt, [-2500, -4000, 6000, 5000], "#FFFFFF"); ctx.restore();
      const sa = lerp(-2.6, -.4, prog(lt, 0, 1.6)); ell(ctx, 540 + Math.cos(sa) * 600, 1100 + Math.sin(sa) * 900, 110, 110, day > .5 ? "#FFE066" : "#F4F1DE", 5);
      ell(ctx, 540, 1300, 4200, 900, "#5E9B4E"); ground(ctx, 1300, "#5E9B4E", -6000, 7000);
      const q = []; for (let i = 60; i >= 1; i--) { const k = Math.pow(.955, i); q.push({ x: 540 + Math.sin(i * .25) * 1400 * (1 - k), y: 2150 - (1 - k) * 2500, h: 1400 * k, p: crowdPreset("M", 400 + i), pose: "holdFront", face: { eyes: "half", mouth: "flat" }, hold: { both: i % 2 ? "bouquet" : "gift" } }); }
      crowd(ctx, q, lt);
      const P = Object.assign({}, crowdPreset("M", 399), lt > .9 ? { beard: "#3B2A20" } : {});
      const shiver = day < .4 ? noise(lt * 4) * 10 : 0;
      person(ctx, 540 + shiver, 2150, 1400, { p: P, pose: "umbrella", face: { eyes: "half", mouth: "flat", sweat: day > .5 ? .9 : 0, pale: day < .4 }, hold: { r: "umbrella", l: "bouquet" } });
    });
  },

  SC18(ctx, lt) {
    cam(ctx, { x: 540, y: 1000, z: 1 + lt * .03 }, () => {
      ctx.save(); ctx.translate(-360, 0); dewanBg(ctx, lt); ctx.restore();
      const tr = noise(lt * 3) * 6;
      person(ctx, 360 + tr, 2050, 1330, { p: "HAKIM-NIKAH", pose: "stand", face: { eyes: "normal", mouth: "wavy", sweat: .7, blush: true, look: .6 } });
      person(ctx, 730, 2050, 1340, { p: "SOFEA-NIKAH", pose: "holdFront", face: { eyes: "half", mouth: "lips", look: -.3 }, hold: { both: "bouquetW" } });
      sparkles(ctx, 16, 6, lt, [100, 300, 880, 1000], "#FFF3C4");
      petals(ctx, 26, 8, lt, ["#FFFFFF", "#F6E7C1", "#FFC4D3"]);
    });
  },

  SC19(ctx, lt) {
    const sw = .22, rich = lt >= sw, zp = easeIn(prog(lt, 1.15, 1.4));
    cam(ctx, { x: lerp(540, 700, zp), y: lerp(1000, 980, zp), z: lerp(1, 1.4, zp), ...shake(lt, rich ? 8 * (1 - prog(lt, sw, sw + .5)) : 0) }, () => {
      banglo(ctx, lt);
      sparkles(ctx, 20, 2, lt, [0, 200, W, 1200], "#FFE27A");
      for (let i = 0; i < 18; i++) { const r = rng(i + 3), x = r() * W, y = ((r() * 1900 + lt * (300 + r() * 300)) % 2100) - 100; bill(ctx, x, y, 34, lt * 3 + i); }
      person(ctx, 540, 2250, 1650, { p: rich ? "HAKIM-JUTAWAN" : "HAKIM", pose: rich ? "card" : "stand",
        face: rich ? (lt > 1.0 ? { eyes: "normal", shades: true, mouth: "grin" } : { eyes: "diamond", mouth: "grin", blush: true }) : { eyes: "shock", mouth: "o" },
        hold: rich ? { r: "card" } : {}, squash: rich ? -.12 * (1 - prog(lt, sw, sw + .25)) : 0 });
    });
    if (rich) flash(ctx, 1 - prog(lt, sw, sw + .25), "#FFE27A");
  },

  SC20(ctx, lt) {
    const wp = easeOut(prog(lt, 0, 1.6)), walking = lt < 1.6;
    cam(ctx, { x: 540, y: 1000, z: 1 }, () => {
      towerOffice(ctx, lt);
      for (const [x, s, f] of [[110, 501, false], [970, 502, true], [240, 503, false], [840, 504, true]]) {
        const P = Object.assign({}, crowdPreset(s % 2 ? "M" : "W", s), { top: { t: s % 2 ? "suit" : "blazer", c: "#2F3A4F", tie: "#9AA5B8", inner: "#FFFFFF" }, bot: { t: s % 2 ? "pants" : "skirt", c: "#2F3A4F" } });
        ctx.save(); ctx.translate(x, 1900); ctx.rotate((f ? -1 : 1) * .28 * easeOut(prog(lt, .2, .6))); person(ctx, 0, 0, 900, { p: P, flip: f, face: { eyes: "closed", mouth: "smile" } }); ctx.restore(); }
      person(ctx, 800, lerp(1750, 1900, wp), lerp(820, 980, wp), { p: "HAKIM-JUTAWAN", pose: "hug", face: { eyes: "star", mouth: "grin", blush: true }, hold: { both: "handbag" } });
      const step = walking ? Math.sin(lt * 9) * .25 : 0;
      person(ctx, 520, lerp(1820, 2200, wp), lerp(1100, 1580, wp), { p: "SOFEA", pose: { la: [.12 - step * .4, .1], ra: [.12 + step * .4, .1], ll: [step, 0], rl: [-step, 0] }, face: { eyes: "half", mouth: "lips" } });
      sparkles(ctx, 14, 9, lt, [0, 200, W, 900], "#FFE27A");
    });
    bigText(ctx, "CEO", 270, 330, 140, "#FFD23F", easeBack(prog(lt, .7, 1.0)), -.08);
    bigText(ctx, "x10 SYARIKAT", 560, 500, 92, "#FFFFFF", easeBack(prog(lt, 1.5, 1.8)), .04, "#7A5212");
  },

  SC21(ctx, lt) {
    cam(ctx, { x: 540, y: 960, z: 1.02, ...shake(lt, 14) }, () => {
      skyGrad(ctx, [[0, "#8EC9F0"], [1, "#EAF6FF"]], 0, 820);
      skyline(ctx, 820, .7, "#A9C6DD"); twinTowers(ctx, 760, 820, .45);
      poly(ctx, [[-200, 1920], [1280, 1920], [600, 820], [480, 820]], "#6B6E75");
      poly(ctx, [[-2000, 1920], [-200, 1920], [480, 820], [-2000, 820]], "#C9C2B5"); poly(ctx, [[1280, 1920], [3000, 1920], [3000, 820], [600, 820]], "#C9C2B5");
      for (let i = 0; i < 6; i++) { const k = ((i / 6 + lt * .9) % 1), y = lerp(830, 1950, k * k), w = lerp(6, 40, k * k); rr(ctx, 540 - w / 2, y, w, lerp(20, 140, k * k), 4, "#F4F4F2"); }
      // tiang lampu + lelaki memanjat
      line(ctx, 90, 1900, 130, 700, 26, "#5A6270"); line(ctx, 130, 700, 260, 680, 18, "#5A6270");
      person(ctx, 150, 1350, 560, { p: crowdPreset("M", 777), pose: { la: [2.9, .1], ra: [2.5, .3], ll: [.6, -1.2], rl: [-.2, -.8] }, face: { eyes: "money", mouth: "open" }, rot: -.08 });
      const list = []; const r = rng(91);
      for (let i = 0; i < 38; i++) { const off = r(), lane = r() * 2 - 1, depth = (off + lt * .42) % 1.15;
        const d2 = Math.pow(depth, 1.5), y = lerp(860, 2350, d2), h = lerp(70, 1650, Math.pow(depth, 1.9)), x = 540 + lane * lerp(120, 900, d2);
        list.push({ x, y, h, p: crowdPreset("M", 600 + i), pose: runPose(lt + i * .37, 1.4), face: { eyes: "money", mouth: "open" }, hold: i % 3 === 0 ? { r: "bouquet" } : i % 3 === 1 ? { l: "ring" } : {}, t: lt, dust: d2 }); }
      list.sort((a, b) => a.y - b.y).forEach(c => { puff(ctx, c.x - c.h * .25, c.y - c.h * .05, c.h * .16, "#D8C7A8", .8); person(ctx, c.x, c.y, c.h, c); });
    });
    speedLines(ctx, 540, 820, 30, 11, lt, "rgba(255,255,255,.75)", 420);
  },

  SC22(ctx, lt, d, T, env) {
    const talk = T < 75.95 ? env(T) : 0, pointT = lt > 1.7 && lt < 3.1, thumb = lt >= 3.1;
    const pop = pointT ? easeOut(prog(lt, 1.7, 1.95)) : 0;
    cam(ctx, { x: 540, y: 1000, z: 1 + pop * .12 - (thumb ? .06 : 0) }, () => {
      studioBg(ctx, lt); confetti(ctx, 40, 3, lt);
      person(ctx, 470, 2150, 1550, { p: "HAKIM", pose: pointT || thumb ? { la: [.12, .05], ra: [.3, 2.4] } : "stand",
        face: { eyes: "normal", wink: lt > 2.2 && lt < 3.0, mouth: talk > .05 ? "talk" : "grin", talk }, squash: pointT ? -.08 * (1 - pop) : 0,
        hold: pointT ? { r: "fingerGun" } : thumb ? { r: "thumbsUp" } : {} });
    });
    const lp = easeBack(prog(lt, 3.3, 3.65));
    if (lp > 0) { bigText(ctx, "JANIMATION", 520, 330, 130, "#FFFFFF", lp, -.03, "#2B1E1A"); bigText(ctx, "FOLLOW!", 520, 480, 86, "#FF5C8A", easeBack(prog(lt, 3.6, 3.9)), .05); }
  },
};
