// pages/admin/index.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Dashboard",
    welcome: "Welcome to the admin dashboard.",
    desc: "Here you can get an overview of users, backgrounds and system status.",
    quickStats: "Quick Stats (placeholder)",
    users: "Total users",
    backgrounds: "Generated backgrounds",
    today: "Today",
    coming: "More detailed statistics will be added later."
  },
  zh: {
    title: "仪表盘",
    welcome: "欢迎来到后台管理仪表盘。",
    desc: "在这里你可以总览用户、背景记录和系统状态。",
    quickStats: "快速统计（占位）",
    users: "用户总数",
    backgrounds: "生成背景数量",
    today: "今日数据",
    coming: "后续会在这里增加更详细的统计图表。"
  },
  es: {
    title: "Panel",
    welcome: "Bienvenido al panel de administración.",
    desc: "Aquí puedes ver el resumen de usuarios, fondos y el estado del sistema.",
    quickStats: "Estadísticas rápidas (temporal)",
    users: "Total de usuarios",
    backgrounds: "Fondos generados",
    today: "Hoy",
    coming: "Más estadísticas detalladas se agregarán más adelante."
  }
};

export default function AdminDashboardPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="mb-2">{t.welcome}</p>
      <p className="mb-4 text-sm text-gray-600">{t.desc}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="border rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase">
            {t.users}
          </div>
          <div className="text-2xl font-semibold mt-1">0</div>
          <div className="text-xs text-gray-400 mt-1">
            {t.today}
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase">
            {t.backgrounds}
          </div>
          <div className="text-2xl font-semibold mt-1">0</div>
          <div className="text-xs text-gray-400 mt-1">
            {t.today}
          </div>
        </div>

        <div className="border rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase">
            {t.quickStats}
          </div>
          <div className="text-2xl font-semibold mt-1">—</div>
          <div className="text-xs text-gray-400 mt-1">
            {t.coming}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
