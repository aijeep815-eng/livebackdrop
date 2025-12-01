import Head from "next/head";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";


export default function About() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lb_lang") || "en");
    }
  }, []);

  const text = {
    en: {
      title: "About LiveBackdrop",
      description:
        "LiveBackdrop is an AI-powered virtual background platform for livestreamers, content creators, teachers, product sellers, and professionals who need beautiful and clean livestream environments.",
      missionTitle: "Our Mission",
      missionBody:
        "Our mission is to make professional livestream backgrounds accessible to everyone—no studio, no expensive lighting, and no technical skills required.",
      whyTitle: "Why We Built This",
      whyBody:
        "Livestreaming and online video are now essential in education, business, e-commerce, and personal branding. Many people don’t have a clean space to stream in. LiveBackdrop generates realistic, studio-like backgrounds so you can focus on your content.",
      techTitle: "Technology",
      techList: [
        "AI image generation optimized for livestream backgrounds",
        "Composition tuned for sitting and standing hosts",
        "Cloud-based image hosting and fast global delivery",
        "Responsive interface for desktop, tablet, and mobile"
      ],
      serveTitle: "Who We Serve",
      serveList: [
        "Lifestyle and product livestreamers",
        "Online educators and coaches",
        "E-commerce and live-selling hosts",
        "Remote teams and professionals",
        "YouTubers and digital creators"
      ],
      visionTitle: "Our Vision",
      visionBody:
        "We believe AI should help people present themselves more professionally, not replace them. LiveBackdrop is focused on building practical tools that make livestreaming easier, more accessible, and more beautiful for everyone."
    },
    zh: {
      title: "关于 LiveBackdrop",
      description:
        "LiveBackdrop 是一款由 AI 驱动的虚拟背景平台，专为带货主播、内容创作者、老师、电商卖家以及需要干净直播环境的职场人士设计。",
      missionTitle: "我们的使命",
      missionBody:
        "我们的目标是：让每个人都能轻松拥有专业的直播背景——不需要摄影棚，不需要复杂灯光，也不需要高深技术。",
      whyTitle: "为什么要做这个产品？",
      whyBody:
        "直播、网课和线上会议已经成为日常工作的一部分，但大多数人的真实环境并不适合出镜。LiveBackdrop 用 AI 自动生成真实感很强的直播背景，让你可以专心说话、展示产品，而不用为背景烦恼。",
      techTitle: "核心技术",
      techList: [
        "针对直播场景优化的 AI 图片生成",
        "根据坐姿 / 站姿优化画面结构与视角",
        "云端图片存储与全球加速访问",
        "自适应电脑 / 平板 / 手机的界面"
      ],
      serveTitle: "适用人群",
      serveList: [
        "带货主播、电商直播团队",
        "线上老师、培训讲师",
        "需要视频会议的职场人士",
        "做短视频、直播的创作者",
        "需要干净背景的普通用户"
      ],
      visionTitle: "我们的愿景",
      visionBody:
        "我们相信，AI 应该帮助普通人更好地表达自己，而不是取代他们。LiveBackdrop 希望通过简单、好用的工具，让更多人拥有体面、专业的直播画面。"
    },
    es: {
      title: "Acerca de LiveBackdrop",
      description:
        "LiveBackdrop es una plataforma de fondos virtuales con IA para streamers, creadores de contenido, profesores, vendedores y profesionales que necesitan un entorno limpio y profesional.",
      missionTitle: "Nuestra Misión",
      missionBody:
        "Nuestra misión es hacer que los fondos profesionales para livestream sean accesibles para todos, sin estudio, sin equipo caro y sin conocimientos técnicos.",
      whyTitle: "Por Qué Creamos Esto",
      whyBody:
        "El vídeo en directo es clave en la educación, los negocios y el comercio electrónico. Muchas personas no tienen un espacio adecuado para transmitir. LiveBackdrop genera fondos de estilo estudio para que puedas concentrarte en tu contenido.",
      techTitle: "Tecnología",
      techList: [
        "Generación de imágenes con IA optimizada para directos",
        "Composición ajustada para presentadores sentados y de pie",
        "Almacenamiento en la nube y entrega rápida global",
        "Interfaz adaptable a ordenador, tablet y móvil"
      ],
      serveTitle: "A Quién Servimos",
      serveList: [
        "Streamers de producto y lifestyle",
        "Profesores y formadores online",
        "Vendedores de e-commerce y live shopping",
        "Equipos remotos y profesionales",
        "Creadores digitales e influencers"
      ],
      visionTitle: "Nuestra Visión",
      visionBody:
        "Creemos que la IA debe ayudar a las personas a presentarse mejor, no sustituirlas. LiveBackdrop se centra en herramientas prácticas que facilitan el streaming para todos."
    }
  };

  const t = text[lang] || text.en;
  const baseUrl = "https://livebackdrop.vercel.app";

  return (
    <>
      <Head>
        <title>About - LiveBackdrop</title>
        <meta
          name="description"
          content={t.description}
        />
        <meta property="og:title" content={t.title + " - LiveBackdrop"} />
        <meta property="og:description" content={t.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl + "/about"} />
        <meta
          property="og:image"
          content={baseUrl + "/og-default.png"}
        />
      </Head>

      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-14 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

        <p className="text-slate-600 mb-6">{t.description}</p>

        <h2 className="text-xl font-semibold mt-10 mb-3">
          {t.missionTitle}
        </h2>
        <p className="mb-6">{t.missionBody}</p>

        <h2 className="text-xl font-semibold mt-10 mb-3">{t.whyTitle}</h2>
        <p className="mb-6">{t.whyBody}</p>

        <h2 className="text-xl font-semibold mt-10 mb-3">{t.techTitle}</h2>
        <ul className="list-disc ml-6 mb-6">
          {t.techList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3">{t.serveTitle}</h2>
        <ul className="list-disc ml-6 mb-6">
          {t.serveList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3">
          {t.visionTitle}
        </h2>
        <p>{t.visionBody}</p>
      </main>
    </>
  );
}
