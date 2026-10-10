// Menerjemahkan pesan error Python menjadi penjelasan sederhana dalam Bahasa Indonesia.

const EXPLANATIONS = {
  SyntaxError: {
    judul: "Penulisan kode belum benar",
    penjelasan:
      "Python tidak memahami penulisan kodenya. Periksa kembali tanda kurung ( ), tanda kutip \" \", dan tanda titik dua : di akhir if, elif, else, for, while, atau def.",
  },
  IndentationError: {
    judul: "Indentasi (spasi di depan baris) tidak sesuai",
    penjelasan:
      "Di Python, isi dari if, for, while, atau def harus menjorok ke dalam dengan jumlah spasi yang sama (biasanya 4 spasi). Pastikan tidak ada baris yang menjorok sendiri tanpa alasan.",
  },
  TabError: {
    judul: "Campuran tab dan spasi",
    penjelasan: "Gunakan spasi saja untuk indentasi. Jangan campur tombol Tab dengan spasi.",
  },
  NameError: {
    judul: "Nama belum dikenal",
    penjelasan:
      "Python tidak menemukan nama yang kamu tulis. Biasanya karena salah ketik nama variabel atau fungsi, atau variabelnya belum dibuat sebelum dipakai.",
  },
  TypeError: {
    judul: "Tipe data tidak cocok",
    penjelasan:
      "Operasi ini tidak bisa dilakukan pada tipe data tersebut. Contoh: angka tidak bisa langsung digabung dengan teks. Gunakan str(angka) untuk mengubah angka jadi teks, atau int(teks) untuk sebaliknya.",
  },
  ValueError: {
    judul: "Nilai tidak sesuai",
    penjelasan:
      "Nilai yang diberikan tidak cocok untuk fungsi ini. Contoh: int(\"abc\") gagal karena \"abc\" bukan angka. Pastikan isinya angka jika memang ingin diubah menjadi angka.",
  },
  ZeroDivisionError: {
    judul: "Pembagian dengan nol",
    penjelasan: "Angka dengan nol di bawah tanda pembagian (/, //, atau %) tidak bisa dihitung. Periksa lagi nilai pembaginya.",
  },
  IndexError: {
    judul: "Indeks di luar jangkauan",
    penjelasan:
      "Kamu mengambil posisi yang tidak ada di list. Ingat, posisi pertama adalah 0, jadi list dengan 3 isi hanya punya posisi 0, 1, dan 2. Gunakan len(daftar) untuk tahu jumlah isinya.",
  },
  KeyError: {
    judul: "Kunci tidak ditemukan",
    penjelasan: "Kunci yang kamu cari tidak ada di dalam dictionary. Periksa lagi tulisan kuncinya.",
  },
  AttributeError: {
    judul: "Method atau atribut tidak ada",
    penjelasan:
      "Objek ini tidak punya method atau atribut dengan nama tersebut. Periksa lagi penulisannya, dan pastikan kamu memanggilnya pada tipe data yang tepat.",
  },
  ModuleNotFoundError: {
    judul: "Modul tidak ditemukan",
    penjelasan: "Modul yang kamu impor tidak tersedia di Py Lab. Coba gunakan modul bawaan Python seperti math atau random.",
  },
  ImportError: {
    judul: "Gagal mengimpor",
    penjelasan: "Ada masalah saat mengimpor modul atau nama dari modul tersebut. Periksa penulisan perintah import.",
  },
  RecursionError: {
    judul: "Fungsi memanggil dirinya terlalu banyak",
    penjelasan: "Fungsi terus memanggil dirinya sendiri tanpa berhenti. Pastikan ada kondisi untuk menghentikan pemanggilan.",
  },
};

const DEFAULT_EXPLANATION = {
  judul: "Terjadi kesalahan saat menjalankan kode",
  penjelasan: "Baca pesan asli di bawah untuk melihat detailnya. Coba periksa baris yang ditandai, lalu jalankan lagi.",
};

// Terjemahan beberapa pesan error yang paling sering muncul.
const MESSAGE_RULES = [
  {
    pattern: /name '([^']+)' is not defined/,
    translate: (m) => `Nama '${m[1]}' belum dibuat. Periksa tulisannya, atau buat variabel/fungsi itu sebelum dipakai.`,
  },
  {
    pattern: /can only concatenate str \(not "(\w+)"\) to str/,
    translate: (m) =>
      `Kamu mencoba menggabungkan teks dengan ${m[1] === "int" ? "angka" : "nilai bertipe " + m[1]}. Ubah dulu dengan str(...), atau gunakan f-string seperti f"Umur: {umur}".`,
  },
  {
    pattern: /unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/,
    translate: (m) =>
      `Operator ${m[1]} tidak bisa dipakai untuk tipe '${m[2]}' dan '${m[3]}'. Pastikan kedua nilainya bertipe yang sesuai.`,
  },
  {
    pattern: /invalid literal for int\(\) with base 10: '([^']*)'/,
    translate: (m) => `int() hanya bisa mengubah teks berisi angka. Teks '${m[1]}' bukan angka yang valid.`,
  },
  {
    pattern: /'(\w+)' object is not callable/,
    translate: (m) =>
      `Kamu mencoba memanggil '${m[1]}' seperti fungsi, tetapi itu bukan fungsi. Periksa apakah ada tanda kurung ( ) yang tidak diperlukan.`,
  },
  {
    pattern: /'(\w+)' object is not subscriptable/,
    translate: (m) =>
      `Tipe '${m[1]}' tidak bisa diambil isinya dengan kurung siku [ ]. Periksa variabelnya, mungkin bukan list atau string.`,
  },
];

/**
 * @param {string} message pesan lengkap dari Pyodide (berisi traceback)
 * @returns {{tipe: string, pesan: string, baris: number|null, judul: string, penjelasan: string, asli: string}}
 */
export function explainError(message) {
  const asli = String(message ?? "").trim();
  const lines = asli.split("\n").map((l) => l.trimEnd()).filter(Boolean);
  const last = lines[lines.length - 1] ?? "";

  // Baris terakhir traceback berbentuk "TipeError: pesan".
  const head = last.match(/^([A-Za-z_][\w.]*)(?::\s*(.*))?$/);
  const tipe = head ? head[1].split(".").pop() : "Error";
  const pesan = head?.[2] ?? "";

  // Cari nomor baris terakhir yang berasal dari kode pengguna (<exec>).
  let baris = null;
  for (const m of asli.matchAll(/File "<exec>", line (\d+)/g)) {
    baris = Number(m[1]);
  }

  const info = EXPLANATIONS[tipe] ?? DEFAULT_EXPLANATION;
  let penjelasan = info.penjelasan;
  for (const rule of MESSAGE_RULES) {
    const m = pesan.match(rule.pattern);
    if (m) {
      penjelasan = rule.translate(m);
      break;
    }
  }

  return {
    tipe,
    pesan,
    baris,
    judul: info.judul,
    penjelasan,
    asli,
  };
}
