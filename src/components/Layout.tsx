import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    <Link
      to="/"
      aria-label="sesmi"
      className="hidden lg:block fixed right-0 top-1/2 side-wordmark"
      style={{
        transform: 'translateY(-50%)',
        zIndex: 40,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        rotate: '180deg',
        fontSize: '11px',
        letterSpacing: '0.15em',
        padding: '16px 8px',
        color: 'var(--muted)',
        transition: 'color 150ms ease',
        cursor: 'pointer',
      }}
    >
      <span className="wm">sesmi</span>
    </Link>
    <style>{`
      .side-wordmark:hover { color: var(--ink) !important; }
    `}</style>
    <main className="pt-[60px]">
      {children}
    </main>
    <Footer />
  </>
);

export default Layout;
