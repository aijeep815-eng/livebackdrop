import Head from 'next/head'
import Nav from '../src/components/Nav'

export default function Home() {
  return (
    <>
      <Head>
        <title>Live Backdrop – AI Virtual Backgrounds</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Upload or generate stunning virtual backgrounds for livestreams and video calls." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page">
        <Nav />

        <header className="hero">
          <div className="hero__inner">
            <h1>Live Backdrop</h1>
            <p>Create, upload, and preview virtual backgrounds in seconds.</p>
            <div className="cta">
              <a className="btn btn--primary" href="/upload">Get Started</a>
              <a className="btn btn--ghost" href="/pricing">Pricing</a>
            </div>
          </div>
        </header>

        <section className="features">
          <div className="feature">
            <h3>Fast Preview</h3>
            <p>Upload and see your backdrop instantly on a sample camera frame.</p>
          </div>
          <div className="feature">
            <h3>AI Generation</h3>
            <p>Type a prompt and let our AI design a crisp, studio‑ready background.</p>
          </div>
          <div className="feature">
            <h3>Safe & Private</h3>
            <p>Your files are processed securely and can be removed anytime.</p>
          </div>
        </section>

        <footer className="footer">© {new Date().getFullYear()} LiveBackdrop</footer>
      </div>
    </>
  )
}
