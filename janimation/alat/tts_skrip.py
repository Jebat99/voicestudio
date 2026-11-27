#!/usr/bin/env python3
"""Jana suara daripada skrip.json dengan eSpeak-NG + MBROLA (luar talian), satu fail per baris,
kesan bunyi ikut watak, kemudian sambung dengan jeda yang ditetapkan.

Output: suara/narasi.wav + suara/masa.json (mula/tamat setiap baris dan anggaran setiap perkataan).
Masa diketahui dengan tepat kerana setiap baris dijana berasingan — sari kata sentiasa selari.

skrip.json: {"profil": {"N": {"suara": "mb-id1", "laju": 140, "pic": 40, "penapis": "..."}},
             "baris": [{"watak": "N", "teks": "…", "jeda": 0.3}, ...], "mula": 0.2}

Guna: python3 janimation/alat/tts_skrip.py janimation/03_episod/EP007_pocong
"""
import json, pathlib, re, subprocess, sys, tempfile, wave

import numpy as np

SR = 44100


def suku(w):
    return max(1, len(re.findall(r"[aeiou]+", w.lower())))


def jana(teks, p, out):
    with tempfile.TemporaryDirectory() as d:
        raw = pathlib.Path(d) / "raw.wav"
        subprocess.run(["espeak-ng", "-v", p.get("suara", "mb-id1"), "-s", str(p.get("laju", 140)), "-p", str(p.get("pic", 45)),
                        "-a", str(p.get("amp", 120)), "-w", str(raw), teks], check=True)
        af = ",".join(x for x in ["silenceremove=start_periods=1:start_threshold=-50dB:stop_periods=-1:stop_threshold=-50dB:stop_duration=0.35",
                                  p.get("penapis", ""), f"aresample={SR}"] if x)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", af, "-ac", "1", "-ar", str(SR), str(out)], check=True)


def baca(path):
    with wave.open(str(path)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def main(ep):
    ep = pathlib.Path(ep); s = json.loads((ep / "skrip.json").read_text(encoding="utf-8"))
    (ep / "suara").mkdir(exist_ok=True)
    cur, parts, rows = s.get("mula", .2), [np.zeros(int(s.get("mula", .2) * SR), np.float32)], []
    for i, b in enumerate(s["baris"]):
        tmp = ep / "suara" / f"_b{i:02d}.wav"; jana(b["teks"], s["profil"][b["watak"]], tmp)
        y = baca(tmp); tmp.unlink()
        y = y / max(1e-6, np.abs(y).max()) * s["profil"][b["watak"]].get("kuat", .85)
        dur = len(y) / SR
        words = b["teks"].replace("…", " ").split(); w8 = [suku(w) for w in words]; tot = sum(w8); t = cur; wt = []
        for w, k in zip(words, w8):
            d = dur * k / tot; wt.append({"w": w, "mula": round(t, 3), "tamat": round(t + d, 3)}); t += d
        rows.append({"i": i, "watak": b["watak"], "teks": b["teks"], "mula": round(cur, 3), "tamat": round(cur + dur, 3), "kata": wt})
        parts += [y, np.zeros(int(b.get("jeda", .3) * SR), np.float32)]; cur += dur + b.get("jeda", .3)
    y = np.concatenate(parts)
    with wave.open(str(ep / "suara" / "narasi.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
    (ep / "suara" / "masa.json").write_text(json.dumps({"durasi": round(len(y) / SR, 3), "baris": rows}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(rows)} baris · {len(y) / SR:.2f} s → suara/narasi.wav, suara/masa.json")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
