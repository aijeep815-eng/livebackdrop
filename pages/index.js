import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/home.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>LiveBackdrop - AI Virtual Backgrounds for Streamers</title>
        <meta name="description" content="Generate professional virtual backgrounds with AI. Perfect for live streams, Zoom, or YouTube." />
      </Head>

      <main className="main">
        <h1 className="title">LiveBackdrop</h1>
        <p className="subtitle">
          Transform your live stream background with <strong>AI-powered</strong> virtual scenes.
        </p>
        <Link href="/generate" className="ctaButton">
          Get Started
        </Link>
      </main>
    </>
  );
}
