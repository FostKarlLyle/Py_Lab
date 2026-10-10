// Menerjemahkan pesan error Python menjadi penjelasan dan saran perbaikan
// dalam Bahasa Indonesia, berdasarkan baris kode yang sebenarnya ditulis pengguna.

const EXPLANATIONS = {
  SyntaxError: {
    judul: "Penulisan kode belum benar",
    penjelasan:
      "Python tidak memahami penulisan kodenya. Periksa kembali tanda kurung ( ), tanda kutip \" \", dan tanda titik dua : di akhir if, elif, else, for, while, atau def.",
    saran: "Bandingkan baris yang ditandai dengan contoh di pelajaran ini, lalu cek tanda baca satu per satu.",
  },
  IndentationError: {
    judul: "Indentasi (spasi di depan baris) tidak sesuai",
    penjelasan:
      "Di Python, isi dari if, for, while, atau def harus menjorok ke dalam dengan jumlah spasi yang sama (biasanya 4 spasi).",
    saran: "Pastikan isi blok menjorok 4 spasi, dan baris di luar blok tidak menjorok.",
  },
  TabError: {
    judul: "Campuran tab dan spasi",
    penjelasan: "Python tidak suka campuran tombol Tab dan spasi untuk indentasi.",
    saran: "Ganti semua indentasi dengan spasi (4 spasi per level).",
  },
  NameError: {
    judul: "Nama belum dikenal",
    penjelasan:
      "Python tidak menemukan nama yang kamu tulis. Biasanya karena salah ketik nama variabel atau fungsi, atau variabelnya belum dibuat sebelum dipakai.",
    saran: "Cek penulisan namanya (huruf besar/kecil juga berpengaruh), dan pastikan variabel dibuat dengan = sebelum baris ini.",
  },
  TypeError: {
    judul: "Tipe data tidak cocok",
    penjelasan:
      "Operasi ini tidak bisa dilakukan pada tipe data tersebut. Contoh: angka tidak bisa langsung digabung dengan teks.",
    saran: "Ubah tipe datanya dulu, misalnya str(angka) untuk jadi teks, atau int(teks) untuk jadi angka.",
  },
  ValueError: {
    judul: "Nilai tidak sesuai",
    penjelasan:
      "Nilai yang diberikan tidak cocok untuk fungsi ini. Contoh: int(\"abc\") gagal karena \"abc\" bukan angka.",
    saran: "Pastikan isi yang diberikan sesuai, misalnya hanya angka untuk int().",
  },
  ZeroDivisionError: {
    judul: "Pembagian dengan nol",
    penjelasan: "Angka dengan nol di bawah tanda pembagian (/, //, atau %) tidak bisa dihitung.",
    saran: "Tambahkan pengecekan dulu, misalnya: if pembagi != 0:",
  },
  IndexError: {
    judul: "Indeks di luar jangkauan",
    penjelasan:
      "Kamu mengambil posisi yang tidak ada di list. Ingat, posisi pertama adalah 0.",
    saran: "Gunakan len(daftar) untuk tahu jumlah isinya. Elemen terakhir bisa diambil dengan daftar[-1].",
  },
  KeyError: {
    judul: "Kunci tidak ditemukan",
    penjelasan: "Kunci yang kamu cari tidak ada di dalam dictionary.",
    saran: "Cek dulu dengan: if kunci in data:",
  },
  AttributeError: {
    judul: "Method atau atribut tidak ada",
    penjelasan:
      "Objek ini tidak punya method atau atribut dengan nama tersebut. Biasanya karena salah tulis nama method.",
    saran: "Cek penulisan nama method, lalu pastikan method itu memang milik tipe datanya.",
  },
  ModuleNotFoundError: {
    judul: "Modul tidak ditemukan",
    penjelasan: "Modul yang kamu impor tidak tersedia di Py Lab.",
    saran: "Coba gunakan modul bawaan Python seperti math atau random.",
  },
  ImportError: {
    judul: "Gagal mengimpor",
    penjelasan: "Ada masalah saat mengimpor modul atau nama dari modul tersebut.",
    saran: "Periksa penulisan perintah import.",
  },
  RecursionError: {
    judul: "Fungsi memanggil dirinya terlalu banyak",
    penjelasan: "Fungsi terus memanggil dirinya sendiri tanpa berhenti.",
    saran: "Pastikan ada kondisi untuk menghentikan pemanggilan (base case).",
  },
};

