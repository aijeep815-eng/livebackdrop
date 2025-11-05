import '../styles/global.css';
import '../styles/navbar.module.css';
import '../styles/home.css';
import NavBar from '../components/NavBar';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
