import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';

const services = [
  {
    num: '01',
    title: 'Valoración de empresas y activos',
    desc: 'Valoraciones por DCF, múltiplos de mercado y análisis de sensibilidad para compraventas de empresas familiares, entradas de socios, herencias o disputas societarias.',
    who: 'Empresas familiares · Bufetes · Bancos locales',
    price: '2.000 €',
  },
  {
    num: '02',
    title: 'Análisis de impacto económico',
    desc: 'Cuantificación del impacto territorial de inversiones, infraestructuras, eventos o políticas públicas. Modelos input-output, multiplicadores económicos, análisis coste-beneficio.',
    who: 'Ayuntamientos · Diputaciones · Consorcios',
    price: '5.000 €',
  },
  {
    num: '03',
    title: 'Due diligence económica',
    desc: 'Análisis de la posición competitiva, estructura de costes, rentabilidad y riesgos sectoriales en procesos de fusión o adquisición.',
    who: 'Empresas en M&A · Asesores financieros',
    price: '4.000 €',
  },
  {
    num: '04',
    title: 'Análisis de daños económicos',
    desc: 'Cuantificación de daños en litigios civiles y mercantiles. Informes periciales con rigor metodológico.',
    who: 'Despachos de abogados · Empresas en litigios',
    price: '3.000 €',
  },
  {
    num: '05',
    title: 'Diagnóstico estratégico-económico',
    desc: 'Análisis integral del negocio: posición en el mercado, estructura de costes, rentabilidad por segmento.',
    who: 'Empresa mediana · Consejo de administración',
    price: '3.000 €',
  },
];

const Services = () => (
  <Layout>
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
      <AnimatedEntry>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
          // SERVICES ─────────────────────────────────
        </p>
      </AnimatedEntry>
      <AnimatedEntry delay={0.1}>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
          Consultoría económica para ciudades reales
        </h1>
      </AnimatedEntry>
      <AnimatedEntry delay={0.2}>
        <p className="text-sesmi-muted max-w-2xl mb-16">
          El tipo de análisis que hasta ahora solo podían permitirse las grandes ciudades.
        </p>
      </AnimatedEntry>
    </section>

    <section className="max-w-7xl mx-auto px-6 pb-20">
      {services.map((svc, i) => (
        <AnimatedEntry key={svc.num} delay={i * 0.08}>
          <div className="border-t border-sesmi-line py-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 group card-hover-line">
            <div>
              <p className="font-mono text-lg text-warm">{svc.num}</p>
            </div>
            <div>
              <h3 className="font-sans text-xl font-medium text-ink mb-3">{svc.title}</h3>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-4">{svc.desc}</p>
              <div className="flex flex-wrap gap-6 items-center">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-muted2">
                  {svc.who}
                </p>
                <p className="font-mono text-sm text-ink">
                  Desde {svc.price}
                </p>
              </div>
            </div>
          </div>
        </AnimatedEntry>
      ))}

      {/* CTA */}
      <AnimatedEntry delay={0.3}>
        <div className="border-t border-sesmi-line pt-16 text-center">
          <p className="text-lg text-sesmi-muted mb-6 max-w-lg mx-auto">
            ¿Tienes un proyecto en mente? La mayoría empiezan con una conversación.
          </p>
          <Link
            to="/nosotros#contacto"
            className="bg-ink text-sesmi-white font-mono text-[0.65rem] uppercase tracking-[0.12em] px-8 py-4 hover:bg-ink2 transition-colors interactive inline-block"
          >
            Hablar con nosotros →
          </Link>
        </div>
      </AnimatedEntry>
    </section>
  </Layout>
);

export default Services;
