import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill, Audio, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

// Watak & latar dilukis oleh pustaka kanvas Janimation (alat/animatik/*.js, 03_episod/<ep>/animatik.js).
// Remotion mengawal masa, audio, sari kata karaoke dan teks bertajuk (spring).
type Kata = { w: string; mula: number; tamat: number };
type Sub = { mula: number; tamat: number; teks: string; watak?: string; gaya?: string; kata?: Kata[]; sembunyi?: boolean };

const GLUE = `
window.__drawFrame = function (ctx, T) {
  const S = DATA.scene; let s = S.find(x => T < x.tamat) || S[S.length - 1];
  const lt = T - s.mula, d = s.tamat - s.mula;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
  ctx.save(); (SCENES[s.id] || (() => {}))(ctx, lt, d, T, env); ctx.restore();
  const i = S.indexOf(s), nx = S[i + 1], D = .26;
  if (nx && nx.masuk === "hati" && T > nx.mula - D) heartWipe(ctx, prog(T, nx.mula - D, nx.mula));
  if (s.masuk === "hati" && lt < D) heartWipe(ctx, -1 + prog(lt, 0, D));
};`;

const FONT = "Inter, 'Noto Color Emoji', sans-serif";
const stroke = (px: number): React.CSSProperties => ({ WebkitTextStroke: `${px}px #000`, paintOrder: "stroke fill" as any });
const TAG: Record<string, { bg: string; fg: string; label: string }> = {
  JAMIL: { bg: "#2E8B57", fg: "#FFFFFF", label: "😨 JAMIL" },
  POCONG: { bg: "#F2EFE6", fg: "#2B1E1A", label: "👻 POCONG" },
};

