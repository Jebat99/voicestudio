"""Pustaka bunyi sintetik Janimation (numpy): kotak muzik, pad, pizzicato, degupan
jantung, whoosh, ting, pop, calar piring hitam, dengung. Tiada fail luar diperlukan.

Fail isyarat episod (cth. 03_episod/EPxxx/bunyi.py) memanggil fungsi ini dan
`campur()` untuk menghasilkan trek akhir suara + muzik + SFX.
"""
import subprocess, wave

import numpy as np

SR = 44100


def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def env_exp(n, k): return np.exp(-k * np.arange(n) / SR)
def t_(d): return np.arange(int(d * SR)) / SR


def attack(y, a=0.005):
    n = min(len(y), int(a * SR)); y[:n] *= np.linspace(0, 1, n); return y


def musicbox(n, d=1.2, amp=.2):
    t = t_(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * 2 * f * t) * env_exp(len(t), 9) + .12 * np.sin(2 * np.pi * 3.01 * f * t) * env_exp(len(t), 14)
    return attack(y * env_exp(len(t), 3.2) * amp)


def pluck(n, d=.35, amp=.2):
    t = t_(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * 2 * f * t) + .2 * np.sin(2 * np.pi * 3 * f * t)
    return attack(y * env_exp(len(t), 13) * amp, .002)


def pad(notes, d, amp=.05):
    t = t_(d); y = sum(np.sin(2 * np.pi * midi(n) * t) + .3 * np.sin(2 * np.pi * midi(n) * 2.003 * t) for n in notes)
    e = np.minimum(1, t / .35) * np.minimum(1, (d - t) / .4)
    return y * e * amp / len(notes)


def heartbeat(amp=.6):
    out = np.zeros(int(.45 * SR))
    for off, f, k in ((0, 62, 26), (.22, 52, 22)):
        t = t_(.2); y = np.sin(2 * np.pi * f * t * (1 - .3 * t)) * env_exp(len(t), k) + .3 * np.random.RandomState(1).randn(len(t)) * env_exp(len(t), 120)
        i = int(off * SR); out[i:i + len(y)] += y * amp * (1 if off == 0 else .8)
    return out


def noise_band(d, lo_k=6, seed=0):
    y = np.random.RandomState(seed).randn(int(d * SR)); k = np.ones(lo_k) / lo_k
    return np.convolve(y, k, mode="same")


def whoosh(d=.45, amp=.22):
    y = noise_band(d, 10, 3); t = t_(d); e = np.sin(np.pi * t / d) ** 2
    return y * e * amp


def ting(amp=.25):
    out = np.zeros(int(1.0 * SR))
    for i, n in enumerate((96, 100, 103, 108)):
        y = np.sin(2 * np.pi * midi(n) * t_(.8)) * env_exp(int(.8 * SR), 6) * amp * (.7 + .1 * i)
        j = int(i * .06 * SR); out[j:j + len(y)] += attack(y, .002)[: len(out) - j]
    return out


def pop(amp=.35):
    t = t_(.12); f = 650 * np.exp(-t * 18) + 180
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(len(t), 25) * amp


def slide_down(d=.6, amp=.18):
    t = t_(d); f = 900 * (1 - t / d) + 250 * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, (d - t) / .1) * amp


def scratch(amp=.35):
    d = .32; t = t_(d); y = noise_band(d, 3, 9) * (np.sin(2 * np.pi * (14 - 30 * t) * t) > 0)
    return y * env_exp(len(t), 6) * amp


def glissando(amp=.12):
    out = np.zeros(int(1.6 * SR))
    for i, n in enumerate(range(72, 97, 2)):
        y = musicbox(n, .8, amp); j = int(i * .055 * SR); out[j:j + len(y)] += y[: len(out) - j]
    return out


def hit(amp=.6):
    t = t_(1.2); y = np.sin(2 * np.pi * 45 * t) * env_exp(len(t), 3.5) + .4 * noise_band(1.2, 30, 5) * env_exp(len(t), 9)
    return y * amp


def drone(d, amp=.05):
    t = t_(d); y = (np.sin(2 * np.pi * 55 * t) + .6 * np.sin(2 * np.pi * 82.4 * t)) * (.75 + .25 * np.sin(2 * np.pi * .5 * t))
    return y * np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / .3) * amp


