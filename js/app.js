import { LESSONS } from "./lessons.js";
import { GLOSSARY, CHEAT_SHEET } from "./glossary.js";
import { loadPython, runCode } from "./runner.js";
import { explainError } from "./errors.js";

// ---------- Elemen halaman ----------
const $ = (id) => document.getElementById(id);
const els = {
  status: $("py-status"),
  runBtn: $("run-btn"),
  resetBtn: $("reset-btn"),
  clearBtn: $("clear-btn"),
  editor: $("editor"),
  gutter: $("gutter"),
  output: $("output"),
  lessonList: $("lesson-list"),
  lessonNumber: $("lesson-number"),
  lessonTitle: $("lesson-title"),
  lessonDesc: $("lesson-desc"),
  lessonTask: $("lesson-task"),
  lessonHint: $("lesson-hint"),
  lessonExpectedWrap: $("lesson-expected-wrap"),
  lessonExpected: $("lesson-expected"),
  glossarySearch: $("glossary-search"),
  glossaryList: $("glossary-list"),
  cheatList: $("cheat-list"),
};

// ---------- Penyimpanan lokal (aman jika localStorage diblokir) ----------
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* abaikan */
    }
  },
};

const DONE_KEY = "pylab.done";
const doneSet = new Set(JSON.parse(store.get(DONE_KEY, "[]")));
const saveDone = () => store.set(DONE_KEY, JSON.stringify([...doneSet]));
const codeKey = (id) => `pylab.code.${id}`;

// ---------- State ----------
let currentIndex = 0;
let running = false;
let pyReady = false;

const currentLesson = () => LESSONS[currentIndex];

// ---------- Tab sidebar ----------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });
    for (const name of ["lessons", "glossary", "cheat"]) {
      $(`panel-${name}`).hidden = tab.dataset.tab !== name;
    }
  });
});

// ---------- Daftar pelajaran ----------
function renderLessonList() {
  els.lessonList.innerHTML = "";
  LESSONS.forEach((lesson, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "lesson-item" + (i === currentIndex ? " active" : "");
    btn.setAttribute("aria-current", i === currentIndex ? "true" : "false");

    const num = document.createElement("span");
    num.className = "lesson-item-num";
    if (doneSet.has(lesson.id)) {
      num.textContent = "✓";
    } else if (lesson.id === "bebas") {
      num.textContent = "✎";
    } else {
      num.textContent = String(i + 1);
    }
    if (doneSet.has(lesson.id)) num.classList.add("done");

    const title = document.createElement("span");
    title.textContent = lesson.title;

    btn.append(num, title);
    btn.addEventListener("click", () => selectLesson(i));
    li.append(btn);
    els.lessonList.append(li);
  });
}

function setParagraphs(container, paragraphs) {
  container.innerHTML = "";
  for (const text of paragraphs) {
    const p = document.createElement("p");
    p.textContent = text;
    container.append(p);
  }
}

function renderLesson() {
  const lesson = currentLesson();
  els.lessonNumber.textContent = lesson.id === "bebas" ? "Bebas" : `Pelajaran ${currentIndex + 1}`;
  els.lessonTitle.textContent = lesson.title;
  setParagraphs(els.lessonDesc, lesson.description);
  els.lessonTask.textContent = lesson.task;
  els.lessonHint.textContent = lesson.hint;
  if (lesson.expected) {
    els.lessonExpectedWrap.hidden = false;
    els.lessonExpected.textContent = lesson.expected;
  } else {
    els.lessonExpectedWrap.hidden = true;
  }
  // Petunjuk selalu disembunyikan dulu setiap ganti pelajaran.
  const details = document.querySelector(".hint");
  if (details) details.open = false;
}

function selectLesson(index) {
  if (index === currentIndex && els.editor.value) return;
  saveCode();
  currentIndex = index;
  renderLessonList();
  renderLesson();
  els.editor.value = store.get(codeKey(currentLesson().id), currentLesson().starter);
  onEditorChange();
  clearOutput();
  els.editor.focus();
}

// ---------- Editor ----------
function saveCode() {
  store.set(codeKey(currentLesson().id), els.editor.value);
}

function renderGutter(errorLine = null) {
  const count = els.editor.value.split("\n").length;
  const frag = document.createDocumentFragment();
  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.textContent = String(i);
    if (i === errorLine) div.className = "error-line";
    frag.append(div);
  }
  els.gutter.replaceChildren(frag);
  els.gutter.scrollTop = els.editor.scrollTop;
}

let errorLine = null;

function onEditorChange() {
  saveCode();
  renderGutter(errorLine);
}

/** Mengganti teks di posisi kursor (atau seluruh baris yang dipilih) dengan aman. */
function replaceRange(start, end, text, caretStart, caretEnd = caretStart) {
  const el = els.editor;
  el.setRangeText(text, start, end, "end");
  el.setSelectionRange(caretStart, caretEnd);
  onEditorChange();
}

