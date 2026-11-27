# EP001 — Suara (Peta Masa)

> Peranan: Pengurus Produksi · Suara pengguna sendiri, tidak dipotong atau dipercepatkan.

## A. Fail diterima

| Fail | Durasi | Format | Catatan |
|---|---|---|---|
| `suara/EP001_narasi.mp3` (asal: `Janda_baru.mp3`) | 76.2 s | MP3 mono 44.1 kHz 128 kb/s | Suara ElevenLabs disediakan pengguna, tiada muzik. Tidak di-commit ke git |

## B. Kaedah

- Jeda dikesan dengan `ffmpeg silencedetect` (−35 dB, ≥ 0.3 s): 17 segmen ucapan.
- Segmen dipadankan dengan baris skrip mengikut kiraan suku kata (±0.3 s untuk 15 baris).
- Titik potong di tengah baris (SC03/04, SC07/08, SC12/13, SC16/17, SC18/19/20) ialah
  **anggaran**. Laraskan pada gelombang audio semasa suntingan.
- Transkripsi automatik (Whisper) tidak dapat dijalankan kerana muat turun model disekat.

## C. Peta masa

| Baris | Scene | Mula | Tamat | Durasi | Padanan |
|---|---|---|---|---|---|
| B00 tajuk | SC01 | 00:00.0 | 00:02.7 | 2.7 s | ✅ kuat |
| B01 | SC02 | 00:03.3 | 00:07.9 | 4.6 s | ✅ |
| B02 | SC03–04 | 00:08.3 | 00:14.0 | 5.6 s | ✅ |
| B03 | SC05 | 00:14.4 | 00:16.1 | 1.7 s | ✅ |
| B04 | SC06 | 00:16.5 | 00:19.4 | 2.9 s | ✅ |
| B05 | SC07–08 | 00:19.9 | 00:24.5 | 4.6 s | ✅ |
| B06 | SC09 | 00:25.0 | 00:29.0 | 4.0 s | ✅ |
| B07 | SC10 | 00:29.3 | 00:33.2 | 3.9 s | ✅ |
| B08 | SC11 | 00:33.7 | 00:36.4 | 2.7 s | ✅ |
| B09 | SC12–13 | 00:36.8 | 00:41.4 | 4.6 s | ✅ |
| B10 | SC14 | 00:41.9 | 00:46.3 | 4.4 s | ✅ |
| B11 | SC15 | 00:46.7 | 00:51.7 | 5.0 s | ✅ ("Tetapi" + jeda 0.6 s) |
| B12 | SC16–17 | 00:52.1 | 00:58.4 | 6.2 s | ✅ |
| B13 | SC18–20 | 00:58.9 | 01:07.6 | 8.7 s | ✅ |
| B14 | SC21 | 01:08.1 | 01:11.4 | 3.3 s | ✅ |
| B15 | SC22 | 01:11.9 | 01:15.9 | 4.0 s | ⚠️ **lebih pendek** daripada skrip (jangkaan ±8.6 s) |

**Jumlah audio:** 76.2 s · **Jumlah video:** 77.0 s (tambahan 0.8 s untuk logo + bunyi penutup)

> ⚠️ B15: rakaman penutup hanya 4 s. Kemungkinan ayat penutup diringkaskan semasa rakaman.
> Keputusan pengguna: teruskan dengan audio sedia ada. Sari kata SC22 guna versi pendek;
> semak dengan teks ElevenLabs semasa suntingan.

## D. Bunyi tambahan

| Scene | SFX utama | Muzik |
|---|---|---|
| SC01–SC14 | Whoosh, "PFFFT!", "DUM!", notifikasi, letupan, "KA-CHING!", cop | Komedi rancak (SC06 romantik sekejap) |
| SC15 | Angin, cengkerik | **Berhenti** pada "Tetapi" |
| SC16–SC21 | Rempuhan, jam berdetik, "KA-CHING!", "DUN DUN!" | Komedi kembali, makin laju |
| SC22 | "Boing!", logo pop | Penutup |

Muzik latar −18 hingga −24 dB di bawah suara.
