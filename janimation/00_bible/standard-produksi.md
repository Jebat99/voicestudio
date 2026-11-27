# Standard Produksi

## Spesifikasi teknikal

| Perkara | Nilai |
|---|---|
| Nisbah | 9:16 menegak |
| Resolusi | 1080×1920 (jana pada resolusi tertinggi alat, kemudian eksport 1080×1920) |
| Kadar bingkai | 24 fps (rasa anime). Eksport 24 atau 30 fps |
| Durasi episod | 60–120 s (sasaran 75–95 s untuk kadar tonton penuh yang tinggi) |
| Durasi scene | 3–8 s (satu klip AI) |
| Bilangan scene | 12–20 |
| Potongan visual | Setiap 2–4 s (gunakan potongan dalam klip atau tukar sudut) |
| Audio | Suara pengguna (utama), SFX, muzik latar −18 hingga −24 dB di bawah suara |
| Sari kata | BM, 1–2 baris, maks 32 aksara sebaris, putih dengan garis hitam tebal |
| Kedudukan sari kata | Atas zon bawah selamat (sekitar 62–72% ketinggian dari atas) |

## Zon selamat TikTok (bingkai 1080×1920)

```
┌────────────────────────┐  0
│  atas ~150 px: elak    │
│                        │
│   ZON UTAMA            │  ← muka & aksi penting di sini
│   (tengah bingkai)     │
│                     ▐▌ │  ← kanan ~130 px: butang TikTok
│   [ sari kata ]     ▐▌ │
│────────────────────────│  ~1500
│  bawah ~420 px: nama,  │
│  kapsyen, muzik        │
└────────────────────────┘  1920
```

## Struktur episod

| Babak | % durasi | 60 s | 90 s | 120 s | Tujuan |
|---|---|---|---|---|---|
| Hook | 3–5% | 0–3 | 0–3 | 0–4 | Hentikan penonton daripada skrol |
| Konflik | 50% | 3–32 | 3–50 | 4–65 | Bina misteri dan lawak, re-hook setiap 15–20 s |
| Klimaks | 30% | 32–50 | 50–80 | 65–105 | Rentak paling laju, pendedahan |
| Ending | 15% | 50–60 | 80–90 | 105–120 | Twist + punchline + CTA / gelung |

### Hook yang berkesan (pilih satu)

- **Mula di klimaks**: tunjuk 2 s saat paling kecoh, kemudian "*3 jam sebelum itu…*".
- **Soalan terus**: watak bercakap kepada kamera: "Siapa curi kasut sebelah kiri satu sekolah?"
- **Visual mustahil**: kerusi terapung, papan hitam menulis sendiri.
- **Kenyataan mengejut**: "Cikgu disiplin kita… bukan manusia."

### Peraturan babak

- Setiap babak mesti mengubah keadaan. Jika scene boleh dibuang tanpa kesan, buang.
- Setiap 15–20 s mesti ada **re-hook**: petunjuk baru, lawak besar atau soalan baru.
- Klimaks: sekurang-kurangnya satu *impact frame* atau *smear* (lihat `04_prompt/teknik-animasi.md`).
- Ending: twist mesti **adil** (ada petunjuk awal yang boleh dilihat semula). Ini menggalakkan tonton semula.

## Contoh scene lengkap

```
### SC01 — Kasut hilang (00:00–00:03, 3 s)
- Babak: Hook
- Lokasi: LOK-KORIDOR
- Watak: AIMAN
- Visual: Koridor sekolah pagi. Deretan kasut murid di luar kelas, semuanya kasut sebelah kanan sahaja.
- Gerakan watak: AIMAN berlari masuk ke bingkai, brek mengejut, tergelincir sedikit.
- Ekspresi: Mata terbeliak bulat, mulut ternganga, satu titis peluh besar gaya anime.
- Dialog: AIMAN "Eh… mana pergi semua kasut kiri?!"
- Sudut kamera: Aras mata, sedikit rendah (low angle)
- Gerakan kamera: Zoom masuk pantas ke muka AIMAN pada perkataan "kiri"
- Bunyi/SFX: Bunyi brek kasut, "DUM!" dramatik
- Sari kata: Eh… mana pergi semua kasut KIRI?!
- Cap masa suara: 00:00.2–00:02.6
- Prompt animasi: lihat 05_prompt-video.md → SC01
```
