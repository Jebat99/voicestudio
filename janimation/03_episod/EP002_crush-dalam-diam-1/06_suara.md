# EP002 — Suara, Muzik dan SFX

| Fail (tidak di-commit) | Keterangan |
|---|---|
| `suara/EP002_narasi_asal.mp3` | Muat naik pengguna (ElevenLabs), 67.4 s |
| `suara/EP002_narasi.wav` | Jeda dirapatkan kepada 0.28 s (`alat/audio_ketat.py --jeda 0.28 --kekal 22:0.85`), 63.4 s. Suara tidak dipotong atau dipercepatkan |
| `suara/EP002_campuran.wav` | Suara + muzik + SFX (`bunyi.py`) — trek dalam MP4 |
| `suara/masa.json` | Cap masa 23 segmen, asal dan baharu (di-commit) |

Sari kata diselaraskan ikut setiap segmen (medan `sari_kata` dalam `adegan.json`), jadi teks
muncul tepat bila suara bermula.

## Isyarat bunyi (`bunyi.py`)

| Masa | Bunyi |
|---|---|
| 00:00–00:06.9 | Kotak muzik romantik → **calar piring hitam** pada "Tapi" (muzik berhenti, lawak) |
| 00:05.3, 00:05.9 | Degupan jantung bila AMIR nampak AINA |
| 00:11–00:23 | Kotak muzik versi mimpi, ting pada senyuman AINA |
| 00:23–00:34 | Pizzicato nakal (misi), pop pemadam, ting tangan diangkat |
| 00:34–00:46 | Kotak muzik manis, ting besar pada "Terima kasih, Amir!", degupan jantung |
| 00:46–01:04 | Dentuman, dengung rendah, degupan jantung makin laju, dentuman "SIAPA LELAKI TU?!" |
