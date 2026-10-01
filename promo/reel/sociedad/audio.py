"""Versión A · «Una sociedad abierta»: arranque en frío de planos macro (pluma, metrónomo, tipos, lacre) con
un «clac» suave en cada corte; piano de fieltro y cuerdas en re mayor; la historia del siglo XVIII suena a
clave (con el lacre que se estampa) y vuelve al piano con «Hoy». Voz: narradora + cuatro vecinos.
La música se calla en la plaza vacía, entre la última pregunta y «Las respuestas existen»."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import Mix, band_noise, bell, clave, piano, tap, thud, tt, whoosh  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
L = {l["id"]: l["t"] for l in json.loads((HERE / "script.json").read_text())["lines"]}
END = {k: L[k] for k in L}
m = Mix(HERE, TL["duration"])


def clac(f=280, d=0.1):
    """Corte seco de montaje: golpe de madera suave (cuerpo grave + un soplo de ruido), sin brillo."""
    t = tt(d)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.016)
    click = band_noise(d, 900, 4800) * np.exp(-t / 0.005)
    return (0.55 * body + 0.5 * click) * np.minimum(1, t / 0.0008)


def squash(d=0.16):
    """Cera blanda que cede bajo el sello."""
    t = tt(d)
    return band_noise(d, 150, 900) * np.exp(-t / 0.035) * np.minimum(1, t / 0.004)


D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
HOY = L["n6"]
FLIP = L["n11"] - 0.5
# plaza vacía (reel.html: PZ0 = fin de q4 + 0,25 s → n2): la música calla en seco
Q4_END = L["q4"] + 1.718
PZ0, PZ1 = Q4_END + 0.25, L["n2"]

m.sections([
    (0.3, L["q1"] - 0.2, 38, D, None),
    (L["q1"] - 0.2, L["q3"] - 0.4, 43, G, None), (L["q3"] - 0.4, L["n2"] - 0.4, 45, [61, 64, 67], None),   # las preguntas: casi en silencio
    (L["n2"] - 0.4, L["n2"] + 2.6, 35, Bm, "q"), (L["n2"] + 2.6, L["n3"] - 0.1, 45, A, "q"),
], loud=lambda a: 0.55)
# siglo XVIII: clave
B = L["n3"] - 0.1
m.sections([(B + a, B + b, r, c, "e") for a, b, r, c in [
    (0, 2.1, 38, D), (2.1, 4.2, 35, Bm), (4.2, 6.3, 43, G), (6.3, 8.4, 45, A),
    (8.4, 10.5, 38, D), (10.5, 12.6, 43, G), (12.6, 14.8, 35, Bm), (14.8, HOY - B, 45, A)]], inst=clave, loud=lambda a: 0.6)
# hoy: piano otra vez
m.sections([
    (HOY, L["n7"] - 0.5, 38, D, "e"),
    (L["n7"] - 0.5, L["n8"] - 0.5, 38, D, "e"), (L["n8"] - 0.5, L["n9"] - 0.5, 35, Bm, "e"), (L["n9"] - 0.5, L["n10"], 43, G, "e"),
    (L["n10"], L["n10"] + 1.8, 43, G, "e"), (L["n10"] + 1.8, FLIP, 45, A, "e"),
    (FLIP + 0.55, FLIP + 3.0, 38, [57, 62, 66, 69], None),
    (FLIP + 3.42, TL["duration"], 38, [62, 64, 66, 69], None),
], loud=lambda a: 0.9 if a >= L["n10"] else 0.7)

# arranque en frío: la pluma rasga el papel (primer plano, 0–0,8 s)
m.pencil(0.05, 0.78, g=(0.05, 0.085))

PENTA = [86, 88, 90, 93, 95, 98]
CLAC_F = {0: 300, 1: 250, 2: 330, 3: 210}
for e in m.events:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "draw0":
        m.pencil(t + 0.1, t + 3.2)
    elif k == "cut":
        # los cuatro primeros cortes van solos (sin música aún): más presencia; el resto, discretos
        g = 0.42 if v in (0, 1, 2, 3) else (0.3 if 20 <= v < 30 else 0.24)
        f = CLAC_F.get(v, 235 + (v * 37) % 110)
        m.put(m.vo, t, clac(f), g, pan=((v * 0.37) % 0.5) - 0.25)
        m.put(m.wet, t, clac(f), g * 0.12)
    elif k == "seal":
        m.both(t, thud(110, 46, 0.55, 0.15), 0.5, 0.12)
        m.put(m.vo, t, squash(), 0.22)
        m.both(t + 0.02, bell(74, 3.0), 0.04, 0.12)
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
    elif k == "stamp":
        m.both(t, thud(95, 45, 0.5, 0.15), 0.4, 0.1)
        m.both(t, piano(74, 0.35), 0.5, 0.4)

m.voice(gains={"narradora": 1.0}, pans={"abuela": -0.25, "joven": 0.25, "madre": 0.2, "tendero": -0.2})
m.master(duck=0.45, mute=((PZ0 + 0.15, PZ1),))
