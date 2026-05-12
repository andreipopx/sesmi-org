import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { wm } from '../lib/wm';

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-haas)',
  fontSize: '9px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
};

const team = [
  {
    name: 'Tu nombre aquí',
    role: 'Fundador · Economista',
    bio: 'Texto de presentación pendiente.',
    links: [] as Array<{ label: string; href: string }>,
  },
];

const principles = [
  {
    title: 'Independencia',
    text: 'Sin financiación institucional. Sin agenda política. Las conclusiones las dictan los datos.',
  },
  {
    title: 'Metodología abierta',
    text: 'Todo lo que publicamos incluye la metodología completa. Cualquiera puede replicar, criticar o mejorar nuestro trabajo.',
  },
  {
    title: 'Sin paywalls',
    text: 'El conocimiento económico es un bien público. Toda nuestra investigación es gratuita y de acceso libre.',
  },
  {
    title: 'Empirismo',
    text: 'Tenemos sesgos, como todo el mundo. Por eso publicamos la metodología, los datos y el código: para que cualquiera pueda encontrar los errores que nosotros no vemos. La imparcialidad no es un punto de llegada, es un esfuerzo constante.',
  },
];

const Nosotros = () => {
  const { lang } = useLanguage();
  const L = {
    teamLabel: lang === 'en' ? 'Team' : 'Equipo',
    howLabel: lang === 'en' ? 'How we work' : 'Cómo trabajamos',
  };

  const paragraphStyle: React.CSSProperties = {
    fontFamily: 'var(--font-editorial)',
    fontSize: 18,
    lineHeight: 1.85,
    color: 'var(--ink)',
    margin: 0,
    marginBottom: 20,
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
          <div style={{ ...labelStyle, marginBottom: 16 }}>Nosotros · sesmi</div>
          <h1
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 400,
              color: 'var(--ink)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Por qué existe <span className="wm">sesmi</span>.
          </h1>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 48 }} />
        </motion.section>

        {/* Manifiesto */}
        <section
          style={{
            paddingTop: 48,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            style={paragraphStyle}
          >
            Las ciudades medias españolas concentran millones de personas, décadas de historia
            industrial y problemas económicos reales. Casi nadie las analiza con rigor.
          </motion.p>
          <p style={paragraphStyle}>
            Los think tanks trabajan para Madrid o Barcelona. Las universidades publican papers
            que nadie lee. Los consultores cobran por informes que acaban en un cajón.
          </p>
          <p style={paragraphStyle}>
            {wm(
              'sesmi nació para hacer algo distinto: investigación económica independiente, con metodología abierta, escrita para que la entienda cualquier persona inteligente — no solo los economistas.',
            )}
          </p>
          <p style={{ ...paragraphStyle, marginBottom: 0 }}>
            El modelo es simple. Los servicios financian la investigación. La investigación es
            pública. Sin paywalls, sin agenda política, sin financiación institucional que
            condicione las conclusiones.
          </p>

          <blockquote
            style={{
              borderLeft: '2.5px solid var(--accent)',
              paddingLeft: 24,
              fontFamily: 'var(--font-editorial)',
              fontSize: 20,
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--ink)',
              margin: '40px 0',
              lineHeight: 1.5,
            }}
          >
            Debo saber. Mantenerse curioso.
          </blockquote>

          <div style={{ borderTop: '1px solid var(--line)' }} />
        </section>

        {/* Equipo */}
        <section
          style={{
            paddingTop: 48,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 32 }}>{L.teamLabel}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {team.map((m, idx) => (
              <li
                key={m.name}
                style={{
                  borderTop: idx === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: '1px solid var(--line)',
                  paddingTop: 32,
                  paddingBottom: 32,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    margin: 0,
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {m.name}
                </h3>
                <div
                  style={{
                    fontFamily: 'var(--font-haas)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 16,
                  }}
                >
                  {m.role}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 16,
                    lineHeight: 1.75,
                    color: 'var(--ink-secondary)',
                    margin: 0,
                  }}
                >
                  {m.bio}
                </p>
                {m.links.length > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: 'var(--font-haas)',
                      fontSize: 9,
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
                    {m.links.map((l, i) => (
                      <span key={l.href}>
                        {i > 0 && ' · '}
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="team-link"
                          style={{
                            color: 'var(--muted)',
                            textDecoration: 'none',
                            transition: 'color 150ms ease',
                          }}
                        >
                          {l.label}
                        </a>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 16,
              fontStyle: 'italic',
              color: 'var(--muted)',
              marginTop: 32,
              marginBottom: 0,
              lineHeight: 1.65,
            }}
          >
            {wm(
              'sesmi es un proyecto abierto y colaborativo. Si quieres contribuir, escríbenos.',
            )}
          </p>
        </section>

        {/* Principios */}
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
            <div style={{ ...labelStyle, marginBottom: 32 }}>{L.howLabel}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {principles.map((p, idx) => (
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
                      fontSize: 18,
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
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {p.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contacto */}
        <section
          style={{
            paddingTop: 48,
            paddingBottom: 64,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 18,
              lineHeight: 1.75,
              color: 'var(--ink-secondary)',
              margin: 0,
              marginBottom: 20,
            }}
          >
            Si tienes preguntas, quieres colaborar o simplemente quieres saber más — escríbenos.
          </p>
          <a
            href="mailto:hola@sesmi.org"
            className="nosotros-mail"
            style={{
              fontFamily: 'var(--font-haas)',
              fontSize: 11,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
          >
            hola@sesmi.org
          </a>
        </section>
      </div>

      <style>{`
        .team-link:hover { color: var(--ink) !important; }
        .nosotros-mail:hover { color: var(--muted) !important; }
      `}</style>
    </Layout>
  );
};

export default Nosotros;
