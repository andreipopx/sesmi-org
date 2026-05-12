import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { wm } from '../lib/wm';

const container: React.CSSProperties = {
  maxWidth: 'var(--max-prose)',
  margin: '0 auto',
  paddingLeft: 'clamp(24px, 4vw, 48px)',
  paddingRight: 'clamp(24px, 4vw, 48px)',
};

// Tokens funcionales (Alte Haas)
const labelStyle: React.CSSProperties = { fontSize: '9px', letterSpacing: '0.18em' };
const navOrButton: React.CSSProperties = { fontSize: '10px', letterSpacing: '0.10em' };
const badgeStyle: React.CSSProperties = { fontSize: '8px', letterSpacing: '0.12em' };
// IDs (Liberation Mono)
const idStyle: React.CSSProperties = { fontSize: '10px', letterSpacing: '0.04em' };

const readLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, color: string) => {
  e.currentTarget.style.color = color;
};

const Index = () => {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <Layout>
      {/* 1. CABECERA */}
      <section style={{ ...container, paddingTop: '48px' }}>
        <p className="font-haas uppercase" style={{ ...labelStyle, color: 'var(--muted)' }}>
          {h.kicker}
        </p>
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--line)' }} />
      </section>

      {/* 2. TRABAJOS EN CURSO */}
      <section style={{ ...container, paddingTop: '48px', paddingBottom: '48px' }}>
        <p
          className="font-haas uppercase"
          style={{ ...labelStyle, color: 'var(--muted)', marginBottom: '10px' }}
        >
          {h.worksLabel}
        </p>

        {/* PIEZA PRINCIPAL */}
        <motion.article
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          style={{ paddingTop: '28px', paddingBottom: '28px' }}
        >
          <p
            className="font-mono uppercase"
            style={{ ...idStyle, color: 'var(--accent)', marginBottom: '10px' }}
          >
            {h.featured.code}
          </p>
          <h2
            className="font-editorial text-ink"
            style={{ fontSize: '34px', fontWeight: 700, lineHeight: 1.2, marginBottom: '14px' }}
          >
            {h.featured.title}
          </h2>
          <p
            className="font-editorial italic"
            style={{
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: 1.65,
              color: 'var(--ink-secondary)',
              maxWidth: '560px',
              marginBottom: '16px',
            }}
          >
            {h.featured.subtitle}
          </p>
          <p
            className="font-editorial"
            style={{
              fontSize: '18px',
              lineHeight: 1.85,
              color: 'var(--ink-secondary)',
              maxWidth: '640px',
              marginBottom: '16px',
            }}
          >
            {wm(h.featured.lede)}
          </p>
          <p className="font-haas uppercase" style={{ ...badgeStyle, color: 'var(--accent)' }}>
            {h.statusBadge}
          </p>
          <Link
            to="/research"
            className="font-haas uppercase inline-block"
            style={{
              ...navOrButton,
              color: 'var(--muted)',
              marginTop: '12px',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => readLinkHover(e, 'var(--ink)')}
            onMouseLeave={(e) => readLinkHover(e, 'var(--muted)')}
          >
            {h.readCta}
          </Link>
        </motion.article>

        <div style={{ borderTop: '1px solid var(--line)' }} />

        {/* PIEZA SECUNDARIA */}
        <motion.article
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' as const, delay: 0.1 }}
          style={{ paddingTop: '28px', paddingBottom: '28px' }}
        >
          <p
            className="font-mono uppercase"
            style={{ ...idStyle, color: 'var(--accent)', marginBottom: '10px' }}
          >
            {h.secondary.code}
          </p>
          <h3
            className="font-editorial text-ink"
            style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.25, marginBottom: '14px' }}
          >
            {h.secondary.title}
          </h3>
          <p
            className="font-editorial"
            style={{
              fontSize: '18px',
              lineHeight: 1.85,
              color: 'var(--ink-secondary)',
              marginBottom: '16px',
            }}
          >
            {h.secondary.subtitle}
          </p>
          <p className="font-haas uppercase" style={{ ...badgeStyle, color: 'var(--accent)' }}>
            {h.statusBadge}
          </p>
        </motion.article>
      </section>

      <div style={{ borderTop: '1px solid var(--line)' }} />

      {/* 4. SOBRE sesmi */}
      <section
        style={{
          ...container,
          paddingTop: '48px',
          paddingBottom: '48px',
          backgroundColor: 'var(--bg)',
        }}
      >
        <p
          className="font-editorial"
          style={{
            fontSize: '18px',
            lineHeight: 1.85,
            color: 'var(--ink-secondary)',
            marginBottom: '16px',
          }}
        >
          {wm(h.about.text)}
        </p>
        <Link
          to="/nosotros"
          className="font-haas uppercase inline-block"
          style={{ ...navOrButton, color: 'var(--muted)', transition: 'color 150ms ease' }}
          onMouseEnter={(e) => readLinkHover(e, 'var(--ink)')}
          onMouseLeave={(e) => readLinkHover(e, 'var(--muted)')}
        >
          {h.about.cta}
        </Link>
      </section>

      {/* 5. NEWSLETTER */}
      <section
        style={{
          backgroundColor: 'var(--bg-2)',
          borderTop: '1px solid var(--line)',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <div style={container}>
          <p
            className="font-editorial"
            style={{
              fontSize: '18px',
              lineHeight: 1.85,
              color: 'var(--ink-secondary)',
              marginBottom: '16px',
            }}
          >
            {wm(h.newsletter.text)}
          </p>
          <NewsletterForm />
        </div>
      </section>
    </Layout>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <p
        className="font-haas uppercase"
        style={{ fontSize: '10px', letterSpacing: '0.10em', color: 'var(--accent)' }}
      >
        {t.waitlist.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end" style={{ gap: '16px' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.waitlist.placeholder}
        required
        className="font-editorial flex-1 text-ink"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--line)',
          borderRadius: 0,
          fontSize: '18px',
          padding: '8px 0',
          outline: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--ink)')}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--line)')}
      />
      <button
        type="submit"
        disabled={loading}
        className="font-haas uppercase text-offwhite"
        style={{
          fontSize: '10px',
          letterSpacing: '0.10em',
          backgroundColor: 'var(--ink)',
          padding: '10px 20px',
          transition: 'background-color 150ms ease',
          opacity: loading ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = 'var(--ink-secondary)';
        }}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ink)')}
      >
        {loading ? '...' : t.waitlist.cta}
      </button>
    </form>
  );
};

export default Index;
