import Link from 'next/link';
import SEOHead from '../components/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Home"
        description="Generate AI-powered live backgrounds for Zoom, streaming, and virtual studios with LiveBackdrop."
        keywords="AI virtual background generator, live streaming backdrop, Zoom background, AI photo studio, virtual office background"
      />
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
