# JANIMATION

Sistem produksi siri animasi 2D gaya anime dalam Bahasa Melayu Malaysia untuk TikTok.
Genre: komedi, misteri, sekolah, plot twist. Durasi 1–2 minit setiap episod.

Arahan tetap untuk Claude: [CLAUDE.md](CLAUDE.md).

## Mula di sini

| Langkah | Fail |
|---|---|
| Fahami dunia siri | [00_bible/siri-bible.md](00_bible/siri-bible.md) |
| Standard teknikal | [00_bible/standard-produksi.md](00_bible/standard-produksi.md) |
| Gaya visual | [00_bible/gaya-visual.md](00_bible/gaya-visual.md) |
| Bahasa dan dialog | [00_bible/panduan-bahasa.md](00_bible/panduan-bahasa.md) |
| Watak | [01_watak/senarai-watak.md](01_watak/senarai-watak.md) |
| Lokasi | [02_lokasi/senarai-lokasi.md](02_lokasi/senarai-lokasi.md) |
| Proses penuh | [06_produksi/aliran-kerja.md](06_produksi/aliran-kerja.md) |
| Status episod | [06_produksi/papan-status.md](06_produksi/papan-status.md) |
| Strategi TikTok | [06_produksi/panduan-tiktok.md](06_produksi/panduan-tiktok.md) |

## Cara membina episod baharu

1. Salin `03_episod/_TEMPLATE_EPxxx/` kepada `03_episod/EP001_tajuk-pendek/`.
2. Minta Claude: *"Mulakan EP001 — idea: …"*. Claude akan berhenti untuk kelulusan
   awak di setiap langkah.
3. Selepas skrip diluluskan, rakam suara ikut `06_suara.md` dan muat naik ke folder
   `suara/` episod itu (atau hantar dalam chat).
4. Claude akan melaraskan storyboard dan prompt ikut masa suara awak.
5. Selepas QC lulus, jana klip satu demi satu menggunakan `05_prompt-video.md`.

## Fail yang tidak di-commit

Audio (`.wav`, `.mp3`, `.m4a`) dan video (`.mp4`, `.mov`) tidak di-commit ke git
(lihat `.gitignore`). Simpan salinan sandaran di tempat lain.
