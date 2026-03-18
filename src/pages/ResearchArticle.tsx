import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';
import WaitlistForm from '../components/WaitlistForm';

const ArticleContent = () => (
  <>
    <AnimatedEntry>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mt-12 mb-6">
        01. Demografía y capital humano
      </h2>
    </AnimatedEntry>
    <AnimatedEntry>
      <p className="mb-6">
        Talavera de la Reina lleva dos décadas perdiendo población en términos netos. No es un caso único entre las ciudades medias españolas, pero sí especialmente significativo: la ciudad que fue tercera de Castilla-La Mancha por población ha visto cómo su base demográfica se erosiona lenta pero constantemente.
      </p>
    </AnimatedEntry>
    <AnimatedEntry>
      <div className="border-l-[3px] border-warm pl-6 py-4 my-8">
        <p className="font-display italic text-xl text-ink leading-relaxed">
          "Las ciudades que pierden población no pierden personas — pierden las decisiones que esas personas habrían tomado aquí."
        </p>
      </div>
    </AnimatedEntry>
    <AnimatedEntry>
      <p className="mb-6">
        Entre 2001 y 2024, Talavera ha perdido aproximadamente un 8% de su población censal. Pero la cifra agregada esconde lo que realmente importa: la composición de esa pérdida. No se van todos por igual. Se van los que tienen entre 25 y 39 años, los que tienen formación universitaria, los que podrían estar creando empresas o liderando proyectos.
      </p>
    </AnimatedEntry>
    <AnimatedEntry>
      <div className="bg-bg2 p-8 my-8 text-center">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-sesmi-muted mb-2">Población perdida 2001–2024</p>
        <p className="font-mono text-5xl md:text-6xl text-warm font-bold">-8,2%</p>
        <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-muted2 mt-2">Fuente: INE, Padrón Municipal</p>
      </div>
    </AnimatedEntry>
    <AnimatedEntry>
      <p className="mb-6">
        Esta selectividad migratoria genera un círculo vicioso bien documentado en la literatura académica: los jóvenes cualificados se van porque no encuentran oportunidades; las oportunidades no se crean porque no hay suficiente capital humano cualificado. Romper ese ciclo requiere intervenciones deliberadas y bien diseñadas.
      </p>
    </AnimatedEntry>
    <AnimatedEntry>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mt-12 mb-6">
        02. Mercado de trabajo
      </h2>
    </AnimatedEntry>
    <AnimatedEntry>
      <p className="mb-6">
        El mercado de trabajo talaverano presenta una paradoja que comparte con muchas ciudades medias españolas: tasas de desempleo superiores a la media nacional coexistiendo con sectores que reportan dificultades para encontrar trabajadores cualificados.
      </p>
    </AnimatedEntry>
    <AnimatedEntry>
      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-sesmi-white">
              <th className="text-left p-3 font-mono text-[0.6rem] uppercase tracking-wider">Indicador</th>
              <th className="text-left p-3 font-mono text-[0.6rem] uppercase tracking-wider">Talavera</th>
              <th className="text-left p-3 font-mono text-[0.6rem] uppercase tracking-wider">España</th>
              <th className="text-left p-3 font-mono text-[0.6rem] uppercase tracking-wider">Diferencial</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Tasa de paro', '18,4%', '11,7%', '+6,7pp'],
              ['Paro juvenil', '34,2%', '27,4%', '+6,8pp'],
              ['Temporalidad', '28,1%', '22,3%', '+5,8pp'],
              ['Salario medio', '18.200€', '25.800€', '-29,5%'],
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-bg' : 'bg-bg2'}>
                {row.map((cell, j) => (
                  <td key={j} className={`p-3 ${j === 0 ? 'font-medium' : 'font-mono text-[0.75rem]'}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedEntry>
    <AnimatedEntry>
      <p className="mb-6">
        Los datos son claros: el mercado laboral talaverano ofrece menos empleo, peor pagado y más precario que la media nacional. Esto no es una opinión — son cifras del SEPE y la EPA. Y son cifras que, de alguna manera, la discusión pública local rara vez incorpora con la claridad que merecen.
      </p>
    </AnimatedEntry>
  </>
);

const ResearchArticle = () => {
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'divulgativa' | 'paper'>('divulgativa');

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
      {/* Reading progress */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <article className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <AnimatedEntry>
          <div className="flex gap-3 mb-6 flex-wrap items-center">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-warm">
              INFORME · ECONOMÍA TERRITORIAL
            </span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted2 border border-sesmi-line px-2 py-0.5">
              SESMI-001
            </span>
          </div>
        </AnimatedEntry>

        <AnimatedEntry delay={0.1}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4 leading-tight">
            La economía de Talavera de la Reina
          </h1>
        </AnimatedEntry>
        <AnimatedEntry delay={0.15}>
          <p className="font-display italic text-sesmi-muted text-xl mb-6">
            Diagnóstico económico independiente
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.2}>
          <div className="flex flex-wrap gap-4 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-muted2 mb-8">
            <span>Sesmi Research</span>
            <span>·</span>
            <span>2025</span>
            <span>·</span>
            <span>~25 min lectura</span>
            <span>·</span>
            <span className="text-[#6FCF97]">En elaboración</span>
          </div>
        </AnimatedEntry>

        <AnimatedEntry delay={0.25}>
          <div className="border-y border-sesmi-line py-1 mb-12 flex gap-0">
            <button
              onClick={() => setActiveTab('divulgativa')}
              className={`font-mono text-[0.6rem] uppercase tracking-[0.12em] px-5 py-3 transition-colors interactive ${
                activeTab === 'divulgativa' ? 'bg-ink text-sesmi-white' : 'text-sesmi-muted hover:text-ink'
              }`}
            >
              Versión divulgativa
            </button>
            <button
              onClick={() => setActiveTab('paper')}
              className={`font-mono text-[0.6rem] uppercase tracking-[0.12em] px-5 py-3 transition-colors interactive ${
                activeTab === 'paper' ? 'bg-ink text-sesmi-white' : 'text-sesmi-muted hover:text-ink'
              }`}
            >
              Paper completo
            </button>
          </div>
        </AnimatedEntry>

        {/* Article body */}
        <div className="max-w-[680px] mx-auto" style={{ fontSize: '1.1rem', lineHeight: 1.95 }}>
          <ArticleContent />
        </div>

        {/* About this analysis */}
        <div className="max-w-[680px] mx-auto mt-16 pt-12 border-t border-sesmi-line">
          <AnimatedEntry>
            <p className="label-style text-warm mb-4">// SOBRE ESTE ANÁLISIS</p>
            <p className="text-sm text-sesmi-muted leading-relaxed mb-2">
              <strong className="text-ink">Metodología:</strong> Análisis descriptivo y comparativo basado exclusivamente en fuentes de datos públicas (INE, SEPE, Banco de España, Hacienda, IGAE).
            </p>
            <p className="text-sm text-sesmi-muted leading-relaxed mb-2">
              <strong className="text-ink">Comparadores:</strong> Ciudad Real, Toledo, Guadalajara, Puertollano.
            </p>
            <p className="text-sm text-sesmi-muted leading-relaxed">
              <strong className="text-ink">Período:</strong> 2001–2024. Actualización prevista: trimestral.
            </p>
          </AnimatedEntry>
        </div>
      </article>

      <WaitlistForm />
    </Layout>
  );
};

export default ResearchArticle;
