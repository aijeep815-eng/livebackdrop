// pages/admin/index.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Dashboard",
    welcome: "Welcome to the admin dashboard.",
    desc: "Here you can later see statistics about users and backgrounds."
  },
  zh: {
    title: "仪表盘",
    welcome: "欢迎来到后台管理仪表盘。",
    desc: "后续你可以在这里看到用户和背景相关的统计数据。"
  },
  es: {
    title: "Panel",
    welcome: "Bienvenido al panel de administración.",
    desc: "Más adelante aquí podrás ver estadísticas de usuarios y fondos."
  }
};

export default function AdminDashboardPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="mb-2">{t.welcome}</p>
      <p className="text-sm text-gray-600">{t.desc}</p>
    </AdminLayout>
  );
}
