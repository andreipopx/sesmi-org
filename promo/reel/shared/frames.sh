#!/usr/bin/env bash
# Extrae los fotogramas de assets/video/*.mp4 a assets/video/.frames/<slug>/NNNN.jpg (30 fps, 1080 de alto)
# y escribe assets/video/.frames/clips.json ({slug: {n, fps}}), que render.mjs inyecta como window.CLIPS.
set -euo pipefail
cd "$(dirname "$0")/../assets/video"
mkdir -p .frames
for v in *.mp4; do
  s="${v%.mp4}"
  [ -d ".frames/$s" ] && [ ".frames/$s" -nt "$v" ] && continue
  rm -rf ".frames/$s"; mkdir -p ".frames/$s"
  ffmpeg -loglevel error -i "$v" -vf "fps=30,scale=-2:'min(1080,ih)'" -q:v 3 ".frames/$s/%04d.jpg"
done
python3 - <<'PY'
import json, os
d = {s: {"n": len([f for f in os.listdir(f".frames/{s}") if f.endswith(".jpg")]), "fps": 30}
     for s in sorted(os.listdir(".frames")) if os.path.isdir(f".frames/{s}")}
json.dump(d, open(".frames/clips.json", "w"), indent=1)
print(f"{len(d)} clips")
PY
