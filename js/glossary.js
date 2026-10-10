// Data untuk tab Kamus (istilah) dan Cheat Sheet (contoh singkat).

export const GLOSSARY = [
  {
    istilah: "Variabel",
    arti: "Tempat menyimpan nilai dengan sebuah nama. Dibuat dengan tanda sama dengan (=).",
    contoh: 'nama = "Budi"',
  },
  {
    istilah: "String (str)",
    arti: "Tipe data untuk teks. Selalu diapit tanda kutip.",
    contoh: 'sapaan = "Halo"',
  },
  {
    istilah: "Integer (int)",
    arti: "Tipe data untuk bilangan bulat, tanpa koma.",
    contoh: "umur = 17",
  },
  {
    istilah: "Float",
    arti: "Tipe data untuk bilangan desimal (pakai titik, bukan koma).",
    contoh: "tinggi = 1.65",
  },
  {
    istilah: "Boolean (bool)",
    arti: "Tipe data dengan dua nilai saja: True (benar) atau False (salah).",
    contoh: "sudah_makan = True",
  },
  {
    istilah: "Operator",
    arti: "Simbol untuk melakukan operasi, seperti + - * / atau == untuk membandingkan.",
    contoh: "print(5 + 3)",
  },
  {
    istilah: "Fungsi",
    arti: "Blok kode yang diberi nama dan bisa dipanggil berulang kali. Dibuat dengan def.",
    contoh: "def sapa():\n    print(\"Halo!\")",
  },
  {
    istilah: "Parameter",
    arti: "Nama yang ditulis di dalam tanda kurung saat mendefinisikan fungsi.",
    contoh: "def sapa(nama):   # nama adalah parameter",
  },
  {
    istilah: "Argumen",
    arti: "Nilai yang kamu berikan saat memanggil fungsi.",
    contoh: 'sapa("Ani")   # "Ani" adalah argumen',
  },
  {
    istilah: "Return",
    arti: "Mengembalikan hasil dari fungsi ke tempat fungsi itu dipanggil.",
    contoh: "def tambah(a, b):\n    return a + b",
  },
  {
    istilah: "List",
    arti: "Kumpulan nilai yang berurutan, ditulis dengan kurung siku [ ].",
    contoh: 'buah = ["apel", "jeruk"]',
  },
  {
    istilah: "Indeks",
    arti: "Nomor posisi dalam list atau string. Dimulai dari 0.",
    contoh: 'buah[0]   # hasilnya "apel"',
  },
  {
    istilah: "Indentasi",
    arti: "Spasi di depan baris kode. Python memakai indentasi untuk menentukan isi dari if, for, while, dan def.",
    contoh: "if True:\n    print(\"Di dalam if\")",
  },
  {
    istilah: "Kondisi",
    arti: "Ekspresi yang hasilnya True atau False, dipakai di if dan while.",
    contoh: "umur >= 17",
  },
  {
    istilah: "Perulangan (loop)",
    arti: "Cara mengulang kode beberapa kali. Ada for dan while.",
    contoh: "for i in range(3):\n    print(i)",
  },
  {
    istilah: "Komentar",
    arti: "Catatan untuk manusia. Python akan mengabaikannya. Dimulai dengan tanda #.",
    contoh: "# ini komentar",
  },
  {
    istilah: "Error (Exception)",
    arti: "Pesan yang muncul saat kode tidak bisa dijalankan. Jangan takut, error membantu kita memperbaiki kode.",
    contoh: "print(1 / 0)   # ZeroDivisionError",
  },
  {
    istilah: "Modul",
    arti: "Kumpulan fungsi siap pakai yang bisa diimpor dengan import.",
    contoh: "import math\nprint(math.sqrt(16))",
  },
];

export const CHEAT_SHEET = [
  {
    judul: "Output",
    items: [
      { label: "Tampilkan teks", kode: 'print("Halo, Dunia!")' },
      { label: "Beberapa nilai sekaligus", kode: 'print("Umur:", 17)' },
      { label: "Teks dengan variabel (f-string)", kode: 'nama = "Ani"\nprint(f"Halo, {nama}!")' },
    ],
  },
  {
    judul: "Input",
    items: [
      { label: "Minta teks", kode: 'nama = input("Nama kamu: ")' },
      { label: "Minta angka", kode: 'umur = int(input("Umur kamu: "))' },
    ],
  },
  {
    judul: "Operator",
    items: [
      { label: "Hitung dasar", kode: "print(7 + 2, 7 - 2, 7 * 2, 7 / 2)" },
      { label: "Bagi bulat & sisa bagi", kode: "print(7 // 2, 7 % 2)" },
      { label: "Pangkat", kode: "print(2 ** 5)" },
      { label: "Perbandingan", kode: "print(5 > 3, 5 == 3, 5 != 3)" },
    ],
  },
  {
    judul: "Kondisi",
    items: [
      {
        label: "if / elif / else",
        kode: 'skor = 85\nif skor >= 90:\n    print("A")\nelif skor >= 80:\n    print("B")\nelse:\n    print("C")',
      },
      { label: "Dan / atau / bukan", kode: "print(True and False, True or False, not True)" },
    ],
  },
  {
    judul: "Perulangan",
    items: [
      { label: "for dengan range", kode: "for i in range(3):\n    print(i)" },
      { label: "for dengan list", kode: 'for buah in ["apel", "jeruk"]:\n    print(buah)' },
      { label: "while", kode: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1" },
    ],
  },
  {
    judul: "List",
    items: [
      { label: "Buat & ambil isi", kode: 'angka = [10, 20, 30]\nprint(angka[0], angka[-1])' },
      { label: "Tambah & hitung", kode: "angka = []\nangka.append(5)\nprint(len(angka))" },
      { label: "Jumlah & terbesar", kode: "nilai = [4, 9, 2]\nprint(sum(nilai), max(nilai))" },
    ],
  },
  {
    judul: "Fungsi",
    items: [
      { label: "Fungsi sederhana", kode: 'def sapa(nama):\n    return "Halo, " + nama\n\nprint(sapa("Budi"))' },
      { label: "Parameter default", kode: 'def salam(nama="Teman"):\n    print("Hai,", nama)\n\nsalam()\nsalam("Ani")' },
    ],
  },
  {
    judul: "Tipe Data",
    items: [
      { label: "Cek tipe", kode: 'print(type(5), type(5.0), type("5"))' },
      { label: "Ubah tipe", kode: 'print(int("42") + 1)\nprint(str(42) + "!")' },
    ],
  },
];
