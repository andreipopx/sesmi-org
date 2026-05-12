import { useLanguage } from '../contexts/LanguageContext';

const Ticker = () => {
  const { t } = useLanguage();
  const items = t.ticker.split(' ◆ ');

  const Sequence = ({ prefix }: { prefix: string }) => (
    <>
      {items.map((item, i) => (
        <span key={`${prefix}-${i}`}>
          {item}
          {i < items.length - 1 && (
            <span style={{ color: 'var(--muted)' }}> · </span>
          )}
        </span>
      ))}
    </>
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-2)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        paddingTop: '12px',
        paddingBottom: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        className="ticker-track whitespace-nowrap font-mono uppercase text-ink"
        style={{
          fontSize: '11px',
          letterSpacing: '0.06em',
          display: 'inline-block',
        }}
      >
        <Sequence prefix="a" />
        <span style={{ color: 'var(--muted)' }}> · </span>
        <Sequence prefix="b" />
      </div>
    </div>
  );
};

export default Ticker;
