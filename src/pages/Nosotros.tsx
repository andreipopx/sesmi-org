import { PillarHeader } from "@/components/PillarHeader";
import { RowLink } from "@/components/RowLink";
import { Sesmi } from "@/components/Wordmark";

const Nosotros = () => (
  <>
    <PillarHeader
      fig="all"
      label="Nosotros"
      title="Suficiente experiencia para saber cómo se hace."
      intro={<>Y suficiente amor por estas ciudades para querer hacerlo aquí. <Sesmi /> es el proyecto de alguien que se fue y quiso volver.</>}
    />

    <div className="quote">
      <div className="f" />
      <div className="in">
        <blockquote>
          <p><span className="gq l">«</span>Las ciudades que nadie analiza merecen el mismo rigor que Madrid o Barcelona.<span className="gq">»</span></p>
        </blockquote>
        <div className="qm">
          <p className="by">Del manifiesto de <Sesmi /></p>
          <p className="tx">
            Las grandes firmas no vienen a Talavera, ni a Ponferrada, ni a Linares. El ticket no justifica sus costes. Y
            cuando vienen, no entienden el contexto porque no son de aquí. <Sesmi /> nace para llenar ese vacío.
          </p>
        </div>
      </div>
    </div>

    <div className="bh sm" id="abierta">
      <div className="f" />
      <div className="tt"><h2>Una sociedad abierta</h2></div>
      <div className="pp">
        <p>
          Las Sociedades Económicas del siglo XVIII juntaban a gente de saberes distintos para mejorar su tierra: abrían
          escuelas, premiaban inventos y traducían libros. <Sesmi /> quiere ser eso: una sociedad abierta a quien quiera
          aprender o aportar.
        </p>
      </div>
    </div>

    <div className="strip team">
      <div className="c0" />
      <div className="cell">
        <span className="k">Fundador</span>
        <h3>Matemático y economista</h3>
        <p>Ha trabajado en Deloitte y KPMG como consultor de ciberseguridad, en Huawei como asistente de CFO y en Amadeus como data engineer.</p>
        <p className="cr">Matemáticas y Economía · Universidad Complutense de Madrid</p>
      </div>
      <div className="cell">
        <span className="k">Cofundador</span>
        <h3>Economista</h3>
        <p>Máster en el Barcelona School of Economics. Research Assistant en el Banco de España.</p>
        <p className="cr">Doble grado en Economía y Matemáticas · BSE</p>
      </div>
    </div>

    <div className="bh sm" id="contacto">
      <div className="f" />
      <div className="tt"><h2>Trabaja con nosotros</h2></div>
      <div className="pp"><p>¿Trabajamos juntos? Base en Talavera de la Reina, Toledo.</p></div>
    </div>
    <RowLink to="mailto:hola@sesmi.org" n="01" title="Escríbenos" sub="hola@sesmi.org" />
    <RowLink to="/servicios" n="02" title="Encarga un análisis" sub="Valoración, impacto económico, due diligence, daños o diagnóstico estratégico." />
    <RowLink to="/divulgacion" n="03" title="Colabora en Divulgación" sub="Para quien quiera aportar materiales o ideas." />
  </>
);

export default Nosotros;
