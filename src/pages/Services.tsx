import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-haas)',
  fontSize: '9px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
};

const profiles = [
  {
    title: 'Administraciones locales',
    desc: 'Diagnósticos económicos, informes de impacto, análisis de inversión y evaluación de políticas públicas para ayuntamientos y diputaciones.',
  },
  {
    title: 'Empresas con impacto local',
    desc: 'Análisis de viabilidad económica, estudio de mercado local, evaluación de impacto territorial para empresas que operan en ciudades medias.',
  },
  {
    title: 'Medios y periodistas',
    desc: 'Datos, contexto y análisis económico para piezas periodísticas sobre economía local. Rigor metodológico sin jerga.',
  },
];

const services = [
  {
    id: 'S-01',
    title: 'Informe de diagnóstico económico',
    desc: 'Análisis completo de la situación económica de una ciudad o comarca. Demografía, estructura productiva, empleo, fiscalidad y propuestas. Metodología abierta y replicable.',
    deliverables: 'Informe divulgativo + paper académico + datasets abiertos',
  },
  {
    id: 'S-02',
    title: 'Análisis de impacto de inversión',
    desc: '¿Qué impacto económico real tiene una inversión en tu ciudad? Empleo directo e indirecto, retorno fiscal, efecto en sectores adyacentes. Sin optimismo sin datos.',
    deliverables: 'Informe técnico + presentación ejecutiva',
  },
  {
    id: 'S-03',
    title: 'Consultoría de datos económicos',
    desc: 'Organización, limpieza y análisis de datos económicos locales. Visualizaciones para comunicar resultados a audiencias no técnicas.',
    deliverables: 'Dataset + visualizaciones + informe metodológico',
  },
  {
    id: 'S-04',
    title: 'Asesoría económica independiente',
    desc: 'Sesiones de trabajo con nuestro equipo para contrastar análisis, revisar metodología o preparar argumentos económicos para negociaciones o decisiones estratégicas.',
    deliverables: 'Informe de sesión + recomendaciones escritas',
  },
];

const principles = [
  {
    lead: 'Independencia metodológica.',
    rest: ' Todos nuestros análisis siguen la misma metodología que usamos en nuestra investigación pública. El cliente no condiciona las conclusiones.',
  },
  {
    lead: 'Transparencia total.',
    rest: ' Publicamos la metodología de todos nuestros trabajos. Si hay algo que no podemos publicar, no lo hacemos.',
  },
  {
    lead: 'Sin paywalls.',
    rest: ' Los datos y las conclusiones principales siempre son públicos, aunque el informe completo sea de encargo.',
  },
];

const Services = () => {
  const { lang } = useLanguage();
  const L = {
    who: lang === 'en' ? 'Who we work with' : 'Para quién',
    what: lang === 'en' ? 'What we offer' : 'Qué ofrecemos',
    how: lang === 'en' ? 'How we work' : 'Cómo trabajamos',
  };

  return (
    <Layout>
      <div style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            paddingTop: 64,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          
          <h1
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 400,
              color: 'var(--ink)',
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            Análisis económico independiente para quien toma decisiones.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 18,
              fontStyle: 'italic',
              color: 'var(--ink-secondary)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            La investigación de sesmi financia nuestra independencia. Los servicios que ofrecemos
            son los mismos análisis que hacemos para nosotros — aplicados a tu problema concreto.
          </p>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 48 }} />
        </motion.section>

        {/* Para quién */}
        <section
          style={{
            paddingTop: 48,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 32 }}>{L.who}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {profiles.map((p, idx) => (
              <li
                key={p.title}
                style={{
                  borderTop: idx === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: '1px solid var(--line)',
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    margin: 0,
                    marginBottom: 8,
                    lineHeight: 1.25,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 16,
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {p.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Qué ofrecemos */}
        <section
          style={{
            paddingTop: 48,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 32 }}>{L.what}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {services.map((s, idx) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.08 }}
                style={{
                  borderTop: idx === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: '1px solid var(--line)',
                  paddingTop: 28,
                  paddingBottom: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--accent)',
                    marginBottom: 8,
                  }}
                >
                  {s.id}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    margin: 0,
                    marginBottom: 10,
                    lineHeight: 1.25,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 16,
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
                <div
                  style={{
                    fontFamily: 'var(--font-haas)',
                    fontSize: 10,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginTop: 12,
                  }}
                >
                  {s.deliverables}
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Cómo trabajamos */}
        <section style={{ marginTop: 48, background: 'var(--bg-2)' }}>
          <div
            style={{
              maxWidth: 680,
              margin: '0 auto',
              paddingTop: 48,
              paddingBottom: 48,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <div style={{ ...labelStyle, marginBottom: 24 }}>{L.how}</div>
            {principles.map((p) => (
              <p
                key={p.lead}
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 17,
                  lineHeight: 1.85,
                  color: 'var(--ink-secondary)',
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                <strong style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.lead}</strong>
                {p.rest}
              </p>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--ink)' }}>
          <div
            style={{
              maxWidth: 680,
              margin: '0 auto',
              paddingTop: 64,
              paddingBottom: 64,
              paddingLeft: 'clamp(24px, 5vw, 48px)',
              paddingRight: 'clamp(24px, 5vw, 48px)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 400,
                color: 'var(--offwhite)',
                margin: 0,
                marginBottom: 16,
                lineHeight: 1.15,
              }}
            >
              ¿Hablamos?
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 18,
                fontStyle: 'italic',
                color: 'rgba(250, 248, 245, 0.7)',
                lineHeight: 1.65,
                margin: 0,
                marginBottom: 32,
              }}
            >
              Cuéntanos qué necesitas.
            </p>
            <a
              href="mailto:hola@sesmi.org"
              className="services-mail"
              style={{
                display: 'block',
                fontFamily: 'var(--font-haas)',
                fontSize: 13,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--offwhite)',
                textDecoration: 'none',
                marginBottom: 24,
                transition: 'opacity 150ms ease',
              }}
            >
              hola@sesmi.org
            </a>
            <div
              style={{
                fontFamily: 'var(--font-haas)',
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(250, 248, 245, 0.4)',
              }}
            >
              Los servicios financian la investigación independiente de sesmi.
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .services-mail:hover { opacity: 0.7; }
      `}</style>
    </Layout>
  );
};

export default Services;
