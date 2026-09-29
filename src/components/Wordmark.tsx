import { WORDMARK } from "@/brand";

interface WordmarkProps {
  /** Color del cuadrado (el punto de la i): rojo de marca o el mismo color que el texto. */
  dot?: "red" | "ink";
  label?: string;
  className?: string;
}

/** Wordmark «sesmi» vectorial: el punto de la i es un cuadrado rojo. Hereda currentColor. */
export function Wordmark({ dot = "red", label = "sesmi", className }: WordmarkProps) {
  const [x, y, w, h] = WORDMARK.sq;
  return (
    <span className={["sesmi-wm", className].filter(Boolean).join(" ")} data-wm="">
      <svg viewBox={WORDMARK.vb} role="img" aria-label={label} focusable="false">
        <path fill="currentColor" d={WORDMARK.d} />
        <rect fill={dot === "ink" ? "currentColor" : "#7A1F10"} x={x} y={y} width={w} height={h} />
      </svg>
    </span>
  );
}

/** «sesmi» dentro de un texto corrido, compuesto en Apfel Grotezk (equivale al antiguo wm()). */
export function Sesmi() {
  return <span className="wm">sesmi</span>;
}
