#!/usr/bin/env bash
# Genera promo/reel/sesmi-<versión>.mp4 (1080×1920, 30 fps, H.264 + AAC, −14 LUFS) desde cero.
#   ./promo/reel/shared/build.sh sociedad | preguntas | 250 | vuelta
# Requisitos: node + playwright (con Chromium), python3 + numpy, ffmpeg.
# Las versiones con voz (script.json) necesitan ELEVENLABS_API_KEY; la voz se cachea en <versión>/out/vo/.
set -euo pipefail
cd "$(dirname "$0")/.."
V="${1:?uso: build.sh <versión>}"
[ -f "$V/script.json" ] && python3 shared/vo.py "$V"    # → $V/out/vo/*.mp3 + out/vo.json
node shared/render.mjs "$V"                              # → $V/out/video.mp4 + out/events.json
python3 "$V/audio.py"                                    # → $V/out/audio.wav
I=$(ffmpeg -hide_banner -nostats -i "$V/out/audio.wav" -af ebur128 -f null - 2>&1 | awk '/Integrated/{f=1} f&&/I:/{print $2; exit}')
G=$(python3 -c "print(round(-14 - ($I), 2))")
ffmpeg -y -loglevel error -i "$V/out/video.mp4" -i "$V/out/audio.wav" \
  -map 0:v -map 1:a -c:v copy -af "volume=${G}dB,alimiter=limit=0.89:level=false" \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "sesmi-$V.mp4"
echo "→ promo/reel/sesmi-$V.mp4 (audio ${I} LUFS → −14, ${G} dB)"
