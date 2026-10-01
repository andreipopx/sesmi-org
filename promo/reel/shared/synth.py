"""Sintetizador y mezcla compartidos de los reels (numpy).

Instrumentos (piano de fieltro, clave, cuerdas, campana, golpe grave, tap, lápiz), un bus de música con
envío a reverb, la voz grabada (script.json + out/vo/*.wav) con la música bajando bajo ella, y el
máster a out/audio.wav. Cada versión escribe su partitura en <versión>/audio.py.
"""
import json
import wave
from pathlib import Path

import numpy as np

SR = 48000
rng = np.random.default_rng(11)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(SR * d)) / SR


def band_noise(d, lo, hi):
    n = max(2, int(SR * d))
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)


def lp1(x, fc):
    """Paso bajo de un polo, por FFT (suave, sin bucles)."""
    n = len(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    return np.fft.irfft(np.fft.rfft(x) / np.sqrt(1 + (f / fc) ** 2), n)


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
        for det in (-0.9, 0.9):
            s += 0.5 * amp * np.sin(2 * np.pi * fn * (1 + det / 1731) * t + n) * np.exp(-t / dec)
    s *= np.minimum(1, t / 0.004)
    ham = band_noise(0.012, 200, 2500) * np.exp(-tt(0.012) / 0.003)
    s[: len(ham)] += 0.12 * vel * ham
    s *= np.clip((dur - t) / 0.25, 0, 1)
    return s * vel


def clave(m, vel=0.5, dur=1.6):
    """Clave (siglo XVIII): pulsado brillante, muchos armónicos, caída rápida, un punto de cuerda."""
    f, t = hz(m), tt(dur)
    s = np.zeros_like(t)
    for n in range(1, 18):
        fn = n * f
        if fn > 11000:
            break
        amp = (1 / n**0.85) * (0.6 + 0.4 * np.cos(n * 1.7))  # punto de pulsado
        s += amp * np.sin(2 * np.pi * fn * t + n * 0.3) * np.exp(-t / (0.9 / (1 + 0.18 * n)))
    pluck = band_noise(0.008, 1500, 7000) * np.exp(-tt(0.008) / 0.002)
    s[: len(pluck)] += 0.25 * pluck
    s *= np.minimum(1, t / 0.0015) * np.clip((dur - t) / 0.08, 0, 1)
    return 0.32 * s * vel


def strings(notes, d, att=1.6, rel=1.4, bright=6):
    """Pad de cuerdas: sierras suaves, desafinadas, con vibrato lento. Devuelve (n, 2)."""
    t = tt(d)
    env = np.minimum(1, t / att) ** 2 * np.clip((d - t) / rel, 0, 1)
    out = np.zeros((len(t), 2))
    for j, m in enumerate(notes):
        f = hz(m)
        for ch, det in ((0, -3.5), (1, 3.5)):
            vib = 1 + 0.0025 * np.sin(2 * np.pi * (4.6 + j * 0.3) * t + j)
            ph = 2 * np.pi * np.cumsum(f * (1 + det / 1731) * vib) / SR
            out[:, ch] += sum(np.sin(h * ph) / h**1.6 for h in range(1, bright + 1)) * env
    return out / max(1, len(notes))


def bell(m, d=2.5):
    t, f = tt(d), hz(m)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dd) for r, a, dd in [(1, 1, 1.0), (2.76, 0.3, 0.45), (5.4, 0.08, 0.18), (2, 0.18, 0.8)])
    return s * np.minimum(1, t / 0.003)


def thud(f0=90, f1=42, d=0.6, dec=0.2):
    t = tt(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / 0.05)) / SR
    return np.sin(ph) * np.exp(-t / dec) * np.minimum(1, t / 0.003)


def tap(f=520):
    t = tt(0.06)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.012)
    s += 0.5 * band_noise(0.06, 400, 1800) * np.exp(-t / 0.006)
    return s


def whoosh(d=0.22, lo=500, hi=2800):
    x = tt(d)
    return band_noise(d, lo, hi) * np.sin(np.pi * x / d) ** 2


