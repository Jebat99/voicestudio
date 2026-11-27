#!/usr/bin/env python3
"""EP005 — isyarat muzik dan SFX (masa ikut suara/EP005_narasi.wav yang telah dirapatkan)."""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "alat"))
import bunyi as B  # noqa: E402

PANJANG = 94.13
C, Am, F, G = (60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)
Dm, E7 = (62, 65, 69), (56, 59, 64)
MANIS = [76, 79, 84, 79, 81, 79, 76, 74, 76, 79, 81, 84, 83, 79, 76, 79, 77, 81, 84, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, 71, 72]
NAKAL = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 74, 71]
SEDIH = [69, 67, 65, 64, 65, 64, 62, 60, 62, 64, 65, 64, 62, 60, 59, 57]
LUAH = [84, 83, 79, 76, 77, 79, 81, 79]
up = lambda xs, k: [x + k for x in xs]
upc = lambda c, k: tuple(x + k for x in c)

mz, fx = B.Trek(PANJANG), B.Trek(PANJANG)
mz.lagu(0.0, 9.6, SEDIH, .55, [Am, F, Dm, E7], amp=.08, pad_amp=.06, bass=False)
for i in range(18): fx.add(3.7 + i * .5, B.tick(.12))
fx.add(7.6, B.ting(.2))
mz.lagu(9.7, 14.1, MANIS, .34, [F, C, Am, G], amp=.1)
mz.lagu(14.15, 30.3, NAKAL, .2, [C, F, G, C], voice="pluck", amp=.12, pad_amp=.03)
fx.add(14.3, B.pop(.3)); fx.add(18.5, B.ting(.24)); fx.add(18.55, B.pop(.35)); fx.add(24.65, B.glissando(.07)); fx.add(28.5, B.ting(.18))
fx.add(30.4, B.pop(.3)); fx.add(30.7, B.slide_down(.5, .12))
mz.add(32.3, B.pad([57, 60, 64], 7.6, .06))
for t in [32.6, 33.4, 34.2, 35.0, 35.8]: fx.add(t, B.heartbeat(.4))
mz.lagu(34.2, 39.85, LUAH, .62, [F, G, Am, F], amp=.11, pad_amp=.05, bass=False)
fx.add(34.25, B.glissando(.08))
for t in [40.2, 40.9, 41.6, 42.2]: fx.add(t, B.heartbeat(.5))
fx.add(42.7, B.glissando(.12)); fx.add(42.72, B.ting(.3))
mz.lagu(42.75, 48.5, up(MANIS, 5), .3, [upc(F, 5), upc(G, 5), upc(C, 5), upc(Am, 5)], amp=.14)
mz.lagu(48.6, 56.85, NAKAL, .22, [F, G, C, Am], voice="pluck", amp=.11, pad_amp=.04)
fx.add(51.5, B.whoosh(.4, .15)); fx.add(55.2, B.pop(.3)); fx.add(55.5, B.pop(.3))
mz.lagu(56.95, 70.3, MANIS, .3, [C, Am, F, G], amp=.13)
fx.add(64.45, B.pop(.4)); fx.add(64.5, B.ting(.28)); fx.add(64.55, B.glissando(.09))
mz.lagu(70.4, 74.1, LUAH, .45, [F, C], amp=.1, pad_amp=.06, bass=False)
mz.lagu(74.2, 91.6, MANIS, .32, [F, G, Em := (52, 55, 59), Am, F, G, C, C], amp=.13, pad_amp=.06)
fx.add(85.35, B.glissando(.08))
mz.lagu(91.7, 93.9, [72, 76, 79, 84, 88, 84], .3, [C, C], amp=.15); mz.add(93.4, B.pad([60, 64, 67, 72], .7, .08)); fx.add(91.75, B.ting(.28))

B.campur(str(HERE / "suara/EP005_narasi.wav"), mz.y, fx.y, str(HERE / "suara/EP005_campuran.wav"), PANJANG)
print("OK: suara/EP005_campuran.wav")
