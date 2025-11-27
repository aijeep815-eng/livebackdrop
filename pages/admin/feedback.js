// pages/admin/feedback.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Feedback & Support",
    desc: "Handle user feedback, bug reports and support tickets."
  },
  zh: {
    title: "用户反馈与支持",
    desc: "在这里处理用户反馈、Bug 报告和支持请求。"
  },
  es: {
    title: "Comentarios y Soporte",
    desc: "Gestiona aquí comentarios de usuarios, errores y soporte."
  }
};

export default function AdminFeedbackPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 表单、工单系统 */}
    </AdminLayout>
  );
}
