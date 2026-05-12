import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const SideWordmark = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [wide, setWide] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : false,
  );
  const [visible, setVisible] = useState(!isHome);

  // Track viewport width with ResizeObserver
  useEffect(() => {
    const update = () => setWide(window.innerWidth > 768);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Visibility: home uses IntersectionObserver on .home-wm; other routes always visible
  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const target = document.querySelector('.home-wm');
    if (!target) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [isHome, pathname]);

  if (!wide) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <Link
        to="/"
        aria-label="sesmi"
        className="side-wordmark wm"
        style={{
          background: 'var(--ink)',
          color: 'var(--offwhite)',
          padding: '4px 1px',
          fontSize: '16px',
          letterSpacing: '0.04em',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg) translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'geometricPrecision',
          border: 'none',
          borderRadius: 0,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 300ms ease, background-color 150ms ease',
          textDecoration: 'none',
        }}
      >
        sesmi
      </Link>
    </div>
  );
};

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    <SideWordmark />
    <style>{`
      .side-wordmark:hover { background: var(--ink-secondary) !important; }
    `}</style>
    <main className="pt-[60px]">{children}</main>
    <Footer />
  </>
);

export default Layout;
