// Daftar pelajaran Python untuk pemula.
// Setiap pelajaran punya: penjelasan, kode awal (starter), latihan, petunjuk,
// dan hasil yang diharapkan (opsional, hanya untuk ditampilkan ke pengguna).

export const LESSONS = [
  {
    id: "halo-dunia",
    title: "Halo Dunia",
    description: [
      "Selamat datang di Python! Perintah paling dasar adalah print(). Perintah ini menampilkan sesuatu ke layar.",
      "Tulisan (disebut string) harus diapit tanda kutip, misalnya \"Halo\". Setiap print() otomatis pindah ke baris baru.",
    ],
    starter: 'print("Halo, Dunia!")\nprint("Saya sedang belajar Python")\n',
    task: "Ubah teks supaya menampilkan namamu sendiri, lalu tambahkan satu baris print() baru.",
    hint: "Ganti teks di dalam tanda kutip. Setiap baris print() akan menampilkan satu baris di output.",
    expected: "Halo, Dunia!\nSaya sedang belajar Python",
  },
  {
    id: "variabel",
    title: "Variabel",
    description: [
      "Variabel itu seperti kotak yang diberi label. Kamu bisa menyimpan nilai di dalamnya dengan tanda sama dengan (=).",
      "Setelah disimpan, kamu bisa memakai nama variabelnya berkali-kali tanpa mengetik ulang nilainya.",
    ],
    starter: 'nama = "Budi"\numur = 17\n\nprint("Nama saya", nama)\nprint("Umur saya", umur, "tahun")\n',
    task: "Buat variabel baru bernama kota (isi dengan nama kotamu), lalu tampilkan dengan print().",
    hint: "Tulis: kota = \"Nama Kota\" lalu print(\"Saya tinggal di\", kota).",
    expected: "Nama saya Budi\nUmur saya 17 tahun",
  },
  {
    id: "angka",
    title: "Angka dan Operasi Hitung",
    description: [
      "Python bisa dipakai sebagai kalkulator. Operator yang umum: + (tambah), - (kurang), * (kali), / (bagi), // (bagi bulat), % (sisa bagi), dan ** (pangkat).",
    ],
    starter: "a = 10\nb = 3\n\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)\nprint(a // b)\nprint(a % b)\nprint(a ** b)\n",
    task: "Buat variabel panjang = 8 dan lebar = 5, lalu tampilkan luas persegi panjang (panjang * lebar).",
    hint: "Luas = panjang * lebar. Gunakan print(panjang * lebar).",
    expected: "13\n7\n30\n3.3333333333333335\n3\n1\n1000",
  },
  {
    id: "input",
    title: "Input dari Pengguna",
    description: [
      "Fungsi input() meminta pengguna mengetik sesuatu. Hasilnya selalu berupa teks.",
      "Untuk angka, bungkus dengan int(), misalnya int(input(\"Angka: \")).",
      "Saat program ini dijalankan, akan muncul kotak isian. Ketik jawabanmu lalu klik OK.",
    ],
    starter: 'nama = input("Siapa namamu? ")\nprint("Halo,", nama, "!")\n',
    task: "Minta dua angka dari pengguna, lalu tampilkan hasil penjumlahannya.",
    hint: "Gunakan a = int(input(\"Angka pertama: \")) dan b = int(input(\"Angka kedua: \")), lalu print(a + b).",
    expected: null,
  },
  {
    id: "if-else",
    title: "Percabangan (if / elif / else)",
    description: [
      "Dengan if, program bisa memilih apa yang dikerjakan berdasarkan kondisi.",
      "Ingat: baris setelah if, elif, atau else harus menjorok ke dalam (4 spasi), dan diakhiri tanda titik dua (:).",
    ],
    starter: 'nilai = 78\n\nif nilai >= 80:\n    print("Nilai A")\nelif nilai >= 70:\n    print("Nilai B")\nelse:\n    print("Nilai C")\n',
    task: "Ubah nilai menjadi 95 lalu jalankan. Tambahkan kondisi agar nilai di bawah 60 menampilkan \"Perlu belajar lagi\".",
    hint: "Tambahkan elif nilai < 60: di atas else, lalu print(\"Perlu belajar lagi\") dengan indentasi yang sama seperti print lainnya.",
    expected: "Nilai B",
  },
  {
    id: "for",
    title: "Perulangan for",
    description: [
      "for dipakai untuk mengulang sebuah aksi beberapa kali. range(1, 6) menghasilkan angka 1 sampai 5 (angka akhir tidak ikut).",
    ],
    starter: 'for i in range(1, 6):\n    print("Hitungan ke", i)\n\nprint("Selesai!")\n',
    task: "Tampilkan angka 1 sampai 10 satu per baris dengan perulangan for.",
    hint: "Gunakan range(1, 11). Ingat, angka akhir tidak ikut, jadi harus 11.",
    expected: "Hitungan ke 1\nHitungan ke 2\nHitungan ke 3\nHitungan ke 4\nHitungan ke 5\nSelesai!",
  },
  {
    id: "while",
    title: "Perulangan while",
    description: [
      "while mengulang selama kondisinya masih benar (True). Pastikan ada sesuatu yang membuat kondisinya suatu saat menjadi salah, supaya tidak berulang selamanya.",
    ],
    starter: "hitung = 3\n\nwhile hitung > 0:\n    print(hitung)\n    hitung = hitung - 1\n\nprint(\"Liftoff!\")\n",
    task: "Ubah program agar hitungan dimulai dari 5, lalu tampilkan \"Liftoff!\" di akhir.",
    hint: "Ubah hitung = 3 menjadi hitung = 5. Baris hitung = hitung - 1 jangan dihapus, supaya perulangan berhenti.",
    expected: "3\n2\n1\nLiftoff!",
  },
  {
    id: "list",
    title: "List (Daftar)",
    description: [
      "List adalah kumpulan banyak nilai dalam satu variabel, ditulis dengan kurung siku [ ] dan dipisah koma.",
      "Posisi pertama di list adalah indeks 0. len() menghitung jumlah isi list, dan append() menambah isi baru di akhir.",
    ],
    starter: 'buah = ["apel", "mangga", "jeruk"]\n\nprint(buah[0])\nbuah.append("pisang")\nprint("Jumlah buah:", len(buah))\n\nfor item in buah:\n    print("-", item)\n',
    task: "Buat list berisi nama 3 temanmu, tambahkan satu nama lagi dengan append(), lalu tampilkan semuanya dengan for.",
    hint: "Buat variabel teman = [\"A\", \"B\", \"C\"], lalu teman.append(\"D\"), dan for nama in teman: print(nama).",
    expected: "apel\nJumlah buah: 4\n- apel\n- mangga\n- jeruk\n- pisang",
  },
  {
    id: "fungsi",
    title: "Fungsi",
    description: [
      "Fungsi adalah blok kode yang diberi nama supaya bisa dipanggil berulang kali. Dibuat dengan kata kunci def.",
      "Nilai yang diberikan saat memanggil fungsi disebut argumen. Hasil yang dikembalikan dengan return.",
    ],
    starter: 'def sapa(nama):\n    return "Halo, " + nama + "!"\n\nprint(sapa("Ani"))\nprint(sapa("Budi"))\n',
    task: "Buat fungsi luas(panjang, lebar) yang mengembalikan hasil perkalian keduanya. Lalu panggil dengan panjang 4 dan lebar 6.",
    hint: "def luas(panjang, lebar): lalu return panjang * lebar. Panggil dengan print(luas(4, 6)).",
    expected: "Halo, Ani!\nHalo, Budi!",
  },
  {
    id: "bebas",
    title: "Mode Bebas",
    description: [
      "Tidak ada aturan di sini. Tulis dan coba kode Python apa pun yang kamu mau.",
      "Kalau bingung, buka tab Cheat Sheet di sebelah kiri untuk contoh singkat yang bisa langsung dicoba.",
    ],
    starter: "# Tulis kode Python kamu di sini\nprint(\"Hai!\")\n",
    task: "Bebas! Coba eksperimen dengan apa saja.",
    hint: "Coba ubah angka, teks, atau tambahkan print() baru lalu jalankan lagi.",
    expected: null,
  },
];
