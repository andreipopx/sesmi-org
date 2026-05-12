import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import { useLanguage } from '../contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <AnimatedEntry>
          <p className="font-haas text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
            {t.services.label} ─────────────────────────────────
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.1}>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-ink mb-4">
            {t.services.title}
          </h1>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <p className="text-sesmi-muted max-w-2xl mb-10">{t.services.desc}</p>
        </AnimatedEntry>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        {t.services.items.map((svc, i) => (
          <AnimatedEntry key={svc.num} delay={i * 0.08}>
            <div className="border-t border-sesmi-line py-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 group card-hover-line">
              <div>
                <p className="font-haas text-lg text-warm">{svc.num}</p>
              </div>
              <div>
                <h3 className="font-haas text-xl font-medium text-ink mb-3">{svc.title}</h3>
                <p className="text-sm text-sesmi-muted leading-relaxed mb-4">{svc.desc}</p>
                <p className="font-haas text-[0.5rem] uppercase tracking-[0.12em] text-muted2">
                  {svc.who}
                </p>
              </div>
            </div>
          </AnimatedEntry>
        ))}

        {/* CTA */}
        <AnimatedEntry delay={0.3}>
          <div className="border-t border-sesmi-line pt-12 text-center">
            <p className="text-lg text-sesmi-muted mb-6 max-w-lg mx-auto">
              {t.services.closingText}
            </p>
            <Link
              to="/nosotros#contacto"
              className="bg-ink text-sesmi-white font-haas text-[0.65rem] uppercase tracking-[0.12em] px-8 py-4 hover:bg-ink2 transition-colors interactive inline-block"
            >
              {t.services.closingCta}
            </Link>
          </div>
        </AnimatedEntry>
      </section>
    </Layout>
  );
};

export default Services;
