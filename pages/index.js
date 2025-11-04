import Head from 'next/head';
import Link from 'next/link';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>LiveBackdrop | AI Virtual Background Generator for Zoom & Streaming</title>
        <meta name="description" content="Generate stunning virtual backgrounds for Zoom and live streams using AI. Create professional backdrops instantly with LiveBackdrop." />
        <meta name="keywords" content="AI virtual background generator, Zoom background maker, AI backdrop creator, live streaming background, LiveBackdrop" />
        <link rel="canonical" href="https://www.livebackdrop.com/" />
        <meta property="og:title" content="LiveBackdrop - AI Virtual Background Generator" />
        <meta property="og:description" content="Create AI-generated backgrounds for Zoom, YouTube, and streaming in seconds." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.livebackdrop.com/" />
      </Head>

      <main className="home-container">
        <section className="hero">
          <h1>Create Stunning Virtual Backgrounds with AI</h1>
          <p>Turn your ideas into professional live backdrops for Zoom and streaming.</p>
          <div className="buttons">
            <Link href="/generate" className="btn-primary">Generate Now</Link>
            <Link href="/about" className="btn-secondary">Learn More</Link>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <h3>🧠 Smart AI Engine</h3>
            <p>Generate unique backgrounds based on your prompt in seconds.</p>
          </div>
          <div className="feature">
            <h3>🎥 Perfect for Streaming</h3>
            <p>Compatible with OBS, Zoom, StreamYard and more.</p>
          </div>
          <div className="feature">
            <h3>🎨 Customizable Styles</h3>
            <p>Choose lighting, color tone, and mood to fit your brand.</p>
          </div>
        </section>

        <section className="seo-text">
          <p>
            LiveBackdrop is an AI virtual background generator that helps creators, professionals, and streamers design realistic backdrops for live meetings, Zoom calls, and videos.
            Our AI background tool automatically generates HD backdrops that perfectly match your theme — whether it’s an office, studio, or natural scenery.
            Start creating your custom AI background today.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 LiveBackdrop | All rights reserved.</p>
      </footer>
    </>
  );
}
