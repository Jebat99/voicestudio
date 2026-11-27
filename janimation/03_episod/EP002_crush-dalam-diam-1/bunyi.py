#!/usr/bin/env python3
"""EP002 — isyarat muzik dan SFX (masa ikut suara/EP002_narasi.wav yang telah dirapatkan)."""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "alat"))
import bunyi as B  # noqa: E402

PANJANG = 64.1
C, Am, F, G = (60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)
MANIS = [76, 79, 84, 79, 81, 79, 76, 74, 76, 79, 81, 84, 83, 79, 76, 79, 77, 81, 84, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, 71, 72]
MIMPI = [79, 76, 72, 76, 77, 81, 79, 76, 74, 77, 76, 72, 71, 74, 79, 77]
NAKAL = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 74, 71]

mz, fx = B.Trek(PANJANG), B.Trek(PANJANG)
# Babak 1 — kotak muzik romantik, berhenti mengejut pada "Tapi" (6.88)
mz.lagu(0.0, 6.88, MANIS, .3, [C, Am, F, G], amp=.15)
fx.add(.02, B.whoosh(.4), 1); fx.add(4.62, B.whoosh(.45), 1)
fx.add(5.25, B.heartbeat(.55)); fx.add(5.85, B.heartbeat(.6))
fx.add(6.86, B.scratch(.4))
fx.add(9.8, B.slide_down(.7, .16))
# Babak 2 — mimpi
mz.lagu(11.0, 23.3, MIMPI, .45, [F, C, Am, G], amp=.11, pad_amp=.06)
fx.add(15.06, B.ting(.2)); fx.add(19.6, B.glissando(.08))
# Babak 3 — misi (pizzicato nakal)
mz.lagu(23.35, 34.2, NAKAL, .2, [C, F, G, C], voice="pluck", amp=.14, pad_amp=.03)
fx.add(27.4, B.whoosh(.5, .15)); fx.add(29.95, B.pop(.35)); fx.add(31.0, B.whoosh(.3, .2)); fx.add(31.15, B.ting(.22))
# Babak 4 — saat paling bahagia
mz.lagu(34.25, 46.3, MANIS, .3, [F, G, C, Am], amp=.14)
fx.add(37.55, B.ting(.2)); fx.add(40.93, B.ting(.28)); fx.add(40.95, B.glissando(.07))
fx.add(42.05, B.heartbeat(.5)); fx.add(42.6, B.heartbeat(.55)); fx.add(43.6, B.glissando(.09))
# Babak 5 — cliffhanger
fx.add(46.3, B.hit(.35)); mz.add(46.4, B.drone(14.4, .06))
for i, t in enumerate([55.9, 56.7, 57.4, 58.05, 58.65, 59.2, 59.7, 60.15]):
    fx.add(t, B.heartbeat(.45 + i * .03))
fx.add(60.78, B.hit(.7))
for t in [61.5, 62.25, 63.0]:
    fx.add(t, B.heartbeat(.75))

B.campur(str(HERE / "suara/EP002_narasi.wav"), mz.y, fx.y, str(HERE / "suara/EP002_campuran.wav"), PANJANG)
print("OK: suara/EP002_campuran.wav")
