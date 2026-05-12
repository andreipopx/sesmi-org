import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const container: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  paddingLeft: 'clamp(20px, 4vw, 48px)',
  paddingRight: 'clamp(20px, 4vw, 48px)',
};

type ChapterStatus = 'in-progress' | 'pending';
type Chapter = { num: string; title: string; status: ChapterStatus };

const ResearchArticle = () => {
  const [progress, setProgress] = useState(0);
  const { lang } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isEn = lang === 'en';

  const copy = isEn
    ? {
        title: 'Welcome, Mr. Zuckerberg?',
        subtitle:
          'An independent economic analysis of the Meta Data Center in Talavera de la Reina.',
        meta: 'In progress · Talavera de la Reina · 2025',
        statusBadge: '● IN PROGRESS',
        contentsLabel: 'Contents',
        statusInProgress: 'IN PROGRESS',
        statusPending: 'PENDING',
        methodology:
          'Methodology: combination of public sources (BOE, INE, municipal records), interviews with local actors, and standard input-output analysis. Figures and conclusions will evolve as the research progresses.',
        prev: '← Previous',
        next: 'Next →',
      }
    : {
        title: '¿Bienvenido, Mr. Zuckerberg?',
        subtitle:
          'Un análisis económico independiente del Meta Data Center en Talavera de la Reina.',
        meta: 'En elaboración · Talavera de la Reina · 2025',
        statusBadge: '● EN ELABORACIÓN',
        contentsLabel: 'Índice',
        statusInProgress: 'EN CURSO',
        statusPending: 'PENDIENTE',
        methodology:
          'Metodología: combinación de fuentes públicas (BOE, INE, registros municipales), entrevistas con actores locales y análisis input-output estándar. Las cifras y conclusiones se irán matizando según avance la investigación.',
        prev: '← Anterior',
        next: 'Siguiente →',
      };

  const chapters: Chapter[] = isEn
    ? [
        { num: '01', title: 'Context: the investment and the city', status: 'in-progress' },
        { num: '02', title: 'Direct and indirect economic impact', status: 'in-progress' },
        { num: '03', title: 'Local employment and qualification', status: 'pending' },
        { num: '04', title: 'Tax retention and public revenue', status: 'pending' },
        { num: '05', title: 'Conditions Talavera should negotiate', status: 'pending' },
      ]
    : [
        { num: '01', title: 'Contexto: la inversión y la ciudad', status: 'in-progress' },
        { num: '02', title: 'Impacto económico directo e indirecto', status: 'in-progress' },
        { num: '03', title: 'Empleo local y cualificación', status: 'pending' },
        { num: '04', title: 'Retención fiscal e ingresos públicos', status: 'pending' },
        { num: '05', title: 'Condiciones que Talavera debería negociar', status: 'pending' },
      ];

  // Style tokens
  const sectionH2: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: 1.25,
    color: 'var(--ink)',
    marginTop: '48px',
    marginBottom: '16px',
  };
  const subH3: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    fontStyle: 'italic',
    color: 'var(--ink)',
    marginTop: '32px',
    marginBottom: '12px',
  };
  const bodyP: React.CSSProperties = {
    fontSize: '18px',
    lineHeight: 1.85,
    color: 'var(--ink)',
    marginBottom: '20px',
  };
  const blockquote: React.CSSProperties = {
    borderLeft: '2.5px solid var(--accent)',
    paddingLeft: '24px',
    fontSize: '19px',
    fontStyle: 'italic',
    color: 'var(--ink)',
    margin: '32px 0',
    lineHeight: 1.6,
  };
  const sourceNote: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--muted)',
    marginTop: '-12px',
    marginBottom: '20px',
    letterSpacing: '0.04em',
  };
  const accentNum: React.CSSProperties = {
    fontWeight: 700,
    color: 'var(--accent)',
  };

  return (
    <Layout>
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <article>
        {/* Cabecera */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ ...container, paddingTop: '64px' }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '12px',
              letterSpacing: '0.04em',
              color: 'var(--accent)',
              marginBottom: '16px',
            }}
          >
            SESMI-001
          </p>

          <h1
            className="font-editorial article-title"
            style={{
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--ink)',
              marginBottom: '20px',
            }}
          >
            {copy.title}
          </h1>

          <p
            className="font-editorial italic"
            style={{
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--ink-secondary)',
              marginBottom: '32px',
            }}
          >
            {copy.subtitle}
          </p>

          <p
            className="font-haas uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--muted)',
              marginBottom: '8px',
            }}
          >
            {copy.meta}
          </p>

          <p
            className="font-haas uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              marginBottom: '40px',
            }}
          >
            {copy.statusBadge}
          </p>

          <div style={{ borderTop: '1px solid var(--line)', marginBottom: '40px' }} />
        </motion.header>

        {/* Índice */}
        <section style={{ ...container, marginBottom: '56px' }}>
          <p
            className="font-haas uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: 'var(--muted)',
              marginBottom: '16px',
            }}
          >
            {copy.contentsLabel}
          </p>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {chapters.map((c, i) => (
              <li
                key={c.num}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'baseline',
                  gap: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderTop: i === 0 ? '1px solid var(--line)' : 'none',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.04em' }}
                >
                  {c.num}
                </span>
                <span
                  className="font-editorial"
                  style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.4 }}
                >
                  {c.title}
                </span>
                <span
                  className="font-haas uppercase"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    color:
                      c.status === 'in-progress' ? 'var(--accent)' : 'var(--muted)',
                  }}
                >
                  {c.status === 'in-progress' ? copy.statusInProgress : copy.statusPending}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cuerpo */}
        <section style={container} className="font-editorial">
          {isEn ? (
            <>
              <h2 className="font-editorial" style={sectionH2}>
                01. Context: the investment and the city
              </h2>
              <p style={bodyP}>
                In early 2024, Meta announced the construction of its largest data center in
                southern Europe in Talavera de la Reina, a mid-sized city in central Spain with
                roughly <span style={accentNum}>83,000</span> inhabitants. The investment:{' '}
                <span style={accentNum}>€750 million</span>. The question this report asks is
                straightforward — how much of that money actually stays in the city?
              </p>
              <p className="font-haas" style={sourceNote}>
                Source: Meta press release, January 2024 · INE municipal padrón.
              </p>

              <blockquote style={blockquote}>
                A €750 million investment doesn't automatically mean €750 million in local
                benefit. The real question is about retention — how much stays, and under what
                conditions.
              </blockquote>

              <p style={bodyP}>
                Talavera sits 120 km southwest of Madrid, connected by highway and a struggling
                rail service. It has experienced two decades of population decline, economic
                stagnation, and a persistent brain drain of its youngest and most qualified
                residents. Meta's arrival represents, numerically, the largest private investment
                in the city's modern history.
              </p>

              <h3 className="font-editorial italic" style={subH3}>
                A city under pressure
              </h3>
              <p style={bodyP}>
                Median household income in Talavera is roughly{' '}
                <span style={accentNum}>22%</span> below the national average. Youth unemployment
                exceeds <span style={accentNum}>30%</span>. Any investment of this scale
                inevitably generates expectations that should be examined with care.
              </p>

              <h2 className="font-editorial" style={sectionH2}>
                02. Direct and indirect economic impact
              </h2>
              <p style={bodyP}>
                Data centers are capital-intensive but labor-light. The construction phase
                generates significant temporary employment, but the operational phase typically
                requires a small, highly specialized workforce. This creates a fundamental tension
                between the headline investment figure and the actual long-term economic
                footprint.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-editorial" style={sectionH2}>
                01. Contexto: la inversión y la ciudad
              </h2>
              <p style={bodyP}>
                A principios de 2024, Meta anunció la construcción de su mayor data center del sur
                de Europa en Talavera de la Reina, una ciudad de unos{' '}
                <span style={accentNum}>83.000</span> habitantes en el centro de España. La
                inversión: <span style={accentNum}>750 millones</span> de euros. La pregunta que
                este informe plantea es directa — ¿cuánto de ese dinero se queda realmente en la
                ciudad?
              </p>
              <p className="font-haas" style={sourceNote}>
                Fuente: nota de prensa de Meta, enero 2024 · padrón municipal INE.
              </p>

              <blockquote style={blockquote}>
                Una inversión de 750 millones no significa automáticamente 750 millones en
                beneficio local. La pregunta real es sobre retención — cuánto se queda, y bajo qué
                condiciones.
              </blockquote>

              <p style={bodyP}>
                Talavera se sitúa a 120 km al suroeste de Madrid, conectada por autovía y un
                servicio ferroviario en dificultades. Ha experimentado dos décadas de declive
                demográfico, estancamiento económico y una fuga persistente de sus residentes más
                jóvenes y cualificados. La llegada de Meta representa, numéricamente, la mayor
                inversión privada en la historia moderna de la ciudad.
              </p>

              <h3 className="font-editorial italic" style={subH3}>
                Una ciudad bajo presión
              </h3>
              <p style={bodyP}>
                La renta media por hogar en Talavera está aproximadamente un{' '}
                <span style={accentNum}>22%</span> por debajo de la media nacional. El paro
                juvenil supera el <span style={accentNum}>30%</span>. Cualquier inversión de esta
                escala genera inevitablemente expectativas que conviene examinar con cuidado.
              </p>

              <h2 className="font-editorial" style={sectionH2}>
                02. Impacto económico directo e indirecto
              </h2>
              <p style={bodyP}>
                Los data centers son intensivos en capital pero ligeros en empleo. La fase de
                construcción genera empleo temporal significativo, pero la fase operativa
                típicamente requiere una plantilla pequeña y altamente especializada. Esto crea
                una tensión fundamental entre la cifra de inversión titular y la huella económica
                real a largo plazo.
              </p>
            </>
          )}
        </section>

        {/* Pie */}
        <footer style={{ ...container, paddingBottom: '96px' }}>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: '64px' }} />

          <p
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: 'var(--muted)',
              marginTop: '24px',
              marginBottom: '8px',
            }}
          >
            JEL: R11 · R23 · J61
          </p>

          <p
            className="font-haas"
            style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.6 }}
          >
            {copy.methodology}
          </p>

          <nav
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '40px',
            }}
          >
            <span
              className="font-haas uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
              }}
            >
              {copy.prev}
            </span>
            <span
              className="font-haas uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--muted)',
              }}
            >
              {copy.next}
            </span>
          </nav>
        </footer>
      </article>

      <style>{`
        .article-title { font-size: clamp(32px, 5vw, 48px); }
        @media (max-width: 640px) {
          .article-title { font-size: clamp(28px, 6vw, 40px); }
        }
      `}</style>
    </Layout>
  );
};

export default ResearchArticle;
