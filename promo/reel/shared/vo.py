"""Graba la voz de una versión con ElevenLabs: una toma por frase de <versión>/script.json.

  ELEVENLABS_API_KEY=… python3 shared/vo.py <versión>

Escribe <versión>/out/vo/<id>.wav (48 kHz, mono, recortada al habla) y out/vo.json con la duración de
cada frase y el tiempo de cada palabra (para los subtítulos palabra a palabra). Cada toma se transcribe
con el reconocimiento de voz de ElevenLabs y se repite (hasta 3 veces) si no dice exactamente el guion.
Cachea por voz + texto + ajustes: solo vuelve a pedir las frases que cambian.
"""
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V = ROOT / sys.argv[1]
SCRIPT = json.loads((V / "script.json").read_text())
VOICES = json.loads((ROOT / "shared/voices.json").read_text())
OUT = V / "out/vo"
OUT.mkdir(parents=True, exist_ok=True)
KEY = os.environ.get("ELEVENLABS_API_KEY")
API = "https://api.elevenlabs.io/v1"
MODEL = SCRIPT.get("model", "eleven_multilingual_v2")
SETTINGS = {  # narradora: serena y estable; vecinos: más expresivos
    "narradora": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True},
    "*": {"stability": 0.38, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
}
NUM = {"2.500": "dos mil quinientos", "2500": "dos mil quinientos", "250": "doscientos cincuenta", "1953": "mil novecientos cincuenta y tres",
       "1878": "mil ochocientos setenta y ocho", "1775": "mil setecientos setenta y cinco", "750": "setecientos cincuenta"}


def post(url, body=None, files=None):
    if files:
        b = uuid.uuid4().hex
        parts = []
        for k, v in files.items():
            if isinstance(v, tuple):
                parts.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{v[0]}"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + v[1] + b"\r\n")
            else:
                parts.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
        data, ctype = b"".join(parts) + f"--{b}--\r\n".encode(), f"multipart/form-data; boundary={b}"
    else:
        data, ctype = json.dumps(body).encode(), "application/json"
    req = urllib.request.Request(url, data=data, headers={"xi-api-key": KEY, "Content-Type": ctype})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read())


def norm(s):
    s = s.lower()
    for a, b in NUM.items():
        s = s.replace(a, b)
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return " ".join(re.sub(r"[^\w\s]", " ", s).split())


def words_from(al):
    """Agrupa la alineación por caracteres en palabras: [[palabra, inicio, fin], …]."""
    out, cur, t0, t1 = [], "", None, None
    for ch, a, b in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                out.append([cur, t0, t1])
            cur, t0 = "", None
            continue
        if t0 is None:
            t0 = a
        cur, t1 = cur + ch, b
    if cur:
        out.append([cur, t0, t1])
    return out


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]))


def take(ln, prev, nxt):
    who = ln["who"]
    body = {"text": ln["text"], "model_id": MODEL, "voice_settings": SETTINGS.get(who, SETTINGS["*"])}
    if prev:
        body["previous_text"] = prev
    if nxt:
        body["next_text"] = nxt
    r = post(f"{API}/text-to-speech/{VOICES[who]}/with-timestamps?output_format=mp3_44100_192", body)
    mp3 = OUT / f"{ln['id']}.mp3"
    mp3.write_bytes(base64.b64decode(r["audio_base64"]))
    words = words_from(r["alignment"])
    a = max(0.0, words[0][1] - 0.04)          # el habla empieza aquí
    b = min(dur(mp3), words[-1][2] + 0.35)   # y deja respirar el final
    wav = OUT / f"{ln['id']}.wav"
    subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(mp3),
                           "-af", "afade=t=in:d=0.02,areverse,afade=t=in:d=0.12,areverse", "-ar", "48000", "-ac", "1", str(wav)])
    words = [[w, round(x - a, 3), round(y - a, 3)] for w, x, y in words]
    heard = post(f"{API}/speech-to-text", files={"model_id": "scribe_v1", "language_code": "spa", "file": ("t.wav", wav.read_bytes())})["text"]
    return wav, words, heard


def main():
    lines = SCRIPT["lines"]
    meta = {}
    old = json.loads((V / "out/vo.json").read_text()) if (V / "out/vo.json").exists() else {}
    for ln in lines:
        same = [x for x in lines if x["who"] == ln["who"]]  # contexto: frases vecinas de la misma voz
        j = same.index(ln)
        prev = same[j - 1]["text"] if j > 0 else None
        nxt = same[j + 1]["text"] if j + 1 < len(same) else None
        h = hashlib.sha1(json.dumps([VOICES[ln["who"]], ln["text"], MODEL, SETTINGS.get(ln["who"], SETTINGS["*"]), prev, nxt, 2]).encode()).hexdigest()[:12]
        wav, mark = OUT / f"{ln['id']}.wav", OUT / f"{ln['id']}.hash"
        if wav.exists() and mark.exists() and mark.read_text() == h and ln["id"] in old and "words" in old[ln["id"]]:
            meta[ln["id"]] = old[ln["id"]]
            continue
        if not KEY:
            sys.exit("falta ELEVENLABS_API_KEY (y la voz no está en caché)")
        for attempt in range(1, 4):
            wav, words, heard = take(ln, prev, nxt)
            ok = norm(heard) == norm(ln["text"])
            print(f"  {'✓' if ok else '✗'} {ln['id']:>4} {ln['who']:<9} «{heard}»" + ("" if ok else f"  (toma {attempt})"))
            if ok:
                break
        mark.write_text(h)
        meta[ln["id"]] = {"dur": round(dur(wav), 3), "who": ln["who"], "words": words, "heard": heard}
    (V / "out/vo.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False))
    print(f"{sys.argv[1]}/out/vo.json · {len(meta)} frases")


if __name__ == "__main__":
    main()
