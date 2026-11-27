#!/usr/bin/env python3
"""EP003 — isyarat muzik dan SFX (masa ikut suara/EP003_narasi.wav yang telah dirapatkan)."""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "alat"))
import bunyi as B  # noqa: E402

PANJANG = 83.4
C, Am, F, G = (60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)
Dm, E7 = (62, 65, 69), (56, 59, 64)
MANIS = [76, 79, 84, 79, 81, 79, 76, 74, 76, 79, 81, 84, 83, 79, 76, 79, 77, 81, 84, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, 71, 72]
MIMPI = [69, 72, 76, 72, 65, 69, 72, 69, 64, 67, 72, 67, 67, 71, 74, 71]
PERISIK = [57, 60, 57, 64, 63, 62, 60, 59, 57, 60, 57, 64, 65, 64, 62, 59]
PANIK = [76, 77, 76, 74, 72, 74, 76, 79, 81, 79, 77, 76, 74, 72, 71, 69]

mz, fx = B.Trek(PANJANG), B.Trek(PANJANG)
# B1 — malam, termenung → misi
mz.lagu(0.0, 8.05, MIMPI, .5, [Am, F, C, G], amp=.08, pad_amp=.06, bass=False)
fx.add(8.1, B.whoosh(.45, .25)); fx.add(8.3, B.ting(.2))
mz.lagu(8.15, 21.7, PERISIK, .2, [Am, Dm, E7, Am], voice="pluck", amp=.15, pad_amp=.03)
fx.add(12.35, B.stamp_sfx(.6))
# Aina menegur
mz.lagu(21.77, 24.05, MANIS, .3, [F, G], amp=.12)
fx.add(24.2, B.slide_down(.7, .14))
mz.lagu(26.95, 40.9, PERISIK, .2, [Am, Dm, E7, Am], voice="pluck", amp=.15, pad_amp=.03)
fx.add(27.0, B.stamp_sfx(.6)); fx.add(37.7, B.stamp_sfx(.6)); fx.add(38.0, B.ting(.22))
for i in range(10): fx.add(30.9 + i * .42, B.tick(.12))
mz.lagu(40.96, 45.3, MANIS, .25, [C, G, Am, F], amp=.12); fx.add(41.2, B.ting(.2))
fx.add(45.45, B.scratch(.3)); fx.add(45.6, B.slide_down(.6, .14))
mz.lagu(48.35, 54.45, MANIS, .3, [F, G, C, Am], amp=.11); fx.add(52.3, B.ting(.2))
mz.lagu(54.5, 56.45, PANIK, .12, [Am, E7], voice="pluck", amp=.14, pad_amp=.02)
for i in range(16): fx.add(54.5 + i * .12, B.tick(.15))
mz.lagu(56.5, 58.2, MANIS, .3, [F, C], amp=.1)
# B5 — berjaya?
mz.lagu(58.25, 76.0, MANIS, .3, [C, Am, F, G], amp=.14)
fx.add(61.2, B.glissando(.08)); fx.add(66.0, B.pop(.3)); fx.add(70.05, B.ting(.24)); fx.add(72.3, B.pop(.4)); fx.add(72.4, B.ting(.26))
fx.add(76.05, B.hit(.35)); mz.add(76.1, B.drone(7.3, .06))
for i, t in enumerate([77.4, 78.1, 78.75, 79.35, 79.9, 80.4]):
    fx.add(t, B.heartbeat(.45 + i * .04))
fx.add(81.1, B.hit(.7))
for t in [81.9, 82.6]:
    fx.add(t, B.heartbeat(.75))

B.campur(str(HERE / "suara/EP003_narasi.wav"), mz.y, fx.y, str(HERE / "suara/EP003_campuran.wav"), PANJANG)
print("OK: suara/EP003_campuran.wav")
