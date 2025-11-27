// components/admin/AdminSidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const labelMap = {
  en: {
    dashboard: "Dashboard",
    users: "User Management",
    backgrounds: "Background Records",
    uploads: "Upload Library",
    presets: "AI Presets",
    payments: "Payments & Orders",
    membership: "Membership Plans",
    settings: "System Settings",
    admins: "Admin Accounts",
    logs: "System Logs",
    feedback: "Feedback & Support",
    adminPanel: "Admin Panel"
  },
  zh: {
    dashboard: "仪表盘",
    users: "用户管理",
    backgrounds: "背景记录",
    uploads: "素材库",
    presets: "AI 模板",
    payments: "支付与订单",
    membership: "会员计划",
    settings: "系统设置",
    admins: "管理员账户",
    logs: "系统日志",
    feedback: "用户反馈与支持",
    adminPanel: "后台管理"
  },
  es: {
    dashboard: "Panel",
    users: "Gestión de Usuarios",
    backgrounds: "Fondos Generados",
    uploads: "Biblioteca de Archivos",
    presets: "Plantillas de IA",
    payments: "Pagos y Órdenes",
    membership: "Planes de Membresía",
    settings: "Configuración del Sistema",
    admins: "Cuentas de Administradores",
    logs: "Registros del Sistema",
    feedback: "Comentarios y Soporte",
    adminPanel: "Panel de Administración"
  }
};

const menuItems = [
  { key: "dashboard", href: "/admin" },
  { key: "users", href: "/admin/users" },
  { key: "backgrounds", href: "/admin/backgrounds" },
  { key: "uploads", href: "/admin/uploads" },
  { key: "presets", href: "/admin/presets" },
  { key: "payments", href: "/admin/payments" },
  { key: "membership", href: "/admin/membership" },
  { key: "settings", href: "/admin/settings" },
  { key: "admins", href: "/admin/admins" },
  { key: "logs", href: "/admin/logs" },
  { key: "feedback", href: "/admin/feedback" }
];

export default function AdminSidebar() {
  const router = useRouter();
  const locale = router.locale || "en";
  const labels = labelMap[locale] || labelMap.en;

  return (
    <aside className="w-56 md:w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="px-4 py-4 border-b border-slate-700">
        <div className="text-lg font-semibold">
          {labels.adminPanel}
        </div>
        <div className="text-xs text-slate-300 mt-1">
          LiveBackdrop
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <li key={item.key}>
                <Link href={item.href}>
                  <span
                    className={
                      "block px-4 py-2 text-sm cursor-pointer " +
                      (isActive
                        ? "bg-slate-700 font-semibold"
                        : "text-slate-200 hover:bg-slate-800")
                    }
                  >
                    {labels[item.key]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
