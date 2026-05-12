import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    <main className="pt-[60px]">
      {children}
    </main>
    <Footer />
  </>
);

export default Layout;
