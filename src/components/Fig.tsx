import { useEffect, useRef } from "react";
import { FIGS, SEQ, prefersReducedMotion, type FigName, type FigVariant } from "@/brand";

interface FigProps {
  name: FigName;
  /** 'menor' para tamaños de interfaz (<64px), 'mayor' (tallas y borde a mano) a partir de 64px. */
  variant?: FigVariant;
  /**
   * true: quieta en reposo; se anima con el ratón sobre la figura o sobre su ancestro
   * [data-anim-host], al recibir el foco, o al tocarla (un ciclo de ~2,2 s).
   * 'loop': en bucle mientras está en pantalla.
   */
  anim?: boolean | "loop";
  /** Texto alternativo. Sin él la figura es decorativa (aria-hidden). */
  label?: string;
  className?: string;
}

/** Figura de marca (búho, caballo, paloma) como SVG en línea, en currentColor. */
export function Fig({ name, variant = "menor", anim = false, label, className }: FigProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = ref.current, g = gRef.current, path = pathRef.current;
    if (!anim || !el || !g || !path) return;
    const Q = SEQ[name], F = Q.frames(variant), restD = FIGS[name][variant];
    let i = 0, timer: number | null = null, stopAt = 0;

    const rest = () => { path.setAttribute("d", restD); g.removeAttribute("transform"); };
    const stop = () => { if (timer !== null) clearInterval(timer); timer = null; stopAt = 0; rest(); };
    const step = () => {
      if (stopAt && Date.now() > stopAt && i % Q.steps.length === 0) return stop();
      const [f, r, y] = Q.steps[i % Q.steps.length]; i++;
      path.setAttribute("d", F[f]);
      g.setAttribute("transform", `translate(0 ${y}) rotate(${r} ${Q.origin[0]} ${Q.origin[1]})`);
    };
    const play = (ms?: number) => {
      if (prefersReducedMotion()) return;
      stopAt = ms ? Date.now() + ms : 0;
      if (timer === null) { i = 0; step(); timer = window.setInterval(step, 1000 / Q.fps); }
    };
    // termina el ciclo en curso y se para
    const soft = () => { if (timer !== null) stopAt = Date.now(); };

    if (anim === "loop") {
      const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? play() : stop())));
      io.observe(el);
      return () => { io.disconnect(); stop(); };
    }

    const host = (el.closest("[data-anim-host]") as HTMLElement | null) || el;
    const onEnter = (e: PointerEvent) => { if (e.pointerType === "mouse") play(); };
    const onLeave = (e: PointerEvent) => { if (e.pointerType === "mouse") soft(); };
    const onDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") play(2200); };
    const onFocusIn = () => play();
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("focusin", onFocusIn);
    host.addEventListener("focusout", soft);
    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("focusin", onFocusIn);
      host.removeEventListener("focusout", soft);
      stop();
    };
  }, [anim, name, variant]);

  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  return (
    <span
      ref={ref}
      className={["sesmi-fig", anim ? "sesmi-anim" : "", className].filter(Boolean).join(" ")}
      data-fig={name}
      data-variant={variant}
    >
      <svg viewBox="0 0 100 100" focusable="false" {...a11y}>
        <g ref={gRef}>
          <path ref={pathRef} fill="currentColor" d={FIGS[name][variant]} />
        </g>
      </svg>
    </span>
  );
}
