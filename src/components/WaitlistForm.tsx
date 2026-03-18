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
    await new Promise(r => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="bg-bg3 py-20 px-6">
      <div className="max-w-[600px] mx-auto text-center">
        <AnimatedEntry>
          <p className="label-style text-warm mb-6">{t.waitlist.label}</p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.1}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            {t.waitlist.title}
          </h2>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <p className="text-sesmi-muted text-sm mb-8">{t.waitlist.desc}</p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.3}>
          {submitted ? (
            <p className="font-mono text-sm text-warm">{t.waitlist.success}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.waitlist.placeholder}
                required
                className="flex-1 px-4 py-3 bg-bg border border-sesmi-line font-sans text-sm text-ink placeholder:text-muted2"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-ink text-sesmi-white font-mono text-[0.7rem] uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink2 transition-colors interactive disabled:opacity-50"
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
