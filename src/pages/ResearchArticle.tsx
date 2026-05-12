import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';
import { useLanguage } from '../contexts/LanguageContext';

const ArticleContent = () => {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <>
        <AnimatedEntry>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-ink mt-8 mb-6">
            01. Context: the investment and the city
          </h2>
        </AnimatedEntry>
        <AnimatedEntry>
          <p className="mb-6">
            In early 2024, Meta announced the construction of its largest data center in southern Europe in Talavera de la Reina, a mid-sized city in central Spain with roughly 83,000 inhabitants. The investment: €750 million. The question this report asks is straightforward — how much of that money actually stays in the city?
          </p>
        </AnimatedEntry>
        <AnimatedEntry>
          <div className="border-l-[3px] border-warm pl-6 py-4 my-8">
            <p className="font-editorial italic text-xl text-ink leading-relaxed">
              "A €750 million investment doesn't automatically mean €750 million in local benefit. The real question is about retention — how much stays, and under what conditions."
            </p>
          </div>
        </AnimatedEntry>
        <AnimatedEntry>
          <p className="mb-6">
            Talavera sits 120km southwest of Madrid, connected by highway and a struggling rail service. It has experienced two decades of population decline, economic stagnation, and a persistent brain drain of its youngest and most qualified residents. Meta's arrival represents, numerically, the largest private investment in the city's modern history.
          </p>
        </AnimatedEntry>
        <AnimatedEntry>
          <div className="bg-bg2 p-8 my-8 text-center">
            <p className="font-haas text-[0.55rem] uppercase tracking-[0.15em] text-sesmi-muted mb-2">Total announced investment</p>
            <p className="font-mono text-5xl md:text-6xl text-warm font-bold">€750M</p>
            <p className="font-haas text-[0.5rem] uppercase tracking-[0.12em] text-muted2 mt-2">Source: Meta, public records</p>
          </div>
        </AnimatedEntry>
        <AnimatedEntry>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-ink mt-8 mb-6">
            02. Direct and indirect economic impact
          </h2>
        </AnimatedEntry>
        <AnimatedEntry>
          <p className="mb-6">
            Data centers are capital-intensive but labor-light. The construction phase generates significant temporary employment, but the operational phase typically requires a small, highly specialized workforce. This creates a fundamental tension between the headline investment figure and the actual long-term economic footprint.
          </p>
        </AnimatedEntry>
      </>
    );
  }

  return (
    <>
      <AnimatedEntry>
        <h2 className="font-editorial text-2xl md:text-3xl font-bold text-ink mt-8 mb-6">
          01. Contexto: la inversión y la ciudad
        </h2>
      </AnimatedEntry>
      <AnimatedEntry>
        <p className="mb-6">
          A principios de 2024, Meta anunció la construcción de su mayor data center del sur de Europa en Talavera de la Reina, una ciudad de unos 83.000 habitantes en el centro de España. La inversión: 750 millones de euros. La pregunta que este informe plantea es directa — ¿cuánto de ese dinero se queda realmente en la ciudad?
        </p>
      </AnimatedEntry>
      <AnimatedEntry>
        <div className="border-l-[3px] border-warm pl-6 py-4 my-8">
          <p className="font-editorial italic text-xl text-ink leading-relaxed">
            "Una inversión de 750 millones no significa automáticamente 750 millones en beneficio local. La pregunta real es sobre retención — cuánto se queda, y bajo qué condiciones."
          </p>
        </div>
      </AnimatedEntry>
      <AnimatedEntry>
        <p className="mb-6">
          Talavera se sitúa a 120 km al suroeste de Madrid, conectada por autovía y un servicio ferroviario en dificultades. Ha experimentado dos décadas de declive demográfico, estancamiento económico y una fuga persistente de sus residentes más jóvenes y cualificados. La llegada de Meta representa, numéricamente, la mayor inversión privada en la historia moderna de la ciudad.
        </p>
      </AnimatedEntry>
      <AnimatedEntry>
        <div className="bg-bg2 p-8 my-8 text-center">
          <p className="font-haas text-[0.55rem] uppercase tracking-[0.15em] text-sesmi-muted mb-2">Inversión total anunciada</p>
          <p className="font-mono text-5xl md:text-6xl text-warm font-bold">750M€</p>
          <p className="font-haas text-[0.5rem] uppercase tracking-[0.12em] text-muted2 mt-2">Fuente: Meta, registros públicos</p>
        </div>
      </AnimatedEntry>
      <AnimatedEntry>
        <h2 className="font-editorial text-2xl md:text-3xl font-bold text-ink mt-8 mb-6">
          02. Impacto económico directo e indirecto
        </h2>
      </AnimatedEntry>
      <AnimatedEntry>
        <p className="mb-6">
          Los data centers son intensivos en capital pero ligeros en empleo. La fase de construcción genera empleo temporal significativo, pero la fase operativa típicamente requiere una plantilla pequeña y altamente especializada. Esto crea una tensión fundamental entre la cifra de inversión titular y la huella económica real a largo plazo.
        </p>
      </AnimatedEntry>
    </>
  );
};

