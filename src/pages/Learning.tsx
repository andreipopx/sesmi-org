import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';

const resources = [
  {
    title: 'Datos económicos de Talavera y Castilla-La Mancha',
    desc: 'Pipeline automatizado de descarga y limpieza de datos del INE, Hacienda y Banco de España. Actualización mensual. CSV listos para usar.',
  },
  {
    title: 'Guía de fuentes de datos económicos España',
    desc: 'Qué datos existen, dónde están, cómo descargarlos y usarlos. Para estudiantes e investigadores que empiezan.',
  },
  {
    title: 'Econometría aplicada con R/Python',
    desc: 'Materiales de apoyo con datasets reales de ciudades medias españolas.',
  },
];

const Learning = () => (
  <Layout>
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
      <AnimatedEntry>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
          // LEARNING ─────────────────────────────────
        </p>
      </AnimatedEntry>
      <AnimatedEntry delay={0.1}>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
          El conocimiento económico es un bien público
        </h1>
      </AnimatedEntry>

      {/* Status callout */}
      <AnimatedEntry delay={0.2}>
        <div className="border-l-[3px] border-warm bg-bg2 p-5 my-12 max-w-3xl">
          <p className="text-sm text-sesmi-muted leading-relaxed">
            Esta sección está en construcción. Estamos preparando los primeros recursos. Si eres profesor o estudiante de economía y tienes algo en mente, escríbenos.
          </p>
        </div>
      </AnimatedEntry>
    </section>

    {/* Resource cards */}
    <section className="max-w-7xl mx-auto px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((res, i) => (
          <AnimatedEntry key={i} delay={i * 0.1}>
            <div className="bg-bg2 p-8 card-hover-line h-full flex flex-col">
              <h3 className="font-sans text-lg font-medium text-ink mb-3">{res.title}</h3>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-6 flex-1">{res.desc}</p>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2 border border-sesmi-line px-2 py-1 w-fit">
                PRÓXIMAMENTE
              </span>
            </div>
          </AnimatedEntry>
        ))}
      </div>
    </section>

    {/* Collaboration */}
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedEntry>
        <div className="text-center">
          <p className="text-lg text-sesmi-muted mb-6">
            Si eres profesor de economía y quieres colaborar, escríbenos.
          </p>
          <Link
            to="/nosotros#contacto"
            className="bg-ink text-sesmi-white font-mono text-[0.65rem] uppercase tracking-[0.12em] px-8 py-4 hover:bg-ink2 transition-colors interactive inline-block"
          >
            Contactar →
          </Link>
        </div>
      </AnimatedEntry>
    </section>
  </Layout>
);

export default Learning;
