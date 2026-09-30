"""Banda sonora del reel, sintetizada desde cero y sincronizada con la imagen.

Lee timeline.json y out/events.json (lo que declara reel.html: cada frase, cada paso del cuadrado,
el trazo de la ciudad, las figuras…) y escribe out/audio.wav. Piano de fieltro y cuerdas suaves en
re mayor, sin percusión; el lápiz suena mientras se dibuja la ciudad. Requiere numpy.
"""
import json
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent
TL = json.loads((HERE / "timeline.json").read_text())
EVENTS = json.loads((HERE / "out/events.json").read_text())
SR = 48000
DUR = TL["duration"]
N = int(SR * (DUR + 0.05))
EIGHTH = 60 / 72 / 2  # 72 BPM
rng = np.random.default_rng(11)

dry = np.zeros((N, 2))
wet = np.zeros((N, 2))  # envío a reverb


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(SR * d)) / SR


def put(buf, t0, sig, gain=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N or i + len(sig) <= 0:
        return
    s = sig
    if i < 0:
        s, i = s[-i:], 0
    s = s[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i : i + len(s), 0] += s * gain * l * 1.414
    buf[i : i + len(s), 1] += s * gain * r * 1.414


def both(t0, sig, g_dry, g_wet, pan=0.0):
    put(dry, t0, sig, g_dry, pan)
    put(wet, t0, sig, g_wet, pan)


def band_noise(d, lo, hi):
    n = max(2, int(SR * d))
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)


# ── instrumentos ─────────────────────────────────────────────────────────────
def piano(m, vel=0.5, dur=None):
    """Piano de fieltro: parciales ligeramente inarmónicos, dos cuerdas, macillo blando."""
    f = hz(m)
    base = float(np.clip(2.4 * (220 / f) ** 0.45, 0.7, 5.0))
    dur = dur or min(6.0, base * 2.2)
    t = tt(dur)
    s = np.zeros_like(t)
    for n in range(1, 11):
        fn = n * f * np.sqrt(1 + 0.00035 * n * n)
        if fn > 12000:
            break
        amp = (1 / n**1.25) * np.exp(-n * (0.42 - 0.25 * vel))
        dec = base / (1 + 0.55 * (n - 1))
        for det in (-0.9, 0.9):  # centésimas
            s += 0.5 * amp * np.sin(2 * np.pi * fn * (1 + det / 1731) * t + n) * np.exp(-t / dec)
    s *= np.minimum(1, t / 0.004)
    ham = band_noise(0.012, 200, 2500) * np.exp(-tt(0.012) / 0.003)
    s[: len(ham)] += 0.12 * vel * ham
    s *= np.clip((dur - t) / 0.25, 0, 1)
    return s * vel


def strings(notes, d, att=1.6, rel=1.4):
    """Pad de cuerdas: sierras suaves (pocos armónicos), desafinadas y con vibrato lento."""
    t = tt(d)
    env = np.minimum(1, t / att) ** 2 * np.clip((d - t) / rel, 0, 1)
    out = np.zeros((len(t), 2))
    for j, m in enumerate(notes):
        f = hz(m)
        for ch, det in ((0, -3.5), (1, 3.5)):
            vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.6 + j * 0.3) * t + j)
            ph = 2 * np.pi * np.cumsum(f * (1 + det / 1731) * vib) / SR
            w = sum(np.sin(h * ph) / h**1.6 for h in range(1, 7))
            out[:, ch] += w * env
    return out / max(1, len(notes))


def bell(m, d=2.5):
    t, f = tt(d), hz(m)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dd) for r, a, dd in [(1, 1, 1.0), (2.76, 0.3, 0.45), (5.4, 0.08, 0.18), (2, 0.18, 0.8)])
    return s * np.minimum(1, t / 0.003)


def thud(f0=90, f1=42, d=0.6, dec=0.2):
    t = tt(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / 0.05)) / SR
    return np.sin(ph) * np.exp(-t / dec) * np.minimum(1, t / 0.003)


def tap():
    t = tt(0.06)
    s = np.sin(2 * np.pi * 520 * t) * np.exp(-t / 0.012)
    s += 0.5 * band_noise(0.06, 400, 1800) * np.exp(-t / 0.006)
    return s


