// pages/admin/settings.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "System Settings",
    desc: "Manage global system configuration."
  },
  zh: {
    title: "系统设置",
    desc: "在这里管理全局系统配置。"
  },
  es: {
    title: "Configuración del Sistema",
    desc: "Administra aquí la configuración global del sistema."
  }
};

export default function AdminSettingsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: API Key、SEO、邮件配置等 */}
    </AdminLayout>
  );
}
