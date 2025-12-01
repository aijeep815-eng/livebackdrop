import Head from "next/head";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function Terms() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lb_lang") || "en");
    }
  }, []);

  const text = {
    en: {
      title: "Terms of Service",
      intro:
        "By accessing or using LiveBackdrop, you agree to the following Terms of Service.",
      sections: [
        {
          title: "1. Use of Service",
          body:
            "You may use the service only in accordance with these terms and applicable laws."
        },
        {
          title: "2. User Accounts",
          body:
            "You are responsible for keeping your account secure and for all activities under it."
        },
        {
          title: "3. AI-Generated Content",
          body:
            "You retain rights to the AI-generated backgrounds created on our platform, and you are responsible for how you use them."
        },
        {
          title: "4. Uploads",
          body:
            "You must have legal rights to any content you upload. Illegal, harmful, or infringing content is prohibited."
        },
        {
          title: "5. Payments & Subscriptions",
          body:
            "Paid plans are billed through Stripe. Subscription fees are non-refundable unless required by law."
        },
        {
          title: "6. Limitations",
          body:
            "We may limit usage for free accounts. Attempts to bypass limits or abuse the platform are prohibited."
        },
        {
          title: "7. Service Changes",
          body:
            "We may modify, suspend, or discontinue parts of the service at any time."
        },
        {
          title: "8. Termination",
          body:
            "We may suspend or terminate accounts that violate these terms or harm the service."
        },
        {
          title: "9. Disclaimer",
          body:
            "The service is provided “as is” without warranties of any kind."
        },
        {
          title: "10. Contact",
          body: "Email: support@livebackdrop.com"
        }
      ]
    },
    zh: {
      title: "服务条款",
      intro:
        "当你访问或使用 LiveBackdrop 时，即表示你同意本服务条款中的内容。",
      sections: [
        {
          title: "1. 服务使用",
          body:
            "你必须在合法合规的前提下使用本服务，不得利用本平台从事违法活动。"
        },
        {
          title: "2. 账户安全",
          body:
            "你有责任保管好自己的账户和密码，并对在你账户下发生的所有操作负责。"
        },
        {
          title: "3. AI 生成内容",
          body:
            "你对通过本平台生成的背景图片拥有使用权，但必须自行确保使用过程合法合规。"
        },
        {
          title: "4. 上传内容",
          body:
            "你必须对上传的图片或素材拥有合法权利，不得上传违法、侵权或有害内容。"
        },
        {
          title: "5. 付费与订阅",
          body:
            "付费套餐通过 Stripe 收费，除法律要求外，费用通常不予退款。"
        },
        {
          title: "6. 使用限制",
          body:
            "我们可能对免费账户设置使用额度，禁止恶意刷量、绕过限制等行为。"
        },
        {
          title: "7. 服务变更",
          body:
            "我们有权根据需要对服务内容进行调整、暂停或终止。"
        },
        {
          title: "8. 账户终止",
          body:
            "如发现违反条款或恶意行为，我们有权暂停或终止相关账户。"
        },
        {
          title: "9. 免责声明",
          body:
            "本服务按“现状”提供，我们不对服务的可用性或结果作出任何保证。"
        },
        {
          title: "10. 联系方式",
          body: "联系邮箱：support@livebackdrop.com"
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      intro:
        "Al usar LiveBackdrop, aceptas los siguientes Términos de Servicio.",
      sections: [
        {
          title: "1. Uso del Servicio",
          body:
            "Solo puedes usar el servicio de acuerdo con estos términos y las leyes aplicables."
        },
        {
          title: "2. Cuentas de Usuario",
          body:
            "Eres responsable de la seguridad de tu cuenta y de toda actividad bajo ella."
        },
        {
          title: "3. Contenido Generado por IA",
          body:
            "Conservas los derechos sobre los fondos generados, y eres responsable de su uso."
        },
        {
          title: "4. Subidas",
          body:
            "Debes tener derechos legales sobre el contenido que subes. Está prohibido subir contenido ilegal o dañino."
        },
        {
          title: "5. Pagos y Suscripciones",
          body:
            "Los planes de pago se procesan a través de Stripe. Las tarifas no son reembolsables salvo obligación legal."
        },
        {
          title: "6. Limitaciones",
          body:
            "Podemos limitar el uso en cuentas gratuitas. Se prohíbe intentar eludir los límites o abusar del servicio."
        },
        {
          title: "7. Cambios en el Servicio",
          body:
            "Podemos modificar, suspender o descontinuar partes del servicio en cualquier momento."
        },
        {
          title: "8. Terminación",
          body:
            "Podemos suspender o cancelar cuentas que violen estos términos."
        },
        {
          title: "9. Descargo de Responsabilidad",
          body:
            "El servicio se ofrece “tal cual”, sin garantías de ningún tipo."
        },
        {
          title: "10. Contacto",
          body: "Correo: support@livebackdrop.com"
        }
      ]
    }
  };

  const t = text[lang] || text.en;
  const baseUrl = "https://livebackdrop.vercel.app";

  return (
    <>
      <Head>
        <title>Terms of Service - LiveBackdrop</title>
        <meta name="description" content={t.intro} />
        <meta property="og:title" content={t.title + " - LiveBackdrop"} />
        <meta property="og:description" content={t.intro} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl + "/terms"} />
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
