import '@/styles/globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <main className="pt-20 min-h-screen">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
