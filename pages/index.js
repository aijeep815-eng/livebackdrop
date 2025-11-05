import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>LiveBackdrop - AI Virtual Backgrounds for Streamers</title>
        <meta name="description" content="Generate professional virtual backgrounds with AI. Perfect for live streams, Zoom, or YouTube." />
      </Head>

      <div className="homeContainer">
        <h1 className="homeTitle">LiveBackdrop</h1>
        <p className="homeSubtitle">
          Create stunning virtual backgrounds powered by AI for your live streams and meetings.
        </p>
        <Link href="/generate" className="homeButton">
          Get Started
        </Link>
      </div>
    </Layout>
  );
}
