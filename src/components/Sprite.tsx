import { FIGS, FIG_NAMES } from "@/brand";

/** Símbolos SVG compartidos: la flecha y las tres figuras (variante menor) para el patrón del hero. */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="arr" viewBox="0 0 28 12">
          <path d="M0 6h26M20.5 .8 26 6l-5.5 5.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
        </symbol>
        {FIG_NAMES.map((n) => (
          <symbol key={n} id={`f-${n}`} viewBox="0 0 100 100">
            <path fill="currentColor" d={FIGS[n].menor} />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

/** Flecha fina de la retícula (usa el símbolo #arr de <Sprite/>). */
export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 28 12" aria-hidden="true" focusable="false">
      <use href="#arr" />
    </svg>
  );
}
