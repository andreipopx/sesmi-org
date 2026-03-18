import { useLanguage } from '../contexts/LanguageContext';

const Ticker = () => {
  const { t } = useLanguage();
  const repeated = `${t.ticker} ◆ ${t.ticker} ◆ ${t.ticker} ◆ `;

  return (
    <div className="h-[38px] bg-bg3 border-y border-sesmi-line overflow-hidden flex items-center">
      <div className="ticker-track whitespace-nowrap font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted2">
        {repeated}
      </div>
    </div>
  );
};

export default Ticker;
