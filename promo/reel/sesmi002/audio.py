"""SESMI-002 · tráiler. El corazón es el MOTOR: seis intentos de arranque (manivela a saltos, tono que sube, calada con
chisporroteo), cada uno un poco más fuerte; debajo, un pulso grave y tenso en re menor. Con «Y no arrancan.» la música
se corta en seco y solo queda un «clac»; tras «¿Por qué?», silencio. Con «Vamos a averiguarlo» entran el piano y las
cuerdas en re mayor (la tercera sube: esperanza); «debemos saber.» y el acorde de cierre. Voz siempre por encima (duck)."""
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
from synth import SR, Mix, band_noise, bell, lp1, piano, tap, thud, tt  # noqa: E402

# np.convolve directo (ventana de 0,25 s sobre toda la pista) tarda mucho en master(): lo hacemos por FFT
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
EV = m.events
first = lambda k: min(e["t"] for e in EV if e["k"] == k)
P0 = [e["t"] for e in EV if e["k"] == "cut"][4]      # corte a papel: empieza la curva
SHRINK = first("shrink") - 0.07
N2, N4, N5 = L["n2"], L["n4"], L["n5"]
D_MIN, D_MAJ = [62, 65, 69], [62, 66, 69]


# ── sonidos del motor ────────────────────────────────────────────────────────
def saw(f, nh):
    ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(np.sin(h * ph) / h**1.2 for h in range(1, nh + 1))


def rev(d, f0, f1, r0=6.0, r1=22.0):
    """Motor que sube de vueltas: sierra de banda limitada con el tono subiendo y los golpes de los cilindros acelerando."""
    t = tt(d)
    p = t / d
    f = f0 * (f1 / f0) ** p
    s = saw(f, int(max(4, min(16, 2500 / f1))))
    r = r0 + (r1 - r0) * p
    am = 0.2 + 0.8 * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(r) / SR)) ** 1.5
    s = lp1(s * am, 1500)
    return s / (np.abs(s).max() + 1e-9) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.01)


def stall(i):
    """Se cala: el tono se desploma, los golpes se espacian, chisporroteo y un golpe seco al final."""
    d = 0.5
    t = tt(d)
    f1 = 92 + 14 * i
    f = f1 * np.exp(-t / 0.07) + 16
    s = saw(f, 6)
    r = 3 + 22 * np.exp(-t / 0.12)
    am = 0.2 + 0.8 * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(r) / SR)) ** 1.5
    s = lp1(s * am, 1100) / (np.abs(s).max() + 1e-9) * np.exp(-t / 0.16) * np.minimum(1, t / 0.004)
    for tp, a in ((0.05, 0.7), (0.12, 0.5), (0.21, 0.4), (0.3, 0.3)):
        n = band_noise(0.035, 150, 1400) * np.exp(-tt(0.035) / 0.008) * a
        k = int(tp * SR)
        s[k : k + len(n)] += n
    k = int(0.36 * SR)
    c = thud(70, 38, 0.14, 0.05) * 0.9
    s[k : k + len(c)] += c
    return s


def mixs(*sigs):
    """Suma señales de distinta longitud (la más larga manda)."""
    out = np.zeros(max(len(x) for x, _ in sigs))
    for x, g in sigs:
        out[: len(x)] += g * x
    return out


def crank_tap():
    """Un diente del trinquete de la manivela."""
    return mixs((tap(330), 0.8), (thud(150, 72, 0.12, 0.03), 0.9))


def clac(f=260, d=0.12):
    t = tt(d)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.02)
    click = band_noise(d, 900, 5200) * np.exp(-t / 0.005)
    return (0.6 * body + 0.5 * click) * np.minimum(1, t / 0.0008)


