import '@/styles/globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NavBar />
      <main className="pt-20 min-h-screen">
        <Component {...pageProps} />
      </main>
      <Footer />
    </SessionProvider>
  )
}
