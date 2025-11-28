// pages/pricing.js
import NavBar from "../components/NavBar";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    highlight: "Best for trying LiveBackdrop",
    features: [
      "Up to 5 AI generations per day (preview UI)",
      "Upload & preview your own backgrounds",
      "Basic download support",
      "Email-based account",
    ],
    cta: "Start for free",
    popular: false,
  },
  {
    id: "creator",
    name: "Creator",
    price: "$9.99",
    priceNote: "/month (coming soon)",
    highlight: "For streamers & content creators",
    features: [
      "High priority AI background generation",
      "Higher resolution outputs when available",
      "Early access to new styles & presets",
      "Priority support",
    ],
    cta: "Coming soon",
    popular: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "Custom",
    highlight: "For teams & studios",
    features: [
      "Team usage & shared presets",
      "Custom style tuning",
      "Higher rate limits",
      "Integration guidance",
    ],
    cta: "Contact us",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />

      <main className="flex-1">
        <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:py-14">
          {/* 标题区 */}
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Pricing
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
              Simple plans for virtual backgrounds
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
              Start free, then upgrade when you&apos;re ready. LiveBackdrop is designed for
              streamers, content creators, and remote teams who want clean, distraction-free
              backgrounds powered by AI.
            </p>
          </div>

          {/* 提示信息：Stripe / 会员即将上线 */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-900 md:text-sm">
            <strong className="font-semibold">Heads up:</strong>{" "}
            Payments and full membership features are still under construction. You can
            explore the plans now; upgrade will be enabled in a future release.
          </div>

          {/* 价格卡片 */}
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm md:p-5 ${
                  plan.popular
                    ? "border-sky-500/70 shadow-md shadow-sky-100"
                    : "border-slate-200"
                }`}
              >
                {plan.popular && (
                  <div className="mb-2 inline-flex items-center self-start rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                    Most popular
                  </div>
                )}

                <h2 className="text-base font-semibold text-slate-900 md:text-lg">
                  {plan.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500 md:text-sm">
                  {plan.highlight}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span className="text-xs text-slate-500 md:text-sm">
                      {plan.priceNote}
                    </span>
                  )}
                </div>

                <ul className="mt-4 flex flex-1 list-disc flex-col gap-1 pl-4 text-xs text-slate-600 md:text-sm">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-4 w-full rounded-xl px-3 py-2 text-xs font-semibold md:text-sm ${
                    plan.id === "free"
                      ? "border border-sky-500/70 bg-white text-sky-700 hover:bg-sky-50"
                      : plan.id === "creator"
                      ? "bg-sky-600 text-white hover:bg-sky-700"
                      : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                  } transition`}
                  onClick={() => {
                    if (plan.id === "free") {
                      window.location.href = "/register";
                    } else if (plan.id === "creator") {
                      alert("Membership payments are coming soon.");
                    } else {
                      window.location.href = "/about";
                    }
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ 简短说明 */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 md:p-5 md:text-sm">
            <h3 className="text-sm font-semibold text-slate-900 md:text-base">
              Frequently asked
            </h3>
            <div className="mt-3 space-y-2">
              <div>
                <p className="font-medium text-slate-800">
                  Can I use LiveBackdrop for free?
                </p>
                <p className="text-xs text-slate-600 md:text-sm">
                  Yes. The Free plan lets you try AI generation with a daily limit and test
                  uploaded backgrounds. It&apos;s perfect for evaluating if LiveBackdrop
                  fits your workflow.
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  When will paid memberships be available?
                </p>
                <p className="text-xs text-slate-600 md:text-sm">
                  We&apos;re currently wiring up Stripe integration and stabilizing AI
                  generation. Once everything is ready for production use, the Creator plan
                  will be activated for monthly billing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