# ── música ───────────────────────────────────────────────────────────────────
m.sections([(0.0, P0, 38, [50, 57], None)], loud=lambda a: 0.35)                  # arranque en frío: un grave quieto
m.sections([(P0, N2 - 0.02, 38, D_MIN, None)], loud=lambda a: 0.5)                 # intentos: re menor, tenso
# la esperanza: piano y cuerdas en mayor desde «Vamos a averiguarlo»
m.sections([(N4 - 0.3, N5 - 0.1, 38, D_MAJ, "e")], eighth=60 / 96 / 2, loud=lambda a: 0.75)
m.sections([(N5 - 0.1, SHRINK, 38, D_MAJ, None)], loud=lambda a: 0.85)
m.sections([(SHRINK + 0.42, TL["duration"], 38, [62, 64, 66, 69], None)], loud=lambda a: 0.9)

# arranque en frío: un motor que se prepara (rumor que sube y late)
m.put(m.mus, 0.0, rev(P0, 26, 70, 5, 16), 0.08)
# pulso grave y tenso bajo los intentos: se acelera
t, per = P0 + 0.1, 0.9
while t < N2 - 0.15:
    g = 0.1 + 0.09 * min(1, (t - P0) / 7)
    m.put(m.mus, t, thud(58, 38, 0.4, 0.13), g)
    m.put(m.mus, t + 0.18, thud(54, 36, 0.3, 0.1), g * 0.6)
    t += per
    per = max(0.55, per - 0.045)

HOP, DOOR = [81, 86, 90], [250, 215, 180, 150]
for e in EV:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "cut":
        if v in (0, 1, 2, 3):                                   # cortes secos del arranque, cada vez más rápidos
            f = [300, 250, 330, 210][v]
            m.put(m.vo, t, clac(f), 0.34 + 0.05 * v, pan=((v * 0.37) % 0.5) - 0.25)
            m.put(m.wet, t, clac(f), 0.05)
        elif v == 4:                                            # a papel: llega el motor
            m.put(m.vo, t, clac(230), 0.45)
            m.put(m.vo, t, thud(90, 44, 0.5, 0.15), 0.2)
        elif v == "ink":                                        # a tinta: golpe grave y silencio
            m.put(m.vo, t, thud(70, 34, 1.2, 0.4), 0.3)
        else:                                                   # de vuelta al papel
            m.put(m.vo, t, clac(300, 0.1), 0.22)
    elif k == "crank":
        m.put(m.mus, t, crank_tap(), 0.15 + 0.025 * v, pan=-0.2 if v % 2 else 0.2)
    elif k == "try":
        i, rise, hold = v["i"], v["rise"], v["hold"]
        d = rise * 0.8 + hold
        m.put(m.mus, t + rise * 0.2, rev(d, 36 + 4 * i, 92 + 14 * i), 0.14 + 0.04 * i)
        m.put(m.wet, t + rise * 0.2, rev(d, 36 + 4 * i, 92 + 14 * i), 0.03)
    elif k == "stall":
        m.put(m.mus, t, stall(v), 0.17 + 0.04 * v)
        m.put(m.wet, t, stall(v), 0.05)
    elif k == "clac":                                           # el único sonido del silencio
        m.put(m.vo, t, clac(190, 0.16), 0.55)
        m.put(m.vo, t, thud(80, 42, 0.5, 0.12), 0.12)
    elif k == "lock":
        m.put(m.mus, t, mixs((tap(900), 1.0), (clac(480, 0.08), 0.6)), 0.12)
        m.both(t, bell(88, 1.0), 0.03, 0.06)
    elif k == "unlock":
        m.put(m.mus, t, tap(1300), 0.14)
        m.both(t, bell(93, 2.0), 0.07, 0.15)
    elif k == "door":
        m.put(m.mus, t, mixs((tap(DOOR[v]), 1.0), (band_noise(0.16, 300, 1000) * np.exp(-tt(0.16) / 0.06), 0.5)), 0.1, pan=0.2)
    elif k == "hop":
        m.both(t, piano(HOP[v], 0.22, 1.6), 0.4, 0.3, pan=0.3)
    elif k == "title":
        for j, n in enumerate((62, 69, 74, 78)):
            m.both(t + j * 0.05, piano(n, 0.3, 2.5), 0.4, 0.35, pan=-0.3 + j * 0.2)

m.voice(gains={"narradora": 1.0})
m.master(duck=0.65, fade_out=2.0, mute=((N2 - 0.02, N4 - 0.3),))
