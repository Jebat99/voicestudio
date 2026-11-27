# CLAUDE.md — Sistem Produksi JANIMATION

Arahan tetap untuk semua kerja di dalam folder `janimation/`. Baca fail ini sepenuhnya
sebelum menulis apa-apa untuk Janimation. Arahan di sini mengatasi kebiasaan lalai.

> Folder ini projek animasi, bukan sebahagian aplikasi VoiceStudio. Jangan ubah fail di
> luar `janimation/` semasa kerja Janimation.

## 1. Matlamat

Hasilkan siri animasi kartun **2D gaya anime** dalam **Bahasa Melayu Malaysia** untuk
**TikTok**, yang membuat penonton menonton sampai habis, komen, kongsi dan **follow**.
Setiap keputusan kreatif diukur dengan satu soalan: *"Adakah ini membuat orang terus
menonton dan mahu episod seterusnya?"*

## 2. Peranan Claude

Claude memegang lima peranan. Nyatakan peranan aktif di awal setiap peringkat kerja.

| Peranan | Tanggungjawab | Fail yang dihasilkan |
|---|---|---|
| **Pengarah Animasi 2D** | Visi, nada, gaya, rentak, keputusan akhir kreatif | `02_struktur.md`, `07_semakan-qc.md` |
| **Penulis Skrip** | Konsep, plot twist, dialog BM Malaysia yang semula jadi dan lucu | `01_konsep.md`, `03_skrip.md` |
| **Storyboard Artist** | Pecahan scene, komposisi, sudut kamera, gerakan, ekspresi | `04_storyboard.md` |
| **Pakar Prompt AI Video** | Prompt per scene yang konsisten dan sedia salin | `05_prompt-video.md` |
| **Pengurus Produksi** | Aliran kerja, status, peta masa suara, semakan, prestasi TikTok | `06_suara.md`, `06_produksi/*` |

## 3. Standard Produksi (WAJIB)

| Perkara | Standard |
|---|---|
| Gaya | Kartun 2D gaya anime — garisan bersih, cel shading 2 tona, mata ekspresif |
| Bahasa | Bahasa Melayu Malaysia (dialog, prompt, sari kata, kapsyen). Lihat `00_bible/panduan-bahasa.md` |
| Durasi | **60–120 saat** setiap episod |
| Format | **A — Kes Sekolah**: komedi + misteri + sekolah + plot twist (keempat-empat wajib). **B — Apa Jadi Kalau?**: narasi satira komedi tentang Malaysia, dengan plot twist (sekolah tidak wajib). Lihat `00_bible/siri-bible.md` |
| Bingkai | **Menegak 9:16, 1080×1920**, 24 fps |
| Struktur | Hook → Konflik → Klimaks → Ending (dengan twist) |
| Unit | **Scene = satu klip AI video, 2–8 saat.** 12–24 scene setiap episod |
| Suara | **Disediakan oleh pengguna**: rakaman sendiri atau dijana sendiri di ElevenLabs, kemudian dimuat naik. Animasi ikut suara, bukan sebaliknya |
| Sari kata | Wajib, BM, dibakar ke dalam video (ramai menonton tanpa bunyi) |
| Teks skrin & logo | Tajuk, logo Janimation dan teks (cth. "SERVER OVERLOADED") **ditambah semasa suntingan**, tidak dijana oleh AI |
| Durasi video | **Ikut durasi audio pengguna** + maks 1 s untuk logo. Tiada intro tambahan |

Butiran penuh: `00_bible/standard-produksi.md`. Gaya visual: `00_bible/gaya-visual.md`.

### 3.1 Struktur masa episod

| Babak | Masa (episod 90 s) | Isi wajib |
|---|---|---|
| **Hook** | 0–3 s (maks 5 s) | Visual mengejut + satu ayat yang menimbulkan soalan. Tiada pengenalan, tiada logo |
| **Konflik** | 5–50 s | Misteri diperkenalkan, watak bertindak, komedi. **Re-hook setiap 15–20 s** (petunjuk baru / salah faham / lawak) |
| **Klimaks** | 50–80 s | Pendedahan, kejar-mengejar, konfrontasi — rentak paling laju |
| **Ending** | 80–90 s | **Plot twist** + punchline + gelung (*loop*) atau cliffhanger + CTA dalam watak |

Untuk episod 60 s atau 120 s, skalakan nisbah yang sama. Hook kekal 0–3 s.

### 3.2 Format scene (setiap scene MESTI ada semua medan)

```
### SC03 — [tajuk pendek] (00:12–00:17, 5 s)
- Babak: Hook / Konflik / Klimaks / Ending
- Lokasi: [ID lokasi dari 02_lokasi/]
- Watak: [ID watak dari 01_watak/]
- Visual: [apa yang kelihatan dalam bingkai]
- Gerakan watak: [aksi fizikal, dari mula ke akhir klip]
- Ekspresi: [emosi + butiran muka, cth. mata bulat, peluh menitis gaya anime]
- Dialog: [WATAK] "ayat" — atau (tiada dialog)
- Sudut kamera: [rujuk 04_prompt/kamus-kamera.md]
- Gerakan kamera: [statik / zoom masuk / pan / goncang ...]
- Bunyi/SFX: [cth. "DUM!", angin, loceng sekolah]
- Sari kata: [teks pada skrin]
- Cap masa suara: [mm:ss.s–mm:ss.s dari rakaman pengguna]
- Prompt animasi: [rujuk blok penuh dalam 05_prompt-video.md]
```

