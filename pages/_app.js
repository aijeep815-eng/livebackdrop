import '../styles/home.css';
import '../styles/navbar.module.css';
import NavBar from '../components/NavBar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('fade-in');
    return () => document.body.classList.remove('fade-in');
  }, [router.locale]);

  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
