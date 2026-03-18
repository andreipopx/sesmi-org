import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';

const publications = [
  {
    id: 'economia-talavera',
    code: 'SESMI-001',
    title: 'La economía de Talavera de la Reina',
    subtitle: 'Diagnóstico económico independiente',
    category: 'INFORME · ECONOMÍA TERRITORIAL · TALAVERA',
    status: 'EN ELABORACIÓN',
    statusColor: '#6FCF97',
    date: '2025',
    excerpt: 'Por qué Talavera, con todo lo que tiene, no termina de despegar. Un diagnóstico independiente que analiza demografía, mercado de trabajo, tejido empresarial y finanzas municipales.',
    featured: true,
  },
  {
    id: 'meta-datacenter',
    code: 'SESMI-002',
    title: '¿Bienvenido, Mr. Zuckerberg?',
    subtitle: 'Un análisis económico independiente del Meta Data Center en Talavera de la Reina',
    category: 'ANÁLISIS · INVERSIÓN EXTRANJERA · TALAVERA',
    status: 'PRÓXIMAMENTE',
    statusColor: undefined,
    date: '2025',
    excerpt: 'Meta llega a Talavera con 750 millones de euros y el data center más grande del sur de Europa. ¿Cuánto de ese dinero se queda realmente en la ciudad?',
    featured: false,
  },
];

const Research = () => (
  <Layout>
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
      <AnimatedEntry>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
          // RESEARCH ─────────────────────────────────
        </p>
      </AnimatedEntry>
      <AnimatedEntry delay={0.1}>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
          Análisis económico independiente
        </h1>
      </AnimatedEntry>
      <AnimatedEntry delay={0.2}>
        <p className="text-sesmi-muted max-w-2xl mb-8">
          Publicamos nuestros trabajos de forma abierta. Sin paywalls. El conocimiento económico es un bien público.
        </p>
      </AnimatedEntry>
      <AnimatedEntry delay={0.25}>
        <div className="border-l-[3px] border-warm bg-bg2 p-5 mb-12 max-w-3xl">
          <p className="text-sm text-sesmi-muted leading-relaxed">
            Cada publicación existe en dos versiones: un <strong className="text-ink">paper académico</strong> con metodología completa y aparato crítico, y una <strong className="text-ink">versión divulgativa</strong> con visualizaciones e infografías. La misma investigación, dos profundidades de lectura.
          </p>
        </div>
      </AnimatedEntry>
    </section>

    {/* Featured report */}
    <section className="max-w-7xl mx-auto px-6 pb-8">
      <AnimatedEntry>
        <div className="bg-ink text-sesmi-white grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-12 lg:border-r border-sesmi-white/10">
            <div className="flex gap-3 mb-6 flex-wrap">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#6FCF97] flex items-center gap-1.5">
                <span className="logo-dot inline-block w-[6px] h-[6px] rounded-full bg-[#6FCF97]" />
                EN ELABORACIÓN
              </span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-sesmi-white/50 border border-sesmi-white/20 px-2 py-0.5">
                SESMI-001
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              La economía de Talavera de la Reina
            </h2>
            <p className="font-display italic text-sesmi-white/50 text-lg mb-4">
              Diagnóstico económico independiente
            </p>
            <p className="text-sesmi-white/60 text-sm leading-relaxed mb-6">
              Por qué Talavera, con todo lo que tiene, no termina de despegar. Escrito para que lo entienda cualquier persona, no solo los economistas.
            </p>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-sesmi-white/40 mb-8">
              Metodología: Datos abiertos · Comparadores: 4 ciudades · Período: 2001–2024
            </p>
            <Link
              to="/research/economia-talavera"
              className="border border-sesmi-white/40 text-sesmi-white font-mono text-[0.6rem] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-sesmi-white/10 transition-colors interactive inline-block"
            >
              Notificarme cuando salga →
            </Link>
          </div>
          <div className="p-8 md:p-12">
            <p className="label-style text-sesmi-white/40 mb-6">Capítulos</p>
            <div className="space-y-4">
              {[
                { n: '01', title: 'Demografía y capital humano', status: 'EN CURSO' },
                { n: '02', title: 'Mercado de trabajo', status: 'EN CURSO' },
                { n: '03', title: 'Tejido empresarial', status: 'PENDIENTE' },
                { n: '04', title: 'Finanzas municipales', status: 'PENDIENTE' },
                { n: '05', title: 'Diagnóstico y oportunidades', status: 'PENDIENTE' },
              ].map((ch) => (
                <div key={ch.n} className="flex items-center justify-between border-b border-sesmi-white/10 pb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-sesmi-white/30">{ch.n}</span>
                    <span className="text-sm text-sesmi-white/80">{ch.title}</span>
                  </div>
                  <span className={`font-mono text-[0.5rem] uppercase tracking-[0.12em] ${ch.status === 'EN CURSO' ? 'text-warm' : 'text-sesmi-white/30'}`}>
                    [{ch.status}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedEntry>
    </section>

    {/* Other publications */}
    <section className="max-w-7xl mx-auto px-6 py-12">
      {publications.filter(p => !p.featured).map((pub, i) => (
        <AnimatedEntry key={pub.id} delay={i * 0.1}>
          <div className="card-hover-line bg-bg2 p-8 mb-4">
            <div className="flex gap-3 mb-4 flex-wrap items-center">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2 border border-sesmi-line px-2 py-0.5">
                {pub.code}
              </span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2">
                {pub.status}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">{pub.title}</h3>
            <p className="font-display italic text-sesmi-muted text-sm mb-3">{pub.subtitle}</p>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-warm mb-3">{pub.category}</p>
            <p className="text-sm text-sesmi-muted leading-relaxed">{pub.excerpt}</p>
          </div>
        </AnimatedEntry>
      ))}
    </section>

    <WaitlistForm />
  </Layout>
);

export default Research;
