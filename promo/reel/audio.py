"""Banda sonora del reel, sintetizada desde cero y sincronizada con la imagen.

Lee timeline.json (tempo, duración) y out/events.json (lo que reel.html declara: cada palabra que
aparece, cada cuadrado rojo, los cascos del caballo, el aleteo de la paloma…) y escribe out/audio.wav.
Base: pad en re menor (Dm · B♭ · F · C, un acorde cada 4 s), bajo y un pulso seco a 120 BPM.
Requiere numpy.
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
BEAT = 60 / TL["bpm"]
N = int(SR * (DUR + 0.05))
rng = np.random.default_rng(7)

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


def lp(x, fc):
    """Paso bajo de un polo (vectorizado con filtro IIR vía lfilter casero en bloques)."""
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for k in range(len(x)):  # señales cortas: aceptable
        acc = (1 - a) * x[k] + a * acc
        y[k] = acc
    return y


def bp_noise(d, lo, hi):
    n = int(SR * d)
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)


def env(d, a=0.003, dec=0.2):
    t = tt(d)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / dec)


# ── instrumentos ─────────────────────────────────────────────────────────────
def marimba(m, d=0.9):
    t, f = tt(d), hz(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35)
    for r, a, dec in ((4, 0.35, 0.05), (10, 0.12, 0.012)):
        if f * r < 15000:  # sin parciales por encima de ~15 kHz (evita aliasing)
            s += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dec)
    return s * np.minimum(1, t / 0.002)


def bell(m, d=2.2):
    t, f = tt(d), hz(m)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dd) for r, a, dd in [(1, 1, 0.9), (2.76, 0.35, 0.4), (5.4, 0.12, 0.15), (2, 0.2, 0.7)])
    return s * np.minimum(1, t / 0.003)


def tick():
    s = bp_noise(0.018, 2500, 6000) * env(0.018, 0.0005, 0.004)
    t = tt(0.018)
    s += 0.5 * np.sin(2 * np.pi * rng.uniform(1900, 2400) * t) * np.exp(-t / 0.006)
    return s


def thud(f0=90, f1=42, d=0.45, dec=0.16):
    t = tt(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / 0.04)) / SR
    return np.sin(ph) * np.exp(-t / dec) * np.minimum(1, t / 0.002)


def stamp():
    s = thud(110, 48, 0.5, 0.14)
    click = bp_noise(0.03, 700, 3500) * env(0.03, 0.0005, 0.008)
    s[: len(click)] += 0.6 * click
    t = tt(0.12)
    s[: len(t)] += 0.35 * np.sin(2 * np.pi * 880 * t) * np.exp(-t / 0.03)
    return s


def hoof(acc):
    t = tt(0.09)
    s = np.sin(2 * np.pi * (520 if acc else 610) * t) * np.exp(-t / 0.018)
    s += 0.8 * bp_noise(0.09, 900, 2600) * env(0.09, 0.0005, 0.01)
    s += 0.6 * thud(160, 90, 0.09, 0.03)
    return s


def wing():
    d = 0.22
    t = tt(d)
    e = np.sin(np.pi * np.minimum(1, t / d)) ** 2
    return bp_noise(d, 500, 3000) * e


def whoosh_steps(t0):
    """Barrido a saltos (6 pasos en .42 s), como el cuadrado que se abre."""
    for k in range(6):
        lo = 300 + k * 450
        s = bp_noise(0.07, lo, lo * 2.2) * env(0.07, 0.002, 0.03)
        put(dry, t0 + k * 0.07, s, 0.22 + k * 0.03, pan=-0.5 + k * 0.2)
        put(wet, t0 + k * 0.07, s, 0.2)


def riser(t0, d):
    t = tt(d)
    n = bp_noise(d, 800, 7000)
    e = (t / d) ** 2.5
    put(dry, t0, n * e, 0.14)
    put(wet, t0, n * e, 0.2)


def rev(a):
    """Intento de arranque que se cala: tono de motor que sube y se muere."""
    d = 0.38
    t = tt(d)
    top = 70 + a * 1.9
    f = np.where(t < 0.2, 62 + (top - 62) * (t / 0.2) ** 0.7, top * np.exp(-(t - 0.2) / 0.08) + 40 * (1 - np.exp(-(t - 0.2) / 0.08)))
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(h * ph) / h for h in range(1, 13))  # diente de sierra de banda limitada
    s = lp(saw, 1400) * 0.6 * np.minimum(1, t / 0.02) * np.where(t < 0.2, 1, np.exp(-(t - 0.2) / 0.07))
    return s * (0.5 + a / 172)


def count_blip(k):
    t = tt(0.05)
    return np.sin(2 * np.pi * (700 + k * 90) * t) * np.exp(-t / 0.014)


# ── base musical ─────────────────────────────────────────────────────────────
D, F, G, A, Bb, C = 62, 65, 67, 69, 70, 72
CHORDS = [  # (raíz del bajo, notas del pad)
    (38, [50, 57, 62, 65, 69]),  # Dm(add9) → D2 · A3 D4 F4 A4
    (34, [46, 53, 58, 62, 65]),  # B♭
    (41, [53, 57, 60, 65, 69]),  # F
    (36, [48, 55, 60, 64, 67]),  # C
]


def chord_at(t):
    if t >= 35:
        return (38, [50, 57, 62, 64, 65, 69])
    return CHORDS[int(t // 4) % 4]


def pad():
    out = np.zeros((N, 2))
    seg = 4.0
    starts = [x * seg for x in range(int(35 // seg) + 1)] + [35.0]
    starts = sorted(set(s for s in starts if s <= 35))
    for i, s0 in enumerate(starts):
        s1 = starts[i + 1] if i + 1 < len(starts) else DUR
        d = s1 - s0 + 0.8
        t = tt(d)
        _, notes = chord_at(s0 + 0.01)
        e = np.minimum(1, t / 0.6) * np.clip((d - t) / 0.8, 0, 1)
        for j, m in enumerate(notes):
            f = hz(m)
            for side, det in ((0, -0.12), (1, 0.12)):
                w = sum(a * np.sin(2 * np.pi * f * h * (1 + det / 100) * t + j) for h, a in ((1, 1), (2, 0.28), (3, 0.1)))
                i0 = int(s0 * SR)
                n = min(len(w), N - i0)
                out[i0 : i0 + n, side] += (w * e)[:n] * 0.05
    # respiración lenta
    tt_all = np.arange(N) / SR
    out *= (0.85 + 0.15 * np.sin(2 * np.pi * tt_all / 8))[:, None]
    return out


def groove():
    """Pulso a 120 BPM: bombo en 1 y 3, golpe seco en 2 y 4, hi-hat en contratiempos, bajo."""
    sections = [(4.0, 9.0, "full"), (9.0, 13.0, "light"), (15.5, 35.0, "full")]
    k_s, rim_s = thud(120, 45, 0.4, 0.12), None
    for a, b, mode in sections:
        n_beats = int(round((b - a) / BEAT))
        for i in range(n_beats):
            t = a + i * BEAT
            if i % 2 == 0:
                put(dry, t, k_s, 0.55 if mode == "full" else 0.4)
            if mode == "full" and i % 2 == 1:
                rim = bp_noise(0.06, 1200, 5000) * env(0.06, 0.0005, 0.012)
                put(dry, t, rim, 0.16, pan=0.15)
                put(wet, t, rim, 0.1)
            if mode == "full":
                hat = bp_noise(0.03, 7000, 14000) * env(0.03, 0.0005, 0.008)
                put(dry, t + BEAT / 2, hat, 0.07, pan=0.35)
            # bajo: 1, «y» del 2 y 4 del compás (2 s)
            pos = i % 4
            if pos in (0, 3) or (mode == "full" and pos == 1 and i % 8 == 1):
                root, _ = chord_at(t + 0.01)
                d = 0.45
                tb = tt(d)
                f = hz(root + 12 if pos == 3 else root)
                bs = (np.sin(2 * np.pi * f * tb) + 0.25 * np.sin(4 * np.pi * f * tb)) * np.exp(-tb / 0.22) * np.minimum(1, tb / 0.005)
                put(dry, t + (BEAT / 2 if pos == 1 else 0), bs, 0.32)


# ── eventos de la imagen ─────────────────────────────────────────────────────
PENTA = [74, 77, 79, 81, 84, 86, 89]  # D5 F5 G5 A5 C6 D6 F6
PILLAR = [(69, 76), (72, 79), (74, 81)]  # quinta sobre A4, C5, D5
LEMA = [81, 84, 86]


def events():
    for e in EVENTS:
        t, k, v = e["t"], e["k"], e.get("v")
        if k == "tick":
            put(dry, t, tick(), 0.16, pan=rng.uniform(-0.35, 0.35))
        elif k == "pat":
            put(dry, t, marimba(86 + [0, 3, 5, 7, 10, 12, 15, 17][v // 3], 0.3), 0.035, pan=-0.6 + v / 20)
            put(wet, t, marimba(86, 0.3), 0.03)
        elif k == "letter":
            s = marimba(PENTA[v])
            put(dry, t, s, 0.3, pan=-0.4 + v * 0.16)
            put(wet, t, s, 0.25)
        elif k in ("stamp", "stamp2"):
            s = stamp()
            put(dry, t, s, 0.6 if k == "stamp" else 0.35)
            put(wet, t, s, 0.12)
        elif k == "pluck":
            if v == 0:  # trío de figuras: arpegio
                for j, m in enumerate((62, 69, 74)):
                    put(dry, t + j * 0.1, marimba(m), 0.3, pan=-0.3 + j * 0.3)
                    put(wet, t + j * 0.1, marimba(m), 0.25)
            else:
                for m in PILLAR[v - 1]:
                    put(dry, t, marimba(m, 1.2), 0.3)
                    put(wet, t, marimba(m, 1.2), 0.3)
        elif k == "lema":
            s = bell(LEMA[v], 1.8)
            put(dry, t, s, 0.12, pan=0.2)
            put(wet, t, s, 0.25)
        elif k == "pluckHi":
            s = bell(86, 2.5)
            put(dry, t, s, 0.14)
            put(wet, t, s, 0.3)
        elif k == "hoof":
            put(dry, t, hoof(v), 0.3 if v else 0.22, pan=-0.1)
            put(wet, t, hoof(v), 0.05)
        elif k == "blink":
            s = marimba(93, 0.25)
            put(dry, t, s, 0.07, pan=0.3)
        elif k == "wing":
            put(dry, t, wing(), 0.2, pan=0.25)
            put(wet, t, wing(), 0.1)
        elif k == "flip":
            riser(t - 0.7, 0.7)
            whoosh_steps(t)
            boom = thud(70, 32, 2.0, 0.6)
            put(dry, t, boom, 0.75)
            put(wet, t, boom, 0.15)
            s = bell(62, 3.0)
            put(wet, t + 0.42, s, 0.25)
        elif k == "hot":
            s = marimba([81, 84, 86][v], 1.0)
            put(dry, t, s, 0.25)
            put(wet, t, s, 0.25)
        elif k == "count":
            put(dry, t, count_blip(v), 0.16, pan=-0.2)
        elif k == "ring":
            t_ = tt(1.2)
            s = np.sin(2 * np.pi * 1320 * t_) * np.exp(-t_ / 0.4)
            put(wet, t, s, 0.07)
            put(dry, t, s, 0.03)
        elif k == "rev":
            s = rev(v)
            put(dry, t, s, 0.3, pan=-0.6 + (EVENTS.index(e) % 6) * 0.24)
            put(wet, t, s, 0.08)
        elif k == "chap":
            s = marimba([74, 77, 81, 79, 77][v], 0.6)
            put(dry, t, s, 0.18 if v < 2 else 0.1, pan=-0.4 + v * 0.2)
            put(wet, t, s, 0.12)
        elif k == "row":
            s = marimba([62, 65, 69, 74][v], 1.0)
            put(dry, t, s, 0.3)
            put(wet, t, s, 0.25)
            put(dry, t, thud(100, 50, 0.3, 0.1), 0.25)
        elif k == "end":
            # final: cierre del pulso, acorde de campanas y golpe grave
            put(dry, t, thud(80, 36, 2.5, 0.7), 0.7)
            for j, m in enumerate((50, 57, 62, 64, 69, 74)):
                s = bell(m, 4.4 - j * 0.1)
                put(dry, t + j * 0.04, s, 0.07, pan=-0.5 + j * 0.2)
                put(wet, t + j * 0.04, s, 0.18)


def reverb(x, seconds=2.2):
    n = int(SR * seconds)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (seconds / 6.9)) * np.minimum(1, t / 0.01)
        ir[: int(0.012 * SR)] = 0  # pre-delay
        y = np.fft.irfft(np.fft.rfft(x[:, ch], nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
        out[:, ch] = y
    return out / (np.abs(out).max() + 1e-9) * np.abs(x).max() * 1.2


def main():
    dry[:] += pad()
    groove()
    events()
    mix = dry + 0.45 * reverb(wet + 0.3 * dry)
    # fundido de entrada corto y de salida al final
    tt_all = np.arange(N) / SR
    mix *= np.clip(tt_all / 0.05, 0, 1)[:, None] * np.clip((DUR - tt_all) / 1.2, 0, 1)[:, None]
    mix = np.tanh(mix * 1.3) / np.tanh(1.3)
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