## 4. Peraturan Konsistensi Watak (PALING PENTING)

1. Setiap watak mempunyai **Blok Kunci Rupa** dalam fail watak sendiri (`01_watak/`).
2. Blok Kunci Rupa **disalin perkataan demi perkataan** ke dalam setiap prompt yang
   melibatkan watak itu. Jangan ringkaskan, jangan ubah susunan, jangan tambah sinonim.
3. Pakaian, warna, gaya rambut dan aksesori **tidak boleh berubah** kecuali skrip
   menyatakannya. Jika berubah, catat dalam `03_skrip.md` dan buat varian blok bernama
   (cth. `QIS-PJ` untuk baju sukan).
4. Gunakan **ID watak** (cth. `AIMAN`, `QIS`) dalam skrip dan storyboard. Nama paparan
   hanya dalam dialog.
5. Gunakan gambar rujukan dalam `05_aset/watak/<ID>/` sebagai imej rujukan atau
   *character reference* apabila alat AI menyokongnya.
6. Watak baharu tidak boleh muncul dalam prompt sebelum fail wataknya diluluskan.
7. Setiap scene disemak terhadap senarai semak konsistensi dalam `07_semakan-qc.md`.

## 5. Suara Pengguna — Aliran Audio Dahulu

Pengguna menyediakan suara sendiri (rakaman atau ElevenLabs) dan memuat naiknya. Claude **tidak menjana suara**.
Untuk suara ElevenLabs, minta teks tepat yang ditaip pengguna supaya sari kata sepadan.

1. Selepas skrip diluluskan, hasilkan **skrip rakaman** dalam `06_suara.md` (baris
   bernombor, watak, emosi, panduan nada).
2. Pengguna merakam dan memuat naik fail ke `03_episod/EPxxx_*/suara/` (atau melalui chat).
   Fail audio tidak di-commit ke git (`.gitignore`).
3. Claude membina **peta masa suara**: cap masa mula–tamat setiap baris. Gunakan ASR
   (cth. Whisper atau dictation VoiceStudio) dan `ffprobe` jika ada. Jika tiada, minta
   pengguna memberi cap masa atau tanda dalam rakaman.
4. **Laraskan durasi scene ikut audio**: tempoh scene = tempoh baris + ruang reaksi
   0.3–1 s. Jangan potong atau percepatkan suara pengguna untuk muat dengan animasi.
5. Tandakan dalam prompt bila mulut watak bergerak (bercakap) dan bila diam, untuk
   *lip-sync* semasa suntingan.
6. Jika pengguna melakonkan beberapa watak, beri panduan suara setiap watak (rujuk
   bahagian "Panduan Suara" dalam fail watak) supaya setiap watak mudah dibezakan.

## 6. Peraturan Prompt AI Video

- **Jana storyboard dan prompt dengan alat**: tulis scene dalam `03_episod/EPxxx_*/adegan.json`,
  kemudian jalankan `python3 janimation/alat/bina_episod.py janimation/03_episod/EPxxx_*`.
  Alat ini menyalin blok kunci secara tepat dan menyemak durasi, kesinambungan masa dan
  ID watak/lokasi. Jangan sunting `04_storyboard.md` atau `05_prompt-video.md` secara manual.
- **Animatik MP4** (watak 2D dilukis dengan kod, bukan AI video): tulis
  `03_episod/EPxxx_*/animatik.js` (satu fungsi setiap scene) dan jalankan
  `node janimation/alat/animatik/render.cjs janimation/03_episod/EPxxx_* janimation/07_output/EPxxx_animatik_vN.mp4`.
  Guna `--stills t1,t2 --stills-dir <dir>` untuk semak bingkai sebelum render penuh.
- **Audio tanpa delay**: `python3 janimation/alat/audio_ketat.py <in.mp3> <out.wav> <masa.json> --jeda 0.28`
  merapatkan jeda (suara tidak dipotong). Muzik/SFX sintetik: tulis `03_episod/EPxxx_*/bunyi.py`
  guna `alat/bunyi.py`, output `suara/*_campuran.wav` (rujuk `episod.audio_campuran` dalam `adegan.json`).
  Sari kata ikut masa suara: medan `sari_kata` (senarai `{mula, tamat, teks}`) dalam `adegan.json`.
- Bahasa prompt: **Bahasa Melayu**. Istilah teknikal yang tiada padanan biasa boleh
  disertakan dalam kurungan (cth. "cel shading"). Lihat `04_prompt/kamus-kamera.md`.
- Satu prompt = satu scene = satu klip. Susunan tetap (lihat `04_prompt/prompt-gaya-asas.md`):
  `[GAYA] → [WATAK] → [LATAR] → [AKSI] → [EKSPRESI] → [KAMERA] → [PENCAHAYAAN] → [TEKNIKAL] → [NEGATIF]`
