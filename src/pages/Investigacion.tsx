import { Link } from "react-router-dom";
import { Arrow } from "@/components/Sprite";
import { Fig } from "@/components/Fig";
import { Illustration } from "@/components/Illustration";
import { MethodDiagram } from "@/components/MethodDiagram";
import { PillarHeader } from "@/components/PillarHeader";
import { WaitlistRow } from "@/components/WaitlistRow";

const CHAPTERS: [string, string, boolean][] = [
  ["01", "Contexto: la inversión y la ciudad", true],
  ["02", "Impacto económico directo e indirecto", true],
  ["03", "Empleo y capital humano", false],
  ["04", "Fiscalidad y retorno local", false],
  ["05", "Recomendaciones de negociación", false],
];

const PRINCIPLES: [string, string, string][] = [
  ["01", "Independencia", "No hacemos informes para justificar decisiones ya tomadas. Análisis honesto, aunque incomode."],
  ["02", "Datos abiertos", "Fuentes públicas y publicación sin paywalls. Cualquiera puede revisar el trabajo y construir sobre él."],
  ["03", "Dos profundidades", "Cada publicación existe como paper y como versión divulgativa. Se lee entera o se lee rápido."],
  ["04", "Conocer el territorio", "No somos una consultora que llega un día y se va. Conocemos el lugar del que hablamos."],
];

const Investigacion = () => (
  <>
    <PillarHeader
      fig="buho"
      label="Investigación"
      title="Investigación independiente, en abierto"
      lema="Debemos saber"
      intro="Publicamos todo en abierto, sin paywalls: el conocimiento es un bien público."
    />

    <article className="pub" id="sesmi-001" aria-labelledby="p1-h">
      <div className="n"><Fig name="buho" /></div>
      <div className="t">
        <div className="rk"><span className="lbl code">SESMI-001</span><span className="lbl st"><i className="sq" />En elaboración</span></div>
        <h3 id="p1-h">¡Bienvenido, Mr. Meta!</h3>
        <p className="sub">Un análisis económico independiente del Meta Data Center en Talavera de la Reina.</p>
        <p className="lede">
          Meta llega a Talavera con 750 millones de euros y el data center más grande del sur de Europa. ¿Cuánto de ese
          dinero se queda realmente en la ciudad? ¿Qué condiciones debería negociar Talavera para maximizar el beneficio local?
        </p>
        <ul className="facts">
          <li><b>Metodología</b> · Datos abiertos · Análisis de impacto territorial</li>
          <li><b>Formatos</b> · Paper académico · Versión divulgativa</li>
        </ul>
      </div>
      <div className="ic"><Illustration kind="rings" /></div>
      <ol className="chap" aria-label="Capítulos">
        {CHAPTERS.map(([k, tx, on]) => (
          <li key={k} className={on ? "on" : "off"}>
            <span className="h">{k} <i className={on ? "sq" : "sq o"} title={on ? "En curso" : "Pendiente"} /></span>
            <span className="bar" />
            <span className="tx">{tx}</span>
          </li>
        ))}
      </ol>
    </article>

    <article className="pub" id="sesmi-002" aria-labelledby="p2-h">
      <div className="n"><Fig name="buho" /></div>
      <div className="t">
        <div className="rk"><span className="lbl code">SESMI-002</span><span className="lbl st"><i className="sq o" />Próximamente</span></div>
        <h3 id="p2-h">Talavera, la ciudad que no arranca</h3>
        <p className="lede">Diagnóstico económico independiente de una ciudad media española.</p>
        <Link className="tlink lbl" to="/investigacion#aviso">Avisarme cuando salga <Arrow /></Link>
      </div>
      <div className="ic paper"><Illustration kind="stall" /></div>
    </article>

    <div className="bh sm" id="metodo">
      <div className="f" />
      <div className="tt"><h2>Cómo trabajamos</h2></div>
      <div className="pp">
        <p>Se puede investigar con rigor sin renunciar a que lo entienda la gente. Cada investigación sigue el mismo camino y termina en dos documentos.</p>
      </div>
    </div>
    <MethodDiagram />
    <div className="princ">
      <div className="c0" />
      {PRINCIPLES.map(([k, h, p]) => (
        <div key={k} className="pr"><span className="k">{k}</span><h3>{h}</h3><p>{p}</p></div>
      ))}
    </div>

    <WaitlistRow id="aviso" inputId="wl-2" sub="Publicamos de forma abierta y gratuita. Déjanos tu email y te avisamos. Sin spam." />
  </>
);

export default Investigacion;
