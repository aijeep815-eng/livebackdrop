// pages/admin/backgrounds.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Background Records",
    desc: "Manage all AI generated backgrounds here."
  },
  zh: {
    title: "背景记录",
    desc: "在这里管理所有 AI 生成的背景记录。"
  },
  es: {
    title: "Fondos Generados",
    desc: "Administra aquí todos los fondos generados por IA."
  }
};

export default function AdminBackgroundsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 生成记录列表 */}
    </AdminLayout>
  );
}
