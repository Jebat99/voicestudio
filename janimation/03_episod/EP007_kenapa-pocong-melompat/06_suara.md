# EP007 — Suara (dijana), Muzik dan SFX

- Skrip & profil suara: `skrip.json`. Dijana dengan `python3 janimation/alat/tts_skrip.py janimation/03_episod/EP007_kenapa-pocong-melompat`
  (eSpeak-NG + MBROLA `mb-id1`, luar talian; tiada perkhidmatan TTS dalam talian boleh dicapai dari sesi ini).
- Setiap baris dijana berasingan → masa baris dan anggaran masa setiap perkataan tepat (`suara/masa.json`),
  digunakan untuk sari kata karaoke di Remotion.
- Profil: NARATOR (dalam, gema ringan), JAMIL (laju, pic tinggi), JAMIL-JERIT, POCONG (rendah, vibrato, gema), POCONG-LAWAK.
- Untuk suara lebih semula jadi: rakam/jana di ElevenLabs ikut `skrip.json`, letak sebagai `suara/narasi.wav`, dan
  jalankan semula `bunyi.py` + render (masa perlu dipadankan semula seperti EP002–EP006).
- SFX baharu: cengkerik, langkah kaki, "TUP" lompatan pocong.
