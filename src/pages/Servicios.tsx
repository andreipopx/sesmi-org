import { PillarHeader } from "@/components/PillarHeader";
import { RowLink } from "@/components/RowLink";
import { Sesmi } from "@/components/Wordmark";

const SERVICES: [string, string, string][] = [
  ["Valoración de empresas y activos", "Valoraciones por DCF, múltiplos de mercado y análisis de sensibilidad para compraventas de empresas familiares, entradas de socios, herencias o disputas societarias.", "Para empresas familiares, bufetes y bancos locales"],
  ["Análisis de impacto económico", "Cuantificación del impacto territorial de inversiones, infraestructuras, eventos o políticas públicas. Modelos input-output, multiplicadores económicos, análisis coste-beneficio.", "Para ayuntamientos, diputaciones y consorcios"],
  ["Due diligence económica", "Posición competitiva, estructura de costes, rentabilidad y riesgos sectoriales en procesos de fusión o adquisición.", "Para empresas en M&A y asesores financieros"],
  ["Análisis de daños económicos", "Cuantificación de daños en litigios civiles y mercantiles. Informes periciales con rigor metodológico.", "Para despachos de abogados y empresas en litigios"],
  ["Diagnóstico estratégico-económico", "Análisis integral del negocio: posición en el mercado, estructura de costes, rentabilidad por segmento.", "Para la empresa mediana y su consejo de administración"],
];

const Servicios = () => (
  <>
    <PillarHeader
      fig="caballo"
      label="Servicios"
      title="Análisis riguroso para ciudades reales"
      lema="Fuerza aplicada"
      intro="El tipo de análisis que hasta ahora solo podían permitirse las grandes ciudades: el rigor de las grandes firmas, sin sus tarifas ni su distancia. Hoy los servicios son de economía, que es lo que hacemos; la sociedad está abierta a sumar otras disciplinas."
    />
    {SERVICES.map(([t, s, w], i) => (
      <RowLink key={t} to="/servicios#hablamos" n={String(i + 1).padStart(2, "0")} title={t} sub={s} who={w} />
    ))}
    <RowLink
      to="mailto:hola@sesmi.org?subject=Otra%20disciplina"
      n="+"
      title="¿Tu proyecto pide otra disciplina?"
      sub={<><Sesmi /> no es cerrada. Cuéntanos qué necesitas y vemos cómo hacerlo, o con quién.</>}
    />
    <div className="bh sm" id="hablamos">
      <div className="f" />
      <div className="tt"><h2>Cada proyecto es distinto. Hablamos.</h2></div>
      <div className="pp"><p>Cuéntanos qué necesitas. Trabajamos desde Talavera de la Reina, Toledo.</p></div>
    </div>
    <RowLink to="mailto:hola@sesmi.org?subject=Servicios" n="@" title="Escríbenos" sub="hola@sesmi.org" />
  </>
);

export default Servicios;
