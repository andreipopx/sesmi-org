"""Créditos de la imagen de archivo/fotos/vídeo que usa una versión (para el texto del post).

  python3 shared/credits.py <versión>   → sesmi-<versión>-creditos.txt

Busca en <versión>/reel.html las rutas ../assets/<carpeta>/<archivo> y las cruza con assets/*/credits.json.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V = sys.argv[1]
html = (ROOT / V / "reel.html").read_text()
db = {}
for d in ("archivo", "foto", "video"):
    p = ROOT / "assets" / d / "credits.json"
    if p.exists():
        for c in json.loads(p.read_text()):
            db[(d, Path(c["file"]).stem)] = c
# una pieza se usa si su nombre aparece en el HTML (rutas literales o compuestas: «'ia-lacre'», «slug + '.jpg'»…)
used = sorted(k for k in db if re.search(r"(?<![\w-])" + re.escape(k[1]) + r"(?![\w-])", html))
lines = ["Imágenes: Wikimedia Commons (salvo las indicadas como generadas con IA)."]
missing = []
for d, stem in used:
    c = db.get((d, stem))
    if not c:
        missing.append(f"{d}/{stem}")
        continue
    who = c.get("author") or "autor desconocido"
    lines.append(f"· {c.get('title') or stem} — {who} — {c.get('license')} — {c.get('commons')}")
(ROOT / f"sesmi-{V}-creditos.txt").write_text("\n".join(lines) + "\n")
print(f"sesmi-{V}-creditos.txt · {len(used)} piezas" + (f" · SIN CRÉDITO: {missing}" if missing else ""))
