"""Un dato de la ciudad · 01. Sobrio y preciso: un pad de cuerdas muy quieto y notas sueltas de piano (re menor; sol menor
en el índice; la pregunta, en si bemol), y encima el trabajo de la pluma: un tic de lápiz por cada año que se dibuja
(más agudo cuanto más alto el dato). Un golpe seco al máximo, a la caída, al cruce de 2017. «debemos saber.»: re mayor.
Voz siempre por encima (duck)."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import SR, Mix, band_noise, bell, piano, tap, thud, tt  # noqa: E402

# convolución por FFT (el master tarda decenas de minutos con np.convolve directo)
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


def first(k):
    return min(e["t"] for e in EV if e["k"] == k)


def cut(v):
    return [e["t"] for e in EV if e["k"] == "cut" and e.get("v") == v][0]


P0, TB0, TC0, TD0 = cut(3), cut("b"), cut("c"), cut("d")
OPEN, LAND = first("flip"), first("land")
SHRINK = first("shrink") - 0.07
D_MIN, G_MIN, BB, D_MAJ = [62, 65, 69], [62, 67, 70], [62, 65, 70], [62, 66, 69]
SLOW = 60 / 48 / 2                      # notas sueltas: una cada 1,25 s

m.sections([(0.0, P0, 38, [50, 57], None)], loud=lambda a: 0.35)
m.sections([(P0, TB0, 38, D_MIN, "q")], eighth=SLOW, loud=lambda a: 0.5)
m.sections([(TB0, TC0, 43, G_MIN, "q")], eighth=SLOW, loud=lambda a: 0.5)
m.sections([(TC0, TD0, 38, D_MIN, "q")], eighth=SLOW, loud=lambda a: 0.55)
m.sections([(TD0, OPEN, 34, BB, "q")], eighth=SLOW, loud=lambda a: 0.6)
m.sections([(OPEN, SHRINK, 38, D_MAJ, None)], loud=lambda a: 0.85)
m.sections([(LAND, TL["duration"], 38, [62, 64, 66, 69], None)], loud=lambda a: 0.9)


def clac(f=240, d=0.12):
    """Golpe seco de madera: cuerpo corto + clic."""
    t = tt(d)
    return (0.6 * np.sin(2 * np.pi * f * t) * np.exp(-t / 0.02) + 0.5 * band_noise(d, 900, 5200) * np.exp(-t / 0.005)) * np.minimum(1, t / 0.0008)


def lapiz(x, fast):
    """Un año de pluma: tic seco y un roce de lápiz; más agudo cuanto más alto el dato (x de 0 a 1)."""
    s = tap(760 + 1100 * float(np.clip(x, 0, 1))) * 0.9
    r = band_noise(len(s) / SR, 2200, 7000)[: len(s)]
    r = r * np.sin(np.pi * np.arange(len(r)) / len(r)) ** 0.8
    s[: len(r)] += 0.35 * r
    return s


QN = [74, 72, 69, 67, 69, 65, 64, 62, 64, 69]       # la pregunta, palabra a palabra (re menor, descendente)

for e in EV:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "cut":
        if v in (0, 1, 2):                                  # archivo: cortes secos de madera
            m.put(m.mus, t, clac([210, 250, 190][v]), 0.3, pan=[-0.25, 0.25, 0.0][v])
            m.put(m.wet, t, clac([210, 250, 190][v]), 0.05)
        elif v == 3:                                        # a papel
            m.put(m.vo, t, clac(230), 0.42)
            m.put(m.vo, t, thud(90, 44, 0.5, 0.15), 0.16)
        else:                                               # cambio de gráfico
            m.put(m.vo, t, clac({"b": 280, "c": 220, "d": 170}[v], 0.1), 0.28)
            if v == "d":
                m.put(m.vo, t, thud(70, 36, 0.9, 0.3), 0.18)
    elif k == "grid":
        m.put(m.mus, t, tap(1500 - 90 * v), 0.04, pan=0.3 - 0.1 * v)
    elif k == "pen":
        m.put(m.mus, t, lapiz(v["x"], v["f"]), 0.10 if v["f"] else 0.13, pan=-0.25 + 0.5 * (v["k"] % 7) / 6)
    elif k == "peak":                                       # el máximo: golpe seco y una nota
        m.put(m.vo, t, clac(300, 0.14), 0.4)
        m.put(m.vo, t, thud(80, 40, 0.8, 0.25), 0.22)
        m.both(t, piano(81, 0.38, 3.0), 0.5, 0.35, pan=0.15)
        m.both(t + 0.02, bell(93, 2.5), 0.03, 0.12)
    elif k == "drop":                                       # la caída: nota grave y seca
        m.put(m.vo, t, clac(200, 0.16), 0.42)
        m.put(m.vo, t, thud(70, 34, 1.0, 0.35), 0.26)
        m.both(t, piano(62, 0.42, 3.5), 0.55, 0.3)
        m.both(t + 0.04, piano(65, 0.28, 3.0), 0.4, 0.3)
    elif k == "gain":                                       # la provincia llega arriba: mayor, abierto
        m.put(m.vo, t, clac(320, 0.12), 0.32)
        for j, n in enumerate((74, 78, 81)):
            m.both(t + j * 0.07, piano(n, 0.34, 3.0), 0.45, 0.3, pan=-0.2 + 0.2 * j)
    elif k == "cross":                                      # 2017: el cruce
        m.put(m.vo, t, clac(260, 0.16), 0.5)
        m.put(m.vo, t, thud(85, 40, 1.0, 0.3), 0.28)
        m.both(t, piano(74, 0.4, 3.0), 0.5, 0.3, pan=-0.2)
        m.both(t + 0.06, piano(77, 0.34, 3.0), 0.45, 0.3, pan=0.2)
        m.both(t + 0.02, bell(86, 3.0), 0.05, 0.15)
    elif k == "qw":
        m.both(t, piano(QN[v], 0.2 + 0.015 * v, 1.6), 0.4, 0.3, pan=-0.3 + 0.07 * v)
    elif k == "tag":
        m.both(t, bell(86, 3.0), 0.05, 0.16)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.6, fade_out=2.0)
