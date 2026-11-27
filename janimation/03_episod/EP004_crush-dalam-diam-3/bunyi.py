#!/usr/bin/env python3
"""EP004 — isyarat muzik dan SFX (masa ikut suara/EP004_narasi.wav yang telah dirapatkan)."""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "alat"))
import bunyi as B  # noqa: E402

PANJANG = 80.8
C, Am, F, G = (60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)
Dm, E7 = (62, 65, 69), (56, 59, 64)
MANIS = [76, 79, 84, 79, 81, 79, 76, 74, 76, 79, 81, 84, 83, 79, 76, 79, 77, 81, 84, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, 71, 72]
NAKAL = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 74, 71]
SEDIH = [69, 67, 65, 64, 65, 64, 62, 60, 62, 64, 65, 64, 62, 60, 59, 57]
HARAP = [72, 76, 79, 84, 83, 79, 81, 84]

mz, fx = B.Trek(PANJANG), B.Trek(PANJANG)
mz.lagu(0.0, 11.35, MANIS, .3, [C, Am, F, G], amp=.14)
fx.add(2.5, B.ting(.18)); fx.add(9.3, B.pop(.3)); fx.add(10.0, B.pop(.3))
mz.lagu(11.4, 18.3, NAKAL, .2, [C, F, G, C], voice="pluck", amp=.13, pad_amp=.03)
fx.add(11.9, B.ting(.2)); fx.add(14.6, B.glissando(.08))
mz.lagu(18.35, 24.9, MANIS, .3, [F, G, C, Am], amp=.13)
fx.add(18.4, B.whoosh(.4, .15))
fx.add(24.95, B.hit(.3)); mz.add(25.0, B.drone(13.2, .045))          # sunyi tiba-tiba
fx.add(31.0, B.slide_down(.6, .12))
fx.add(38.3, B.stinger(.7))                                            # kejutan dramatik
mz.lagu(39.8, 58.7, SEDIH, .5, [Am, F, Dm, E7], amp=.11, pad_amp=.06)
fx.add(58.75, B.glissando(.07))
mz.lagu(58.75, 67.6, SEDIH, .55, [F, C, Dm, E7], amp=.09, pad_amp=.06, bass=False)
for i in range(14): fx.add(63.8 + i * .27, B.tick(.12))
mz.add(67.6, B.drone(8.8, .05))
for i, t in enumerate([69.0, 69.8, 70.6, 71.4, 72.1, 72.8, 73.5, 74.2, 74.9, 75.5]):
    fx.add(t, B.heartbeat(.4 + i * .03))
fx.add(76.35, B.hit(.5))
mz.lagu(78.6, 80.7, HARAP, .26, [C, G], amp=.15); fx.add(78.65, B.ting(.25))

B.campur(str(HERE / "suara/EP004_narasi.wav"), mz.y, fx.y, str(HERE / "suara/EP004_campuran.wav"), PANJANG)
print("OK: suara/EP004_campuran.wav")
