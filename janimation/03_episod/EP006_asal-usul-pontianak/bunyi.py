#!/usr/bin/env python3
"""EP006 — muzik seram-lucu dan SFX (masa ikut suara/EP006_narasi.wav yang telah dirapatkan)."""
import pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "alat"))
import bunyi as B  # noqa: E402

PANJANG = 89.43
Am, Dm, E7, F, C = (57, 60, 64), (62, 65, 69), (56, 59, 64), (53, 57, 60), (60, 64, 67)
PENTA = [74, 76, 79, 81, 79, 76, 74, 72, 74, 79, 81, 84, 81, 79, 76, 74]     # rasa tradisional
PERISIK = [57, 60, 57, 64, 63, 62, 60, 59, 57, 60, 57, 64, 65, 64, 62, 59]
SEDIH = [69, 67, 65, 64, 65, 64, 62, 60, 62, 64, 65, 64, 62, 60, 59, 57]
SERAM = [69, 72, 75, 72, 68, 71, 74, 71, 69, 72, 75, 78, 77, 74, 71, 68]   # minor + tritone, ala waltz hantu
DODOI = [81, 77, 74, 77, 80, 77, 74, 71]

mz, fx = B.Trek(PANJANG), B.Trek(PANJANG)
fx.add(0.05, B.jeritan(1.0, .3)); fx.add(0.05, B.hit(.5)); mz.add(.2, B.drone(1.9, .05))
mz.lagu(2.15, 9.2, PENTA, .26, [Am, F, C, E7], voice="pluck", amp=.12, pad_amp=.04)
fx.add(5.7, B.ting(.18))
mz.lagu(9.3, 14.05, PERISIK, .2, [Am, Dm, E7, Am], voice="pluck", amp=.13, pad_amp=.03)
fx.add(12.8, B.stamp_sfx(.6))
fx.add(14.12, B.hit(.4)); fx.add(14.2, B.whoosh(.5, .2))
fx.add(16.4, B.guruh(.4)); mz.add(16.4, B.hujan(8.7, .05))
mz.lagu(16.45, 25.05, SEDIH, .5, [Am, F, Dm, E7], amp=.09, pad_amp=.06, bass=False)
mz.add(25.1, B.drone(18.2, .05)); mz.add(25.1, B.angin(18.2, .06))
fx.add(29.2, B.whoosh(.6, .18)); fx.add(32.55, B.hit(.25))
fx.add(34.5, B.burung_hantu(.35)); fx.add(36.0, B.burung_hantu(.3)); fx.add(36.8, B.slide_down(.6, .12))
for t in [40.5, 41.3, 42.1, 42.8]: fx.add(t, B.heartbeat(.4))
mz.add(43.3, B.drone(12.2, .06)); mz.add(43.3, B.angin(12.2, .05))
fx.add(44.8, B.ketawa_seram(.18)); fx.add(47.2, B.ketawa_seram(.2)); fx.add(50.5, B.ketawa_seram(.16))
for i, t in enumerate([52.6, 53.2, 53.7, 54.1, 54.45]): fx.add(t, B.heartbeat(.35 + i * .05))
fx.add(54.8, B.jeritan(1.2, .32)); fx.add(54.8, B.hit(.6))
fx.add(55.6, B.pop(.3)); fx.add(56.2, B.whoosh(.5, .2)); fx.add(56.9, B.slide_down(.5, .12))
mz.lagu(57.75, 65.9, SERAM, .24, [Am, Dm, E7, Am], voice="pluck", amp=.13, pad_amp=.04)
fx.add(57.8, B.ketawa_seram(.16)); fx.add(64.6, B.titis(.3)); fx.add(64.9, B.titis(.28)); fx.add(65.2, B.slide_down(.6, .12))
mz.add(66.05, B.drone(5.7, .06)); mz.add(66.05, B.angin(5.7, .05))
fx.add(68.7, B.hit(.55)); fx.add(68.72, B.jeritan(.6, .22))
fx.add(69.7, B.pop(.3)); fx.add(71.85, B.hit(.5))
mz.lagu(74.3, 81.4, DODOI, .5, [Am, Dm, E7, Am], amp=.09, pad_amp=.05, bass=False)
fx.add(78.9, B.ting(.24)); fx.add(79.0, B.stamp_sfx(.4))
fx.add(81.5, B.wah_wah(.24)); mz.lagu(83.6, 86.5, SEDIH, .4, [Am, Dm], voice="pluck", amp=.1, pad_amp=.03)
fx.add(86.6, B.hit(.4)); fx.add(86.7, B.ketawa_seram(.2)); mz.lagu(86.9, 89.3, PERISIK[:8], .22, [Am, E7], voice="pluck", amp=.13)

B.campur(str(HERE / "suara/EP006_narasi.wav"), mz.y, fx.y, str(HERE / "suara/EP006_campuran.wav"), PANJANG)
print("OK: suara/EP006_campuran.wav")
