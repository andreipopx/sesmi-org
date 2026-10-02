"""Versión «aportar» · «¿Quieres aportar?»: apertura de planos macro con «clac» seco en cada corte; después, en re mayor,
cada vecino que entra en la retícula añade una nota a un acorde que se va completando (piano + cuerdas suaves);
en n7 resuelve (el cuadrado salta por la retícula, la última celda cierra el acorde); el cierre del correo suena
a escritura (ticks de teclado) y todo termina en «debemos saber.» con la firma."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import Mix, band_noise, bell, piano, strings, tap, thud, tt, whoosh  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
L = {l["id"]: l["t"] for l in json.loads((HERE / "script.json").read_text())["lines"]}
m = Mix(HERE, TL["duration"])
FLIP = 30.5          # tiene que coincidir con reel.html
SHRINK = FLIP + 1.9
G0, CLOSE = 6.5, 26.0


def clac(f=280, d=0.1):
    """Corte seco de montaje: golpe de madera suave (cuerpo grave + un soplo de ruido), sin brillo."""
    t = tt(d)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.016)
    click = band_noise(d, 900, 4800) * np.exp(-t / 0.005)
    return (0.55 * body + 0.5 * click) * np.minimum(1, t / 0.0008)


def key(d=0.05):
    """Tecla de máquina de escribir, muy suave."""
    t = tt(d)
    return (band_noise(d, 1200, 6500) * np.exp(-t / 0.007) + 0.6 * np.sin(2 * np.pi * 330 * t) * np.exp(-t / 0.012)) * np.minimum(1, t / 0.0006)


D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
# acorde que se completa: una nota por vecino (re mayor con novena): fa#, la, do#, mi y, en n7, re agudo
CHORD = [66, 69, 73, 76, 74]

# ── apertura: pluma, un colchón grave que respira hasta que aparece la pregunta
m.pencil(0.05, 0.46, g=(0.05, 0.08))
m.put(m.mus, 0.4, strings([38, 45, 50], 2.6, att=1.6, rel=0.9), 0.07)
# n1: el pad de re se asienta; la ciudad se dibuja
m.sections([(L["n1"] + 0.1, G0 + 0.4, 38, D, None)], loud=lambda a: 0.5)
# retícula: bajo y quinta sostenidos hasta n7; cada celda añadirá su nota
m.put(m.mus, G0, strings([38, 45, 50], L["n7"] - G0 + 0.8, att=1.4, rel=1.0), 0.05)
# n7: resolución, con la armonía en movimiento
m.sections([
    (L["n7"] - 0.1, L["n7"] + 2.0, 38, D, "q"), (L["n7"] + 2.0, L["n7"] + 3.9, 43, G, "q"),
    (L["n7"] + 3.9, CLOSE, 45, A, "q"),
], loud=lambda a: 0.7)
# cierre: re mayor abierto, arpegio lento bajo «Escríbenos.»
m.sections([
    (CLOSE + 0.1, L["n8"] + 0.3, 38, D, None), (L["n8"] + 0.3, L["n8"] + 2.0, 43, G, "q"), (L["n8"] + 2.0, FLIP - 0.1, 38, [62, 66, 69, 73], "q"),
], loud=lambda a: 0.65)
# «debemos saber.»
m.sections([
    (FLIP + 0.55, SHRINK, 38, [57, 62, 66, 69], None),
    (SHRINK + 0.42, TL["duration"], 38, [62, 64, 66, 69], None),
], loud=lambda a: 0.8)

PENTA = [74, 76, 78, 81, 83, 86]
for e in m.events:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "cut":
        g = 0.42 if v <= 3 else 0.3
        f = [300, 250, 330, 210, 260, 240][v]
        m.put(m.vo, t, clac(f), g, pan=((v * 0.37) % 0.5) - 0.25)
        m.put(m.wet, t, clac(f), g * 0.12)
    elif k == "draw0":
        m.pencil(t + 0.1, t + 3.6)
    elif k == "cell":
        # una nota nueva del acorde: toque de madera + piano + el pad de cuerdas la sostiene hasta n7
        n = CHORD[v]
        m.put(m.mus, t, tap(700 + v * 90), 0.08, pan=(-0.3 if v % 2 else 0.3))
        m.both(t + 0.02, piano(n, 0.34, 3.5), 0.42, 0.4, pan=-0.3 + 0.15 * v)
        m.both(t + 0.02, piano(n - 12, 0.2, 3.5), 0.25, 0.25)
        pad_d = L["n7"] - t + 1.0
        m.put(m.mus, t + 0.05, strings([n], pad_d, att=1.2, rel=1.0), 0.04 + 0.004 * v)
    elif k == "hop":
        m.both(t, piano(PENTA[v], 0.2 + 0.015 * v, 1.2), 0.38, 0.4, pan=-0.45 + 0.18 * v)
        m.put(m.mus, t, tap(900 + 80 * v), 0.045)
    elif k == "pulse":
        m.both(t, piano(CHORD[v] + (12 if v == 4 else 0), 0.3, 2.0), 0.38, 0.4, pan=-0.4 + 0.2 * v)
        m.put(m.mus, t, tap(520 + 60 * v), 0.06)
    elif k == "you":
        # la celda libre se llena: el acorde se cierra
        m.both(t, thud(95, 45, 0.6, 0.2), 0.35, 0.1)
        for j, n in enumerate((38, 50, 57, 62, 66, 69, 73, 76)):
            m.both(t + j * 0.04, piano(n, 0.3 if j < 3 else 0.25, 6.0), 0.4, 0.35, pan=-0.4 + j * 0.1)
        m.both(t + 0.1, bell(86, 4.0), 0.07, 0.22)
    elif k == "type":
        m.put(m.vo, t, key(), 0.16 + 0.02 * v, pan=((v * 0.4) % 0.8) - 0.4)
        m.put(m.mus, t, tap(1400 + v * 90), 0.03)

m.voice(gains={"narradora": 1.0}, pans={"abuela": -0.25, "joven": 0.25, "madre": 0.2, "tendero": -0.2, "chica": -0.1})
m.master(duck=0.45, fade_out=1.5)
