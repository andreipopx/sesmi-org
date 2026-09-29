import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Arrow } from "./Sprite";

interface RowLinkProps {
  /** Ruta interna (react-router) o enlace externo (mailto:, https:). */
  to: string;
  /** Contenido de la primera celda (número, «@», «···», figura…). */
  n: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  /** Línea «para quién» (servicios). */
  who?: ReactNode;
  className?: string;
}

/** Fila numerada de la retícula: celda de número, texto y flecha. Toda la fila es un enlace. */
export function RowLink({ to, n, title, sub, who, className }: RowLinkProps) {
  const cls = ["row", className].filter(Boolean).join(" ");
  const inner = (
    <>
      <div className="n">{n}</div>
      <div className="t">
        <span className="rt">{title}</span>
        {sub && <span className="rs">{sub}</span>}
        {who && <span className="rw">{who}</span>}
      </div>
      <div className="a"><Arrow /></div>
    </>
  );
  return /^[a-z]+:/i.test(to) ? <a className={cls} href={to}>{inner}</a> : <Link className={cls} to={to}>{inner}</Link>;
}
