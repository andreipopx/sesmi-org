import { useState } from 'react';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import { useLanguage } from '../contexts/LanguageContext';
import { wm } from '../lib/wm';

const cities = [
  { name: 'Talavera de la Reina', active: true },
  { name: 'Ponferrada', active: false },
  { name: 'Mérida', active: false },
  { name: 'Linares', active: false },
  { name: 'Alcoy', active: false },
  { name: 'Sagunto', active: false },
];

const Nosotros = () => {
  const [formState, setFormState] = useState({ name: '', email: '', org: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  return (
    <Layout>
      {/* About */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <AnimatedEntry>
          <p className="font-haas text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
            {t.about.label} ───────────────────────────────
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.1}>
          <h1 className="font-editorial text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-10 max-w-4xl leading-tight">
            {t.about.title}
          </h1>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <div className="max-w-3xl space-y-6 text-sesmi-muted leading-relaxed mb-10">
            {t.about.manifesto.map((p, i) => (
              <p key={i}>{wm(p)}</p>
            ))}
          </div>
        </AnimatedEntry>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <AnimatedEntry>
          <p className="label-style text-warm mb-8">{t.about.teamLabel}</p>
        </AnimatedEntry>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedEntry delay={0.1}>
            <div className="bg-bg2 p-8 card-hover-line">
              <div className="w-24 h-24 bg-bg3 flex items-center justify-center mb-6">
                <span className="font-editorial text-3xl text-sesmi-muted">F</span>
              </div>
              <p className="font-haas text-[0.55rem] uppercase tracking-[0.15em] text-warm mb-2">
                {t.about.founder.role}
              </p>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-4">{t.about.founder.bio}</p>
              <div className="space-y-1.5">
                {t.about.founder.credentials.map((c) => (
                  <p key={c} className="font-haas text-[0.55rem] text-sesmi-muted">
                    <span className="text-warm">◆</span> {c}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedEntry>
          <AnimatedEntry delay={0.2}>
            <div className="bg-bg2 p-8 card-hover-line">
              <div className="w-24 h-24 bg-bg3 flex items-center justify-center mb-6">
                <span className="font-editorial text-3xl text-sesmi-muted">C</span>
              </div>
              <p className="font-haas text-[0.55rem] uppercase tracking-[0.15em] text-warm mb-2">
                {t.about.cofounder.role}
              </p>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-4">{t.about.cofounder.bio}</p>
              <div className="space-y-1.5">
                {t.about.cofounder.credentials.map((c) => (
                  <p key={c} className="font-haas text-[0.55rem] text-sesmi-muted">
                    <span className="text-warm">◆</span> {c}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedEntry>
        </div>
      </section>

      {/* Cities */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <AnimatedEntry>
          <p className="label-style text-warm mb-6">{t.about.citiesLabel}</p>
          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <span
                key={city.name}
                className={`font-haas text-[0.6rem] uppercase tracking-[0.12em] px-3 py-1.5 border ${
                  city.active ? 'border-warm text-warm' : 'border-sesmi-line text-sesmi-muted'
                }`}
              >
                {city.name} {city.active && '◆'}
              </span>
            ))}
            <span className="font-haas text-[0.6rem] uppercase tracking-[0.12em] px-3 py-1.5 text-sesmi-muted">
              + →
            </span>
          </div>
        </AnimatedEntry>
      </section>

      {/* Contact */}
      <section id="contacto" className="max-w-7xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-sesmi-line">
          <AnimatedEntry className="pb-6 lg:pb-0 lg:pr-12">
            <p className="font-haas text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
              {t.about.contactLabel} ─────────────────
            </p>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-ink mb-8">
              {t.about.contactTitle}
            </h2>
            <div className="space-y-4">
              {t.about.contactInfo.map((item) => (
                <div key={item.label} className="flex gap-6">
                  <span className="font-haas text-[0.6rem] uppercase tracking-[0.12em] text-sesmi-muted w-20 shrink-0 pt-0.5">
                    {item.label}
                  </span>
                  <span className="text-sm text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </AnimatedEntry>

          <AnimatedEntry delay={0.1} className="pt-8 lg:pt-0 lg:pl-12">
            <div className="bg-bg2 p-8">
              {sent ? (
                <div className="text-center py-8">
                  <p className="font-haas text-sm text-warm">{t.about.formLabels.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { key: 'name', label: t.about.formLabels.name, type: 'text' },
                    { key: 'email', label: t.about.formLabels.email, type: 'email' },
                    { key: 'org', label: t.about.formLabels.org, type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="label-style text-sesmi-muted block mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.key !== 'org'}
                        value={formState[field.key as keyof typeof formState]}
                        onChange={(e) => setFormState(s => ({ ...s, [field.key]: e.target.value }))}
                        className="w-full px-4 py-3 bg-bg border border-sesmi-line font-haas text-sm text-ink"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="label-style text-sesmi-muted block mb-2">{t.about.formLabels.message}</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-bg border border-sesmi-line font-haas text-sm text-ink resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-ink text-sesmi-white font-haas text-[0.65rem] uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink2 transition-colors interactive disabled:opacity-50"
                  >
                    {sending ? '...' : t.about.formLabels.submit}
                  </button>
                </form>
              )}
            </div>
          </AnimatedEntry>
        </div>
      </section>
    </Layout>
  );
};

export default Nosotros;