const ResearchArticle = () => {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'divulgativa' | 'paper'>('divulgativa');
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Layout>
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-6">
        <AnimatedEntry>
          <div className="flex gap-3 mb-6 flex-wrap items-center">
            <span className="font-haas text-[0.55rem] uppercase tracking-[0.15em] text-warm">
              {t.article.category}
            </span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2 border border-sesmi-line px-2 py-0.5">
                {t.article.code}
            </span>
          </div>
        </AnimatedEntry>

        <AnimatedEntry delay={0.1}>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4 leading-tight">
            {t.article.title}
          </h1>
        </AnimatedEntry>
        <AnimatedEntry delay={0.15}>
          <p className="font-editorial italic text-sesmi-muted text-xl mb-6">
            {t.article.subtitle}
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <div className="flex flex-wrap gap-4 font-haas text-[0.5rem] uppercase tracking-[0.12em] text-muted2 mb-8">
            <span>{t.article.author}</span>
            <span>·</span>
            <span>2025</span>
            <span>·</span>
            <span>{t.article.readTime}</span>
            <span>·</span>
            <span className="text-[#6FCF97]">{t.article.status}</span>
          </div>
        </AnimatedEntry>

        <AnimatedEntry delay={0.25}>
          <div className="border-y border-sesmi-line py-1 mb-8 flex gap-0">
            <button
              onClick={() => setActiveTab('divulgativa')}
              className={`font-haas text-[0.6rem] uppercase tracking-[0.12em] px-5 py-3 transition-colors interactive ${
                activeTab === 'divulgativa' ? 'bg-ink text-sesmi-white' : 'text-sesmi-muted hover:text-ink'
              }`}
            >
              {t.article.tabDivulgativa}
            </button>
            <button
              onClick={() => setActiveTab('paper')}
              className={`font-haas text-[0.6rem] uppercase tracking-[0.12em] px-5 py-3 transition-colors interactive ${
                activeTab === 'paper' ? 'bg-ink text-sesmi-white' : 'text-sesmi-muted hover:text-ink'
              }`}
            >
              {t.article.tabPaper}
            </button>
          </div>
        </AnimatedEntry>

        <div className="max-w-[680px] mx-auto" style={{ fontSize: '1.1rem', lineHeight: 1.95 }}>
          <ArticleContent />
        </div>

        <div className="max-w-[680px] mx-auto mt-10 pt-12 border-t border-sesmi-line">
          <AnimatedEntry>
            <p className="label-style text-warm mb-4">{t.article.aboutLabel}</p>
            <p className="text-sm text-sesmi-muted leading-relaxed mb-2">
              <strong className="text-ink">{t.research.featured.methodology.split('·')[0].replace('Metodología: ', '').replace('Methodology: ', '')}</strong>
            </p>
          </AnimatedEntry>
        </div>
      </article>

      <WaitlistForm />
    </Layout>
  );
};

export default ResearchArticle;
