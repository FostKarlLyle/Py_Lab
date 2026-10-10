// Menjalankan kode Python di browser memakai Pyodide (Python dalam WebAssembly).
// Kode tidak dikirim ke server mana pun: semuanya berjalan di komputer pengguna.

export const PYODIDE_VERSION = "0.29.5";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Kode yang dijalankan sekali di setiap namespace sebelum kode pengguna.
// input() dibuat ulang agar bisa meminta jawaban lewat antarmuka aplikasi
// dan jawabannya ikut tercatat di output.
const PRELUDE = `
import sys as _sys

def input(prompt=""):
    try:
        _sys.stdout.flush()
    except Exception:
        pass
    _ans = _pylab_ask(str(prompt))
    return "" if _ans is None else str(_ans)
`;

let pyPromise = null;
let activeHandlers = null;

/** Memuat Python sekali saja. Hasilnya di-cache untuk pemanggilan berikutnya. */
export function loadPython() {
  if (!pyPromise) {
    pyPromise = (async () => {
      const { loadPyodide } = await import(`${PYODIDE_INDEX_URL}pyodide.mjs`);
      const py = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      const forward = (text) => activeHandlers?.onOutput(text);
      py.setStdout({ batched: (s) => forward(s + "\n") });
      py.setStderr({ batched: (s) => forward(s + "\n") });
      return py;
    })();
    // Jika gagal (misalnya tidak ada internet), izinkan percobaan ulang nanti.
    pyPromise.catch(() => {
      pyPromise = null;
    });
  }
  return pyPromise;
}

/**
 * Menjalankan kode Python dengan namespace baru (variabel dari run sebelumnya tidak terbawa).
 * @returns {Promise<{ok: true} | {ok: false, message: string}>}
 */
export async function runCode(code, handlers) {
  const py = await loadPython();
  activeHandlers = handlers;
  const ns = py.globals.get("dict")();
  try {
    ns.set("_pylab_ask", (prompt) => handlers.onInput(prompt));
    await py.runPythonAsync(PRELUDE, { globals: ns });
    await py.runPythonAsync(code, { globals: ns });
    return { ok: true };
  } catch (err) {
    return { ok: false, message: String(err?.message ?? err) };
  } finally {
    ns.destroy();
    activeHandlers = null;
  }
}