class Trek:
    def __init__(self, dur): self.y = np.zeros(int(dur * SR) + SR)

    def add(self, at, sig, gain=1.0):
        i = int(at * SR); n = min(len(sig), len(self.y) - i)
        if n > 0: self.y[i:i + n] += sig[:n] * gain

    def lagu(self, t0, t1, melody, step, chords, voice="musicbox", amp=.16, pad_amp=.05, bass=True):
        """Ulang melodi dari t0 hingga t1. chords: senarai triad, satu setiap 4 not."""
        t, i = t0, 0
        while t < t1 - .05:
            n = melody[i % len(melody)]
            self.add(t, (musicbox(n, 1.1, amp) if voice == "musicbox" else pluck(n, .3, amp)))
            if i % 4 == 0:
                ch = chords[(i // 4) % len(chords)]
                self.add(t, pad(ch, min(step * 4 + .3, t1 - t + .2), pad_amp))
                if bass: self.add(t, pluck(ch[0] - 12, .5, amp * .9))
            t += step; i += 1
        # potong tepat pada t1 (berhenti mengejut) dengan fade 20 ms
        a, b = int(t1 * SR), int((t1 + .02) * SR)
        return a, b


def baca_wav(path):
    with wave.open(path) as w:
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def tulis_wav(path, y):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())


def campur(suara_wav, muzik, sfx, out_wav, panjang, g_muzik=.17, g_sfx=.6):
    """Muzik ~16 dB di bawah suara (dan di-duck semasa bercakap); SFX lebih perlahan daripada suara."""
    v = baca_wav(suara_wav); n = int(panjang * SR)
    m = np.zeros(n); m[: min(n, len(muzik))] = muzik[:n]
    s = np.zeros(n); s[: min(n, len(sfx))] = sfx[:n]
    vv = np.zeros(n); vv[: min(n, len(v))] = v[:n]
    # duck muzik bila suara aktif
    k = int(.05 * SR); envv = np.convolve(np.abs(vv), np.ones(k) / k, mode="same")
    duck = 1 - .45 * np.clip(envv / (envv.max() * .25 + 1e-9), 0, 1)
    y = vv + m * duck * g_muzik + s * g_sfx
    y = y / max(1e-9, np.abs(y).max()) * .95
    tulis_wav(out_wav, y)


def stamp_sfx(amp=.5):
    t = t_(.35); y = np.sin(2 * np.pi * 70 * t) * env_exp(len(t), 18) + .5 * noise_band(.35, 4, 21) * env_exp(len(t), 40)
    return y * amp


def tick(amp=.18):
    t = t_(.05); return np.sin(2 * np.pi * 1800 * t) * env_exp(len(t), 90) * amp


def stinger(amp=.6):
    """Kejutan dramatik: kord sumbang menurun + dentuman."""
    d = 1.6; t = t_(d); y = np.zeros(len(t))
    for n in (60, 61, 66, 67):
        f = midi(n) * (1 - .08 * t / d); y += np.sin(2 * np.pi * np.cumsum(np.full(len(t), 1.0)) / SR * f) * .25
    y *= env_exp(len(t), 2.2); y[:int(1.2 * SR)] += hit(1.0)[:int(1.2 * SR)]
    return y * amp


def angin(d, amp=.08):
    y = noise_band(d, 40, 33); t = t_(d); return y * (.6 + .4 * np.sin(2 * np.pi * .23 * t)) * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8) * amp


def hujan(d, amp=.06):
    y = noise_band(d, 2, 44); t = t_(d); return y * np.minimum(1, t / .5) * np.minimum(1, (d - t) / .5) * amp


def burung_hantu(amp=.3):
    out = np.zeros(int(1.3 * SR))
    for off, d in ((0, .35), (.5, .6)):
        t = t_(d); f = 330 * (1 - .12 * t / d) * (1 + .01 * np.sin(2 * np.pi * 6 * t))
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** .6 * amp
        i = int(off * SR); out[i:i + len(y)] += y
    return out


def ketawa_seram(amp=.2):
    out = np.zeros(int(1.6 * SR))
    for k in range(7):
        d = .14; t = t_(d); f = (900 - k * 60) * (1 + .04 * np.sin(2 * np.pi * 30 * t))
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * amp * (1 - k * .08)
        i = int(k * .19 * SR); out[i:i + len(y)] += y
    return out


def jeritan(d=1.1, amp=.35):
    t = t_(d); f = 1100 + 500 * np.sin(np.pi * t / d) + 60 * np.sin(2 * np.pi * 9 * t)
    y = (np.sin(2 * np.pi * np.cumsum(f) / SR) + .5 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)) * .6 + .25 * noise_band(d, 3, 51)
    return y * np.minimum(1, t / .03) * np.minimum(1, (d - t) / .3) * amp


def guruh(amp=.5):
    d = 2.4; t = t_(d); y = noise_band(d, 120, 61) * 3; return y * env_exp(len(t), 1.6) * np.minimum(1, t / .05) * amp


def wah_wah(amp=.22):
    out = np.zeros(int(2.4 * SR))
    for k, n in enumerate((62, 61, 60, 59)):
        d = .5 if k < 3 else 1.1; t = t_(d); f = midi(n) * (1 + .03 * np.sin(2 * np.pi * 6 * t))
        y = (np.sin(2 * np.pi * np.cumsum(f) / SR) + .5 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.minimum(1, t / .05) * np.minimum(1, (d - t) / .15) * amp
        i = int(k * .52 * SR); out[i:i + len(y)] += y[: len(out) - i]
    return out


def titis(amp=.25):
    t = t_(.15); f = 1400 * np.exp(-t * 10) + 500; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(len(t), 30) * amp
