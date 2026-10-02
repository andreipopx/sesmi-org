"""Una palabra · 01 — «el efecto multiplicador». Piano sobrio en re mayor con un motivo de cuatro notas que se
repite una vez por vuelta (reel.html: «lap») y se acorta cuando hay fugas (n5: «motif» con menos notas);
un «clic» de moneda/registradora en cada parada de la ciudad («stop»), un soplo suave en cada fuga («leak»),
un golpe de madera en cada corte, teclas al escribirse la palabra, notas que bajan con cada cuadrado de la fila
(«sq») y un acorde al resolver el × 2 («x2»). Debajo, cuerdas con un colchón que cambia de color con la historia:
re mayor (ciudad), sol/la (vueltas), re menor (lo que se escapa), y re mayor otra vez al resolver."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import Mix, band_noise, bell, piano, tap, thud, tt, whoosh  # noqa: E402

# la reverb del máster hace convoluciones largas: por FFT (como en sesmi001)
_conv = np.convolve


def _fast_conv(a, v, mode="full"):
    if len(v) < 512:
        return _conv(a, v, mode)
    n = len(a) + len(v) - 1
    nf = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(a, nf) * np.fft.rfft(v, nf), nf)[:n]
    if mode == "same":
        o = (len(v) - 1) // 2
        return y[o : o + len(a)]
    return y


np.convolve = _fast_conv

TL = json.loads((HERE / "timeline.json").read_text())
L = {l["id"]: l["t"] for l in json.loads((HERE / "script.json").read_text())["lines"]}
VO = json.loads((HERE / "out/vo.json").read_text())
END = {k: L[k] + VO[k]["dur"] for k in L}
m = Mix(HERE, TL["duration"])
EV = m.events
ev1 = lambda k: next(e["t"] for e in EV if e["k"] == k)
C1, C2, C3, C4, C5 = (e["t"] for e in EV if e["k"] == "cut" and e.get("v") in (3, 4, 5, 6, 7))
FLIP = ev1("flip")
D, G, A, Bm, Dm = [62, 66, 69], [59, 62, 67], [61, 64, 69], [59, 62, 66], [57, 62, 65]

# ── colchón de cuerdas y bajo, según la escena
m.sections([(0.9, C1 - 0.1, 38, D, None)], loud=lambda a: 0.5)
m.sections([                                  # la ciudad: pizzicato juguetón (un plink por negra, muy bajito)
    (C1, 10.7, 38, D, "q"), (10.7, 14.5, 43, G, "q"), (14.5, 18.9, 45, A, "q"), (18.9, C2, 38, D, "q"),
], loud=lambda a: 0.55)
m.sections([(C2, 26.5, 38, D, None), (26.5, C3, 35, Bm, None)], loud=lambda a: 0.6)           # vueltas
m.sections([(C3, 34.4, 35, Bm, None), (34.4, C4, 38, Dm, None)], loud=lambda a: 0.6)           # fugas
m.sections([(C4, 46.6, 38, D, "q"), (46.6, 49.0, 43, G, "q"), (49.0, C5, 38, D, "q")], loud=lambda a: 0.6)  # resolución
m.sections([(C5, FLIP - 0.3, 38, [62, 64, 66, 69], None)], loud=lambda a: 0.5)                 # titular
m.sections([(ev1("land") + 0.3, TL["duration"], 38, [62, 64, 66, 69], None)], loud=lambda a: 0.9)


# ── sonidos propios
def clac(f=280, d=0.1):
    """Corte seco de montaje: golpe de madera suave."""
    t = tt(d)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.016)
    click = band_noise(d, 900, 4800) * np.exp(-t / 0.005)
    return (0.55 * body + 0.5 * click) * np.minimum(1, t / 0.0008)


def coin(f=2100, d=0.4):
    """Moneda / registradora: un tintineo metálico corto con un clic."""
    t = tt(d)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dd) for r, a, dd in [(1, 1.0, 0.09), (2.43, 0.55, 0.05), (3.11, 0.35, 0.03)])
    s = s * np.minimum(1, t / 0.0008)
    s[: int(0.004 * 48000)] += 0.6 * band_noise(0.004, 2500, 9000)[: int(0.004 * 48000)]
    return s


def soplo(d=0.7):
    """El soplo de lo que se escapa: ruido suave que cae."""
    t = tt(d)
    return band_noise(d, 350, 2600) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5 * np.exp(-t / (d * 0.7))


MOTIF = [74, 78, 81, 86]            # re · fa# · la · re (la octava)


def motif(t, n=4, vel=0.3, shift=0, gap=0.11, wet=0.35):
    for j, p in enumerate(MOTIF[:n]):
        m.both(t + j * gap, piano(p + shift, vel * (0.9 + 0.1 * (j == n - 1)), 1.6 if j == n - 1 else 0.7), 0.45, wet, pan=-0.2 + 0.12 * j)


PENTA = [86, 83, 81, 78, 74, 71, 69, 66]
STOPN = [74, 78, 81, 86]

# ── cold open: la moneda, el ábaco… (sin música aún; solo los clacs y un tintineo)
m.both(0.02, bell(86, 2.4), 0.07, 0.2)
m.both(1.0, bell(81, 2.0), 0.05, 0.15)

for e in EV:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "cut":
        g = 0.42 if v < 3 else 0.26
        f = [300, 250, 330, 280, 235, 310, 260, 290, 240][v % 9]
        m.put(m.vo, t, clac(f), g, pan=((v * 0.37) % 0.5) - 0.25)
        m.put(m.wet, t, clac(f), g * 0.12)
    elif k == "key":                          # teclas al escribirse «multiplicador»
        m.put(m.mus, t, tap(900 + (v % 5) * 60), 0.05, pan=-0.3 + 0.05 * v)
    elif k == "entry":
        m.both(t, piano(86, 0.2, 1.0), 0.3, 0.3, pan=0.2)
        m.put(m.mus, t, coin(2400, 0.2), 0.03)
    elif k == "hot":                          # la palabra se pone roja: re mayor, suave
        for j, p in enumerate((62, 69, 74, 78)):
            m.both(t + j * 0.04, piano(p, 0.26, 2.2), 0.4, 0.3, pan=-0.3 + 0.2 * j)
    elif k == "draw0":
        m.pencil(t, t + 1.3, g=(0.04, 0.07))
    elif k == "hop":                          # el cuadrado salta: un soplo y un golpecito de madera
        m.put(m.mus, t, whoosh(0.26, 700, 3800), 0.05, pan=0.2)
        m.put(m.mus, t, tap(520 + 40 * v), 0.06)
    elif k == "stop":                         # aterriza: moneda de registradora + una nota del motivo
        m.put(m.vo, t, coin(2000 + 150 * v), 0.16, pan=-0.1 + 0.1 * v)
        m.put(m.wet, t, coin(2000 + 150 * v), 0.05)
        m.both(t, piano(STOPN[v % 4], 0.3, 1.4), 0.5, 0.35, pan=-0.2 + 0.15 * v)
    elif k == "hop2":
        m.put(m.mus, t, tap(480 + 30 * v), 0.045, pan=0.3)
    elif k == "lap":                          # una vuelta cerrada: el motivo completo, un poco más agudo cada vez
        motif(e["t"] - 0.45, 4, 0.26, shift=0, gap=0.11)
        m.put(m.mus, t, coin(2300 - 60 * v, 0.25), 0.04)
        if v > 0:
            m.put(m.mus, t + 0.02, tap(1200 + 60 * v), 0.04)
    elif k == "limit":
        m.both(t + 0.05, bell(86, 3.0), 0.06, 0.2)
    elif k == "motif":                        # n5: 4 notas al inicio; 2 al final (se acorta: hay fugas)
        motif(t, v, 0.26 if v == 4 else 0.22, shift=0 if v == 4 else -5, wet=0.4)
    elif k == "leak":                         # un soplo y la mitad de un motivo que se va apagando
        m.put(m.mus, t, soplo(0.9), 0.09, pan=[0.5, 0.0, -0.5][v])
        m.put(m.wet, t, soplo(0.9), 0.05)
        m.both(t, thud(70, 40, 0.5, 0.18), 0.12, 0.05)
        m.both(t + 0.05, piano([81, 78, 74][v], 0.2, 1.0), 0.3, 0.25, pan=[0.4, 0.0, -0.4][v])
    elif k == "sq":                           # un cuadrado por vuelta: notas que bajan y se hacen pequeñas
        m.both(t, piano(PENTA[v % 8], 0.3 - 0.015 * v, 1.2), 0.45, 0.3, pan=-0.4 + 0.12 * v)
        m.put(m.mus, t, tap(900 + 40 * v), 0.04)
    elif k == "sum":
        m.both(t, bell(81, 2.4), 0.08, 0.2)
        m.put(m.mus, t, coin(2400, 0.3), 0.05)
    elif k == "mult":                         # el × 2 aparece
        m.both(t, thud(90, 42, 0.8, 0.25), 0.4, 0.1)
        for j, p in enumerate((50, 62, 66, 69, 74)):
            m.both(t + j * 0.05, piano(p, 0.3, 3.0), 0.45, 0.3, pan=-0.4 + 0.2 * j)
        m.both(t + 0.05, bell(86, 3.0), 0.06, 0.2)
    elif k == "shrinkrow":
        m.put(m.mus, t, tap(700 - 80 * v), 0.07)
        m.put(m.mus, t, whoosh(0.2, 600, 2500), 0.04)
    elif k == "rowA":                         # la fila del 70 %: pocas notas y cortas
        m.both(t, piano([74, 71, 69, 66, 62, 59][v % 6], 0.2, 0.6), 0.3, 0.2, pan=0.1 * v)
    elif k == "keep":
        m.both(t, piano(69, 0.22, 1.2), 0.35, 0.3)
    elif k == "x2":                           # si se queda más dentro: sube el efecto
        m.both(t, thud(85, 40, 0.9, 0.3), 0.35, 0.1)
        for j, p in enumerate((62, 69, 74, 78, 81)):
            m.both(t + j * 0.05, piano(p, 0.3, 3.0), 0.45, 0.3, pan=-0.4 + 0.2 * j)
    elif k == "form":
        m.put(m.mus, t, tap(1100), 0.06)
        m.both(t, bell(93, 2.0), 0.04, 0.12)
    elif k == "title":
        m.both(t, piano(81, 0.26, 1.6), 0.4, 0.3)
    elif k == "ring":
        m.both(t, bell([74, 78, 81, 86, 90][v], 1.8), 0.06, 0.18, pan=-0.3 + 0.15 * v)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.5, fade_out=2.0)
