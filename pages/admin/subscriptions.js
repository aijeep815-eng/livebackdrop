// pages/admin/subscriptions.js
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subs, setSubs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/subscriptions");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load subscriptions");
        }
        setSubs(Array.isArray(data.subscriptions) ? data.subscriptions : []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Subscriptions
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                View active and past subscriptions for LiveBackdrop users. This is a
                simple internal view for you to confirm who has paid and what their
                current status is.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2 text-xs text-sky-800">
              <p className="font-semibold">Note</p>
              <p>
                Data comes from Stripe webhooks and may be slightly delayed compared to
                real-time Stripe dashboard.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
              <span>Loading subscriptions…</span>
            </div>
          ) : subs.length === 0 ? (
            <p className="text-sm text-slate-500">
              No subscription records found yet. Once users complete checkout via Stripe,
              they will appear here.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-xs text-slate-700 md:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 md:text-xs">
                  <tr>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Stripe Customer</th>
                    <th className="px-3 py-2">Stripe Subscription</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s) => {
                    const created = s.createdAt
                      ? new Date(s.createdAt).toLocaleString()
                      : "-";
                    const updated = s.updatedAt
                      ? new Date(s.updatedAt).toLocaleString()
                      : "-";
                    return (
                      <tr
                        key={s._id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                      >
                        <td className="px-3 py-2 align-top">
                          <div className="max-w-[200px] truncate font-medium">
                            {s.email || "-"}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                            {s.plan || "creator"}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              s.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : s.status === "canceled"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {s.status || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="max-w-[180px] truncate text-[11px] font-mono text-slate-500">
                            {s.stripeCustomerId || "-"}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="max-w-[220px] truncate text-[11px] font-mono text-slate-500">
                            {s.stripeSubscriptionId || "-"}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top text-[11px] text-slate-500">
                          {created}
                        </td>
                        <td className="px-3 py-2 align-top text-[11px] text-slate-500">
                          {updated}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
