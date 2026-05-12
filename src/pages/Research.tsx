import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

type Status = 'in-progress' | 'published';
type ChapterStatus = 'in-progress' | 'pending';
type Chapter = { num: string; title: string; status: ChapterStatus };
type Report = {
  id: string;
  slug: string;
  status: Status;
  statusBadge: string;
  title: string;
  subtitle: string;
  desc: string;
  chapters: Chapter[];
};

const container: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  paddingLeft: 'clamp(20px, 4vw, 48px)',
  paddingRight: 'clamp(20px, 4vw, 48px)',
};

const Research = () => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'published'>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const copy = isEn
    ? {
        label: 'Research',
        title: 'Research.',
        desc: 'We publish our work openly. No paywalls. Economic knowledge is a public good.',
        filters: { all: 'All', inProgress: 'In progress', published: 'Published' },
        showChapters: 'Show chapters ↓',
        hideChapters: 'Hide ↑',
        readMore: 'Read research →',
        statusInProgress: 'IN PROGRESS',
        statusPublished: 'PUBLISHED',
        statusInProgressBadge: '● IN PROGRESS',
        chapStatusInProgress: 'IN PROGRESS',
        chapStatusPending: 'PENDING',
        upcoming: 'Upcoming research in development.',
        collabTitle: 'Have a question about your city?',
        collabText:
          'If there is something you want to understand about your city\u2019s economy — and you believe it deserves serious research — let us know. We work openly and collaboratively.',
        email: 'hola@sesmi.org',
      }
    : {
        label: 'Investigación',
        title: 'Análisis económico independiente.',
        desc: 'Publicamos nuestros trabajos de forma abierta. Sin paywalls. El conocimiento económico es un bien público.',
        filters: { all: 'Todo', inProgress: 'En elaboración', published: 'Publicado' },
        showChapters: 'Ver capítulos ↓',
        hideChapters: 'Ocultar ↑',
        readMore: 'Leer investigación →',
        statusInProgress: 'EN ELABORACIÓN',
        statusPublished: 'PUBLICADO',
        statusInProgressBadge: '● EN ELABORACIÓN',
        chapStatusInProgress: 'EN CURSO',
        chapStatusPending: 'PENDIENTE',
        upcoming: 'Próximas investigaciones en desarrollo.',
        collabTitle: '¿Tienes una pregunta sobre tu ciudad?',
        collabText:
          'Si hay algo que quieras entender sobre la economía de tu ciudad —y crees que merece una investigación seria— cuéntanoslo. Trabajamos de forma abierta y colaborativa.',
        email: 'hola@sesmi.org',
      };

  const reports: Report[] = isEn
    ? [
        {
          id: 'SESMI-001',
          slug: 'meta-datacenter',
          status: 'in-progress',
          statusBadge: copy.statusInProgressBadge,
          title: 'Welcome, Mr. Meta',
          subtitle: 'An independent economic analysis of the Meta Data Center in Talavera de la Reina.',
          desc: 'Meta is bringing 750 million euros and the largest data center in southern Europe to Talavera. How much of that money actually stays in the city? What conditions should Talavera negotiate to maximise local benefit?',
          chapters: [
            { num: '01', title: 'Context: the investment and the city', status: 'in-progress' },
            { num: '02', title: 'Direct and indirect economic impact', status: 'in-progress' },
            { num: '03', title: 'Employment and human capital', status: 'pending' },
            { num: '04', title: 'Taxation and local return', status: 'pending' },
            { num: '05', title: 'Negotiation recommendations', status: 'pending' },
          ],
        },
        {
          id: 'SESMI-002',
          slug: 'talavera-diagnostico',
          status: 'in-progress',
          statusBadge: copy.statusInProgressBadge,
          title: 'Talavera, the city that won\u2019t take off',
          subtitle: 'Independent economic diagnosis of a mid-sized Spanish city.',
          desc: 'Talavera de la Reina has spent decades losing population and economic activity relative to its surroundings. This report analyses the structural causes and proposes concrete lines of action.',
          chapters: [
            { num: '01', title: 'Demographics and internal migration', status: 'pending' },
            { num: '02', title: 'Productive structure', status: 'pending' },
            { num: '03', title: 'Comparison with similar cities', status: 'pending' },
            { num: '04', title: 'Proposals', status: 'pending' },
          ],
        },
      ]
    : [
        {
          id: 'SESMI-001',
          slug: 'meta-datacenter',
          status: 'in-progress',
          statusBadge: copy.statusInProgressBadge,
          title: 'Bienvenido, Mr. Meta',
          subtitle: 'Un análisis económico independiente del Meta Data Center en Talavera de la Reina.',
          desc: 'Meta llega a Talavera con 750 millones de euros y el data center más grande del sur de Europa. ¿Cuánto de ese dinero se queda realmente en la ciudad? ¿Qué condiciones debería negociar Talavera para maximizar el beneficio local?',
          chapters: [
            { num: '01', title: 'Contexto: la inversión y la ciudad', status: 'in-progress' },
            { num: '02', title: 'Impacto económico directo e indirecto', status: 'in-progress' },
            { num: '03', title: 'Empleo y capital humano', status: 'pending' },
            { num: '04', title: 'Fiscalidad y retorno local', status: 'pending' },
            { num: '05', title: 'Recomendaciones de negociación', status: 'pending' },
          ],
        },
        {
          id: 'SESMI-002',
          slug: 'talavera-diagnostico',
          status: 'in-progress',
          statusBadge: copy.statusInProgressBadge,
          title: 'Talavera, la ciudad que no arranca',
          subtitle: 'Diagnóstico económico independiente de una ciudad media española.',
          desc: 'Talavera de la Reina lleva décadas perdiendo población y actividad económica respecto a su entorno. Este informe analiza las causas estructurales y propone líneas de acción concretas.',
          chapters: [
            { num: '01', title: 'Demografía y migración interna', status: 'pending' },
            { num: '02', title: 'Estructura productiva', status: 'pending' },
            { num: '03', title: 'Comparativa con ciudades similares', status: 'pending' },
            { num: '04', title: 'Propuestas', status: 'pending' },
          ],
        },
      ];

  const visible = reports.filter((r) => filter === 'all' || r.status === filter);

  // Tokens
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-haas)',
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: 'var(--muted)',
  };
  const filterBase: React.CSSProperties = {
    fontFamily: 'var(--font-haas)',
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'color 150ms ease',
  };
  const sep: React.CSSProperties = {
    fontFamily: 'var(--font-haas)',
    fontSize: '9px',
    color: 'var(--muted-2)',
    margin: '0 10px',
  };

  const filterOptions: Array<{ key: 'all' | 'in-progress' | 'published'; label: string }> = [
    { key: 'all', label: copy.filters.all },
    { key: 'in-progress', label: copy.filters.inProgress },
    { key: 'published', label: copy.filters.published },
  ];

  return (
    <Layout>
      <div style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <header style={{ ...container, paddingTop: '64px' }}>
          
          <h1
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '20px',
            }}
          >
            {copy.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '18px',
              fontStyle: 'italic',
              color: 'var(--ink-secondary)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {copy.desc}
          </p>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: '48px' }} />
        </header>

        {/* Filters */}
        <div
          style={{
            ...container,
            paddingTop: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {filterOptions.map((f, i) => {
              const active = filter === f.key;
              return (
                <span key={f.key} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {i > 0 && <span style={sep}>·</span>}
                  <button
                    onClick={() => setFilter(f.key)}
                    style={{
                      ...filterBase,
                      color: active ? 'var(--ink)' : 'var(--muted)',
                      fontWeight: active ? 700 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
                    }}
                  >
                    {f.label}
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* Reports list */}
        <section>
          {visible.map((r) => {
            const isOpen = !!expanded[r.id];
            return (
              <article
                key={r.id}
                style={{
                  ...container,
                  paddingTop: '40px',
                  paddingBottom: '40px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--accent)',
                    }}
                  >
                    {r.id}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-haas)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--accent)',
                    }}
                  >
                    {r.statusBadge}
                  </span>
                </div>

                {/* Title link */}
                <Link
                  to={`/research/${r.slug}`}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '28px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: 'var(--ink)',
                    marginTop: '12px',
                    marginBottom: '12px',
                    textDecoration: 'none',
                    transition: 'opacity 150ms ease',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                >
                  {r.title}
                </Link>

                {/* Subtitle */}
                <p
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '17px',
                    fontStyle: 'italic',
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                  }}
                >
                  {r.subtitle}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '17px',
                    fontWeight: 400,
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.75,
                    marginBottom: '20px',
                  }}
                >
                  {r.desc}
                </p>

                {/* Chapters toggle */}
                <button
                  onClick={() => setExpanded((s) => ({ ...s, [r.id]: !s[r.id] }))}
                  style={{
                    fontFamily: 'var(--font-haas)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--muted)',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
                >
                  {isOpen ? copy.hideChapters : copy.showChapters}
                </button>

                {isOpen && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--line)' }}>
                    {r.chapters.map((c) => (
                      <div
                        key={c.num}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '32px 1fr auto',
                          alignItems: 'baseline',
                          gap: '16px',
                          padding: '10px 0',
                          borderBottom: '1px solid var(--line)',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>
                          {c.num}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-editorial)',
                            fontSize: '16px',
                            color: 'var(--ink)',
                          }}
                        >
                          {c.title}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-haas)',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            color: c.status === 'in-progress' ? 'var(--accent)' : 'var(--muted)',
                          }}
                        >
                          {c.status === 'in-progress' ? copy.chapStatusInProgress : copy.chapStatusPending}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Read more */}
                <div style={{ marginTop: '8px' }}>
                  <Link
                    to={`/research/${r.slug}`}
                    style={{
                      fontFamily: 'var(--font-haas)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                      color: 'var(--muted)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                      display: 'inline-block',
                      paddingTop: '12px',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
                  >
                    {copy.readMore}
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* Upcoming */}
        <div style={{ ...container, padding: '40px 0', borderBottom: '1px solid var(--line)' }}>
          <div style={container}>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '17px',
                fontStyle: 'italic',
                color: 'var(--muted)',
                margin: 0,
              }}
            >
              {copy.upcoming}
            </p>
          </div>
        </div>

        {/* Collaboration block */}
        <section style={{ background: 'var(--bg-2)', padding: '56px 0' }}>
          <div style={container}>
            <h2
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '24px',
                fontWeight: 400,
                color: 'var(--ink)',
                marginBottom: '16px',
                lineHeight: 1.2,
              }}
            >
              {copy.collabTitle}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '18px',
                lineHeight: 1.75,
                color: 'var(--ink-secondary)',
                marginBottom: '24px',
              }}
            >
              {copy.collabText}
            </p>
            <a
              href={`mailto:${copy.email}`}
              style={{
                fontFamily: 'var(--font-haas)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                color: 'var(--ink)',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')}
            >
              {copy.email}
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Research;
