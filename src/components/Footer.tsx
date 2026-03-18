import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const navLinks = [
  { to: '/', key: 'home' as const },
  { to: '/research', key: 'research' as const },
  { to: '/services', key: 'services' as const },
  { to: '/learning', key: 'learning' as const },
  { to: '/nosotros', key: 'about' as const },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg2 border-t border-sesmi-line">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="logo-dot inline-block w-[7px] h-[7px] rounded-full bg-warm" />
            <span className="font-mono text-sm tracking-[0.18em] lowercase font-medium text-ink">sesmi</span>
          </div>
          <p className="text-sm text-sesmi-muted leading-relaxed">{t.footer.org}</p>
          <p className="text-sm text-sesmi-muted mt-1">{t.footer.location}</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label-style text-sesmi-muted mb-2">{t.footer.navLabel}</span>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-sesmi-muted hover:text-ink transition-colors interactive">
              {t.nav[link.key]}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="label-style text-sesmi-muted mb-2">{t.footer.contactLabel}</span>
          <a href="mailto:hola@sesmi.org" className="text-sm text-sesmi-muted hover:text-ink transition-colors interactive">
            hola@sesmi.org
          </a>
          <span className="text-sm text-sesmi-muted">sesmi.org</span>
        </div>
      </div>

      <div className="border-t border-sesmi-line px-6 py-4">
        <p className="text-center font-mono text-[0.55rem] tracking-[0.12em] uppercase text-muted2">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
