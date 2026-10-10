# Py Lab 🐍

Website belajar Python untuk pemula, berbahasa Indonesia. Kode Python dijalankan langsung di browser (memakai [Pyodide](https://pyodide.org)), jadi tidak perlu install Python dan tidak perlu server khusus.

## Fitur

- **9 pelajaran bertahap**: print, variabel, operasi angka, input, if/elif/else, for, while, list, dan fungsi, masing-masing dengan penjelasan, latihan, dan petunjuk.
- **Mode Bebas** untuk bereksperimen tanpa aturan.
- **Editor ramah pemula**: nomor baris, tombol `Tab` untuk menjorok, `Enter` setelah `:` menjorok otomatis, dan `Shift+Tab` untuk mengurangi indentasi.
- **Jalankan dengan `Ctrl+Enter`** (atau `Cmd+Enter` di macOS).
- **Input interaktif**: `input()` akan memunculkan kotak isian, dan jawabanmu tercatat di output.
- **Penjelasan error dalam Bahasa Indonesia**: error seperti `NameError`, `IndentationError`, `TypeError`, dan `ZeroDivisionError` diterjemahkan, lengkap dengan nomor baris yang ditandai di editor. Pesan asli tetap bisa dilihat.
- **Kamus**: istilah pemrograman dasar dengan arti dan contoh, bisa dicari.
- **Cheat Sheet**: contoh singkat yang bisa langsung ditambahkan ke editor.
- **Kode tersimpan otomatis** di browser (localStorage), dan pelajaran yang sudah berhasil dijalankan diberi tanda ✓.

## Cara menjalankan

Tidak ada instalasi atau build. Cukup jalankan server kecil yang sudah disediakan:

```bash
python3 serve.py
```

Lalu buka <http://localhost:8000> di browser. (`serve.py` memakai header anti-cache, jadi perubahan kode langsung terlihat setelah halaman dimuat ulang.)

> Catatan: Pyodide dimuat dari CDN jsDelivr (`cdn.jsdelivr.net`) saat pertama kali halaman dibuka, jadi perlu koneksi internet. Setelah itu browser biasanya menyimpannya di cache.

## Struktur

```
index.html        Halaman utama
css/style.css     Tampilan
js/app.js         Logika UI (editor, output, tab, penyimpanan)
js/runner.js      Memuat Pyodide dan menjalankan kode Python
js/errors.js      Penerjemah error Python ke Bahasa Indonesia
js/lessons.js     Isi pelajaran
js/glossary.js    Isi Kamus dan Cheat Sheet
```

## Catatan teknis

- Versi Pyodide diatur di `js/runner.js` (`PYODIDE_VERSION`).
- Setiap kali dijalankan, kode memakai namespace baru, sehingga variabel dari run sebelumnya tidak terbawa.
- Karena kode berjalan di thread utama browser, program yang terjebak perulangan tak berhenti akan membuat halaman tidak responsif. Muat ulang halaman (F5) untuk memulai lagi.
