import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Only use NavBar.js, remove any Nav.js reference
const NavBar = dynamic(() => import('@/components/NavBar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: '80vh', padding: '2rem 1rem', backgroundColor: '#f9fafb' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
