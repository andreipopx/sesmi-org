import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import { useLanguage } from '../contexts/LanguageContext';

const Learning = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <AnimatedEntry>
          <p className="font-haas text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
            {t.learning.label} ─────────────────────────────────
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.1}>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-ink mb-4">
            {t.learning.title}
          </h1>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <div className="border-l-[3px] border-warm bg-bg2 p-5 my-12 max-w-3xl">
            <p className="text-sm text-sesmi-muted leading-relaxed">{t.learning.callout}</p>
          </div>
        </AnimatedEntry>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.learning.resources.map((res, i) => (
            <AnimatedEntry key={i} delay={i * 0.1}>
              <div className="bg-bg2 p-8 card-hover-line h-full flex flex-col">
                <h3 className="font-haas text-lg font-medium text-ink mb-3">{res.title}</h3>
                <p className="text-sm text-sesmi-muted leading-relaxed mb-6 flex-1">{res.desc}</p>
                <span className="font-haas text-[0.55rem] uppercase tracking-[0.15em] text-muted2 border border-sesmi-line px-2 py-1 w-fit">
                  {t.research.next.label}
                </span>
              </div>
            </AnimatedEntry>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <AnimatedEntry>
          <div className="text-center">
            <p className="text-lg text-sesmi-muted mb-6">{t.learning.collabText}</p>
            <Link
              to="/nosotros#contacto"
              className="bg-ink text-sesmi-white font-haas text-[0.65rem] uppercase tracking-[0.12em] px-8 py-4 hover:bg-ink2 transition-colors interactive inline-block"
            >
              {t.learning.collabCta}
            </Link>
          </div>
        </AnimatedEntry>
      </section>
    </Layout>
  );
};

export default Learning;
