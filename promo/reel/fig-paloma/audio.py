"""«De dónde sale la paloma» (ep. 3/3) · piano de fieltro y cuerdas suaves en re mayor (72 bpm), el motivo de cuatro
notas (74, 78, 81, 86 en corcheas) en el gancho y en el cierre, «clac» suave en cada corte, plumilla al escribir y
al calcar, nota grave y campana al rellenar, aleteos de la figura y acorde final. Voz por encima (duck 0,55)."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import Mix, band_noise, bell, piano, thud, tap, tt  # noqa: E402

# np.convolve directo tarda decenas de minutos en master(): lo hacemos por FFT
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
m = Mix(HERE, TL["duration"])
EV = m.events
first = lambda k: min(e["t"] for e in EV if e["k"] == k)  # noqa: E731
motifs = sorted(e["t"] for e in EV if e["k"] == "motif")
FILL, CLOSE = first("fill"), motifs[-1]
EIGHTH = 60 / 72 / 2
D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]

# colchón: un acorde por tramo, arpegio lento (negras) mientras suena la voz; el cierre en re mayor con novena
span = CLOSE - 0.0
bounds = [0.0, span * 0.25, span * 0.5, span * 0.75, CLOSE]
m.sections([(bounds[0], bounds[1], 38, D, "q"), (bounds[1], bounds[2], 35, Bm, "q"),
            (bounds[2], bounds[3], 43, G, "q"), (bounds[3], bounds[4], 45, A, "q")],
           eighth=EIGHTH, loud=lambda a: 0.55)
m.sections([(CLOSE, TL["duration"], 38, [62, 64, 66, 69], None)], loud=lambda a: 0.9)

# motivo de cuatro notas: gancho y cierre (idéntico en los tres episodios)
for t0 in motifs:
    for i, n in enumerate((74, 78, 81, 86)):
        m.both(t0 + i * EIGHTH, piano(n, 0.34, 2.0), 0.55, 0.4, pan=-0.2 + 0.13 * i)


def clac(v):
    t = tt(0.16)
    f = [190, 230, 210, 250, 200, 240][v % 6]
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.035) + 0.55 * band_noise(0.16, 1800, 7500) * np.exp(-t / 0.006)


for e in EV:
    t, k, v = e["t"], e["k"], e.get("v")
    if k == "motif":
        continue
    if k == "cut":
        m.put(m.mus, t, clac(v), 0.2, pan=((v * 0.37) % 0.6) - 0.3)
        m.put(m.wet, t, clac(v), 0.05)
    elif k == "digit":                       # la cifra 1775 que se compone a saltos
        m.both(t, tap(380 + 60 * v), 0.1, 0.05, pan=-0.1 + 0.07 * v)
    elif k == "write":                       # la plumilla escribe el lema
        m.pencil(t, t + v, g=(0.035, 0.055))
    elif k == "veil":                        # el vuelo se detiene
        m.both(t, thud(70, 40, 0.5, 0.16), 0.2, 0.08)
    elif k == "trace":                       # el calco, a pluma
        m.pencil(t, t + 1.5, g=(0.04, 0.06))
    elif k == "traceEnd":
        m.put(m.mus, t, tap(900), 0.05)
    elif k == "fill":                        # la figura se rellena: nota grave y campana
        m.both(t, thud(95, 45, 0.7, 0.2), 0.32, 0.1)
        m.both(t, piano(50, 0.4, 3.0), 0.45, 0.3)
        m.both(t + 0.02, bell(86, 3.5), 0.1, 0.25)
    else:
        m.common(e)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.55, fade_out=2.0)
