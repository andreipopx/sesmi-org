"""Versión B · «Preguntas»: noche en re menor (cuerdas graves, piano suelto), murmullo de vecinos,
silencio seco, «¿Y si nos quedamos?» sola, y amanecer en re mayor con la narradora."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "shared"))
import numpy as np  # noqa: E402
from synth import SR, Mix, band_noise, bell, piano, strings, tap, tt  # noqa: E402

TL = json.loads((HERE / "timeline.json").read_text())
SCRIPT = json.loads((HERE / "script.json").read_text())
L = {l["id"]: l["t"] for l in SCRIPT["lines"]}
m = Mix(HERE, TL["duration"])

Dm, Bb, Gm, A7 = [62, 65, 69], [58, 62, 65], [58, 62, 67], [61, 64, 67]
D, Bm, G, A = [62, 66, 69], [59, 62, 66], [59, 62, 67], [61, 64, 69]
DAWN = L["n1"]
m.sections([
    (0.2, 4.4, 38, Dm, None), (4.4, 8.4, 34, Bb, "q"), (8.4, 12.4, 43, Gm, "q"), (12.4, 16.3, 45, A7, "q"),
    (16.3, 18.4, 45, [61, 64, 67, 70], "e"),                     # murmullo: todo se acelera
], loud=lambda a: 0.75 if a >= 16 else 0.5)
m.sections([
    (DAWN, DAWN + 2.6, 38, D, "q"), (DAWN + 2.6, L["n2"], 35, Bm, "e"),
    (L["n2"], L["n2"] + 2.0, 43, G, "e"), (L["n2"] + 2.0, L["n2"] + 4.0, 45, A, "e"), (L["n2"] + 4.0, L["n3"] - .5, 38, D, "e"),
    (L["n3"] + .05, L["n3"] + 2.5, 38, [57, 62, 66, 69], None),
    (L["n3"] + 2.92, TL["duration"], 38, [62, 64, 66, 69], None),
], loud=lambda a: 0.85)

# noche: grillos muy lejos (pulsos de ruido agudo, en grupos)
t = 0.4
while t < 18.3:
    for j in range(3):
        x = tt(0.018)
        m.put(m.mus, t + j * 0.045, band_noise(0.018, 4200, 5200) * np.sin(np.pi * x / 0.018), 0.012, pan=0.6 if int(t) % 2 else -0.5)
    t += 0.55 + (t * 3.7) % 0.5

for e in m.events:
    t, k, v = e["t"], e["k"], e.get("v")
    if m.common(e):
        continue
    if k == "draw0":
        m.pencil(t + 0.1, t + 2.2, g=(0.02, 0.032))
    elif k == "light":  # la ventana se enciende: interruptor + nota
        m.put(m.mus, t - 0.05, tap(1400), 0.05, pan=0.2)
        m.both(t, piano([74, 77, 81, 79, 76, 74, 72, 77][int(t) % 8], 0.2, 2.5), 0.4, 0.45)
    elif k == "lightq":
        m.put(m.mus, t, tap(1300 + v * 20), 0.03, pan=((v * 0.37) % 1.4) - 0.7)
    elif k == "lone":
        m.both(t, piano(74, 0.25, 4.0), 0.4, 0.6)
    elif k == "dawn":
        for j, n in enumerate((50, 57, 62, 66, 69)):
            m.both(t + j * 0.06, piano(n, 0.3, 5.0), 0.4, 0.45)
        st = strings([62, 66, 69, 74], 4.0, att=1.5, rel=2.0)
        m.put(m.mus, t, st, 0.06)
    elif k == "chart":
        for j in range(8):
            m.both(t + j * 0.13, piano(74 + [0, 2, 4, 7, 9, 12, 14, 16][j], 0.16, 1.2), 0.3, 0.3)
    elif k == "open":
        m.both(t, bell(81, 2.5), 0.07, 0.2)
    elif k == "people":
        for j in range(10):
            m.put(m.mus, t + j * 0.07 + 0.2, tap(), 0.03, pan=-0.6 + j * 0.13)

m.voice(pans={"abuelo": -0.3, "chica": 0.3, "madre": -0.2, "tendero": 0.25, "vecina": -0.35, "joven": 0.35, "abuela": -0.1})
# murmullo: las preguntas otra vez, bajitas y encima unas de otras
qs = [l for l in SCRIPT["lines"] if l["id"].startswith("p") and l["id"] != "p9"]
import wave  # noqa: E402
for j, l in enumerate(qs * 2):
    with wave.open(str(HERE / f"out/vo/{l['id']}.wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768
    x = x / (np.sqrt(np.mean(x**2)) + 1e-9) * 0.1
    t0 = 16.3 + j * 0.13
    x = x[: int((18.4 - t0) * SR)] if t0 < 18.4 else x[:0]
    if len(x):
        m.put(m.vo, t0, x, 0.16 + 0.02 * (j % 3), pan=((j * 0.61) % 1.6) - 0.8)
        m.put(m.wet, t0, x, 0.05)
m.master(duck=0.4, mute=[(18.4, DAWN - 0.05)])
