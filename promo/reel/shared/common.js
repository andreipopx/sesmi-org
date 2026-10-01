// Piezas compartidas de los reels: tiempo, figuras de marca, trazo a mano, la ciudad, subtítulos
// sincronizados con la voz, la cara de tinta («debemos saber.») y la firma final.
// Todo es función del tiempo t: cada versión llama a sus update(t) desde window.renderAt(t).
(() => {
const B = window.BRAND;
const NS = "http://www.w3.org/2000/svg";
const S = (window.S = {});
S.$ = (id) => document.getElementById(id);
S.EVENTS = [];
S.ev = (t, k, v) => S.EVENTS.push({ t: Math.round(t * 1000) / 1000, k, v });
S.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
S.eOut = (x) => 1 - Math.pow(1 - S.clamp(x), 3);
S.eIO = (x) => { x = S.clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
S.stepN = (t, t0, fps) => Math.floor((t - t0) * fps + 1e-6);
S.el = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (parent || S.$("stage")).appendChild(e); return e; };
/** Visible con fundido entre a y b (entrada fi, salida fo). */
S.fade = (t, a, b, fi = .6, fo = .6) => S.eOut((t - a) / fi) * (1 - S.eIO((t - (b - fo)) / fo));

// ── voz: script.json (cuándo empieza cada frase) + out/vo.json (duración y palabras)
S.line = (id) => {
  const l = (window.SCRIPT?.lines || []).find((x) => x.id === id), v = window.VO?.[id];
  if (!l || !v) throw new Error(`frase sin grabar o sin tiempo: ${id}`);
  return { ...l, ...v, end: l.t + v.dur };
};
/** Momento (absoluto) en que se dice la palabra n.º i de la frase id. */
S.wordAt = (id, i) => { const L = S.line(id); return L.t + L.words[Math.min(i, L.words.length - 1)][1]; };

// ── subtítulo palabra a palabra (las palabras aparecen cuando se dicen)
S.sub = (id, opts = {}) => {
  const L = S.line(id);
  const host = S.el("div", "sub " + (opts.cls || ""), opts.parent);
  if (opts.style) host.style.cssText = opts.style;
  const hot = opts.hot || [];
  const ws = L.words.map(([w], i) => S.el("span", "w" + (hot.includes(i) ? " hot" : ""), host, w));
  ws.forEach((w, i) => i < ws.length - 1 && host.insertBefore(document.createTextNode(" "), w.nextSibling));
  const out = opts.out ?? L.end + .7;
  return (t) => {
    const vis = t >= L.t - .05 && t < out + .05;
    host.style.display = vis ? "block" : "none";
    if (!vis) return;
    host.style.opacity = 1 - S.eIO((t - (out - .5)) / .5);
    ws.forEach((w, i) => { const x = S.eOut((t - L.t - L.words[i][1] + .04) / .28); w.style.opacity = x; w.style.transform = `translateY(${(1 - x) * 6}px)`; });
  };
};

// ── figuras (copia de SEQ en src/brand/index.ts)
S.SEQ = {
  buho: { fps: 5, origin: [50, 85], frames: (v) => B.frames.buho[v],
    steps: [["s1", 0, 0], ["s2", .5, 0], ["blink1", .8, 0], ["blink2", .8, 0], ["s3", .5, 0], ["s4", 0, 0], ["s1", -.5, 0], ["s2", -.8, 0], ["s3", -.5, 0], ["s4", 0, 0]] },
  caballo: { fps: 6, origin: [50, 50], frames: () => B.frames.caballo.run,
    steps: [["g1", 0, -.5], ["g2", .5, 0], ["g3", -.5, -1.5], ["g4", -1.5, -.5], ["g5", 1, 0], ["g6", .5, -.25]] },
  paloma: { fps: 6, origin: [50, 50], frames: () => B.frames.paloma.flap,
    steps: [["f1", 0, 1], ["f2", 0, -.5], ["f3", 0, -1.5], ["f4", 0, -2], ["f5", 0, -1.5], ["f6", 0, -.5]] },
};
S.NAMES = ["buho", "caballo", "paloma"];
S.fig = (host, name, variant = "mayor") => {
  host.innerHTML = `<svg viewBox="0 0 100 100" style="display:block;width:100%;height:100%"><g><path fill="currentColor"/></g></svg>`;
  const g = host.querySelector("g"), p = host.querySelector("path");
  const Q = S.SEQ[name], F = Q.frames(variant), rest = B.figs[name][variant];
  return (t, t0) => {
    if (t0 == null || t < t0) { p.setAttribute("d", rest); g.removeAttribute("transform"); return; }
    const [f, r, y] = Q.steps[S.stepN(t, t0, Q.fps) % Q.steps.length];
    p.setAttribute("d", F[f]);
    g.setAttribute("transform", `translate(0 ${y}) rotate(${r} ${Q.origin[0]} ${Q.origin[1]})`);
  };
};
/** Sonidos propios de cada figura mientras se anima (casco, parpadeo, ala). */
S.figEvents = (name, t0, t1) => {
  const Q = S.SEQ[name];
  for (let k = 0, t = t0; t < t1 - 1e-6; k++, t = t0 + k / Q.fps) {
    const f = Q.steps[k % Q.steps.length][0];
    if (name === "caballo" && ["g1", "g2", "g4"].includes(f)) S.ev(t, "hoof", f === "g4" ? 1 : 0);
    if (name === "buho" && f === "blink1") S.ev(t, "owl");
    if (name === "paloma" && f === "f2") S.ev(t, "wing");
  }
};

// ── trazo a mano: ondas largas y suaves
const wob = (x, y) => [x + Math.sin(y * .11 + x * .03) * .55, y + Math.sin(x * .09 + 1.3) * .6 + Math.sin(x * .23 + y * .05) * .3];
S.hand = (pts) => {
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    if (i === 0) { const [a, b] = wob(x0, y0); d += `M${a.toFixed(2)} ${b.toFixed(2)}`; continue; }
    const [px, py] = pts[i - 1], n = Math.max(1, Math.ceil(Math.hypot(x0 - px, y0 - py) / 5));
    for (let k = 1; k <= n; k++) { const [a, b] = wob(px + (x0 - px) * k / n, py + (y0 - py) * k / n); d += `L${a.toFixed(2)} ${b.toFixed(2)}`; }
  }
  return d;
};
S.box = (x, y, w, h) => S.hand([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]);

/**
 * Una ciudad media, de perfil (coordenadas: suelo en y = G, x de 0 a 540).
 * era 'hoy': torre, manzanas, cúpula, bloque, fábrica y chimenea. era '1775': sin bloque ni fábrica,
 * más tejados, y el puente. Devuelve trazados y una lista de ventanas [x, y, w, h].
 */
S.city = (G = 470, era = "hoy") => {
  const P = [], L = (x, dy) => P.push([x, G - dy]);
  L(-10, 0); L(160, 0);
  L(160, 26); L(171, 38); L(182, 26); L(182, 32); L(194, 44); L(206, 32); L(206, 28); L(214, 28);
  L(214, 118); L(218, 118); L(218, 130); L(229, 150); L(240, 130); L(240, 118); L(244, 118); L(244, 60);
  L(262, 60); L(262, 78); L(300, 78); L(300, 66); L(326, 66); L(326, 52); L(334, 52); L(334, 62); L(340, 62);
  const DC = 362, DR = 22, DY = 62;
  for (let a = Math.PI; a > Math.PI / 2 + .14; a -= .12) P.push([DC + DR * Math.cos(a), G - DY - DR * Math.sin(a)]);
  L(358, DY + DR - .5); L(358, DY + DR + 9); L(362, DY + DR + 16); L(366, DY + DR + 9); L(366, DY + DR - .5);
  for (let a = Math.PI / 2 - .14; a >= 0; a -= .12) P.push([DC + DR * Math.cos(a), G - DY - DR * Math.sin(a)]);
  L(384, 62); L(392, 62);
  if (era === "hoy") {
    L(392, 118); L(440, 118); L(440, 50);
    L(446, 50); L(456, 64); L(456, 50); L(466, 64); L(466, 50); L(476, 64); L(476, 50); L(480, 50); L(480, 172); L(488, 172); L(488, 50); L(494, 50);
    L(494, 30); L(502, 38); L(510, 30); L(522, 30); L(522, 0); L(560, 0);
  } else {
    L(392, 34); L(404, 46); L(416, 34); L(416, 40); L(430, 54); L(444, 40); L(444, 30); L(458, 42); L(472, 30); L(472, 36); L(486, 48); L(500, 36);
    L(500, 26); L(510, 34); L(520, 26); L(520, 0); L(560, 0);
  }
  let BR = "";
  for (let i = 0; i < 5; i++) {
    const x0 = 24 + i * 27, x1 = x0 + 27, cx = (x0 + x1) / 2, r = 11.5, pts = [[x0, G + 34]];
    for (let a = Math.PI; a >= 0; a -= .2) pts.push([cx + r * Math.cos(a), G + 34 - 22 * Math.sin(a)]);
    pts.push([x1, G + 34]); BR += S.hand(pts);
  }
  let WAT = "";
  for (let r = 0; r < 4; r++) for (let x = 6 + (r % 2) * 14; x < 170 - r * 12; x += 30) WAT += S.hand([[x, G + 44 + r * 7], [x + 14, G + 44 + r * 7]]);
  const win = [[225, G - 108, 7, 12], [272, G - 66, 6, 8], [286, G - 66, 6, 8], [306, G - 56, 6, 8], [168, G - 20, 5, 7], [192, G - 26, 5, 7]];
  if (era === "hoy") for (let c = 0; c < 3; c++) for (let r = 0; r < 4; r++) win.push([400 + c * 14, G - 106 + r * 20, 5, 7]);
  else win.push([400, G - 26, 5, 7], [426, G - 34, 5, 7], [454, G - 24, 5, 7], [482, G - 30, 5, 7], [508, G - 18, 5, 7]);
  // sombreado de grabado (solo 1775): rayas finas en tejados y torre
  let HATCH = "";
  if (era === "1775") {
    for (let y = G - 112; y < G - 64; y += 5) HATCH += S.hand([[236, y], [242, y - 4]]);
    for (let k = 0; k < 6; k++) HATCH += S.hand([[350 + k * 4, G - 64], [356 + k * 4, G - 74 + Math.abs(k - 2.5) * 2]]);
    [[171, 38], [194, 44], [404, 46], [430, 54], [458, 42], [486, 48]].forEach(([x, h]) => {
      for (let k = 1; k < 4; k++) HATCH += S.hand([[x + k * 2.5, G - h + k * 3.2], [x + k * 2.5 + 3, G - h + k * 3.2 + 4]]);
    });
  }
  return { sky: S.hand(P), bridge: BR, water: WAT, windows: win, hatch: HATCH, G };
};
/** Trazado que se dibuja: devuelve set(p) con p de 0 a 1. */
S.dash = (path) => { const l = path.getTotalLength(); path.style.strokeDasharray = `${l} ${l}`; return (p) => (path.style.strokeDashoffset = l * (1 - S.clamp(p))); };
/** Dibuja una ciudad en un <g>; devuelve { g, draw(t, t0, dur), windows }. */
S.drawCity = (svg, opts = {}) => {
  const C = S.city(opts.G ?? 470, opts.era ?? "hoy");
  const g = document.createElementNS(NS, "g");
  const col = opts.color || "currentColor";
  g.innerHTML =
    `<path class="ground" d="${S.hand([[-20, C.G], [560, C.G]])}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path class="sky" d="${C.sky}" fill="none" stroke="${col}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path class="bridge" d="${C.bridge}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>` +
    `<path class="water" d="${C.water}" fill="none" stroke="${col}" stroke-opacity=".38" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path class="hatch" d="${C.hatch}" fill="none" stroke="${col}" stroke-opacity=".5" stroke-width=".9"/>` +
    (opts.windows === false ? "" : `<path class="det" d="${C.windows.map(([x, y, w, h]) => S.box(x, y, w, h)).join("")}" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="1"/>`);
  svg.appendChild(g);
  const q = (c) => g.querySelector("." + c);
  const dG = S.dash(q("ground")), dS = S.dash(q("sky")), dB = S.dash(q("bridge")), dW = S.dash(q("water"));
  return {
    g, windows: C.windows, G: C.G,
    draw(t, t0, d = 3.2) {
      dG(S.eIO((t - t0) / (d * .3)));
      dS(S.eIO((t - t0 - d * .1) / (d * .9)));
      dB(S.eIO((t - t0 - d * .4) / (d * .45)));
      dW(S.eIO((t - t0 - d * .55) / (d * .45)));
      q("hatch").style.opacity = S.eOut((t - t0 - d * .8) / .8);
      if (q("det")) q("det").style.opacity = S.eOut((t - t0 - d * .85) / .8);
    },
  };
};

// ── iconos a línea (para «escuelas, inventos, libros»)
S.ICON = {
  escuela: () => S.hand([[0, 40], [0, 14], [22, 0], [44, 14], [44, 40], [0, 40]]) + S.hand([[17, 40], [17, 26], [27, 26], [27, 40]]) + S.box(19, 6, 6, 6),
  invento: () => {
    let d = "", pts = [];
    for (let k = 0; k <= 16; k++) { const a = (k / 16) * Math.PI * 2, r = k % 2 ? 15 : 20; pts.push([22 + r * Math.cos(a), 20 + r * Math.sin(a)]); }
    d += S.hand(pts);
    const c = []; for (let k = 0; k <= 12; k++) { const a = (k / 12) * Math.PI * 2; c.push([22 + 6 * Math.cos(a), 20 + 6 * Math.sin(a)]); }
    return d + S.hand(c);
  },
  libro: () => S.hand([[22, 8], [2, 2], [2, 34], [22, 40], [42, 34], [42, 2], [22, 8], [22, 40]]) + S.hand([[7, 12], [17, 14]]) + S.hand([[7, 19], [17, 21]]) + S.hand([[27, 14], [37, 12]]) + S.hand([[27, 21], [37, 19]]),
};

// ── cara de tinta: se abre a saltos y, al final, se encoge hasta ser el punto de la i
S.saber = (open, shrink, lines = {}) => {
  const ink = S.el("div", "ink");
  const pat = S.el("div", "pat", ink), pfs = [];
  for (let r = 0; r < 16; r++) for (let c = 0; c < 9; c++) {
    const s = S.el("span", "", pat), d = S.el("div", "fig", s);
    pfs.push(S.fig(d, S.NAMES[(c + r) % 3], "menor"));
  }
  const k1 = S.el("div", "abs ht", ink); k1.style.cssText = "left:0;right:0;top:310px";
  const a = S.el("div", "", k1, "debemos"), b = S.el("div", "", k1, 'saber<span class="dot"></span>');
  const tag = lines.tag ? S.el("div", "abs inktag", ink, lines.tag) : null;
  const tA = lines.a ?? open + .55, tB = lines.b ?? open + .8;
  S.ev(open, "flip");
  for (let k = 1; k <= 6; k++) S.ev(shrink + k * .07, "shrink", k);
  S.ev(shrink + .42, "land");
  const SC = 360 / 2360, [sqx, sqy, sqw] = B.wordmark.sq.map(Number);
  const DOT = [90 + (sqx - 22) * SC, 380 + (sqy + 702) * SC, sqw * SC];
  return (t) => {
    const on = t >= open && t < shrink + .42;
    ink.style.display = on ? "block" : "none";
    if (!on) return;
    let x0, y0, x1, y1;
    if (t < shrink) {
      const k = Math.min(6, S.stepN(t, open, 1 / .07) + 1), r = (k / 6) * 560;
      [x0, y0, x1, y1] = [270 - r, 480 - r, 270 + r, 480 + r];
    } else {
      const k = Math.min(6, S.stepN(t, shrink, 1 / .07) + 1), p = S.eIO(k / 6), [dx, dy, ds] = DOT;
      [x0, y0, x1, y1] = [p * dx, p * dy, 540 + p * (dx + ds - 540), 960 + p * (dy + ds - 960)];
    }
    ink.style.clipPath = `inset(${y0}px ${540 - x1}px ${960 - y1}px ${x0}px)`;
    pfs.forEach((f) => f(t, open + .5));
    a.style.visibility = t >= tA ? "visible" : "hidden";
    b.style.visibility = t >= tB ? "visible" : "hidden";
    if (tag) tag.style.opacity = S.eOut((t - tB - .9) / .8);
  };
};

// ── firma: wordmark con el punto ya puesto, nombre, web y (una sola vez) la ciudad
S.firma = (t0, opts = {}) => {
  const L = S.el("div", "firma");
  const w = S.el("div", "abs", L); w.style.cssText = "left:90px;top:380px;width:360px";
  const [sqx, sqy, sqw] = B.wordmark.sq.map(Number);
  w.innerHTML = `<svg viewBox="${B.wordmark.vb}" style="display:block;width:100%;overflow:visible"><defs><clipPath id="wc"><rect class="wcr" x="22" y="-702" height="714" width="0"/></clipPath></defs>` +
    `<path fill="currentColor" d="${B.wordmark.d}" clip-path="url(#wc)"/><rect class="wdot" fill="#7A1F10" x="${sqx}" y="${sqy}" width="${sqw}" height="${sqw}"/></svg>`;
  const e1 = S.el("div", "abs lbl", L, "Sociedad Económica de San Miguel"); e1.style.cssText = "left:0;right:0;top:528px;text-align:center;color:var(--ink-2);font-size:12px";
  const e2 = S.el("div", "abs", L, "sesmi.org"); e2.style.cssText = "left:0;right:0;top:600px;text-align:center;font:500 27px/1 var(--display)";
  const e3 = S.el("div", "abs lbl", L, opts.where || "Talavera de la Reina"); e3.style.cssText = "left:0;right:0;top:642px;text-align:center;color:var(--ink-3)";
  const END = [447, 949, 1397, 2181, 2382], W0 = t0 + .25;
  END.forEach((_, i) => S.ev(W0 + i * .13, "letter", i));
  S.ev(t0 + 1.3, "sign2"); S.ev(t0 + 1.9, "url");
  return (t) => {
    const on = t >= t0;
    L.style.display = on ? "block" : "none";
    if (!on) return;
    const n = t < W0 ? 0 : Math.min(5, S.stepN(t, W0, 1 / .13) + 1);
    L.querySelector(".wcr").setAttribute("width", n ? END[n - 1] - 22 + 6 : 0);
    [[e1, t0 + 1.3], [e2, t0 + 1.9], [e3, t0 + 2.3]].forEach(([e, a]) => { const x = S.eOut((t - a) / .8); e.style.opacity = x; e.style.transform = `translateY(${(1 - x) * 8}px)`; });
  };
};
})();

