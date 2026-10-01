"""Teaser · pulso sereno a 96 bpm (1 tiempo = 0,625 s), piano de fieltro y cuerdas en re mayor, un «clac» seco
en cada corte del montaje (evento 'cut'), la música baja con «Debemos saber.» y el acorde del punto de la i."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import SR, Mix, band_noise, bell, piano, thud, tt  # noqa: E402

# np.convolve directo (ventana de 0,25 s sobre toda la pista) tarda decenas de minutos en master(): lo hacemos por FFT
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
m = Mix(HERE, TL["duration"])

BEAT = 60 / 96
D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
CUTS = [e["t"] for e in m.events if e["k"] == "cut"]
HOLD, CLOSE = CUTS[-2], CUTS[-1]
BAR = 4 * BEAT

# montaje: arpegio en corcheas (piano de fieltro) sobre cuerdas, un acorde cada compás
m.sections([
    (0.0, BAR, 38, D, "e"), (BAR, 2 * BAR, 35, Bm, "e"),
    (2 * BAR, 3 * BAR, 43, G, "e"), (3 * BAR, HOLD, 45, A, "e"),
], eighth=BEAT / 2, loud=lambda a: 0.55 + 0.3 * min(1, a / 8))
# el plano que se queda: solo cuerdas y el bajo, para que se oiga la voz
m.sections([(HOLD, CLOSE + 0.3, 38, D, None)], loud=lambda a: 0.7)
# cierre: re mayor con novena
m.sections([(CLOSE + 0.3, TL["duration"], 38, [62, 64, 66, 69], None)], loud=lambda a: 0.9)


def clac(v):
    """Golpe seco de madera: un clic corto + un cuerpo grave; algo distinto según el plano."""
    t = tt(0.16)
    f = [190, 230, 210, 250, 200, 240][v % 6]
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.035)
    click = band_noise(0.16, 1800, 7500) * np.exp(-t / 0.006)
    return body + 0.55 * click


# pulso: un latido grave muy suave en cada tiempo del montaje
t = 0.0
while t < HOLD - 1e-6:
    m.put(m.mus, t, thud(78, 48, 0.3, 0.09), 0.07)
    t += BEAT

for e in m.events:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "cut":
        if v < len(CUTS) - 2:
            m.put(m.mus, t, clac(v), 0.22, pan=((v * 0.37) % 0.6) - 0.3)
            m.put(m.wet, t, clac(v), 0.05)
        elif t == HOLD:      # llega el plano que se queda: golpe suave y grave
            m.put(m.mus, t, clac(v), 0.2)
            m.both(t, thud(62, 36, 1.6, 0.5), 0.3, 0.12)
        else:                # corte a papel
            m.put(m.mus, t, clac(v), 0.16)
            m.both(t, thud(70, 42, 0.8, 0.2), 0.22, 0.08)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.8, fade_out=2.0)
