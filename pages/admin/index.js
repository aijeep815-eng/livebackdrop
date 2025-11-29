// pages/admin/index.js
import AdminLayout from "../../components/AdminLayout";

const cards = [
  {
    title: "Users",
    href: "/admin/users",
    desc: "View and manage registered LiveBackdrop users.",
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    desc: "See who has an active Creator plan and their status.",
  },
  {
    title: "Backgrounds",
    href: "/admin/backgrounds",
    desc: "Review AI-generated backgrounds or presets.",
  },
  {
    title: "Uploads",
    href: "/admin/uploads",
    desc: "Inspect user-uploaded assets and files.",
  },
  {
    title: "Feedback",
    href: "/admin/feedback",
    desc: "Read user feedback and bug reports.",
  },
  {
    title: "Logs",
    href: "/admin/logs",
    desc: "Basic activity logs and debug information.",
  },
  {
    title: "Membership",
    href: "/admin/membership",
    desc: "High-level membership overview and controls.",
  },
  {
    title: "Payments",
    href: "/admin/payments",
    desc: "Payment-related records and sanity checks.",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    desc: "Admin-only configuration and feature flags.",
  },
];

export default function AdminHomePage() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Internal admin tools for LiveBackdrop. Use these cards to quickly jump into user management, subscriptions, backgrounds, and more."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.href}
            type="button"
            onClick={() => {
              window.location.href = card.href;
            }}
            className="flex h-full flex-col items-start rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-sky-300 hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-slate-900 md:text-base">
              {card.title}
            </h2>
            <p className="mt-2 text-xs text-slate-600 md:text-sm">{card.desc}</p>
          </button>
        ))}
      </div>
    </AdminLayout>
  );
}
