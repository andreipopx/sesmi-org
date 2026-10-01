"""Versión A · «Una sociedad abierta»: piano de fieltro y cuerdas en re mayor; la historia del
siglo XVIII suena a clave y vuelve al piano con «Hoy». Voz: narradora + cuatro vecinos."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import Mix, bell, clave, piano, tap, thud, whoosh  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
L = {l["id"]: l["t"] for l in json.loads((HERE / "script.json").read_text())["lines"]}
m = Mix(HERE, TL["duration"])

D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
HOY = L["n6"]
m.sections([
    (0.3, 5.2, 38, D, None),
    (5.2, 9.2, 43, G, None), (9.2, 13.2, 45, [61, 64, 67], None),       # las preguntas: casi en silencio
    (13.2, 16.2, 35, Bm, "q"), (16.2, 19.2, 45, A, "q"),
], loud=lambda a: 0.55)
# siglo XVIII: clave
m.sections([(a, b, r, c, "e") for a, b, r, c in [
    (19.2, 21.3, 38, D), (21.3, 23.4, 35, Bm), (23.4, 25.5, 43, G), (25.5, 27.6, 45, A),
    (27.6, 29.7, 38, D), (29.7, 31.8, 43, G), (31.8, 34.0, 35, Bm), (34.0, HOY, 45, A)]], inst=clave, loud=lambda a: 0.6)
# hoy: piano otra vez
m.sections([
    (HOY, L["n7"] - .2, 38, D, "e"),
    (L["n7"] - .2, L["n8"], 38, D, "e"), (L["n8"], L["n9"], 35, Bm, "e"), (L["n9"], L["n10"], 43, G, "e"),
    (L["n10"], L["n10"] + 1.8, 43, G, "e"), (L["n10"] + 1.8, 50.0, 45, A, "e"),
    (50.55, 53.0, 38, [57, 62, 66, 69], None),
    (53.42, TL["duration"], 38, [62, 64, 66, 69], None),
], loud=lambda a: 0.9 if a >= L["n10"] else 0.7)

PENTA = [86, 88, 90, 93, 95, 98]
for e in m.events:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "draw0":
        m.pencil(t + 0.1, t + 3.2)
    elif k == "pop":
        m.both(t, piano(PENTA[int(t * 7) % len(PENTA)], 0.14, 0.8), 0.3, 0.3, pan=((t * 13) % 1.2) - 0.6)
    elif k == "ask":
        m.both(t, piano([74, 78, 81, 83, 76, 79, 71, 76, 81, 83][v % 10], 0.22, 2.0), 0.4, 0.4)
    elif k == "dig0":
        m.both(t, thud(60, 40, 2.0, 0.7), 0.25, 0.2)
    elif k == "dig":
        m.put(m.mus, t, tap(480 - v * 30), 0.08)
    elif k == "step":
        m.put(m.mus, t, tap(), 0.04, pan=(-0.2 if v % 4 else 0.2))
    elif k == "icon":
        m.both(t, bell([81, 85, 88][v], 2.5), 0.08, 0.22)
    elif k == "stamp":
        m.both(t, thud(95, 45, 0.5, 0.15), 0.4, 0.1)
        m.both(t, piano(74, 0.35), 0.5, 0.4)

m.voice(gains={"narradora": 1.0}, pans={"abuela": -0.25, "joven": 0.25, "madre": 0.2, "tendero": -0.2})
m.master(duck=0.45)
