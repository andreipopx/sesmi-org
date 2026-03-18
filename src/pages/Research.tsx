import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';
import { useLanguage } from '../contexts/LanguageContext';

const Research = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <AnimatedEntry>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
            // RESEARCH ─────────────────────────────────
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.1}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            {t.research.pageTitle}
          </h1>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <p className="text-sesmi-muted max-w-2xl mb-8">{t.research.pageDesc}</p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.25}>
          <div className="border-l-[3px] border-warm bg-bg2 p-5 mb-12 max-w-3xl">
            <p className="text-sm text-sesmi-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: t.research.pageCallout }} />
          </div>
        </AnimatedEntry>
      </section>

      {/* Featured report */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <AnimatedEntry>
          <div className="bg-ink text-sesmi-white grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:border-r border-sesmi-white/10">
              <div className="flex gap-3 mb-6 flex-wrap">
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#6FCF97] flex items-center gap-1.5">
                  <span className="logo-dot inline-block w-[6px] h-[6px] rounded-full bg-[#6FCF97]" />
                  {t.research.featured.status}
                </span>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-sesmi-white/50 border border-sesmi-white/20 px-2 py-0.5">
                  {t.research.featured.code}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {t.research.featured.title}
              </h2>
              <p className="font-display italic text-sesmi-white/50 text-lg mb-4">
                {t.research.featured.subtitle}
              </p>
              <p className="text-sesmi-white/60 text-sm leading-relaxed mb-6">
                {t.research.featured.desc}
              </p>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-sesmi-white/40 mb-8">
                {t.research.featured.methodology}
              </p>
              <Link
                to="/research/meta-datacenter"
                className="border border-sesmi-white/40 text-sesmi-white font-mono text-[0.6rem] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-sesmi-white/10 transition-colors interactive inline-block"
              >
                {t.research.featured.cta}
              </Link>
            </div>
            <div className="p-8 md:p-12">
              <p className="label-style text-sesmi-white/40 mb-6">{t.research.featured.chaptersLabel}</p>
              <div className="space-y-4">
                {t.research.featured.chapters.map((ch) => (
                  <div key={ch.n} className="flex items-center justify-between border-b border-sesmi-white/10 pb-3">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-sesmi-white/30">{ch.n}</span>
                      <span className="text-sm text-sesmi-white/80">{ch.title}</span>
                    </div>
                    <span className={`font-mono text-[0.5rem] uppercase tracking-[0.12em] ${
                      ['EN CURSO', 'IN PROGRESS'].includes(ch.status) ? 'text-warm' : 'text-sesmi-white/30'
                    }`}>
                      [{ch.status}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedEntry>
      </section>

      {/* Next publication */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <AnimatedEntry>
          <div className="card-hover-line bg-bg2 p-8 mb-4">
            <div className="flex gap-3 mb-4 flex-wrap items-center">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2 border border-sesmi-line px-2 py-0.5">
                SESMI-002
              </span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2">
                {t.research.next.label}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">{t.research.next.title}</h3>
            <p className="font-display italic text-sesmi-muted text-sm mb-3">{t.research.next.subtitle}</p>
          </div>
        </AnimatedEntry>
      </section>

      <WaitlistForm />
    </Layout>
  );
};

export default Research;