def pencil(t0, t1):
    """Lápiz sobre papel: gestos de ruido de 0,1–0,35 s."""
    t = t0
    while t < t1:
        d = rng.uniform(0.1, 0.35)
        n = band_noise(d, 1800, 7500)
        x = tt(d)
        e = np.sin(np.pi * x / d) ** 0.7 * (0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(6, 14) * x) ** 2)
        put(dry, t, n * e, rng.uniform(0.028, 0.045), pan=rng.uniform(-0.4, 0.4))
        t += d + rng.uniform(0.0, 0.08)


# ── armonía (re mayor) ───────────────────────────────────────────────────────
Dm, Bm, Gm, Am = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
SECTIONS = [  # (inicio, fin, bajo, acorde, arpegio: None | 'q' negras | 'e' corcheas)
    (3.0, 5.0, 38, Dm, None),
    (5.0, 7.0, 38, Dm, "q"), (7.0, 9.0, 35, Bm, "q"), (9.0, 11.0, 43, Gm, "q"), (11.0, 13.0, 45, Am, "q"),
    (13.0, 15.0, 38, Dm, "e"), (15.0, 17.0, 37, Am, "e"), (17.0, 19.0, 35, Bm, "e"), (19.0, 20.5, 43, Gm, "e"),
    (20.5, 21.2, 43, [62, 67, 69], None),
    (21.2, 22.8, 43, Gm, "e"), (22.8, 24.4, 45, Am, "e"), (24.4, 26.0, 38, Dm, "e"),
    (26.0, 27.5, 35, Bm, "e"), (27.5, 29.0, 43, Gm, "e"), (29.0, 30.5, 42, Dm, "e"), (30.5, 32.2, 45, Am, "e"),
    (32.2, 34.8, 38, Dm, "e"), (34.8, 37.4, 35, Bm, "e"), (37.4, 40.0, 43, Gm, "e"),
    (40.55, 44.3, 38, [57, 62, 66, 69], None),
    (44.72, DUR, 38, [62, 64, 66, 69], None),
]
PAT = [0, 1, 2, 3, 4, 3, 2, 1]


def chord_at(t):
    for a, b, bass, ch, _ in SECTIONS:
        if a <= t < b:
            return bass, ch
    return 38, Dm


def music():
    k8 = 0
    for a, b, bass, ch, arp in SECTIONS:
        d = b - a
        loud = 0.9 if a >= 26 and a < 40 else 0.6
        st = strings([bass + 12] + ch, d + 1.2, att=min(1.6, d * 0.6), rel=1.2)
        g = 0.05 * loud if a < 40.5 else 0.06
        put(dry, a, st[:, 0], g, -0.5)
        put(dry, a, st[:, 1], g, 0.5)
        put(wet, a, st.mean(axis=1), g * 0.8)
        if a >= 5:
            both(a, piano(bass, 0.42), 0.55, 0.25)
        if arp:
            tones = [bass + 12] + ch + [ch[0] + 12]
            step = EIGHTH * (2 if arp == "q" else 1)
            n = int(round(d / step))
            for i in range(n):
                t = a + i * step
                m = tones[PAT[k8 % len(PAT)]]
                k8 += 1
                vel = 0.26 + (0.06 if i % 2 == 0 else 0) + (0.04 if a >= 26 else 0)
                both(t, piano(m, vel), 0.5, 0.35, pan=-0.35 + 0.1 * (k8 % 8))


# ── eventos de la imagen ─────────────────────────────────────────────────────
LINE_NOTES = [81, 78, 76, 81, 83, 86, 81, 74, 76, 78]
SIGNS = [86, 88, 90, 93, 95]


