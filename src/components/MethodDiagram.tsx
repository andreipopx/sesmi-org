import { useEffect, useRef } from "react";

type Pt = [number, number];

// Posición a lo largo de una polilínea (t de 0 a 1), en % de la celda.
function lerp(pts: Pt[], t: number): Pt {
  let tot = 0;
  const seg: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    tot += l;
  }
  let r = t * tot;
  for (let i = 0; i < seg.length; i++) {
    if (r <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(r / seg[i], 1) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    r -= seg[i];
  }
  return pts[pts.length - 1];
}

const place = (el: HTMLElement, [x, y]: Pt) => {
  el.style.left = x + "%";
  el.style.top = y + "%";
  el.style.opacity = "1";
};

/** «Cómo trabajamos»: del dato abierto a dos publicaciones, con un marcador rojo que recorre el flujo. */
export function MethodDiagram() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const meth = ref.current;
    if (!meth) return;
    const m1 = meth.querySelector<HTMLElement>(".cn1 .mk")!;
    const m2 = [...meth.querySelectorAll<HTMLElement>(".cn2 .mk")];
    const narrow = window.matchMedia("(max-width:860px)");
    let f = 0, timer: number | null = null;
    const tick = () => {
      f++;
      const g = f % 26, v = narrow.matches;
      if (g < 8) place(m1, v ? [50, (g / 7) * 100] : [(g / 7) * 100, 50]);
      else m1.style.opacity = "0";
      m2.forEach((m, j) => {
        if (g >= 9 && g < 19) {
          const t = (g - 9) / 9, o = j ? 75 : 25;
          place(m, lerp(v ? [[50, 0], [50, 50], [o, 50], [o, 100]] : [[0, 50], [50, 50], [50, o], [100, o]], t));
        } else m.style.opacity = "0";
      });
    };
    const io = new IntersectionObserver((es) =>
      es.forEach((e) => {
        if (e.isIntersecting && timer === null) timer = window.setInterval(tick, 180);
        else if (!e.isIntersecting && timer !== null) { clearInterval(timer); timer = null; }
      }),
    );
    io.observe(meth);
    return () => { io.disconnect(); if (timer !== null) clearInterval(timer); };
  }, []);

  return (
    <>
      <div className="method" role="group" aria-label="Del dato abierto a dos publicaciones" ref={ref}>
        <div className="c0" />
        <div className="node d">
          <span className="k"><span>Entrada</span><span>A</span></span>
          <h3>Datos abiertos</h3>
          <p>INE, Hacienda, Banco de España. Fuentes públicas, citadas y descargables.</p>
        </div>
        <div className="cn cn1" aria-hidden="true"><i className="a" /><span className="mk" /></div>
        <div className="node an">
          <span className="k"><span>Proceso</span><span>B</span></span>
          <h3>Análisis</h3>
          <p>Impacto territorial con metodología abierta, hecho por quien conoce la ciudad de la que habla.</p>
        </div>
        <div className="cn cn2" aria-hidden="true">
          <i className="s" /><i className="v" /><i className="h h1" /><i className="h h2" />
          <span className="mk" /><span className="mk" />
        </div>
        <div className="node o1">
          <span className="k"><span>Salida</span><span>C1</span></span>
          <h3>Paper académico</h3>
          <p>Metodología completa y aparato crítico.</p>
        </div>
        <div className="node o2">
          <span className="k"><span>Salida</span><span>C2</span></span>
          <h3>Versión divulgativa</h3>
          <p>Visualizaciones e infografías para cualquier lector.</p>
        </div>
      </div>
      <div className="cap"><div /><p>La misma investigación, dos profundidades de lectura.</p></div>
    </>
  );
}