function lineBounds(value, pos) {
  const start = value.lastIndexOf("\n", pos - 1) + 1;
  let end = value.indexOf("\n", pos);
  if (end === -1) end = value.length;
  return { start, end };
}

els.editor.addEventListener("input", () => {
  errorLine = null;
  onEditorChange();
});

els.editor.addEventListener("scroll", () => {
  els.gutter.scrollTop = els.editor.scrollTop;
});

els.editor.addEventListener("keydown", (e) => {
  const el = els.editor;
  const { selectionStart: s, selectionEnd: t, value } = el;

  // Ctrl+Enter / Cmd+Enter untuk menjalankan kode.
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    run();
    return;
  }

  // Tab: tambah indentasi 4 spasi. Shift+Tab: kurangi indentasi.
  if (e.key === "Tab") {
    e.preventDefault();
    const first = lineBounds(value, s).start;
    const last = lineBounds(value, t).end;
    const block = value.slice(first, last);
    const lines = block.split("\n");

    if (e.shiftKey) {
      const newBlock = lines.map((l) => l.replace(/^ {1,4}/, "")).join("\n");
      const removed = block.length - newBlock.length;
      const firstRemoved = lines[0].length - lines[0].replace(/^ {1,4}/, "").length;
      replaceRange(first, last, newBlock, Math.max(first, s - firstRemoved), Math.max(first, t - removed));
    } else if (s !== t && lines.length > 1) {
      const newBlock = lines.map((l) => "    " + l).join("\n");
      replaceRange(first, last, newBlock, s + 4, t + 4 * lines.length);
    } else {
      replaceRange(s, t, "    ", s + 4);
    }
    return;
  }

  // Enter: pertahankan indentasi baris sebelumnya, dan tambah 4 spasi setelah baris yang diakhiri ":".
  if (e.key === "Enter" && !e.shiftKey && s === t) {
    e.preventDefault();
    const { start } = lineBounds(value, s);
    const before = value.slice(start, s);
    const indent = before.match(/^ */)[0];
    const extra = before.trimEnd().endsWith(":") ? "    " : "";
    const insert = "\n" + indent + extra;
    replaceRange(s, t, insert, s + insert.length);
    return;
  }

  // Backspace di awal indentasi: hapus satu level (4 spasi) sekaligus.
  if (e.key === "Backspace" && s === t && s > 0) {
    const { start } = lineBounds(value, s);
    const before = value.slice(start, s);
    if (before.length > 0 && /^ +$/.test(before) && before.length % 4 === 0) {
      e.preventDefault();
      replaceRange(s - 4, s, "", s - 4);
    }
  }
});

// ---------- Output ----------
function clearOutput() {
  els.output.replaceChildren();
}

function appendLine(text, className = "out-text") {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  els.output.append(span);
  els.output.scrollTop = els.output.scrollHeight;
  return span;
}

function appendInfo(text) {
  appendLine(text + "\n", "out-info");
}

function appendError(result, lineNo) {
  const box = document.createElement("div");
  box.className = "error-box";

  const title = document.createElement("div");
  title.className = "error-title";
  title.textContent = `⚠️ ${result.judul}`;

  const explain = document.createElement("p");
  explain.className = "error-explain";
  explain.textContent = result.penjelasan;

  box.append(title, explain);

  if (lineNo) {
    const where = document.createElement("div");
    where.className = "error-where";
    where.textContent = `📍 Ada di baris ${lineNo}`;
    box.append(where);
    if (result.kodeBaris.trim()) {
      const codeLine = document.createElement("pre");
      codeLine.className = "error-code";
      codeLine.textContent = `${String(lineNo).padStart(3)} | ${result.kodeBaris}`;
      box.append(codeLine);
    }
  }

  if (result.saran.length) {
    const fixTitle = document.createElement("div");
    fixTitle.className = "error-fix-title";
    fixTitle.textContent = "🔧 Cara memperbaikinya:";
    const list = document.createElement("ul");
    list.className = "error-fix";
    for (const s of result.saran) {
      const li = document.createElement("li");
      li.textContent = s;
      list.append(li);
    }
    box.append(fixTitle, list);
  }

  const type = document.createElement("div");
  type.className = "error-type";
  type.textContent = result.tipe + (result.pesan ? `: ${result.pesan}` : "");
  box.append(type);

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Lihat pesan asli dari Python";
  const pre = document.createElement("pre");
  pre.textContent = result.asli;
  details.append(summary, pre);
  box.append(details);

  els.output.append(box);
  els.output.scrollTop = els.output.scrollHeight;
}

/** Meminta input lewat kotak isian, lalu mencatat pertanyaan dan jawaban di output. */
function askUser(prompt) {
  const question = prompt || "Masukkan input:";
  const answer = window.prompt(question, "");
  const value = answer ?? "";
  appendLine(question, "out-prompt");
  appendLine(value + "\n", "out-answer");
  return value;
}

