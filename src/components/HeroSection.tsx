import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section
      style={{
        paddingTop: '96px',
        paddingBottom: '80px',
        maxWidth: 'var(--max-prose)',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 4vw, 48px)',
        paddingRight: 'clamp(24px, 4vw, 48px)',
      }}
    >
      {/* Eyebrow */}
      <motion.p
        {...fadeUp}
        className="font-mono uppercase text-muted"
        style={{ fontSize: '11px', letterSpacing: '0.08em', marginBottom: '24px' }}
      >
        {t.hero.tag}
      </motion.p>

      {/* Title */}
      <motion.h1
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="font-editorial text-ink"
        style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400,
          lineHeight: 1.15,
          maxWidth: '680px',
          marginBottom: '24px',
        }}
      >
        {t.hero.lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </motion.h1>

      {/* Subtitle / description */}
      <motion.p
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        className="font-editorial"
        style={{
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: 1.65,
          color: 'var(--ink-secondary)',
          maxWidth: '560px',
          marginBottom: '40px',
        }}
      >
        {t.hero.tagline}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.3 }}
        className="flex items-center flex-wrap"
        style={{ gap: '16px' }}
      >
        {/* Primary CTA */}
        <Link
          to="/research"
          className="font-mono uppercase text-offwhite"
          style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            backgroundColor: 'var(--ink)',
            padding: '12px 24px',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'var(--ink-secondary)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'var(--ink)';
          }}
        >
          {t.hero.cta}
        </Link>

        {/* Secondary / scroll indicator */}
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--muted)',
          }}
        >
          {t.hero.scroll}
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
