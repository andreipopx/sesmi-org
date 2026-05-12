import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import Ticker from '../components/Ticker';
import SectionHeader from '../components/SectionHeader';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';
import { useLanguage } from '../contexts/LanguageContext';

const proseSection: React.CSSProperties = {
  maxWidth: 'var(--max-prose)',
  margin: '0 auto',
  paddingLeft: 'clamp(24px, 4vw, 48px)',
  paddingRight: 'clamp(24px, 4vw, 48px)',
  paddingTop: '80px',
  paddingBottom: '80px',
};

const Index = () => {
  const { t } = useLanguage();
  const inProgressLabels = ['EN CURSO', 'IN PROGRESS'];

  return (
    <Layout>
      {/* HERO */}
      <HeroSection />

      {/* TICKER */}
      <Ticker />

      {/* RESEARCH */}
      <section style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <div style={proseSection}>
          <AnimatedEntry>
            <SectionHeader label={t.research.sectionLabel} />
          </AnimatedEntry>

          {/* Featured report */}
          <AnimatedEntry delay={0.08}>
            <article style={{ paddingTop: '32px', paddingBottom: '32px', borderTop: '1px solid var(--line)' }}>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  marginBottom: '8px',
                }}
              >
                {t.research.featured.code}
              </p>
              <h3
                className="font-editorial text-ink"
                style={{ fontSize: '22px', fontWeight: 400, marginBottom: '8px', lineHeight: 1.25 }}
              >
                {t.research.featured.title}
              </h3>
              <p
                className="font-editorial"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--ink-secondary)',
                  marginBottom: '16px',
                }}
              >
                {t.research.featured.subtitle}
              </p>
              <p
                className="font-editorial"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--ink-secondary)',
                  marginBottom: '16px',
                }}
              >
                {t.research.featured.desc}
              </p>

              {/* Status badge */}
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  color: 'var(--accent)',
                  marginBottom: '16px',
                }}
              >
                <span style={{ color: 'var(--accent)', marginRight: '6px' }}>●</span>
                {t.research.featured.status}
              </p>

              {/* Chapters */}
              <ul style={{ marginBottom: '20px', listStyle: 'none', padding: 0 }}>
                {t.research.featured.chapters.map((ch) => (
                  <li
                    key={ch.n}
                    className="font-mono"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.04em',
                      color: 'var(--muted)',
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      display: 'flex',
                      gap: '12px',
                    }}
                  >
                    <span>{ch.n}</span>
                    <span style={{ flex: 1, color: 'var(--ink-secondary)', textTransform: 'none' }}>
                      {ch.title}
                    </span>
                    <span
                      style={{
                        textTransform: 'uppercase',
                        color: inProgressLabels.includes(ch.status) ? 'var(--accent)' : 'var(--muted-2)',
                      }}
                    >
                      {ch.status}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/research"
                className="font-mono uppercase"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--muted)',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {t.research.featured.cta}
              </Link>
            </article>
          </AnimatedEntry>

          {/* Next report */}
          <AnimatedEntry delay={0.16}>
            <article style={{ paddingTop: '32px', paddingBottom: '32px', borderTop: '1px solid var(--line)' }}>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  marginBottom: '8px',
                }}
              >
                {t.research.next.label}
              </p>
              <h3
                className="font-editorial text-ink"
                style={{ fontSize: '22px', fontWeight: 400, marginBottom: '8px', lineHeight: 1.25 }}
              >
                {t.research.next.title}
              </h3>
              <p
                className="font-editorial"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--ink-secondary)',
                  marginBottom: '16px',
                }}
              >
                {t.research.next.subtitle}
              </p>
              <Link
                to="/research"
                className="font-mono uppercase"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--muted)',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {t.research.next.cta}
              </Link>
            </article>
          </AnimatedEntry>
        </div>
      </section>

      {/* LÍNEAS DE TRABAJO */}
      <section style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        <div style={proseSection}>
          <AnimatedEntry>
            <SectionHeader label={t.work.sectionLabel} />
          </AnimatedEntry>
          {t.work.items.map((item, i) => (
            <AnimatedEntry key={item.idx} delay={i * 0.08}>
              <div
                style={{
                  paddingTop: '32px',
                  paddingBottom: '32px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--accent)',
                    marginBottom: '8px',
                  }}
                >
                  {item.idx} — {item.tag}
                </p>
                <h3
                  className="font-editorial text-ink"
                  style={{ fontSize: '22px', fontWeight: 400, marginBottom: '8px', lineHeight: 1.25 }}
                >
                  {item.name}
                </h3>
                <p
                  className="font-editorial"
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: 'var(--ink-secondary)',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </AnimatedEntry>
          ))}
        </div>
      </section>

      {/* SOBRE SESMI / MANIFIESTO */}
      <section style={{ backgroundColor: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div style={proseSection}>
          <AnimatedEntry>
            <SectionHeader label={t.manifesto.label.replace(/^\/\/\s*/, '')} />
          </AnimatedEntry>

          <AnimatedEntry delay={0.08}>
            <h2
              className="font-editorial text-ink"
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: '24px',
              }}
            >
              {t.manifesto.title}
            </h2>
          </AnimatedEntry>

          <AnimatedEntry delay={0.16}>
            <p
              className="font-editorial"
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: 'var(--ink-secondary)',
                marginBottom: '32px',
              }}
            >
              {t.manifesto.text}
            </p>
          </AnimatedEntry>

          <AnimatedEntry delay={0.24}>
            <blockquote
              className="font-editorial italic text-ink"
              style={{
                borderLeft: '2.5px solid var(--accent)',
                paddingLeft: '24px',
                fontSize: '20px',
                lineHeight: 1.5,
                marginBottom: '32px',
              }}
            >
              {t.manifesto.principle}
            </blockquote>
          </AnimatedEntry>

          <AnimatedEntry delay={0.32}>
            <Link
              to="/nosotros"
              className="font-mono uppercase text-ink"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            >
              {t.manifesto.cta}
            </Link>
          </AnimatedEntry>
        </div>
      </section>

      {/* WAITLIST */}
      <WaitlistForm />
    </Layout>
  );
};

export default Index;
