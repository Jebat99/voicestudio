#!/usr/bin/env python3
"""Rapatkan jeda dalam rakaman suara (tanpa memotong atau mempercepat suara).

Setiap segmen ucapan dikekalkan penuh; hanya senyap di antara segmen dipendekkan
kepada --jeda saat (jeda yang lebih pendek dikekalkan). --kekal "K:S" mengekalkan
jeda S saat SEBELUM segmen ke-K (indeks dari 0) untuk saat dramatik.

Output: WAV mono 44.1 kHz + JSON cap masa segmen (asal dan baharu).

Guna: python3 janimation/alat/audio_ketat.py in.mp3 out.wav out.json --jeda 0.28 --kekal 22:0.85
"""
import argparse, json, re, subprocess, sys, wave

import numpy as np

SR = 44100


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("inp"); ap.add_argument("out_wav"); ap.add_argument("out_json")
    ap.add_argument("--jeda", type=float, default=0.28)
    ap.add_argument("--kekal", action="append", default=[])
    ap.add_argument("--db", type=float, default=-35.0)
    ap.add_argument("--min-senyap", type=float, default=0.25)
    a = ap.parse_args()

    log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.inp, "-af",
                          f"silencedetect=noise={a.db}dB:d={a.min_senyap}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", a.inp, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True).stdout
    x = np.frombuffer(pcm, dtype=np.float32).copy()
    dur = len(x) / SR

    # segmen ucapan = pelengkap senyap
    sil = list(zip(starts, ends + ([dur] if len(ends) < len(starts) else [])))
    segs, cur = [], 0.0
    for s, e in sil:
        if s - cur > 0.05:
            segs.append([cur, s])
        cur = e
    if dur - cur > 0.05:
        segs.append([cur, dur])

    keep = {int(k): float(v) for k, v in (s.split(":") for s in a.kekal)}
    pad_a, pad_b, fade = 0.06, 0.08, int(0.008 * SR)
    out, cursor, rows = [], 0.0, []
    for i, (s, e) in enumerate(segs):
        lo = max(0.0, s - pad_a) if i == 0 else max(segs[i - 1][1], s - pad_a)
        hi = min(dur, e + pad_b) if i == len(segs) - 1 else min(segs[i + 1][0], e + pad_b)
        piece = x[int(lo * SR):int(hi * SR)].copy()
        if len(piece) > 2 * fade:
            piece[:fade] *= np.linspace(0, 1, fade); piece[-fade:] *= np.linspace(1, 0, fade)
        if i > 0:
            orig_gap = s - segs[i - 1][1]
            want = keep.get(i, a.jeda)
            gap = min(orig_gap, want) - (pad_a + pad_b)
            if gap > 0:
                out.append(np.zeros(int(gap * SR), np.float32)); cursor += int(gap * SR) / SR
        rows.append({"i": i, "asal": [round(s, 3), round(e, 3)],
                     "baharu": [round(cursor + (s - lo), 3), round(cursor + (e - lo), 3)]})
        out.append(piece); cursor += len(piece) / SR
    y = np.concatenate(out)
    with wave.open(a.out_wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
    json.dump({"durasi_asal": round(dur, 3), "durasi_baharu": round(len(y) / SR, 3), "segmen": rows},
              open(a.out_json, "w"), indent=1)
    print(f"{len(segs)} segmen · {dur:.2f} s → {len(y) / SR:.2f} s")


if __name__ == "__main__":
    sys.exit(main())
