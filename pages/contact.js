import Head from "next/head";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";


export default function Contact() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lb_lang") || "en");
    }
  }, []);

  const text = {
    en: {
      title: "Contact Us",
      intro:
        "Have questions, feedback, or need help? We’d love to hear from you. Fill out the form below or contact us directly.",
      emailLabel: "Your Email",
      messageLabel: "Message",
      button: "Send Message",
      contactEmail: "Email: support@livebackdrop.com",
      hours: "Business Hours: Mon–Fri · 9:00–18:00 (PST)"
    },
    zh: {
      title: "联系我们",
      intro:
        "有任何问题、建议或合作想法，都可以通过下面的表单给我们留言，或者直接发送邮件与我们联系。",
      emailLabel: "您的邮箱",
      messageLabel: "留言内容",
      button: "发送留言（示意表单，暂不真正发送）",
      contactEmail: "邮箱：support@livebackdrop.com",
      hours: "工作时间：周一至周五 · 9:00–18:00（美国西部时间）"
    },
    es: {
      title: "Contáctanos",
      intro:
        "¿Tienes preguntas, comentarios o necesitas ayuda? Rellena el formulario o contáctanos directamente por correo.",
      emailLabel: "Tu correo",
      messageLabel: "Mensaje",
      button: "Enviar mensaje",
      contactEmail: "Correo: support@livebackdrop.com",
      hours: "Horario: Lun–Vie · 9:00–18:00 (PST)"
    }
  };

  const t = text[lang] || text.en;
  const baseUrl = "https://livebackdrop.vercel.app";

  return (
    <>
      <Head>
        <title>Contact - LiveBackdrop</title>
        <meta
          name="description"
          content={t.intro}
        />
        <meta property="og:title" content={t.title + " - LiveBackdrop"} />
        <meta property="og:description" content={t.intro} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl + "/contact"} />
        <meta
          property="og:image"
          content={baseUrl + "/og-default.png"}
        />
      </Head>

      <NavBar />

      <main className="max-w-xl mx-auto px-6 py-14 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

        <p className="mb-6 text-slate-600">{t.intro}</p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white rounded-xl shadow p-6 border border-slate-200"
        >
          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">
              {t.emailLabel}
            </span>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">
              {t.messageLabel}
            </span>
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
            {t.button}
          </button>
        </form>

        <div className="mt-10 text-sm text-slate-600">
          <p>{t.contactEmail}</p>
          <p className="mt-1">{t.hours}</p>
        </div>
      </main>
    </>
  );
}
