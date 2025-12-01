import Head from "next/head";
import NavBar from "../components/NavBar";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - LiveBackdrop</title>
        <meta
          name="description"
          content="Get in touch with the LiveBackdrop team."
        />
      </Head>

      <NavBar />

      <main className="max-w-xl mx-auto px-6 py-14 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <p className="mb-6 text-slate-600">
          Have questions, feedback, or need help? We’d love to hear from you.
          Fill out the form below or contact us directly.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white rounded-xl shadow p-6 border border-slate-200"
        >
          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">Your Email</span>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              rows="4"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              required
            ></textarea>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-sm text-slate-600">
          <p>Email: support@livebackdrop.com</p>
          <p className="mt-1">Business Hours: Mon–Fri · 9:00–18:00 (PST)</p>
        </div>
      </main>
    </>
  );
}
