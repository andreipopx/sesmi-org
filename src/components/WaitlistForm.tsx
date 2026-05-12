import { useState } from 'react';
import AnimatedEntry from './AnimatedEntry';
import { useLanguage } from '../contexts/LanguageContext';

const WaitlistForm = () => {
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

  return (
    <section
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--line)',
        paddingTop: '48px',
        paddingBottom: '48px',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-prose)',
          margin: '0 auto',
          paddingLeft: 'clamp(24px, 4vw, 48px)',
          paddingRight: 'clamp(24px, 4vw, 48px)',
        }}
      >
        <AnimatedEntry>
          <p
            className="font-haas uppercase text-muted"
            style={{ fontSize: '9px', letterSpacing: '0.10em', marginBottom: '24px' }}
          >
            {t.waitlist.label}
          </p>
        </AnimatedEntry>

        <AnimatedEntry delay={0.08}>
          <h2
            className="font-editorial text-ink"
            style={{ fontSize: '28px', fontWeight: 400, marginBottom: '16px', lineHeight: 1.2 }}
          >
            {t.waitlist.title}
          </h2>
        </AnimatedEntry>

        <AnimatedEntry delay={0.16}>
          <p
            className="font-editorial"
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: 'var(--ink-secondary)',
              marginBottom: '32px',
            }}
          >
            {t.waitlist.desc}
          </p>
        </AnimatedEntry>

        <AnimatedEntry delay={0.24}>
          {submitted ? (
            <p
              className="font-haas uppercase"
              style={{ fontSize: '9px', letterSpacing: '0.10em', color: 'var(--accent)' }}
            >
              {t.waitlist.success}
            </p>
          ) : (
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
                  fontSize: '18px',
                  padding: '8px 0',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor = 'var(--ink)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor = 'var(--line)';
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="font-haas uppercase text-offwhite"
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
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ink)';
                }}
              >
                {loading ? '...' : t.waitlist.cta}
              </button>
            </form>
          )}
        </AnimatedEntry>
      </div>
    </section>
  );
};

export default WaitlistForm;
