import Head from "next/head";
import NavBar from "../components/NavBar";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - LiveBackdrop</title>
        <meta name="description" content="LiveBackdrop Privacy Policy" />
      </Head>

      <NavBar />

      <main className="max-w-3xl mx-auto px-6 py-12 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy explains how LiveBackdrop collects, uses, and
          protects your data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We collect account information, uploaded content, and analytics data
          to improve our services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To operate and improve services</li>
          <li>To generate AI backgrounds</li>
          <li>To process payments</li>
          <li>To secure the platform</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Upload Privacy</h2>
        <p className="mb-4">
          Uploaded images are private and are not used to train AI models.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Cookies & Tracking</h2>
        <p className="mb-4">
          Cookies are used for authentication and analytics.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Third-Party Services</h2>
        <p className="mb-4">
          We use trusted providers such as Stripe and Cloudinary. Their privacy
          policies apply.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Data Security</h2>
        <p className="mb-4">
          We follow industry standards to protect your data but cannot guarantee
          absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Data Deletion</h2>
        <p className="mb-4">
          You may request full deletion of your account and data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Children</h2>
        <p className="mb-4">
          Our service is not intended for children under 13.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Changes to Policy</h2>
        <p className="mb-4">
          We may update this policy periodically. Continued use means acceptance.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact</h2>
        <p>Email: privacy@livebackdrop.com</p>
      </main>
    </>
  );
}