const DEFAULT_EXPLANATION = {
  judul: "Terjadi kesalahan saat menjalankan kode",
  penjelasan: "Baca pesan asli di bawah untuk melihat detailnya.",
  saran: "Coba periksa baris yang ditandai, lalu jalankan lagi.",
};

const BUILTINS = [
  "print", "input", "len", "range", "int", "str", "float", "bool", "list",
  "sum", "max", "min", "abs", "round", "type", "sorted",
];

/** Jarak edit (Levenshtein) untuk mencari nama yang mirip. */
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

/** Nama-nama yang didefinisikan di kode pengguna (variabel, def, for) plus fungsi bawaan. */
function knownNames(code) {
  // Nama dari kode pengguna dimasukkan dulu, supaya diprioritaskan saat jaraknya sama.
  const names = new Set();
  for (const m of code.matchAll(/^\s*(?:def\s+|for\s+)?([A-Za-z_]\w*)\s*(?:=|\(|\s+in\b)/gm)) {
    names.add(m[1]);
  }
  for (const m of code.matchAll(/for\s+([A-Za-z_]\w*)\s+in/g)) names.add(m[1]);
  for (const name of BUILTINS) names.add(name);
  return names;
}

/** Saran perbaikan berdasarkan pesan error dan isi kode. */
function specificFixes(tipe, pesan, codeLine, code, lineNo) {
  const fixes = [];
  const line = codeLine.trim();

  if (tipe === "SyntaxError") {
    if (/expected ':'/.test(pesan) && line) {
      fixes.push(`Tambahkan tanda titik dua (:) di akhir baris ini, sehingga menjadi: ${line}:`);
    }
    const bracket = pesan.match(/'(.)' was never closed/);
    if (bracket) {
      const close = { "(": ")", "[": "]", "{": "}" }[bracket[1]];
      fixes.push(`Tanda ${bracket[1]} belum ditutup. Tambahkan ${close} yang sesuai.`);
    }
    if (/unterminated string literal/.test(pesan)) {
      fixes.push("Ada teks yang tanda kutipnya belum ditutup. Pastikan setiap \" atau ' punya pasangan.");
    }
    if (/Maybe you meant '=='/.test(pesan)) {
      fixes.push("Untuk membandingkan dua nilai pakai == (dua tanda sama dengan). Satu tanda = hanya untuk menyimpan nilai.");
    }
    if (/Perhaps you forgot a comma/.test(pesan)) {
      fixes.push("Mungkin ada koma (,) yang terlewat di antara dua nilai.");
    }
  }

  if (tipe === "IndentationError") {
    const header = pesan.match(/on line (\d+)/);
    if (header) {
      fixes.push(`Baris di bawah baris ${header[1]} harus menjorok ke dalam, yaitu diberi 4 spasi di depannya.`);
    }
    if (/unexpected indent/.test(pesan)) {
      fixes.push("Baris ini menjorok padahal tidak seharusnya. Hapus spasi di depannya, atau pastikan baris sebelumnya diakhiri dengan :.");
    }
    if (/unindent does not match/.test(pesan)) {
      fixes.push("Jumlah spasi di depan baris ini tidak cocok dengan blok di atasnya. Samakan menjadi kelipatan 4 spasi.");
    }
  }

  if (tipe === "NameError") {
    const m = pesan.match(/name '([^']+)' is not defined/);
    if (m) {
      const target = m[1];
      let best = null;
      let bestDist = Infinity;
      for (const name of knownNames(code)) {
        if (name === target) continue;
        const d = editDistance(target, name);
        if (d < bestDist) {
          best = name;
          bestDist = d;
        }
      }
      // Nama pendek (kurang dari 3 huruf) terlalu banyak kemungkinan, jadi tidak disarankan.
      const limit = Math.max(2, Math.floor(target.length / 3));
      if (target.length >= 3 && best && bestDist <= limit) {
        fixes.push(`Mungkin maksudmu '${best}'? Ganti '${target}' dengan '${best}' jika itu yang dimaksud.`);
      } else {
        fixes.push(`Jika '${target}' seharusnya berupa teks, tulis di dalam tanda kutip: "${target}". Jika itu variabel, buat dulu dengan: ${target} = ...`);
      }
    }
  }

  if (tipe === "TypeError" && /can only concatenate str/.test(pesan)) {
    fixes.push('Ubah angka menjadi teks dengan str(), misalnya: "Umur: " + str(umur)');
    fixes.push('Atau pakai f-string, misalnya: f"Umur: {umur}"');
  }

  if (tipe === "ValueError" && /invalid literal for int\(\)/.test(pesan)) {
    fixes.push("Pastikan teks yang diubah ke angka hanya berisi digit (0-9), tanpa huruf atau spasi di tengah.");
  }

  if (tipe === "AttributeError") {
    const m = pesan.match(/'(\w+)' object has no attribute '(\w+)'/);
    if (m && m[1] === "list" && m[2] === "add") {
      fixes.push("List tidak punya method add(). Untuk menambah isi list, gunakan append(). Contoh: daftar.append(\"nilai\")");
    } else if (m) {
      fixes.push(`Tipe '${m[1]}' tidak punya '${m[2]}'. Cek lagi nama method-nya.`);
    }
  }

  return fixes;
}

