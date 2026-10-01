"""Versión C · «250 años»: 1775 suena a clave (bajo de Alberti, re mayor); al correr el año, un
barrido de tiempo y el piano de hoy con cuerdas. Voz: narradora."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
import numpy as np  # noqa: E402
from synth import Mix, band_noise, bell, clave, piano, tap, thud, tt  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
L = {l["id"]: l["t"] for l in json.loads((HERE / "script.json").read_text())["lines"]}
m = Mix(HERE, TL["duration"])

D, Bm, G, A, Em = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69], [59, 64, 67]
Y0 = L["n6"] - .2
ALBERTI = (0, 2, 1, 2)  # bajo de Alberti: grave, agudo, medio, agudo
old = []
t, prog = 0.4, [(38, D), (43, G), (45, A), (38, D), (35, Bm), (40, Em), (45, A), (38, D)]
i = 0
while t < Y0 - 0.2:
    r, c = prog[i % len(prog)]
    old.append((t, min(t + 2.4, Y0 - 0.2), r, c, "e"))
    t += 2.4
    i += 1
m.sections(old, inst=clave, loud=lambda a: 0.55, pat=ALBERTI + (3, 2, 1, 2), eighth=60 / 84 / 2)
m.sections([
    (Y0 + 2.8, L["n7"], 38, D, "e"), (L["n7"], L["n8"], 35, Bm, "e"), (L["n8"], L["n9"], 43, G, "e"),
    (L["n9"], L["n9"] + 2.4, 43, G, "e"), (L["n9"] + 2.4, L["n10"] - .5, 45, A, "e"),
    (L["n10"] + .05, L["n10"] + 2.5, 38, [57, 62, 66, 69], None),
    (L["n10"] + 2.92, TL["duration"], 38, [62, 64, 66, 69], None),
], loud=lambda a: 0.85)

for e in m.events:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "draw0":
        m.pencil(t + 0.1, t + 3.4)  # plumilla
    elif k == "step":
        m.put(m.mus, t, tap(), 0.04, pan=(-0.25 if v % 4 else 0.25))
    elif k == "job":
        m.both(t, clave([74, 78, 81, 86][v], 0.5, 1.4), 0.5, 0.3, pan=-0.3 + v * 0.2)
    elif k == "icon":
        m.both(t, bell([81, 85, 88][v], 2.5), 0.08, 0.22)
    elif k == "stamp":
        m.both(t, thud(95, 45, 0.5, 0.15), 0.35, 0.1)
        m.both(t, clave(74, 0.6), 0.5, 0.4)
    elif k == "time":  # el tiempo pasa: barrido largo y grave
        d = 3.4
        x = tt(d)
        m.both(t, band_noise(d, 300, 5000) * np.sin(np.pi * x / d) ** 2, 0.1, 0.25)
        m.both(t + 3.0, thud(70, 40, 1.5, 0.5), 0.3, 0.1)
    elif k == "tick":
        m.put(m.mus, t, tap(900 + v * 12), 0.035, pan=((v * 0.29) % 1.2) - 0.6)
    elif k == "pop":
        m.both(t, piano([86, 88, 90, 93, 95, 98][int(t * 7) % 6], 0.14, 0.8), 0.3, 0.3, pan=((t * 13) % 1.2) - 0.6)

m.voice()
m.master(duck=0.45)
