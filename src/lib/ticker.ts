/**
 * Reloj a pocos fps sincronizado con el refresco de pantalla (requestAnimationFrame).
 * Con fps que dividen a 60 (5, 6, 10, 12, 15…) cada paso dura exactamente los mismos refrescos,
 * así todos los fotogramas duran lo mismo y el ritmo no cojea (con setInterval a 7 fps no pasa).
 */
export function ticker(fps: number, onStep: () => void) {
  const period = 1000 / fps;
  let raf = 0, alive = false, t0 = 0, last = -1;
  const loop = (now: number) => {
    if (!alive) return;
    if (!t0) t0 = now;
    const n = Math.floor((now - t0 + 2) / period); // 2 ms de margen contra el temblor del vsync
    if (n !== last) { last = n; onStep(); if (!alive) return; }
    raf = requestAnimationFrame(loop);
  };
  return {
    start() { if (alive) return; alive = true; t0 = 0; last = -1; raf = requestAnimationFrame(loop); },
    stop() { alive = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    get running() { return alive; },
  };
}
