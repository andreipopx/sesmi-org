import { Fragment, ReactNode } from 'react';

/**
 * Envuelve cada aparición de "sesmi" (case-insensitive, palabra completa)
 * en <span className="wm"> para que se renderice en Apfel Grotezk Mittel.
 * Acepta strings o (parcialmente) HTML simple — si el contenido contiene
 * etiquetas, mejor usar dangerouslySetInnerHTML aparte.
 */
export function wm(text: string): ReactNode {
  if (!text) return text;
  const parts = text.split(/(\bsesmi\b)/gi);
  return parts.map((p, i) =>
    /^sesmi$/i.test(p) ? (
      <span key={i} className="wm">
        {p}
      </span>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}