class Mix:
    def __init__(self, here, duration):
        self.here = Path(here)
        self.dur = duration
        self.n = int(SR * (duration + 0.05))
        self.mus = np.zeros((self.n, 2))
        self.wet = np.zeros((self.n, 2))
        self.vo = np.zeros((self.n, 2))
        self.vo_env = np.zeros(self.n)
        self.events = json.loads((self.here / "out/events.json").read_text())

    # ── colocar sonidos
    def put(self, buf, t0, sig, gain=1.0, pan=0.0):
        i = int(round(t0 * SR))
        if i >= self.n or i + len(sig) <= 0:
            return
        s = sig
        if i < 0:
            s, i = s[-i:], 0
        s = s[: self.n - i]
        if s.ndim == 2:
            buf[i : i + len(s)] += s * gain
            return
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        buf[i : i + len(s), 0] += s * gain * l * 1.414
        buf[i : i + len(s), 1] += s * gain * r * 1.414

    def both(self, t0, sig, g_dry, g_wet, pan=0.0):
        self.put(self.mus, t0, sig, g_dry, pan)
        self.put(self.wet, t0, sig, g_wet, pan)

    # ── partitura: acordes con pad, bajo de piano y arpegio
    def sections(self, secs, inst=piano, loud=lambda a: 0.7, pat=(0, 1, 2, 3, 4, 3, 2, 1), eighth=60 / 72 / 2, pan_arp=True, bass=True):
        k8 = 0
        for a, b, root, ch, arp in secs:
            d = b - a
            st = strings([root + 12] + ch, d + 1.2, att=min(1.6, d * 0.6), rel=1.2)
            g = 0.05 * loud(a)
            self.put(self.mus, a, st * np.array([1.0, 1.0]), g)
            self.put(self.wet, a, st.mean(axis=1), g * 0.8)
            if bass:
                self.both(a, inst(root, 0.42), 0.55, 0.25)
            if arp:
                tones = [root + 12] + ch + [ch[0] + 12]
                step = eighth * (2 if arp == "q" else 1)
                for i in range(int(round(d / step))):
                    m = tones[pat[k8 % len(pat)]]
                    k8 += 1
                    vel = 0.26 + (0.06 if i % 2 == 0 else 0) + 0.06 * (loud(a) - 0.7)
                    self.both(a + i * step, inst(m, vel), 0.5, 0.35, pan=(-0.35 + 0.1 * (k8 % 8)) if pan_arp else 0)

    def pencil(self, t0, t1, g=(0.028, 0.045)):
        t = t0
        while t < t1:
            d = rng.uniform(0.1, 0.35)
            x = tt(d)
            e = np.sin(np.pi * x / d) ** 0.7 * (0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(6, 14) * x) ** 2)
            self.put(self.mus, t, band_noise(d, 1800, 7500) * e, rng.uniform(*g), pan=rng.uniform(-0.4, 0.4))
            t += d + rng.uniform(0.0, 0.08)

    # ── eventos comunes a todas las versiones (figuras, cara de tinta, firma)
    def common(self, e):
        t, k, v = e["t"], e["k"], e.get("v")
        if k == "fig":
            self.both(t, bell([81, 83, 86][v], 3.0), 0.1, 0.25)
        elif k == "owl":
            self.both(t, piano(93, 0.15, 0.6), 0.25, 0.2, pan=0.3)
        elif k == "hoof":
            self.put(self.mus, t, tap() * (1.2 if v else 1), 0.07, pan=-0.15)
        elif k == "wing":
            self.both(t, whoosh(), 0.07, 0.05, pan=0.2)
        elif k == "flip":
            d = 0.9
            x = tt(d)
            self.both(t - d, band_noise(d, 900, 7000) * (x / d) ** 2.5, 0.12, 0.2)
            for j in range(6):
                lo = 300 + j * 420
                self.both(t + j * 0.07, band_noise(0.07, lo, lo * 2.2) * np.exp(-tt(0.07) / 0.03), 0.14, 0.12, pan=-0.5 + j * 0.2)
            self.both(t, thud(70, 32, 2.5, 0.8), 0.35, 0.1)
        elif k == "shrink":
            self.both(t, piano(90 - v * 2, 0.18, 0.5), 0.35, 0.2)
        elif k == "land":
            self.both(t, thud(95, 45, 0.6, 0.18), 0.3, 0.08)
            for j, m in enumerate((38, 50, 57, 62, 64, 66, 69, 74)):
                self.both(t + j * 0.035, piano(m, 0.32 if j < 3 else 0.25, 6.0), 0.4, 0.35, pan=-0.4 + j * 0.1)
            self.both(t + 0.3, bell(86, 4.0), 0.06, 0.2)
        elif k == "letter":
            self.both(t, piano([74, 76, 78, 81, 86][v], 0.22, 1.2), 0.35, 0.3)
        elif k in ("sign2", "url"):
            self.both(t, bell(81 if k == "sign2" else 86, 3.0), 0.05, 0.15)
        else:
            return False
        return True

    # ── voz
    def voice(self, gain=1.0, gains=None, pans=None, rev=0.08):
        script = json.loads((self.here / "script.json").read_text())
        for ln in script["lines"]:
            with wave.open(str(self.here / f"out/vo/{ln['id']}.wav")) as w:
                x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768
            x = x / (np.sqrt(np.mean(x**2)) + 1e-9) * 0.1  # todas las tomas al mismo nivel (RMS)
            g = gain * (gains or {}).get(ln["who"], 1.0) * ln.get("gain", 1.0)
            p = ln.get("pan", (pans or {}).get(ln["who"], 0.0))
            self.put(self.vo, ln["t"], x, g, pan=p)
            self.put(self.wet, ln["t"], x, g * rev, pan=p)
            i0, i1 = int(ln["t"] * SR), int((ln["t"] + len(x) / SR) * SR)
            self.vo_env[max(0, i0) : min(self.n, i1)] = 1

    # ── máster
    def reverb(self, x, seconds=3.2):
        n = int(SR * seconds)
        t = np.arange(n) / SR
        out = np.zeros_like(x)
        nfft = 1 << (len(x) + n - 1).bit_length()
        f = np.fft.rfftfreq(n, 1 / SR)
        for ch in range(2):
            ir = rng.standard_normal(n) * np.exp(-t / (seconds / 6.9)) * np.minimum(1, t / 0.02)
            ir[: int(0.02 * SR)] = 0
            ir = np.fft.irfft(np.fft.rfft(ir) / (1 + (f / 4500) ** 2), n)  # cola oscura
            out[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch], nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
        return out / (np.abs(out).max() + 1e-9) * (np.abs(x).max() + 1e-9) * 1.1

    def room(self, level=0.006):
        w = rng.standard_normal((self.n, 2))
        spec = np.fft.rfft(w, axis=0)
        f = np.fft.rfftfreq(self.n, 1 / SR)
        spec /= np.sqrt(np.maximum(f, 20))[:, None]
        spec[f > 6000] *= 0.2
        x = np.fft.irfft(spec, self.n, axis=0)
        return x / np.abs(x).max() * level

    def master(self, duck=0.5, vo_level=1.0, fade_out=2.5, mute=()):
        # la música baja bajo la voz (envolvente suavizada ~0,25 s)
        k = int(0.25 * SR)
        c = np.concatenate([[0.0], np.cumsum(self.vo_env)])  # media móvil por suma acumulada (instantánea)
        lo = np.clip(np.arange(self.n) - k // 2, 0, self.n)
        hi = np.clip(np.arange(self.n) + k - k // 2, 0, self.n)
        env = (c[hi] - c[lo]) / k
        music = self.mus + 0.55 * self.reverb(self.wet + 0.25 * self.mus)
        music *= (1 - duck * env)[:, None]
        tm = np.arange(self.n) / SR
        for a, b in mute:  # silencios: la música se corta en seco y vuelve con un fundido
            g = np.where((tm >= a) & (tm < b), 0.0, 1.0)
            g = np.minimum(g, np.clip((tm - b) / 0.8, 0, 1) + (tm < a))
            music *= g[:, None]
        mix = music + vo_level * self.vo + self.room()
        t = np.arange(self.n) / SR
        mix *= np.clip(t / 0.1, 0, 1)[:, None] * np.clip((self.dur - t) / fade_out, 0, 1)[:, None]
        mix = np.tanh(mix * 1.2) / np.tanh(1.2)
        mix *= 0.89 / np.abs(mix).max()
        with wave.open(str(self.here / "out/audio.wav"), "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix * 32767).astype("<i2").tobytes())
        print(f"{self.here.name}/out/audio.wav · {self.dur:.1f} s · {len(self.events)} eventos")
