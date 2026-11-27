# Aliran Kerja Produksi

✋ = berhenti dan dapatkan kelulusan pengguna sebelum langkah seterusnya.

| # | Langkah | Peranan | Output | Kelulusan |
|---|---|---|---|---|
| 0 | Sediakan folder: salin `03_episod/_TEMPLATE_EPxxx/` → `03_episod/EP00N_tajuk/` | Pengurus Produksi | Folder episod | — |
| 1 | Konsep: 3 cadangan logline + hook + twist | Penulis Skrip | `01_konsep.md` | ✋ |
| 2 | Struktur babak + masa | Pengarah | `02_struktur.md` | ✋ |
| 3 | Skrip penuh mengikut scene | Penulis Skrip | `03_skrip.md` | ✋ |
| 4 | Skrip rakaman | Pengurus Produksi | `06_suara.md` (A) | — |
| 5 | **Pengguna rakam dan muat naik suara** | Pengguna | `suara/*.m4a` | — |
| 6 | Peta masa suara + pilih ambilan | Pengurus Produksi | `06_suara.md` (B–C) | — |
| 7 | Tulis `adegan.json`, jalankan `alat/bina_episod.py` | Storyboard Artist + Pakar Prompt | `04_storyboard.md` + `05_prompt-video.md` | ✋ |
| 8 | Semak prompt yang dijana | Pakar Prompt | `05_prompt-video.md` | ✋ |
| 9 | Semakan QC A–D | Pengarah | `07_semakan-qc.md` | ✋ |
| 10 | Jana klip satu demi satu, semak QC E, jana semula jika gagal | Pengguna + Pakar Prompt | `EP00N_SCxx_vN.mp4` | — |
| 11 | Suntingan: susun klip, letak suara, lip-sync, sari kata, SFX, muzik | Pengguna (dibantu Claude) | `07_output/EP00N_akhir.mp4` | ✋ |
| 12 | Pos TikTok (senarai semak) | Pengguna | Pautan video | — |
| 13 | Rekod prestasi 24 j / 7 hari + pengajaran | Pengurus Produksi | `prestasi-tiktok.md` | — |

## Prinsip

- **Audio dahulu**: masa suara pengguna menentukan durasi scene. Animasi menyesuaikan suara.
- **Satu klip satu masa**: jana SC01, semak, barulah SC02. Klip yang lulus menjadi rujukan visual untuk scene berikutnya.
- **Jangan ubah blok kunci di tengah episod.** Jika rupa watak perlu dibetulkan, kemas kini fail watak, dapatkan kelulusan, dan jana semula scene terlibat.
- **Pengajaran dikumpul**: selepas setiap episod, catat apa yang berjaya dan gagal dalam `prestasi-tiktok.md`, dan gunakannya dalam konsep episod seterusnya.

## Suntingan (cadangan)

1. Letak trek suara penuh dahulu di garis masa.
2. Susun klip ikut cap masa dalam `06_suara.md`.
3. Lip-sync: gunakan alat lip-sync atau ciri penyegerakan bibir alat AI video.
4. Sari kata BM, dalam zon selamat (`00_bible/standard-produksi.md`).
5. SFX pada setiap punchline dan kejutan. Muzik latar perlahan di bawah suara.
6. Eksport 1080×1920, 24/30 fps.
