import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import Ticker from '../components/Ticker';
import SectionHeader from '../components/SectionHeader';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';
import { useLanguage } from '../contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* HERO */}
      <HeroSection />

      {/* TICKER */}
      <Ticker />

      {/* RESEARCH — primary section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeader label={t.research.sectionLabel} />

        {/* Featured report - dark */}
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
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {t.research.featured.title}
              </h3>
              <p className="font-display italic text-sesmi-white/50 text-lg mb-4">
                {t.research.featured.subtitle}
              </p>
              <p className="text-sesmi-white/60 text-sm leading-relaxed mb-6">
                {t.research.featured.desc}
              </p>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-sesmi-white/40 mb-8">
                {t.research.featured.methodology}
              </p>
              <button className="border border-sesmi-white/40 text-sesmi-white font-mono text-[0.6rem] uppercase tracking-[0.12em] px-5 py-2.5 hover:bg-sesmi-white/10 transition-colors interactive">
                {t.research.featured.cta}
              </button>
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

        {/* Next report preview */}
        <AnimatedEntry delay={0.15}>
          <div className="bg-bg2 p-8 mt-4 card-hover-line">
            <span className="label-style text-muted2 block mb-3">{t.research.next.label}</span>
            <h4 className="font-display text-xl font-bold text-ink mb-2">
              {t.research.next.title}
            </h4>
            <p className="font-display italic text-sesmi-muted text-sm mb-4">
              {t.research.next.subtitle}
            </p>
            <Link to="/research" className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-warm hover:text-ink transition-colors interactive">
              {t.research.next.cta}
            </Link>
          </div>
        </AnimatedEntry>
      </section>

      {/* LÍNEAS DE TRABAJO — Research first */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeader label={t.work.sectionLabel} />

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sesmi-line">
          {t.work.items.map((item, i) => (
            <AnimatedEntry key={item.idx} delay={i * 0.1} className="p-8 card-hover-line">
              <p className="font-mono text-sm text-warm mb-2">{item.idx} — {item.tag}</p>
              <h3 className="font-sans text-2xl font-medium text-ink mb-4">{item.name}</h3>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-8">{item.desc}</p>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-muted2">{item.footer}</p>
            </AnimatedEntry>
          ))}
        </div>
      </section>

      {/* MANIFIESTO */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
          {/* Sidebar */}
          <AnimatedEntry className="bg-bg2 border-r border-sesmi-line p-8">
            <p className="label-style text-warm mb-6">{t.manifesto.label}</p>
            <div className="border-l-[4px] border-warm pl-5 py-4 mt-6">
              <p className="font-display italic text-ink text-xl leading-relaxed">
                {t.manifesto.principle}
              </p>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-muted2 mt-3">
                {t.manifesto.principleAttr}
              </p>
            </div>
          </AnimatedEntry>

          {/* Main */}
          <AnimatedEntry delay={0.1} className="p-8 lg:p-12">
            <h2 className="font-sans text-2xl md:text-3xl font-light text-ink leading-snug mb-6">
              {t.manifesto.title}
            </h2>
            <p className="text-sm text-sesmi-muted leading-relaxed mb-6">
              {t.manifesto.text}
            </p>
            <Link to="/nosotros" className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-warm hover:text-ink transition-colors interactive">
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