const Sarikata: React.FC<{ subs: Sub[]; T: number; fps: number }> = ({ subs, T, fps }) => {
  const idx = subs.findIndex((k, i) => !k.sembunyi && T >= k.mula - 0.04 && T < Math.min(subs[i + 1] ? subs[i + 1].mula - 0.02 : 1e9, k.tamat + 0.35));
  if (idx < 0) return null;
  const k = subs[idx];
  const pop = spring({ frame: Math.round((T - k.mula + 0.04) * fps), fps, config: { damping: 12, stiffness: 180 } });
  const hi = k.gaya === "seram" ? "#FF4D5E" : "#FFD23F";
  const words = k.kata && k.kata.length ? k.kata : k.teks.split(" ").map((w) => ({ w, mula: k.mula, tamat: k.mula }));
  const tag = k.watak && TAG[k.watak];
  return (
    <div style={{ position: "absolute", top: 1180, left: 70, width: 860, display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`, opacity: pop }}>
      {tag && <div style={{ background: tag.bg, color: tag.fg, fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "8px 26px", borderRadius: 999, border: "5px solid #000" }}>{tag.label}</div>}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.18, textAlign: "center", color: "#fff", ...stroke(14) }}>
        {k.watak && k.watak !== "N" ? "“" : ""}
        {words.map((w, i) => {
          const said = T >= w.mula, now = T >= w.mula && T < w.tamat;
          return (
            <span key={i} style={{ color: said ? hi : "#FFFFFF", display: "inline-block", transform: `scale(${now ? 1.12 : 1})`, margin: "0 9px" }}>
              {w.w.replace(/[“”]/g, "")}
            </span>
          );
        })}
        {k.watak && k.watak !== "N" ? "”" : ""}
      </div>
    </div>
  );
};

const HookTitle: React.FC<{ sub: Sub; T: number; fps: number }> = ({ sub, T, fps }) => {
  if (!sub || T > 4.7) return null;
  const words = sub.kata || [];
  const cut = words.findIndex((w) => w.w.toLowerCase().startsWith("kenapa"));
  const line = (ws: Kata[], size: number, color: string) => (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px" }}>
      {ws.map((w, i) => {
        const s = spring({ frame: Math.round((T - w.mula) * fps), fps, config: { damping: 10, stiffness: 200 } });
        return <span key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color, display: "inline-block", transform: `scale(${s}) rotate(${(i % 2 ? 3 : -3) * (1 - s)}deg)`, ...stroke(size * 0.18) }}>{w.w.toUpperCase()}</span>;
      })}
    </div>
  );
  return (
    <div style={{ position: "absolute", top: 190, left: 60, width: 900, display: "flex", flexDirection: "column", gap: 10 }}>
      {line(words.slice(0, cut), 62, "#FFFFFF")}
      {line(words.slice(cut), 118, "#FFD23F")}
    </div>
  );
};

const Kad: React.FC<{ T: number; t0: number; fps: number; children: React.ReactNode; top: number }> = ({ T, t0, fps, children, top }) => {
  const s = spring({ frame: Math.round((T - t0) * fps), fps, config: { damping: 11, stiffness: 160 } });
  if (T < t0) return null;
  return <div style={{ position: "absolute", top, left: 0, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${s})` }}>{children}</div>;
};

export const Episod: React.FC<{ ep: string }> = ({ ep }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<any>(null);
  const [handle] = useState(() => delayRender("Memuat pustaka lukisan Janimation"));

  useEffect(() => {
    (async () => {
      const get = (f: string) => fetch(staticFile(`${ep}/${f}`)).then((r) => r.text());
      const [lukis, latar, anim, dataTxt, envTxt] = await Promise.all(["lukis.js", "latar.js", "animatik.js", "adegan.json", "env.json"].map(get));
      const w = window as any;
      if (!w.__drawFrame) {
        const envCode = `const DATA = ${dataTxt}; const ENVV = ${envTxt}; const env = T => { const i = T * 100, a = ENVV[Math.floor(i)] || 0, b = ENVV[Math.floor(i) + 1] || 0; return a + (b - a) * (i % 1); };`;
        for (const code of [lukis, latar, envCode, anim, GLUE]) { const s = document.createElement("script"); s.textContent = code; document.head.appendChild(s); }
        await (document as any).fonts.load("900 60px Inter");
      }
      setData(JSON.parse(dataTxt));
      continueRender(handle);
    })();
  }, [ep, handle]);

  useLayoutEffect(() => {
    if (!data || !canvas.current) return;
    (window as any).__drawFrame(canvas.current.getContext("2d"), T);
  }, [T, data]);

  const subs: Sub[] = data?.sari_kata || [];
  const scenes = data?.scene || [];
  const last = scenes[scenes.length - 1];
  const cta = scenes.find((s: any) => s.tajuk === "Follow!");
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <canvas ref={canvas} width={1080} height={1920} style={{ width: 1080, height: 1920 }} />
      {data && (
        <>
          <HookTitle sub={subs.find((s) => s.sembunyi)} T={T} fps={fps} />
          {cta && T >= cta.mula && T < cta.tamat && (
            <Kad T={T} t0={cta.mula + 0.6} fps={fps} top={260}>
              <div style={{ background: "#FF2D55", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "22px 48px", borderRadius: 999, border: "7px solid #000" }}>🔔 FOLLOW JANIMATION</div>
            </Kad>
          )}
          {last && T >= last.mula && (
            <div style={{ position: "absolute", top: 260, left: 60, width: 960, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {[["KALAU NAMPAK POCONG,", 74, "#FFFFFF"], ["JANGAN LARI…", 104, "#FFD23F"], ["MUNGKIN DIA CUMA", 74, "#FFFFFF"], ["NAK MINTA TOLONG! 😂", 92, "#FF4D5E"]].map(([t, sz, c], i) => {
                const s = spring({ frame: Math.round((T - last.mula - i * 0.18) * fps), fps, config: { damping: 11 } });
                return <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: sz as number, color: c as string, transform: `scale(${s})`, ...stroke((sz as number) * 0.16) }}>{t}</div>;
              })}
            </div>
          )}
          <Sarikata subs={subs} T={T} fps={fps} />
        </>
      )}
      <Audio src={staticFile(`${ep}/campuran.wav`)} />
    </AbsoluteFill>
  );
};
