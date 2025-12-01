import Head from "next/head";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function Privacy() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lb_lang") || "en");
    }
  }, []);

  const text = {
    en: {
      title: "Privacy Policy",
      intro:
        "This Privacy Policy explains how LiveBackdrop collects, uses, and protects your data.",
      sections: [
        {
          title: "1. Information We Collect",
          body:
            "We collect account information, uploaded content, and analytics data to improve our services."
        },
        {
          title: "2. How We Use Information",
          body:
            "We use your data to operate the service, generate AI backgrounds, process payments, and protect the platform."
        },
        {
          title: "3. Upload Privacy",
          body:
            "Uploaded images are private and are not used to train AI models."
        },
        {
          title: "4. Cookies & Tracking",
          body:
            "We use cookies for authentication and analytics to understand usage and improve the experience."
        },
        {
          title: "5. Third-Party Services",
          body:
            "We use providers such as Stripe and Cloudinary. Their own privacy policies apply."
        },
        {
          title: "6. Data Security",
          body:
            "We follow industry standards to protect your data but cannot guarantee absolute security."
        },
        {
          title: "7. Data Deletion",
          body:
            "You may request full deletion of your account and related data at any time."
        },
        {
          title: "8. Children",
          body:
            "Our service is not intended for children under 13, and we do not knowingly collect their data."
        },
        {
          title: "9. Changes to Policy",
          body:
            "We may update this policy periodically. Continued use means you accept the updated version."
        },
        {
          title: "10. Contact",
          body: "Email: privacy@livebackdrop.com"
        }
      ]
    },
    zh: {
      title: "隐私政策",
      intro:
        "本隐私政策说明 LiveBackdrop 如何收集、使用和保护你的个人信息。",
      sections: [
        {
          title: "1. 我们收集的信息",
          body:
            "我们会根据你注册账号、使用服务、上传内容的过程，收集必要的账户信息与使用数据。"
        },
        {
          title: "2. 信息的使用方式",
          body:
            "这些信息主要用于：提供与改进服务、生成 AI 背景、处理支付以及防止滥用和欺诈行为。"
        },
        {
          title: "3. 上传内容的隐私",
          body:
            "你上传的图片仅用于为你提供服务，我们不会将其用作训练公共 AI 模型。"
        },
        {
          title: "4. Cookies 与追踪技术",
          body:
            "我们使用 Cookies 做登录状态保持与基础统计分析，不会用来进行恶意跟踪。"
        },
        {
          title: "5. 第三方服务",
          body:
            "我们使用 Stripe（支付）、Cloudinary（图片存储）等第三方服务商，其隐私条款由各自平台提供。"
        },
        {
          title: "6. 数据安全",
          body:
            "我们采用业界通用的安全措施保护你的数据，但任何系统都无法做到绝对安全。"
        },
        {
          title: "7. 数据删除",
          body:
            "你可以随时联系我们，申请删除账号及相关数据。"
        },
        {
          title: "8. 未成年人",
          body:
            "本服务并非面向 13 岁以下儿童使用，我们不会主动收集儿童的个人信息。"
        },
        {
          title: "9. 政策变更",
          body:
            "在法律允许范围内，我们可能适时更新本政策，继续使用服务视为你接受更新后的条款。"
        },
        {
          title: "10. 联系方式",
          body: "隐私相关问题请发送邮件至：privacy@livebackdrop.com"
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      intro:
        "Esta Política de Privacidad explica cómo LiveBackdrop recopila, usa y protege tus datos.",
      sections: [
        {
          title: "1. Información que Recopilamos",
          body:
            "Recopilamos datos de cuenta, contenido subido y analíticas para mejorar el servicio."
        },
        {
          title: "2. Uso de la Información",
          body:
            "Usamos tus datos para operar el servicio, generar fondos con IA, procesar pagos y proteger la plataforma."
        },
        {
          title: "3. Privacidad del Contenido",
          body:
            "Las imágenes subidas son privadas y no se utilizan para entrenar modelos públicos de IA."
        },
        {
          title: "4. Cookies y Seguimiento",
          body:
            "Utilizamos cookies para autenticación y estadísticas básicas de uso."
        },
        {
          title: "5. Servicios de Terceros",
          body:
            "Trabajamos con proveedores como Stripe y Cloudinary, que tienen sus propias políticas de privacidad."
        },
        {
          title: "6. Seguridad de Datos",
          body:
            "Aplicamos medidas estándar de la industria, aunque no podemos garantizar seguridad absoluta."
        },
        {
          title: "7. Eliminación de Datos",
          body:
            "Puedes solicitar la eliminación completa de tu cuenta y tus datos."
        },
        {
          title: "8. Menores de Edad",
          body:
            "El servicio no está destinado a menores de 13 años, y no recopilamos conscientemente sus datos."
        },
        {
          title: "9. Cambios en la Política",
          body:
            "Podemos actualizar esta política; seguir usando el servicio implica que aceptas la nueva versión."
        },
        {
          title: "10. Contacto",
          body: "Correo: privacy@livebackdrop.com"
        }
      ]
    }
  };

  const t = text[lang] || text.en;
  const baseUrl = "https://livebackdrop.vercel.app";

  return (
    <>
      <Head>
        <title>Privacy Policy - LiveBackdrop</title>
        <meta name="description" content={t.intro} />
        <meta property="og:title" content={t.title + " - LiveBackdrop"} />
        <meta property="og:description" content={t.intro} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl + "/privacy"} />
        <meta
          property="og:image"
          content={baseUrl + "/og-default.png"}
        />
      </Head>

      <NavBar />

      <main className="max-w-3xl mx-auto px-6 py-12 text-slate-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
        <p className="mb-4">{t.intro}</p>

        {t.sections.map((sec, idx) => (
          <section key={idx} className="mt-6">
            <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
            <p>{sec.body}</p>
          </section>
        ))}
      </main>
    </>
  );
}
