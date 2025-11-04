import '../styles/home.css';
import '../styles/navbar.module.css';
import NavBar from '../components/NavBar';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
