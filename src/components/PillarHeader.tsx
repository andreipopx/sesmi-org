import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { FigName } from "@/brand";
import { FIG_NAMES } from "@/brand";
import { Arrow } from "./Sprite";
import { Fig } from "./Fig";
import { Wordmark } from "./Wordmark";

interface PillarHeaderProps {
  /** Figura de la pata; 'all' muestra las tres (Nosotros); sin figura, solo wordmark en la firma. */
  fig?: FigName | "all";
  /** Nombre de la sección en la firma (en rojo). */
  label: string;
  title: ReactNode;
  lema?: string;
  intro?: ReactNode;
}

/** Cabecera de página de cada pata: volver, firma (figura | sesmi Sección), h1, lema, intro y figura grande. */
export function PillarHeader({ fig, label, title, lema, intro }: PillarHeaderProps) {
  const single = fig && fig !== "all" ? fig : null;
  return (
    <header className={fig ? "ph" : "ph nofig"} data-anim-host="">
      <Link className="back" to="/" aria-label="Volver al inicio"><Arrow /></Link>
      <div className="pt">
        <div className="firma">
          {single && (<><Fig name={single} className="sf" /><i className="bar" /></>)}
          <Wordmark dot="ink" />
          <b>{label}</b>
        </div>
        <h1>{title}</h1>
        {lema && <p className="lema">{lema}</p>}
        {intro && <p className="intro">{intro}</p>}
      </div>
      {fig && (
        <div className={fig === "all" ? "pf three" : "pf"}>
          {(fig === "all" ? FIG_NAMES : [fig]).map((n) => <Fig key={n} name={n} variant="mayor" anim />)}
        </div>
      )}
    </header>
  );
}
