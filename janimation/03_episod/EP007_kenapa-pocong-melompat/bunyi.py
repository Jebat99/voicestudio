#!/usr/bin/env python3
"""EP007 — muzik seram-lucu + SFX untuk suara janaan (suara/narasi.wav)."""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "alat"))
import bunyi as B  # noqa: E402

PANJANG = 64.48
Am, Dm, E7, F, C, G = (57, 60, 64), (62, 65, 69), (56, 59, 64), (53, 57, 60), (60, 64, 67), (55, 59, 62)
SERAM = [69, 72, 75, 72, 68, 71, 74, 71, 69, 72, 75, 78, 77, 74, 71, 68]
KEJAR = [69, 69, 72, 69, 74, 72, 69, 68, 69, 69, 72, 76, 75, 74, 72, 71]
NAKAL = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 74, 71]
DODOI = [81, 77, 74, 77, 80, 77, 74, 71]

mz, fx = B.Trek(PANJANG), B.Trek(PANJANG)
for t in (.3, 1.05, 1.8, 2.55): fx.add(t, B.tup(.55))
fx.add(3.1, B.hit(.55)); mz.add(0, B.drone(4.5, .05))
mz.add(4.6, B.cengkerik(23.2, .05)); mz.add(4.6, B.angin(23.2, .04))
for i in range(9): fx.add(4.8 + i * .5, B.langkah(.16))
for t in (12.85, 13.3, 13.75): fx.add(t, B.tup(.45))
mz.add(9.4, B.drone(14.5, .05))
for i in range(8): fx.add(15.6 + i * .42, B.langkah(.18))
for t in (23.5, 23.78, 24.05, 24.3): fx.add(t, B.tup(.55))
for t in (24.6, 25.4): fx.add(t, B.heartbeat(.4))
fx.add(26.6, B.jeritan(.9, .3)); fx.add(26.62, B.hit(.6))
mz.lagu(27.9, 33.7, KEJAR, .16, [Am, E7, Am, E7], voice="pluck", amp=.14, pad_amp=.03)
for i in range(13): fx.add(28.0 + i * .45, B.tup(.35))
fx.add(31.4, B.whoosh(.6, .22)); fx.add(32.2, B.ting(.24))
for i in range(5): fx.add(34.1 + i * .4, B.langkah(.2))
fx.add(36.8, B.tup(.45)); fx.add(37.5, B.tup(.45)); fx.add(38.7, B.slide_down(.6, .16)); fx.add(39.5, B.hit(.6)); fx.add(39.7, B.ting(.2))
mz.lagu(40.0, 44.6, NAKAL, .2, [C, F, G, C], voice="pluck", amp=.12, pad_amp=.03)
mz.lagu(44.75, 48.2, DODOI, .45, [Am, Dm], amp=.09, pad_amp=.05, bass=False)
fx.add(49.5, B.pop(.3)); fx.add(51.6, B.wah_wah(.22))
mz.lagu(52.0, 61.9, NAKAL, .22, [C, Am, F, G], voice="pluck", amp=.12, pad_amp=.04)
fx.add(54.5, B.glissando(.08)); fx.add(58.2, B.ting(.22))
fx.add(62.0, B.hit(.35)); fx.add(62.1, B.pop(.35)); mz.lagu(62.3, 64.3, SERAM[:8], .22, [Am, E7], voice="pluck", amp=.12)

B.campur(str(HERE / "suara/narasi.wav"), mz.y, fx.y, str(HERE / "suara/campuran.wav"), PANJANG)
print("OK: suara/campuran.wav")
