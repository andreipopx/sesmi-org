import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const container: React.CSSProperties = {
  maxWidth: 'var(--max-prose)',
  margin: '0 auto',
  paddingLeft: 'clamp(24px, 4vw, 48px)',
  paddingRight: 'clamp(24px, 4vw, 48px)',
};

const monoLabel: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.08em',
};

const readLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, color: string) => {
  e.currentTarget.style.color = color;
};

const Index = () => {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <Layout>
      {/* 1. CABECERA DE PORTADA */}
      <section style={{ ...container, paddingTop: '72px' }}>
        <p
          className="font-mono uppercase"
          style={{ ...monoLabel, color: 'var(--muted)' }}
        >
          {h.kicker}
        </p>
        <div
          style={{
            marginTop: '48px',
            borderTop: '1px solid var(--line)',
          }}
        />
      </section>

      {/* 2. TRABAJOS EN CURSO */}
      <section style={{ ...container, paddingTop: '48px' }}>
        <p
          className="font-mono uppercase"
          style={{ ...monoLabel, color: 'var(--muted)', marginBottom: '40px' }}
        >
          {h.worksLabel}
        </p>

        {/* PIEZA PRINCIPAL */}
        <motion.article
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          style={{ paddingTop: '48px', paddingBottom: '48px' }}
        >
          <p
            className="font-mono uppercase"
            style={{ ...monoLabel, color: 'var(--accent)', marginBottom: '12px' }}
          >
            {h.featured.code}
          </p>
          <h2
            className="font-editorial text-ink"
            style={{ fontSize: '36px', fontWeight: 400, lineHeight: 1.2, marginBottom: '16px' }}
          >
            {h.featured.title}
          </h2>
          <p
            className="font-editorial"
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: 'var(--ink-secondary)',
              maxWidth: '560px',
              marginBottom: '20px',
            }}
          >
            {h.featured.subtitle}
          </p>
          <p
            className="font-editorial"
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--ink-secondary)',
              maxWidth: '640px',
              marginBottom: '24px',
            }}
          >
            {h.featured.lede}
          </p>
          <p
            className="font-mono uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--accent)' }}
          >
            {h.statusBadge}
          </p>
          <Link
            to="/research"
            className="font-mono uppercase inline-block"
            style={{
              ...monoLabel,
              color: 'var(--muted)',
              marginTop: '16px',
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
          style={{ paddingTop: '40px', paddingBottom: '40px' }}
        >
          <p
            className="font-mono uppercase"
            style={{ ...monoLabel, color: 'var(--accent)', marginBottom: '12px' }}
          >
            {h.secondary.code}
          </p>
          <h3
            className="font-editorial text-ink"
            style={{ fontSize: '24px', fontWeight: 400, lineHeight: 1.25, marginBottom: '12px' }}
          >
            {h.secondary.title}
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
            {h.secondary.subtitle}
          </p>
          <p
            className="font-mono uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--accent)' }}
          >
            {h.statusBadge}
          </p>
        </motion.article>
      </section>

      {/* 3. SEPARADOR */}
      <div style={{ borderTop: '1px solid var(--line)' }} />

      {/* 4. SOBRE SESMI */}
      <section
        style={{
          ...container,
          paddingTop: '64px',
          paddingBottom: '64px',
          backgroundColor: 'var(--bg)',
        }}
      >
        <p
          className="font-editorial"
          style={{
            fontSize: '18px',
            lineHeight: 1.75,
            color: 'var(--ink-secondary)',
            marginBottom: '32px',
          }}
        >
          {h.about.text}
        </p>
        <Link
          to="/nosotros"
          className="font-mono uppercase inline-block"
          style={{ ...monoLabel, color: 'var(--muted)', transition: 'color 150ms ease' }}
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
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div style={container}>
          <p
            className="font-editorial"
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--ink-secondary)',
              marginBottom: '24px',
            }}
          >
            {h.newsletter.text}
          </p>
          <NewsletterForm />
        </div>
      </section>
    </Layout>
  );
};

import { useState } from 'react';

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
        className="font-mono uppercase"
        style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--accent)' }}
      >
        {t.waitlist.success}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-end"
      style={{ gap: '16px' }}
    >
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
          fontSize: '16px',
          padding: '8px 0',
          outline: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--ink)')}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--line)')}
      />
      <button
        type="submit"
        disabled={loading}
        className="font-mono uppercase text-offwhite"
        style={{
          fontSize: '11px',
          letterSpacing: '0.08em',
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