// ── imagen real: fotos (paneo/zoom lento) y clips de vídeo (fotograma a fotograma)
(() => {
const S = window.S;
/** Etalonajes: 'grabado' = blanco y negro cálido (papel y tinta); 'calido' = color apagado y cálido. */
S.GRADE = {
  grabado: "grayscale(1) sepia(.28) contrast(1.12) brightness(.97)",
  calido: "saturate(.72) sepia(.18) contrast(1.06) brightness(.98)",
  noche: "grayscale(.6) sepia(.2) contrast(1.15) brightness(.7)",
  natural: "none",
};
/**
 * Plano de foto a pantalla completa (o en una caja). opts:
 *   t0, t1        cuándo está en pantalla
 *   from, to      [escala, x%, y%] al principio y al final (paneo/zoom lento, lineal)
 *   grade         clave de S.GRADE · fadeIn/fadeOut (s; 0 = corte seco) · box {left, top, width, height} (px)
 *   fps           el movimiento va a saltos (6 por defecto; 5, 6, 10, 12… dividen a 60). 0 = continuo
 */
S.photo = (src, opts = {}) => {
  // fps: el movimiento del plano va a saltos (estética de la marca: pocos fps, que dividan a 60). 0 = continuo.
  const o = { from: [1.08, 50, 50], to: [1.0, 50, 50], grade: "calido", fadeIn: 0, fadeOut: 0, fps: 6, ...opts };
  const box = S.el("div", "photo", opts.parent);
  const b = o.box || { left: 0, top: 0, width: 540, height: 960 };
  box.style.cssText = `position:absolute;overflow:hidden;left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px;display:none;z-index:${o.z ?? 2}`;
  const img = S.el("img", "", box);
  img.src = src;
  img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${S.GRADE[o.grade] || o.grade};transform-origin:50% 50%`;
  const upd = (t) => {
    const on = t >= o.t0 && t < o.t1;
    box.style.display = on ? "block" : "none";
    if (!on) return;
    const tq = o.fps ? o.t0 + S.stepN(t, o.t0, o.fps) / o.fps : t;
    const p = S.clamp((tq - o.t0) / (o.t1 - o.t0));
    const [s, x, y] = o.from.map((v, i) => v + (o.to[i] - v) * p);
    img.style.objectPosition = `${x}% ${y}%`;
    img.style.transform = `scale(${s})`;
    box.style.opacity = (o.fadeIn ? S.eOut((t - o.t0) / o.fadeIn) : 1) * (o.fadeOut ? 1 - S.eIO((t - (o.t1 - o.fadeOut)) / o.fadeOut) : 1);
  };
  upd.img = img; upd.box = box;
  return upd;
};
/**
 * Clip de vídeo: assets/video/<slug>.mp4, pintado desde sus fotogramas (assets/video/.frames/<slug>/,
 * los genera shared/frames.sh). opts como S.photo + start (s dentro del clip) y rate (velocidad).
 * Se reproduce a opts.fps (6 por defecto): vídeo real o de IA a pocos fps, como stop-motion.
 */
S.clip = (slug, opts = {}) => {
  const meta = (window.CLIPS || {})[slug];
  if (!meta) throw new Error(`clip sin fotogramas: ${slug} (ejecuta shared/frames.sh)`);
  const o = { start: 0, rate: 1, ...opts };
  const dir = `../assets/video/.frames/${slug}/`;
  const f = S.photo(dir + "0001.jpg", o);
  const upd = (t) => {
    f(t);
    if (t < o.t0 || t >= o.t1) return;
    const tq = o.fps ? S.stepN(t, o.t0, o.fps) / o.fps : t - o.t0;  // a saltos, como las figuras
    const k = Math.min(meta.n, Math.max(1, 1 + Math.floor((o.start + tq * o.rate) * meta.fps + 1e-6)));
    const name = String(k).padStart(4, "0") + ".jpg";
    if (!f.img.src.endsWith("/" + name)) f.img.src = dir + name;
  };
  upd.img = f.img; upd.box = f.box;
  return upd;
};
})();
