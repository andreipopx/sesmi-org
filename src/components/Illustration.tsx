import { useEffect, useRef, type ReactElement } from "react";
import { prefersReducedMotion } from "@/brand";

/**
 * Ilustraciones de línea de las publicaciones:
 *  - rings: SESMI-001 (750 M€ que se dispersan en anillos)
 *  - stall: SESMI-002 (una curva que intenta arrancar y se cala)
 * Se animan a ~180 ms por paso solo mientras están en pantalla y nunca con reduced-motion.
 */
export type IllustrationKind = "rings" | "stall";

const TICK = 180;
const W = 640, H = 320;

// ── rings
const CX = 470, CY = 236;
const RINGS = Array.from({ length: 10 }, (_, k) => {
  const i = 10 - k; // del más grande (10) al más pequeño (1), como en el prototipo
  const d = 18 * Math.pow(1.36, i);
  return { i, d, o: +(0.5 - i * 0.034).toFixed(3) };
});

// ── stall
const BASE = 262;
const TRIES: [number, number, number][] = [[70, 46, 22], [170, 70, 26], [270, 58, 24], [372, 86, 28], [478, 64, 24], [572, 40, 20]];
const STALL: [number, number][] = [];
for (let x = 0; x <= W; x += 4) {
  let y = BASE;
  TRIES.forEach(([c, a, w]) => {
    const u = (x - c) / w;
    y -= x < c ? a * Math.exp((-u * u) / 3.2) : a * Math.exp(-Math.pow(u * 2.6, 2));
  });
  y += Math.sin(x * 0.21) * 1.4;
  STALL.push([x, y]);
}
const STALL_D = STALL.map(([x, y], k) => (k ? "L" : "M") + x + " " + y.toFixed(1)).join("");
const GRID: number[] = [];
for (let y = 142; y <= BASE; y += 24) GRID.push(y);

const NS = { vectorEffect: "non-scaling-stroke" } as const;

export function Illustration({ kind }: { kind: IllustrationKind }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const host = hostRef.current, svg = svgRef.current;
    if (!host || !svg || prefersReducedMotion()) return;
    let f = 0, timer: number | null = null;
    // anillos ordenados del menor al mayor
    const rg = [...svg.querySelectorAll<SVGRectElement>(".rg")].sort((a, b) => +a.dataset.i! - +b.dataset.i!);
    const mk = svg.querySelector<SVGRectElement>(".mk");
    const tick = () => {
      f++;
      if (kind === "rings") {
        const k = f % 14;
        rg.forEach((r, i) =>
          r.setAttribute("stroke-opacity", i === k - 1 ? ".85" : i === k - 2 ? (+r.dataset.o! + 0.18).toFixed(2) : r.dataset.o!),
        );
      } else if (mk) {
        const p = STALL[(f * 3) % STALL.length];
        mk.setAttribute("x", String(p[0] - 4.5));
        mk.setAttribute("y", String(p[1] - 4.5));
        mk.setAttribute("opacity", "1");
      }
    };
    const io = new IntersectionObserver((es) =>
      es.forEach((e) => {
        if (e.isIntersecting && timer === null) timer = window.setInterval(tick, TICK);
        else if (!e.isIntersecting && timer !== null) { clearInterval(timer); timer = null; }
      }),
    );
    io.observe(host);
    return () => { io.disconnect(); if (timer !== null) clearInterval(timer); };
  }, [kind]);

  let body: ReactElement;
  if (kind === "rings") {
    body = (
      <>
        {RINGS.map(({ i, d, o }) => (
          <rect key={i} className="rg" data-i={i} data-o={o} x={(CX - d / 2).toFixed(1)} y={(CY - d / 2).toFixed(1)}
            width={d.toFixed(1)} height={d.toFixed(1)} fill="none" stroke="currentColor" strokeOpacity={o} strokeWidth="1" {...NS} />
        ))}
        <line x1="0" y1={CY} x2={W} y2={CY} stroke="currentColor" strokeOpacity=".18" strokeDasharray="2 5" {...NS} />
        <line x1={CX} y1="0" x2={CX} y2={H} stroke="currentColor" strokeOpacity=".18" strokeDasharray="2 5" {...NS} />
        <rect x={CX - 8} y={CY - 8} width="16" height="16" fill="#7A1F10" />
        <rect className="tb" x={CX + 18} y={CY - 11} width="64" height="22" />
        <text className="tg" x={CX + 24} y={CY + 4.5}>750 M€</text>
      </>
    );
  } else {
    body = (
      <>
        {GRID.map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="currentColor" strokeOpacity={y === BASE ? 0.5 : 0.13} strokeWidth="1" {...NS} />
        ))}
        <path d={STALL_D} fill="none" stroke="currentColor" strokeWidth="1.5" {...NS} />
        {TRIES.map(([c, a]) => (
          <line key={c} x1={c} y1={BASE - a - 14} x2={c} y2={BASE - a - 4} stroke="currentColor" strokeOpacity=".45" {...NS} />
        ))}
        <rect className="mk" x="-20" y="-20" width="9" height="9" opacity="0" />
      </>
    );
  }

  return (
    <div className="ill" data-ill={kind} aria-hidden="true" ref={hostRef}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice" focusable="false">
        {body}
      </svg>
    </div>
  );
}