// ---------- Jalankan ----------
async function run() {
  if (running) return;
  running = true;
  setBusy(true);

  const lesson = currentLesson();
  const code = els.editor.value;
  clearOutput();
  errorLine = null;
  renderGutter(null);
  appendInfo("▶ Menjalankan kode...");

  let result;
  try {
    result = await runCode(code, {
      onOutput: (text) => appendLine(text),
      onInput: askUser,
    });
  } finally {
    running = false;
    setBusy(false);
  }

  if (result.ok) {
    appendInfo("✅ Selesai. Tidak ada error.");
    if (!doneSet.has(lesson.id) && lesson.id !== "bebas") {
      doneSet.add(lesson.id);
      saveDone();
      renderLessonList();
    }
  } else {
    const explained = explainError(result.message, code);
    errorLine = explained.baris;
    renderGutter(errorLine);
    if (errorLine) {
      scrollEditorToLine(errorLine);
    }
    appendError(explained, errorLine);
  }
}

function scrollEditorToLine(lineNo) {
  const lineHeight = parseFloat(getComputedStyle(els.editor).lineHeight) || 22;
  els.editor.scrollTop = Math.max(0, (lineNo - 3) * lineHeight);
  els.gutter.scrollTop = els.editor.scrollTop;
}

function setBusy(busy) {
  els.runBtn.disabled = busy || !pyReady;
  els.runBtn.innerHTML = busy ? "⏳ Berjalan..." : "▶ Jalankan <kbd>Ctrl+Enter</kbd>";
}

els.runBtn.addEventListener("click", run);

els.resetBtn.addEventListener("click", () => {
  const lesson = currentLesson();
  if (!window.confirm("Kembalikan kode ke contoh awal pelajaran ini?")) return;
  els.editor.value = lesson.starter;
  store.set(codeKey(lesson.id), lesson.starter);
  errorLine = null;
  onEditorChange();
});

els.clearBtn.addEventListener("click", clearOutput);

// ---------- Kamus ----------
function renderGlossary(filter = "") {
  const q = filter.trim().toLowerCase();
  const items = GLOSSARY.filter(
    (g) => !q || g.istilah.toLowerCase().includes(q) || g.arti.toLowerCase().includes(q),
  );
  els.glossaryList.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Istilah tidak ditemukan.";
    els.glossaryList.append(empty);
    return;
  }
  for (const g of items) {
    const card = document.createElement("div");
    card.className = "gloss-card";
    const h = document.createElement("h3");
    h.textContent = g.istilah;
    const p = document.createElement("p");
    p.textContent = g.arti;
    const pre = document.createElement("pre");
    pre.textContent = g.contoh;
    card.append(h, p, pre);
    els.glossaryList.append(card);
  }
}

els.glossarySearch.addEventListener("input", () => renderGlossary(els.glossarySearch.value));

// ---------- Cheat Sheet ----------
function insertIntoEditor(code) {
  const el = els.editor;
  const prefix = el.value.length && !el.value.endsWith("\n") ? "\n" : "";
  el.value = el.value + prefix + code + "\n";
  el.scrollTop = el.scrollHeight;
  errorLine = null;
  onEditorChange();
  el.focus();
}

function renderCheatSheet() {
  els.cheatList.replaceChildren();
  for (const group of CHEAT_SHEET) {
    const section = document.createElement("div");
    section.className = "cheat-group";
    const h = document.createElement("h3");
    h.textContent = group.judul;
    section.append(h);
    for (const item of group.items) {
      const card = document.createElement("div");
      card.className = "cheat-card";
      const label = document.createElement("div");
      label.className = "cheat-label";
      label.textContent = item.label;
      const pre = document.createElement("pre");
      pre.textContent = item.kode;
      const btn = document.createElement("button");
      btn.className = "btn small";
      btn.textContent = "+ Tambah ke editor";
      btn.addEventListener("click", () => insertIntoEditor(item.kode));
      card.append(label, pre, btn);
      section.append(card);
    }
    els.cheatList.append(section);
  }
}

// ---------- Inisialisasi ----------
function setStatus(text, kind) {
  els.status.textContent = text;
  els.status.className = `status status-${kind}`;
}

async function initPython() {
  setStatus("Menyiapkan Python… (pertama kali bisa beberapa detik)", "loading");
  try {
    await loadPython();
    pyReady = true;
    setStatus("Python siap ✓", "ready");
  } catch (err) {
    console.error(err);
    setStatus("Gagal memuat Python. Periksa koneksi internet lalu muat ulang halaman.", "error");
  }
  setBusy(false);
}

function init() {
  renderLessonList();
  renderLesson();
  els.editor.value = store.get(codeKey(currentLesson().id), currentLesson().starter);
  onEditorChange();
  renderGlossary();
  renderCheatSheet();
  initPython();
}

init();
