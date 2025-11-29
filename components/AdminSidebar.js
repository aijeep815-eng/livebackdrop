// components/AdminSidebar.js
import { useRouter } from "next/router";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/backgrounds", label: "Backgrounds" },
  { href: "/admin/uploads", label: "Uploads" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/membership", label: "Membership" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = router?.pathname || "";

  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-slate-200 bg-white/80 px-3 py-5 text-sm text-slate-700 shadow-sm md:block">
      <div className="mb-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Admin
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" &&
              pathname.startsWith(link.href) &&
              link.href !== "/admin");
          return (
            <button
              key={link.href}
              type="button"
              onClick={() => {
                window.location.href = link.href;
              }}
              className={[
                "flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-medium md:text-sm",
                active
                  ? "bg-sky-100 text-sky-800"
                  : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
