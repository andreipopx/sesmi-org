import { PillarHeader } from "@/components/PillarHeader";
import { RowLink } from "@/components/RowLink";

const RESOURCES: [string, string][] = [
  ["Datos económicos locales", "Pipeline automatizado de descarga y limpieza de datos del INE, Hacienda y Banco de España. Actualización mensual. CSV listos para usar."],
  ["Guía de fuentes de datos económicos", "Qué datos existen, dónde están, cómo descargarlos y usarlos. Para estudiantes e investigadores que empiezan."],
  ["Econometría aplicada con R/Python", "Materiales de apoyo con datasets reales de territorios españoles."],
];

const Divulgacion = () => (
  <>
    <PillarHeader
      fig="paloma"
      label="Divulgación"
      title="El conocimiento es un bien público"
      lema="Socorre enseñando"
      intro={
        <>
          Datos, herramientas y materiales gratuitos o a coste mínimo, para estudiantes, profesores y cualquiera con ganas de aprender. Empezamos por la economía y las matemáticas.{" "}
          <em>Esta sección está en construcción:</em> estamos preparando los primeros recursos.
        </>
      }
    />
    <div className="strip">
      <div className="c0" />
      {RESOURCES.map(([h, p], i) => (
        <div key={h} className="cell"><span className="k">{String(i + 1).padStart(2, "0")}</span><h3>{h}</h3><p>{p}</p></div>
      ))}
    </div>
    <RowLink
      to="mailto:hola@sesmi.org?subject=Divulgaci%C3%B3n"
      n="···"
      title="¿Enseñas, estudias o sabes de algo?"
      sub="Si quieres colaborar, en economía o en cualquier otra materia, escríbenos."
    />
  </>
);

export default Divulgacion;
