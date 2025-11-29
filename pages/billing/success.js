// pages/billing/success.js
import NavBar from "../../components/NavBar";

export default function BillingSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1">
        <section className="mx-auto max-w-xl px-4 py-10 md:py-14">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Payment successful
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Thank you for upgrading your LiveBackdrop plan. Your subscription should be
            activated shortly. If you don&apos;t see the new limits after a few minutes,
            try refreshing the page or signing out and back in.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
            onClick={() => {
              window.location.href = "/ai-background";
            }}
          >
            Go to AI Backgrounds
          </button>
        </section>
      </main>
    </div>
  );
}
