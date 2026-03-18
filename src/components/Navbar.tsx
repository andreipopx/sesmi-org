import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const navLinks = [
  { to: '/', key: 'home' as const },
  { to: '/research', key: 'research' as const },
  { to: '/services', key: 'services' as const },
  { to: '/learning', key: 'learning' as const },
  { to: '/nosotros', key: 'about' as const },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-sesmi-line" style={{ backgroundColor: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 interactive">
          <span className="logo-dot inline-block w-[8px] h-[8px] rounded-full bg-warm" />
          <span className="font-mono text-sm tracking-[0.18em] lowercase font-medium text-ink">sesmi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-mono text-[0.62rem] uppercase tracking-[0.12em] transition-colors interactive ${
                location.pathname === link.to ? 'text-ink' : 'text-sesmi-muted hover:text-ink'
              }`}
            >
              {t.nav[link.key]}
              {location.pathname === link.to && (
                <span className="block w-1 h-1 rounded-full bg-warm mx-auto mt-1" />
              )}
            </Link>
          ))}

          {/* Language switcher */}
          <div className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]">
            <button
              onClick={() => setLang('es')}
              className={`px-1.5 py-0.5 transition-colors interactive ${lang === 'es' ? 'text-ink' : 'text-muted2 hover:text-ink'}`}
            >
              ES
            </button>
            <span className="text-muted2">/</span>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 transition-colors interactive ${lang === 'en' ? 'text-ink' : 'text-muted2 hover:text-ink'}`}
            >
              EN
            </button>
          </div>

          <Link
            to="/nosotros#contacto"
            className="font-mono text-[0.62rem] uppercase tracking-[0.12em] bg-ink text-sesmi-white px-4 py-2 hover:bg-ink2 transition-colors interactive"
          >
            {t.nav.contact}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 interactive p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-[1px] bg-ink transition-transform ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-5 h-[1px] bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1px] bg-ink transition-transform ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-b border-sesmi-line"
            style={{ backgroundColor: 'rgba(247,243,238,0.98)', backdropFilter: 'blur(16px)' }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`font-mono text-[0.7rem] uppercase tracking-[0.12em] py-1 ${
                    location.pathname === link.to ? 'text-warm' : 'text-sesmi-muted'
                  }`}
                >
                  {t.nav[link.key]}
                </Link>
              ))}
              {/* Mobile language switcher */}
              <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] py-1">
                <button onClick={() => setLang('es')} className={lang === 'es' ? 'text-warm' : 'text-sesmi-muted'}>ES</button>
                <span className="text-muted2">/</span>
                <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-warm' : 'text-sesmi-muted'}>EN</button>
              </div>
              <Link
                to="/nosotros#contacto"
                onClick={() => setOpen(false)}
                className="font-mono text-[0.7rem] uppercase tracking-[0.12em] bg-ink text-sesmi-white px-4 py-2 w-fit"
              >
                {t.nav.contact}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
