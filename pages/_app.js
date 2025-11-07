import '@/styles/globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: '70vh', paddingTop: '4rem' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
