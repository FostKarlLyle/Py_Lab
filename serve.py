#!/usr/bin/env python3
"""Server statis untuk Py Lab.

Pemakaian:
    python3 serve.py            # buka http://localhost:8000
    python3 serve.py 5000       # pakai port lain

Sama seperti `python3 -m http.server`, tetapi mengirim header
Cache-Control: no-store, sehingga browser tidak memakai file lama
(JavaScript/CSS) dan perubahan kode langsung terlihat saat halaman dimuat ulang.
"""
import functools
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    with Server(("0.0.0.0", port), handler) as httpd:
        print(f"Py Lab berjalan di http://localhost:{port}  (Ctrl+C untuk berhenti)")
        httpd.serve_forever()