def events():
    for e in EVENTS:
        t, k, v = e["t"], e["k"], e.get("v")
        if k == "blink":  # el cursor que parpadea: tres notas sueltas
            both(t, piano([74, 78, 81][v], 0.3), 0.6, 0.5)
        elif k == "draw0":
            pencil(t + 0.2, 8.8)
        elif k == "line":
            _, ch = chord_at(t + 0.01)
            m = LINE_NOTES[v]
            both(t, piano(m, 0.38), 0.55, 0.5, pan=0.15)
        elif k in ("step", "stepB"):
            put(dry, t, tap(), 0.05 if k == "step" else 0.045, pan=(-0.25 if v % 2 else 0.25))
        elif k == "sign":
            both(t, bell(SIGNS[v], 1.8), 0.06, 0.12, pan=0.3)
        elif k == "look":
            both(t, piano([81, 79][v], 0.3), 0.5, 0.5)
        elif k == "home":
            both(t, bell(74, 3.0), 0.08, 0.2)
        elif k == "fig":
            both(t, bell([81, 83, 86][v], 3.0), 0.1, 0.25)
        elif k == "owl":
            both(t, piano(93, 0.15, 0.6), 0.25, 0.2, pan=0.3)
        elif k == "hoof":
            put(dry, t, tap() * (1.2 if v else 1), 0.07, pan=-0.15)
        elif k == "wing":
            d = 0.22
            x = tt(d)
            both(t, band_noise(d, 500, 2800) * np.sin(np.pi * x / d) ** 2, 0.07, 0.05, pan=0.2)
        elif k == "flip":
            d = 0.9
            x = tt(d)
            both(t - d, band_noise(d, 900, 7000) * (x / d) ** 2.5, 0.12, 0.2)
            for j in range(6):
                lo = 300 + j * 420
                s = band_noise(0.07, lo, lo * 2.2) * np.exp(-tt(0.07) / 0.03)
                both(t + j * 0.07, s, 0.14, 0.12, pan=-0.5 + j * 0.2)
            both(t, thud(70, 32, 2.5, 0.8), 0.6, 0.15)
        elif k == "saber":
            ms = (38, 50, 57) if v == 0 else (62, 66, 69, 74)
            for j, m in enumerate(ms):
                both(t + j * 0.015, piano(m, 0.55), 0.55, 0.4)
        elif k == "shrink":
            both(t, piano(90 - v * 2, 0.18, 0.5), 0.35, 0.2)
        elif k == "land":
            both(t, thud(95, 45, 0.6, 0.18), 0.55, 0.1)
            for j, m in enumerate((38, 50, 57, 62, 64, 66, 69, 74)):
                both(t + j * 0.035, piano(m, 0.5 if j < 3 else 0.4, 6.0), 0.5, 0.45, pan=-0.4 + j * 0.1)
            both(t + 0.3, bell(86, 4.0), 0.06, 0.2)
        elif k == "letter":
            both(t, piano([74, 76, 78, 81, 86][v], 0.22, 1.2), 0.35, 0.3)
        elif k == "sign2":
            both(t, bell(81, 3.0), 0.05, 0.15)
        elif k == "url":
            both(t, bell(86, 3.0), 0.05, 0.15)


def reverb(x, seconds=3.2):
    n = int(SR * seconds)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    nfft = 1 << (len(x) + n - 1).bit_length()
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (seconds / 6.9)) * np.minimum(1, t / 0.02)
        ir[: int(0.02 * SR)] = 0
        spec = np.fft.rfft(ir)  # reverb oscura: atenuar agudos de la cola
        f = np.fft.rfftfreq(n, 1 / SR)
        ir = np.fft.irfft(spec / (1 + (f / 4500) ** 2), n)
        out[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch], nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return out / (np.abs(out).max() + 1e-9) * np.abs(x).max() * 1.1


def room():
    """Tono de sala: ruido rosa muy bajo, para que el silencio no sea digital."""
    w = rng.standard_normal((N, 2))
    spec = np.fft.rfft(w, axis=0)
    f = np.fft.rfftfreq(N, 1 / SR)
    spec /= np.sqrt(np.maximum(f, 20))[:, None]
    spec[f > 6000] *= 0.2
    x = np.fft.irfft(spec, N, axis=0)
    return x / np.abs(x).max() * 0.006


def main():
    music()
    events()
    mix = dry + 0.55 * reverb(wet + 0.25 * dry) + room()
    t = np.arange(N) / SR
    mix *= np.clip(t / 0.1, 0, 1)[:, None] * np.clip((DUR - t) / 2.5, 0, 1)[:, None]
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    mix *= 0.89 / np.abs(mix).max()
    pcm = (mix * 32767).astype("<i2")
    with wave.open(str(HERE / "out/audio.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"out/audio.wav · {DUR:.1f} s · {len(EVENTS)} eventos")


if __name__ == "__main__":
    main()
