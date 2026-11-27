# Blok Prompt Gaya Asas

> Salin blok `[GAYA]` **tepat** ke awal setiap prompt. Jangan ubah tanpa kelulusan
> pengguna (perubahan di sini mengubah rupa seluruh siri).

## [GAYA] — utama

```
[GAYA] Animasi kartun 2D gaya anime moden, garisan luar bersih berwarna coklat kehitaman,
cel shading dua tona, mata besar ekspresif dengan kilauan putih, warna cerah tepu sederhana,
latar belakang lukisan tangan yang lembut dan sedikit kabur, animasi lancar 24 fps,
kualiti siri anime televisyen, suasana dan budaya Malaysia.
```

## Tambahan mod suasana (letak dalam `[PENCAHAYAAN]`)

**Komedi**
```
Cahaya matahari pagi yang terang dan hangat, bayang lembut, warna kuning dan biru ceria.
```

**Misteri**
```
Cahaya petang jingga atau cahaya malam biru keunguan, bayang panjang dan tajam, vignet
gelap di tepi bingkai, kontras tinggi, kabus nipis.
```

**Mewah** (scene jutawan / kekayaan)
```
Cahaya matahari petang keemasan yang hangat, kilauan bintang emas berkilau di udara, kontras
hangat dan mewah, warna emas dan putih menonjol.
```

## Susunan prompt (tetap)

```
[GAYA]        ← blok di atas, tepat
[WATAK]       ← Blok Kunci Rupa setiap watak (01_watak/<ID>.md), tepat
[LATAR]       ← Blok Kunci Latar (02_lokasi/senarai-lokasi.md), tepat
[AKSI]        ← satu aksi utama, kata kerja jelas, mula → akhir
[EKSPRESI]    ← emosi + butiran muka anime (00_bible/gaya-visual.md)
[KAMERA]      ← sudut + gerakan (kamus-kamera.md)
[PENCAHAYAAN] ← mod komedi / misteri
[TEKNIKAL]    ← 9:16, durasi, kedudukan subjek, mulut bercakap ya/tidak, tiada teks
[NEGATIF]     ← prompt-negatif.md, tepat
```

## Contoh lengkap

```
[GAYA] Animasi kartun 2D gaya anime moden, garisan luar bersih berwarna coklat kehitaman,
cel shading dua tona, mata besar ekspresif dengan kilauan putih, warna cerah tepu sederhana,
latar belakang lukisan tangan yang lembut dan sedikit kabur, animasi lancar 24 fps,
kualiti siri anime televisyen, suasana dan budaya Malaysia.

[WATAK] AIMAN: remaja lelaki Melayu 16 tahun, badan kurus sederhana tinggi, rambut hitam
pendek berserabut dengan satu jambul tegak melengkung di atas kepala, mata besar coklat
gelap dengan kening tebal, plaster kecil berwarna oren di pipi kanan, kemeja sekolah putih
lengan pendek dengan hujung baju terkeluar sebelah kiri, tali leher hijau tua berjalur
kuning dilonggarkan, seluar panjang hijau gelap, kasut sekolah putih, jam tangan digital
hitam besar di pergelangan tangan kiri, warna tanda oren.

[LATAR] LOK-KORIDOR: koridor terbuka tingkat dua sekolah, lantai jubin merah bata, tembok
separas pinggang berwarna krim dengan jeriji hijau tua, pintu kelas kayu hijau di sebelah
kanan berderet, rak kasut kecil di tepi setiap pintu, pemandangan padang sekolah hijau dan
pokok angsana di sebelah kiri.

[AKSI] AIMAN berlari masuk dari kiri bingkai, brek mengejut di depan rak kasut sehingga
tergelincir sedikit, kemudian merenung rak kasut yang hanya berisi kasut sebelah kanan.

[EKSPRESI] Mata terbeliak putih bulat, mulut ternganga, jambul tegak lurus, satu titis
peluh besar gaya anime di dahi.

[KAMERA] Aras mata sedikit rendah, statik, kemudian zoom masuk pantas ke muka AIMAN pada
saat akhir.

[PENCAHAYAAN] Cahaya matahari pagi yang terang dan hangat, bayang lembut, warna kuning dan
biru ceria.

[TEKNIKAL] Menegak 9:16, 3 saat, subjek di tengah bingkai, bahagian bawah bingkai kosong,
mulut bercakap: ya, tiada teks atau huruf dalam visual.

[NEGATIF] (blok dari prompt-negatif.md)
```

## Nota alat AI

- Jika alat menyokong **imej rujukan watak**, muat naik gambar dari `05_aset/watak/<ID>/`
  dan kekalkan Blok Kunci Rupa dalam teks.
- Jika alat salah faham istilah BM, tambah istilah teknikal dalam kurungan
  (lihat `kamus-kamera.md`) tanpa membuang teks BM.
- Untuk dua watak dalam satu scene, letakkan kedudukan jelas: "AIMAN di kiri, QIS di kanan".
- Maksimum dua watak utama setiap scene untuk konsistensi terbaik.
