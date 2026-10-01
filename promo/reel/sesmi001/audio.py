"""SESMI-001 · tráiler. Pasodoble de banda de pueblo (2/4, 110 bpm, re mayor) compuesto aquí: bajo y bombo en el
primer tiempo, acorde y platillo en el segundo, melodía de clave; se corta en seco cuando entra la comitiva
(reel.html: CAR0). Silencio cómico con los coches. Luego una base seria (cuerdas graves + pulso) para «Hoy»,
ticks del contador, golpe con el 750, el dinero que sale de la nave, los capítulos y el acorde de cierre."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import Mix, band_noise, bell, clave, piano, strings, thud, tap, tt, whoosh  # noqa: E402

# la reverb del máster hace convoluciones largas con np.convolve: por FFT (como en el teaser)
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
rng = np.random.default_rng(5)

EV = m.events
CUTS = [e["t"] for e in EV if e["k"] == "cut"]
CAR0 = L["n2"] - 0.2          # entra la comitiva: la banda se calla
A1 = 10.9                      # «Hoy»
B1 = END["n4"] + 0.4           # contador
C1 = END["n5"] + 0.2           # la pregunta
D0 = END["n6"] + 0.2           # capítulos
HIT = next(e["t"] for e in EV if e["k"] == "hit")
LAND = next(e["t"] for e in EV if e["k"] == "land")
FLIP = next(e["t"] for e in EV if e["k"] == "flip")

# ── pasodoble: 2/4 a 110 bpm. Un compás = 2 tiempos; 4 corcheas por compás.
BEAT = 60 / 110
BAR = 2 * BEAT
P0 = 0.3
D, A7, G = ([50, 62, 66, 69], [45, 61, 64, 67], [43, 59, 62, 67])
PROG = [D, D, A7, D, G, A7, D, D]
MEL = [[74, 74, 78, 81], [79, 78, 76, 73], [74, 74, 78, 81], [83, 81, 79, 78],
       [83, 83, 86, 83], [81, 79, 78, 76], [74, 78, 81, 86], [86, 86, 86, 86]]
jit = lambda: rng.normal(0, 0.007)  # la banda del pueblo no es un metrónomo


def cymbal():
    t = tt(0.3)
    return band_noise(0.3, 5200, 13000) * np.exp(-t / 0.085)


def bombo():
    return thud(95, 52, 0.4, 0.13)


def caja(n=1):
    return tap(760) * 1.0


bar = 0
while P0 + bar * BAR < CAR0 - 0.05:
    t0 = P0 + bar * BAR
    ch = PROG[bar % len(PROG)]
    root, tri = ch[0], ch[1:]
    # tiempo 1: bajo (tuba) + bombo
    if t0 < CAR0 - 0.02:
        m.both(t0 + jit(), piano(root, 0.55, 0.45), 0.5, 0.2, pan=-0.2)
        m.put(m.mus, t0 + jit(), bombo(), 0.3, pan=0.1)
    # tiempo 2: acorde (metales de la banda: piano + cuerda corta) + platillo + caja
    t1 = t0 + BEAT
    if t1 < CAR0 - 0.02:
        for n in tri:
            m.both(t1 + jit(), piano(n, 0.3, 0.4), 0.38, 0.2, pan=0.15)
        m.put(m.mus, t1 + jit(), cymbal(), 0.1, pan=0.25)
        m.put(m.mus, t1 + BEAT / 2 + jit(), caja(), 0.05)
        m.put(m.mus, t1 + BEAT * 0.75 + jit(), caja(), 0.04)
    # melodía: cuatro corcheas de clave, con el arranque de la frase en anacrusa
    for k, n in enumerate(MEL[bar % len(MEL)]):
        tn = t0 + k * BEAT / 2 + jit()
        if tn < CAR0 - 0.02:
            m.both(tn, clave(n, 0.5, 0.7), 0.55, 0.3, pan=-0.1 + 0.07 * k)
    bar += 1
# colchón de cuerdas de la banda, compás a compás hasta la comitiva
for i in range(0, 8):
    a, b = P0 + i * 2 * BAR, min(P0 + (i + 1) * 2 * BAR, CAR0)
    if a < CAR0 - 0.2:
        c = PROG[(2 * i) % len(PROG)]
        m.sections([(a, b, c[0], c[1:], None)], bass=False, loud=lambda x: 0.45)

# ── «Hoy»: base seria, cuerdas graves y un pulso (72 bpm) que va ganando cuerpo
m.sections([
    (A1, L["n4"], 38, [50, 53, 57], None),
    (L["n4"], B1, 34, [46, 53, 58], None),
    (B1, C1, 33, [49, 52, 57, 61], None),
    (C1, D0, 38, [50, 54, 57, 61], None),
    (D0, FLIP - 0.5, 38, [50, 57, 62, 66], None),
], loud=lambda a: 0.55 + 0.4 * min(1, (a - A1) / 12), bass=False)
t = A1 + 0.15
while t < B1 - 0.01:
    m.put(m.mus, t, thud(70, 40, 0.35, 0.12), 0.1 + 0.12 * (t - A1) / (B1 - A1))
    t += 60 / 72
t = B1
while t < C1:  # sobre el contador el pulso se acelera
    m.put(m.mus, t, thud(75, 42, 0.3, 0.1), 0.2)
    t += 60 / 96
t = C1
while t < D0 - 0.1:
    m.put(m.mus, t, thud(65, 38, 0.4, 0.14), 0.14)
    t += 60 / 60

PENTA = [86, 88, 90, 93, 95]


def clac(v):
    t = tt(0.16)
    f = [190, 230, 210, 250, 200, 240][v % 6]
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.035) + 0.55 * band_noise(0.16, 1800, 7500) * np.exp(-t / 0.006)


def rumble():
    return thud(62, 48, 0.12, 0.06) + 0.5 * band_noise(0.12, 90, 420) * np.exp(-tt(0.12) / 0.04)


for e in EV:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "cut":
        if t < 1:
            continue
        g = 0.2 if t >= A1 else 0.12
        m.put(m.vo, t, clac(v), g, pan=((v * 0.37) % 0.5) - 0.25)
        m.put(m.wet, t, clac(v), 0.04)
    elif k == "draw0":
        m.pencil(t, t + 1.1, g=(0.04, 0.07))
    elif k == "draw1":
        m.pencil(t, t + 1.5, g=(0.04, 0.07))
    elif k == "flag":
        m.put(m.mus, t, whoosh(0.18, 1500, 6000), 0.07, pan=0.3)
    elif k == "arch":
        for j in range(3):
            m.put(m.mus, t + j * 0.18, tap(310), 0.12)
    elif k == "letter1":
        m.put(m.mus, t, tap(900 + (v % 4) * 40), 0.045, pan=-0.2 + 0.05 * v)
    elif k == "pop":
        m.put(m.mus, t, tap(520 + 25 * v), 0.04, pan=((v * 37) % 10) / 10 - 0.5)
    elif k == "car":
        m.put(m.vo, t, rumble(), 0.16 if v % 2 == 0 else 0.1, pan=-0.3 + 0.04 * v)
    elif k == "fall":
        m.put(m.vo, t - 0.45, whoosh(0.4, 400, 2200), 0.05)
        m.put(m.vo, t, tap(280), 0.25)
        m.put(m.wet, t, tap(280), 0.04)
    elif k == "slump":  # la gente se encoge: dos notas que bajan, muy bajitas
        m.put(m.vo, t, piano(66, 0.2, 0.7), 0.35)
        m.put(m.vo, t + 0.3, piano(61, 0.2, 1.0), 0.35)
    elif k == "grow":
        m.both(t, thud(72, 38, 0.7, 0.25), 0.45 + 0.05 * v, 0.1)
    elif k == "tick":
        m.put(m.mus, t, tap(520 + v * 55), 0.11, pan=0.2)
        m.put(m.wet, t, tap(520 + v * 55), 0.04)
    elif k == "hit":
        m.both(t, thud(125, 36, 1.6, 0.5), 0.65, 0.18)
        m.both(t, piano(38, 0.5, 3.0), 0.5, 0.3)
        m.both(t + 0.02, bell(74, 4.0), 0.12, 0.3)
        m.both(t + 0.02, bell(86, 3.0), 0.07, 0.2)
    elif k == "coin":
        m.put(m.mus, t, tap(1300 + (v % 5) * 90), 0.035, pan=-0.2)
    elif k == "stay":
        m.both(t, bell(PENTA[v % 5], 1.6), 0.07, 0.2, pan=-0.4 + 0.1 * (v % 8))
    elif k == "chap":
        m.both(t, piano([74, 76, 78, 81, 83][v], 0.26, 1.4), 0.4, 0.3)
    elif k == "chapOn":
        m.put(m.mus, t, thud(80, 45, 0.3, 0.1), 0.18)

# cierre: acorde de re mayor con novena (el «land» de S.saber) y colchón hasta el final
m.sections([(LAND + 0.3, TL["duration"], 38, [62, 64, 66, 69], None)], loud=lambda a: 0.9)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.55, fade_out=2.0, mute=((CAR0 + 0.05, A1),))
