import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Ticker from '../components/Ticker';
import SectionHeader from '../components/SectionHeader';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';

const heroLines = [
  '¿Economía para',
  'las ciudades que',
  'Madrid no atiende?',
];

const Index = () => (
  <Layout>
    {/* HERO */}
    <section className="min-h-screen flex items-center justify-center relative grid-bg">
      <div className="text-center px-6 py-20 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-8"
        >
          // SESMI — 2025
        </motion.p>

        <h1 className="mb-10">
          {heroLines.map((line, i) => (
            <motion.span
              key={i}
              className={`block font-display italic font-normal leading-[1.05] ${
                i === 2 ? 'text-warm' : 'text-ink'
              }`}
              style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.04em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-sesmi-muted mb-10"
        >
          Consultoría económica independiente · Talavera de la Reina · España
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex items-center justify-center gap-6 flex-wrap"
        >
          <Link
            to="/research"
            className="bg-ink text-sesmi-white font-mono text-[0.65rem] uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink2 transition-colors interactive"
          >
            Ver Research →
          </Link>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted2">
            Scroll ↓
          </span>
        </motion.div>
      </div>
    </section>

    {/* TICKER */}
    <Ticker />

    {/* ÚLTIMO DE RESEARCH */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <SectionHeader label="RESEARCH" />

      {/* Featured report - dark */}
      <AnimatedEntry>
        <div className="bg-ink text-sesmi-white grid grid-cols-1 lg:grid-cols-2">
          {/* Left */}
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
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
              La economía de Talavera de la Reina
            </h3>
            <p className="font-display italic text-sesmi-white/50 text-lg mb-4">
              Diagnóstico económico independiente
            </p>
            <p className="text-sesmi-white/60 text-sm leading-relaxed mb-6">
              Por qué Talavera, con todo lo que tiene, no termina de despegar. Escrito para que lo entienda cualquier persona, no solo los economistas.
            </p>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-sesmi-white/40 mb-8">
              Metodología: Datos abiertos · Comparadores: 4 ciudades · Período: 2001–2024
            </p>
            <button className="border border-sesmi-white/40 text-sesmi-white font-mono text-[0.6rem] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-sesmi-white/10 transition-colors interactive">
              Notificarme cuando salga →
            </button>
          </div>

          {/* Right - Chapters */}
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
                  <span className={`font-mono text-[0.5rem] uppercase tracking-[0.12em] ${
                    ch.status === 'EN CURSO' ? 'text-warm' : 'text-sesmi-white/30'
                  }`}>
                    [{ch.status}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedEntry>

      {/* Next report preview */}
      <AnimatedEntry delay={0.15}>
        <div className="bg-bg2 p-8 mt-4 card-hover-line">
          <span className="label-style text-muted2 block mb-3">PRÓXIMAMENTE</span>
          <h4 className="font-display text-xl font-bold text-ink mb-2">
            ¿Bienvenido, Mr. Zuckerberg?
          </h4>
          <p className="font-display italic text-sesmi-muted text-sm mb-4">
            Un análisis económico independiente del Meta Data Center en Talavera de la Reina
          </p>
          <Link to="/research" className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-warm hover:text-ink transition-colors interactive">
            → Ver todos los informes
          </Link>
        </div>
      </AnimatedEntry>
    </section>

    {/* TRES LÍNEAS DE TRABAJO */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <SectionHeader label="TRES LÍNEAS DE TRABAJO" />

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sesmi-line">
        {[
          {
            idx: '01',
            tag: 'Services',
            name: 'Consultoría',
            desc: 'Valoraciones, análisis de impacto, diagnósticos estratégicos para empresas y organismos públicos de ciudades medias. El rigor de las grandes firmas, sin sus tarifas ni su distancia.',
            footer: '◆ Genera los recursos',
          },
          {
            idx: '02',
            tag: 'Research',
            name: 'Investigación',
            desc: 'Análisis económico independiente sobre territorios y mercados locales. Metodología abierta, dos formatos: paper académico completo y versión divulgativa. Publicado para que cualquiera pueda leerlo y construir sobre él.',
            footer: '◆ Produce el conocimiento',
          },
          {
            idx: '03',
            tag: 'Learning',
            name: 'Conocimiento libre',
            desc: 'Datos, herramientas y materiales para estudiantes y profesores de economía. Gratuitos o a coste mínimo. El conocimiento económico no debería estar detrás de un paywall.',
            footer: '◆ Democratiza el acceso',
          },
        ].map((item, i) => (
          <AnimatedEntry key={item.idx} delay={i * 0.1} className="p-8 card-hover-line">
            <p className="font-mono text-sm text-warm mb-2">{item.idx} — {item.tag}</p>
            <h3 className="font-sans text-2xl font-medium text-ink mb-4">{item.name}</h3>
            <p className="text-sm text-sesmi-muted leading-relaxed mb-8">{item.desc}</p>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-muted2">{item.footer}</p>
          </AnimatedEntry>
        ))}
      </div>
    </section>

    {/* MANIFIESTO */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
        {/* Sidebar */}
        <AnimatedEntry className="bg-bg2 border-r border-sesmi-line p-8">
          <p className="label-style text-warm mb-6">// MANIFIESTO</p>
          <p className="font-mono text-[8rem] leading-none text-bg3 select-none" style={{ WebkitTextStroke: '1px var(--sesmi-line)' }}>01</p>
          <div className="border-l-[3px] border-warm pl-4 mt-6">
            <p className="font-display italic text-ink text-lg">
              "Debo saber. Mantenerse curioso."
            </p>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-muted2 mt-2">
              — Principio fundacional
            </p>
          </div>
        </AnimatedEntry>

        {/* Main */}
        <AnimatedEntry delay={0.1} className="p-8 lg:p-12">
          <h2 className="font-sans text-2xl md:text-3xl font-light text-ink leading-snug mb-6">
            Las ciudades medias de España merecen análisis económico de verdad.
          </h2>
          <p className="text-sm text-sesmi-muted leading-relaxed mb-6">
            Las firmas de Madrid y Barcelona no van a Talavera, a Ponferrada, a Linares o a Alcoy. El ticket medio no justifica sus costes de estructura. Y cuando van, no entienden el contexto porque no vienen de ahí. Sesmi nace para cambiar eso: análisis con el rigor de las grandes, pero con raíces en el territorio.
          </p>
          <Link to="/nosotros" className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-warm hover:text-ink transition-colors interactive">
            Leer el manifiesto completo →
          </Link>
        </AnimatedEntry>
      </div>
    </section>

    {/* WAITLIST */}
    <WaitlistForm />
  </Layout>
);

export default Index;
