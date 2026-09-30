#!/usr/bin/env bash
# Genera sesmi-reel.mp4 (1080×1920, 30 fps, H.264 + AAC, −14 LUFS) desde cero.
# Requisitos: node + playwright (con Chromium), python3 + numpy, ffmpeg.
set -euo pipefail
cd "$(dirname "$0")"
node render.mjs          # → out/video.mp4 + out/events.json
python3 audio.py         # → out/audio.wav
ffmpeg -y -loglevel error -i out/video.mp4 -i out/audio.wav \
  -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -shortest sesmi-reel.mp4
echo "→ promo/reel/sesmi-reel.mp4"
