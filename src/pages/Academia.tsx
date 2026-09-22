import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const items = [
  {
    title: 'Datos económicos de ciudades medias',
    desc: 'Series históricas, indicadores y estadísticas organizadas y listas para usar.',
  },
  {
    title: 'Guías metodológicas',
    desc: 'Cómo analizamos, qué fuentes usamos, cómo replicar nuestros trabajos.',
  },
  {
    title: 'Materiales de formación',
    desc: 'Recursos para estudiantes y profesores de economía. Ejercicios, casos prácticos y datasets.',
  },
  {
    title: 'Papers y documentos de trabajo',
    desc: 'Las versiones académicas de nuestras investigaciones, con metodología completa y aparato crítico.',
  },
];

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-haas)',
  fontSize: '9px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
};

const Academia = () => {
  const { lang } = useLanguage();
  const whatLabel = lang === 'en' ? "What you'll find" : 'Qué encontrarás';

  return (
    <Layout>
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
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
              fontFamily: 'var(--font-haas)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              marginBottom: 20,
            }}
          >
            Academia.
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
            Academia es el espacio de sesmi para compartir recursos,
            datos y materiales de formación. Todo abierto, todo gratuito.
          </p>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 48 }} />
        </motion.section>

        {/* What's in Academia */}
        <section
          style={{
            paddingTop: 48,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 32 }}>{whatLabel}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item, idx) => (
              <li
                key={item.title}
                style={{
                  borderTop: idx === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: '1px solid var(--line)',
                  paddingTop: 24,
                  paddingBottom: 24,
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
                  {item.title}
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
                  {item.desc}
                </p>
                <div
                  style={{
                    fontFamily: 'var(--font-haas)',
                    fontSize: 8,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginTop: 12,
                  }}
                >
                  Próximamente
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Access block */}
        <section style={{ marginTop: 48, paddingLeft: 20, paddingRight: 20 }}>
          <div
            style={{
              background: 'var(--bg-2)',
              padding: 'clamp(40px, 6vw, 56px) clamp(24px, 5vw, 48px)',
              maxWidth: 680,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 17,
                color: 'var(--ink-secondary)',
                lineHeight: 1.65,
                marginTop: 0,
                marginBottom: 32,
              }}
            >
              Academia está en construcción. Cuando haya material disponible, se anunciará aquí.
            </p>
            <div
              style={{
                fontFamily: 'var(--font-haas)',
                fontSize: 8,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Próximamente
            </div>
          </div>
        </section>

        <div style={{ height: 96 }} />
      </div>
    </Layout>
  );
};

export default Academia;