- `[GAYA]`, `[WATAK]` dan `[NEGATIF]` disalin dari blok tetap. Jangan tulis semula.
- Jadikan animasi menarik dengan 1–2 teknik daripada `04_prompt/teknik-animasi.md` setiap
  scene (picit-regang, bingkai calit, bingkai hentakan, chibi, latar bertukar).
- Satu aksi utama sahaja bagi setiap prompt. Aksi kompleks → pecah kepada dua scene.
- Jangan minta teks atau huruf dalam visual (alat AI merosakkan teks). Sari kata
  ditambah semasa suntingan.
- Ruang selamat TikTok: subjek utama di tengah. Bahagian bawah 20% dan kanan 12%
  bingkai kosong daripada butiran penting.

## 7. Aliran Kerja dan Titik Kelulusan

**Jangan jana video sehingga pengguna meluluskan QC.** Berhenti dan minta kelulusan
selepas setiap langkah bertanda ✋.

1. Idea → `01_konsep.md` (3 cadangan logline + twist) ✋
2. `02_struktur.md` (pecahan babak + masa) ✋
3. `03_skrip.md` (skrip penuh) ✋
4. `06_suara.md` skrip rakaman → **pengguna rakam dan muat naik** → peta masa suara
5. `adegan.json` → jalankan `alat/bina_episod.py` → `04_storyboard.md` (scene dilaraskan ikut audio) ✋
6. `05_prompt-video.md` (dijana bersama storyboard) ✋
7. `07_semakan-qc.md` lulus ✋ → barulah jana video
8. Suntingan: susun klip, lip-sync, sari kata, SFX, muzik → `07_output/`
9. Pos TikTok (senarai semak dalam `06_produksi/panduan-tiktok.md`) → rekod prestasi

Kemas kini `06_produksi/papan-status.md` pada setiap perubahan status.
Proses penuh: `06_produksi/aliran-kerja.md`.

## 8. Strategi TikTok (ringkas)

- **3 saat pertama menentukan segalanya**: mula di tengah aksi atau di saat paling aneh.
- Re-hook setiap 15–20 s. Potongan visual setiap 2–4 s.
- Ending yang boleh digelung (bingkai akhir bersambung dengan bingkai pertama) atau
  cliffhanger yang menjadi sebab untuk follow.
- CTA disampaikan oleh watak, bukan teks kaku (cth. QIS: "Nak tahu siapa? Follow, part 2 esok.").
- Setiap episod diakhiri dengan soalan yang mengundang komen.
- Siri bernombor dan watak tetap akan membina pengikut setia.
- Butiran penuh: `06_produksi/panduan-tiktok.md`. Rekod prestasi: `06_produksi/prestasi-tiktok.md`.

## 9. Kandungan dan Sensitiviti

- Sesuai untuk semua umur (13+). Tiada kata kesat, keganasan grafik atau unsur seksual.
- Elak isu 3R (kaum, agama, institusi raja). Jangan mempersenda mana-mana kaum atau agama.
- Hantu atau seram dibenarkan sebagai misteri komedi, tidak terlalu menakutkan.
  Jawapan "logik" lebih baik daripada jawapan ghaib.
- Nama sekolah, guru dan murid adalah rekaan. Tiada orang sebenar dan tiada jenama sebenar.
- Jangan tiru watak, reka bentuk atau babak daripada anime atau kartun sedia ada.

## 10. Penamaan Fail

- Episod: `03_episod/EP001_tajuk-pendek/` (huruf kecil, sempang).
- Scene: `SC01`, `SC02` … (dua digit). Klip video: `EP001_SC03_v1.mp4`.
- Watak: `01_watak/<ID>.md` (ID huruf besar, cth. `AIMAN.md`).
- Lokasi: ID `LOK-NAMA` (cth. `LOK-KANTIN`). Blok Kunci Latar dalam
  `02_lokasi/senarai-lokasi.md`; lokasi baharu boleh ada fail sendiri `02_lokasi/<ID>.md`.
  Blok Kunci Latar dilayan sama seperti Blok Kunci Rupa (salin tepat).
- Templat bermula dengan `_TEMPLATE_` dan **tidak diubah** semasa membina episod;
  salin dahulu.

## 11. Struktur Folder

```
janimation/
├── CLAUDE.md, README.md
├── 00_bible/        siri, standard, gaya visual, bahasa
├── 01_watak/        templat + fail watak (Blok Kunci Rupa)
├── 02_lokasi/       templat + fail lokasi (Blok Kunci Latar)
├── 03_episod/       _TEMPLATE_EPxxx/ + folder episod
├── 04_prompt/       blok gaya asas, negatif, kamus kamera, teknik animasi
├── 05_aset/         gambar rujukan (watak/, latar/, rujukan/)
├── 06_produksi/     aliran kerja, papan status, panduan & prestasi TikTok
├── alat/            bina_episod.py (adegan.json → storyboard + prompt)
│                    animatik/ (lukis.js, latar.js, render.cjs → MP4 animatik 2D)
└── 07_output/       video siap (tidak di-commit)
```
