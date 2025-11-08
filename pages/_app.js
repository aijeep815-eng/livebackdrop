import '@/styles/globals.css'
import NavBar from '@/components/NavBar'

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <main className="pt-20">
        <Component {...pageProps} />
      </main>
    </>
  )
}
