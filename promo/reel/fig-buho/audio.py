"""Serie «De dónde sale cada figura» · ep. 1 (búho). Piano de fieltro y cuerdas suaves en re mayor a 72 bpm.
Motivo de cuatro notas (74, 78, 81, 86 en corcheas) en el gancho y en el cierre; 'cut' = clac suave; 'trace' = pluma
(m.pencil); 'fill' = nota grave + campana; el parpadeo del búho ('owl') y el acorde final ('land')."""
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


def all_(k):
    return [e["t"] for e in EV if e["k"] == k]


CUTS = all_("cut")
T_COIN, T_CALCO = CUTS[0], CUTS[-1]
T_TRACE, T_TRACE_END, T_FILL = first("trace"), first("traceEnd"), first("fill")
T_LAND = first("land")
T_ERASE = json.loads((HERE / "script.json").read_text())["lines"][-1]["t"]
EIGHTH = 60 / 72 / 2

D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
DADD9 = [62, 64, 66, 69]

# gancho: solo cuerdas bajo el motivo; la fuente: arpegio en negras sobre D · Bm · G · A; el calco: cuerdas;
# la figura viva: re mayor con arpegio; el cierre: re mayor con novena
span = (T_CALCO - T_COIN) / 4
m.sections([(0.0, T_COIN, 38, D, None)], loud=lambda a: 0.6)
m.sections([
    (T_COIN, T_COIN + span, 38, D, "q"), (T_COIN + span, T_COIN + 2 * span, 35, Bm, "q"),
    (T_COIN + 2 * span, T_COIN + 3 * span, 43, G, "q"), (T_COIN + 3 * span, T_CALCO, 45, A, "q"),
], eighth=EIGHTH, loud=lambda a: 0.55 + 0.25 * min(1, (a - T_COIN) / 8))
m.sections([(T_CALCO, T_FILL, 35, Bm, None)], loud=lambda a: 0.6)
m.sections([(T_FILL, T_ERASE, 38, D, "e")], eighth=EIGHTH, loud=lambda a: 0.85)
m.sections([(T_ERASE, TL["duration"], 38, DADD9, None)], loud=lambda a: 0.9)


def clac(v):
    """Golpe seco de madera: clic corto + cuerpo grave; algo distinto según el plano."""
    t = tt(0.16)
    f = [190, 230, 210, 250, 200, 240, 220][v % 7]
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.035) + 0.55 * band_noise(0.16, 1800, 7500) * np.exp(-t / 0.006)


def motif(t0, vel=0.3):
    for i, n in enumerate((74, 78, 81, 86)):
        m.both(t0 + i * EIGHTH, piano(n, vel + 0.03 * i, 2.4), 0.45, 0.4, pan=-0.25 + 0.17 * i)
    m.both(t0 + 3 * EIGHTH, bell(86, 3.0), 0.04, 0.16)


for e in EV:
    t, k, v = e["t"], e["k"], e.get("v")
    if k == "motif":
        motif(t)
    elif k == "cut":
        m.put(m.mus, t, clac(v), 0.2, pan=((v * 0.37) % 0.6) - 0.3)
        m.put(m.wet, t, clac(v), 0.05)
    elif k == "veil":
        m.both(t, band_noise(0.25, 700, 5000) * np.sin(np.pi * tt(0.25) / 0.25), 0.05, 0.05)  # papel de calco
    elif k == "fill":
        m.both(t, thud(70, 38, 1.4, 0.5), 0.35, 0.15)
        m.both(t, piano(38, 0.4, 3.0), 0.5, 0.25)
        m.both(t + 0.02, bell(81, 3.2), 0.1, 0.25)
    elif k == "letter":
        m.put(m.mus, t, tap(430 + 70 * v), 0.05, pan=-0.2 + 0.1 * v)
    elif k in ("trace", "traceEnd"):
        pass
    elif m.common(e):
        pass

m.pencil(T_TRACE, T_TRACE_END, g=(0.035, 0.06))
# el borde de la caja, a saltos: un tic suave al dibujarse y al borrarse
for i in range(7):
    m.put(m.mus, 0.02 + i * 0.08, tap(900), 0.03, pan=0.2)
for i in range(6):
    m.put(m.mus, T_ERASE + 0.15 + i * 0.083, tap(760), 0.025, pan=-0.2)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.55, fade_out=2.0)
