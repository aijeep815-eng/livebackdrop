// pages/admin/membership.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Membership Plans",
    desc: "Configure membership levels and limits."
  },
  zh: {
    title: "会员计划",
    desc: "在这里配置会员等级和使用限制。"
  },
  es: {
    title: "Planes de Membresía",
    desc: "Configura aquí los niveles de membresía y límites."
  }
};

export default function AdminMembershipPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 会员配置表单 */}
    </AdminLayout>
  );
}
