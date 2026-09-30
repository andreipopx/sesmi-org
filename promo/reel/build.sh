#!/usr/bin/env bash
# Genera sesmi-reel.mp4 (1080×1920, 30 fps, H.264 + AAC, −14 LUFS) desde cero.
# Requisitos: node + playwright (con Chromium), python3 + numpy, ffmpeg.
set -euo pipefail
cd "$(dirname "$0")"
node render.mjs          # → out/video.mp4 + out/events.json
python3 audio.py         # → out/audio.wav
# ganancia fija hasta −14 LUFS integrados (el pico ya queda por debajo de −1 dBFS)
I=$(ffmpeg -hide_banner -nostats -i out/audio.wav -af ebur128 -f null - 2>&1 | awk '/Integrated/{f=1} f&&/I:/{print $2; exit}')
G=$(python3 -c "print(round(-14 - ($I), 2))")
ffmpeg -y -loglevel error -i out/video.mp4 -i out/audio.wav \
  -map 0:v -map 1:a -c:v copy -af "volume=${G}dB,alimiter=limit=0.89:level=false" \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest sesmi-reel.mp4
echo "→ promo/reel/sesmi-reel.mp4 (audio ${I} LUFS → −14, ${G} dB)"
