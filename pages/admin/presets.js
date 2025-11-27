// pages/admin/presets.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "AI Presets",
    desc: "Create and edit AI background presets."
  },
  zh: {
    title: "AI 模板",
    desc: "在这里创建和编辑 AI 背景模板。"
  },
  es: {
    title: "Plantillas de IA",
    desc: "Crea y edita plantillas de fondos de IA aquí."
  }
};

export default function AdminPresetsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 模板表单 */}
    </AdminLayout>
  );
}
