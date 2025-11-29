// pages/admin/analytics.js
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [usage, setUsage] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load analytics");
        }
        setStats(data.stats || null);
        setUsage(Array.isArray(data.usageLast7Days) ? data.usageLast7Days : []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxUsage =
    usage.length > 0 ? Math.max(...usage.map((u) => u.total || 0)) : 0;
  const scale = maxUsage > 0 ? 60 / maxUsage : 0;

  return (
    <AdminLayout
      title="Analytics"
      description="High-level metrics for LiveBackdrop usage and subscriptions. This is a simple internal view based on your MongoDB data."
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
          <span>Loading analytics…</span>
        </div>
      ) : (
        <>
          <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total users
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats?.totalUsers ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Subscriptions (all)
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats?.totalSubscriptions ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Active subscriptions
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {stats?.activeSubscriptions ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Active Creator
              </p>
              <p className="mt-2 text-2xl font-bold text-sky-700">
                {stats?.creatorActive ?? 0}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                  AI generations – last 7 days
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Based on UserUsage entries. Values include both Free and Creator users.
                </p>
              </div>
            </div>
            {usage.length === 0 ? (
              <p className="text-sm text-slate-500">
                No usage data found for the last 7 days yet. Once users start generating
                more backgrounds, the chart will appear here.
              </p>
            ) : (
              <div className="mt-2">
                <div className="flex items-end gap-2 border-b border-slate-100 pb-6">
                  {usage.map((u) => {
                    const h =
                      u.total === 0 ? 4 : 10 + Math.round(u.total * scale);
                    return (
                      <div
                        key={u.date}
                        className="flex flex-1 flex-col items-center justify-end gap-1"
                      >
                        <div
                          className="w-full rounded-t-full bg-sky-500/80"
                          style={{ height: `${h}px` }}
                        />
                        <div className="text-[10px] text-slate-500">
                          {u.total}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-2 text-[10px] text-slate-500">
                  {usage.map((u) => (
                    <div key={u.date} className="flex-1 text-center">
                      {u.date.slice(5)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  );
}
