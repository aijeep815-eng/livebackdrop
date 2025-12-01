import Head from "next/head";
import NavBar from "../components/NavBar";

export default function About() {
  return (
    <>
      <Head>
        <title>About - LiveBackdrop</title>
        <meta
          name="description"
          content="Learn about the mission, technology, and team behind LiveBackdrop."
        />
      </Head>

      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-14 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">About LiveBackdrop</h1>

        <p className="text-slate-600 mb-6">
          LiveBackdrop is an AI-powered virtual background platform designed for
          livestreamers, content creators, teachers, product sellers, and
          professionals who need beautiful and clean livestream environments.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-3">Our Mission</h2>
        <p className="mb-6">
          Our mission is to make professional livestream backgrounds accessible
          to everyone—no studio, no expensive lighting, and no technical skills
          required. With AI, anyone can instantly generate a high-quality,
          camera-ready background.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-3">Why We Built This</h2>
        <p className="mb-6">
          Livestreaming and online video have become essential in education,
          business, e-commerce, and personal branding. However, most people
          don’t have a clean environment to stream in. LiveBackdrop solves this
          by generating realistic, studio-like backgrounds tailored to your
          needs.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-3">Technology</h2>
        <ul className="list-disc ml-6 mb-6">
          <li>AI image generation for realistic studio backgrounds</li>
          <li>Automatic composition optimized for sitting/standing livestreams</li>
          <li>Cloud-based image hosting and fast worldwide delivery</li>
          <li>Responsive interface for all devices</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3">Who We Serve</h2>
        <ul className="list-disc ml-6 mb-6">
          <li>Lifestyle / product livestreamers</li>
          <li>Online educators</li>
          <li>E-commerce sellers</li>
          <li>Corporate teams</li>
          <li>Digital creators and influencers</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3">Our Vision</h2>
        <p>
          We believe AI will help people express themselves more creatively and
          professionally. LiveBackdrop is committed to building tools that make
          livestreaming easier, more accessible, and more beautiful for
          everyone.
        </p>
      </main>
    </>
  );
}
