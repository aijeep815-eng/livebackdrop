import Head from "next/head";
import NavBar from "../components/NavBar";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - LiveBackdrop</title>
        <meta name="description" content="LiveBackdrop Terms of Service" />
      </Head>

      <NavBar />

      <main className="max-w-3xl mx-auto px-6 py-12 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="mb-4">
          Welcome to LiveBackdrop. By accessing or using our website, AI
          services, and tools, you agree to be bound by the following Terms of
          Service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
        <p className="mb-4">
          You may use the service only in accordance with these terms and
          applicable laws.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. User Accounts</h2>
        <p className="mb-4">
          You are responsible for keeping your account secure and for all
          activities under it.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. AI-Generated Content</h2>
        <p className="mb-4">
          You retain rights to the AI-generated backgrounds created on our
          platform. You are responsible for ensuring legal and appropriate use.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Uploads</h2>
        <p className="mb-4">
          You must have the rights to any content you upload. Illegal or harmful
          uploads are strictly prohibited.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Payments & Subscriptions</h2>
        <p className="mb-4">
          Paid plans are billed through Stripe. Subscription fees are
          non-refundable unless required by law.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Limitations</h2>
        <p className="mb-4">
          Free accounts may be limited. Attempts to bypass limits or misuse the
          system are prohibited.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Service Changes</h2>
        <p className="mb-4">
          We may modify, suspend, or discontinue parts of the service at any
          time.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Termination</h2>
        <p className="mb-4">
          We may suspend or terminate accounts that violate our policies.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. Disclaimer</h2>
        <p className="mb-4">
          The service is provided “as is” without warranties of any kind.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact</h2>
        <p>Email: support@livebackdrop.com</p>
      </main>
    </>
  );
}
