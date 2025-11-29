// pages/billing/cancel.js
import NavBar from "../components/NavBar";

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1">
        <section className="mx-auto max-w-xl px-4 py-10 md:py-14">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Checkout canceled
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Your payment was canceled or not completed. You can continue using the Free
            plan, or try upgrading again later if you&apos;d like access to higher AI
            limits.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900"
            onClick={() => {
              window.location.href = "/pricing";
            }}
          >
            Back to pricing
          </button>
        </section>
      </main>
    </div>
  );
}