// Terjemahan beberapa pesan error yang paling sering muncul.
const MESSAGE_RULES = [
  {
    pattern: /name '([^']+)' is not defined/,
    translate: (m) => `Nama '${m[1]}' belum dibuat atau salah tulis.`,
  },
  {
    pattern: /can only concatenate str \(not "(\w+)"\) to str/,
    translate: (m) =>
      `Kamu mencoba menggabungkan teks dengan ${m[1] === "int" ? "angka" : "nilai bertipe " + m[1]}.`,
  },
  {
    pattern: /unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/,
    translate: (m) => `Operator ${m[1]} tidak bisa dipakai untuk tipe '${m[2]}' dan '${m[3]}'.`,
  },
  {
    pattern: /invalid literal for int\(\) with base 10: '([^']*)'/,
    translate: (m) => `int() hanya bisa mengubah teks berisi angka. Teks '${m[1]}' bukan angka yang valid.`,
  },
  {
    pattern: /'(\w+)' object is not callable/,
    translate: (m) => `Kamu mencoba memanggil '${m[1]}' seperti fungsi, tetapi itu bukan fungsi.`,
  },
  {
    pattern: /'(\w+)' object is not subscriptable/,
    translate: (m) => `Tipe '${m[1]}' tidak bisa diambil isinya dengan kurung siku [ ].`,
  },
];

/**
 * @param {string} message pesan lengkap dari Pyodide (berisi traceback)
 * @param {string} code kode yang dijalankan (untuk menampilkan baris bermasalah dan saran)
 */
export function explainError(message, code = "") {
  const asli = String(message ?? "").trim();
  const lines = asli.split("\n").map((l) => l.trimEnd()).filter(Boolean);
  const last = lines[lines.length - 1] ?? "";

  // Baris terakhir traceback berbentuk "TipeError: pesan".
  const head = last.match(/^([A-Za-z_][\w.]*)(?::\s*(.*))?$/);
  const tipe = head ? head[1].split(".").pop() : "Error";
  const pesan = head?.[2] ?? "";

  // Nomor baris terakhir yang berasal dari kode pengguna (<exec>).
  let baris = null;
  for (const m of asli.matchAll(/File "<exec>", line (\d+)/g)) {
    baris = Number(m[1]);
  }
  const codeLines = code.split("\n");
  const kodeBaris = baris ? codeLines[baris - 1] ?? "" : "";

  const info = EXPLANATIONS[tipe] ?? DEFAULT_EXPLANATION;
  let penjelasan = info.penjelasan;
  for (const rule of MESSAGE_RULES) {
    const m = pesan.match(rule.pattern);
    if (m) {
      penjelasan = rule.translate(m) + " " + penjelasan;
      break;
    }
  }

  let saran = specificFixes(tipe, pesan, kodeBaris, code, baris);
  if (saran.length === 0) saran = [info.saran];

  return {
    tipe,
    pesan,
    baris,
    kodeBaris,
    judul: info.judul,
    penjelasan,
    saran,
    asli,
  };
}
