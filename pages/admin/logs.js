// pages/admin/logs.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "System Logs",
    desc: "View system logs and error records."
  },
  zh: {
    title: "系统日志",
    desc: "在这里查看系统日志和错误记录。"
  },
  es: {
    title: "Registros del Sistema",
    desc: "Aquí puedes ver los registros del sistema y errores."
  }
};

export default function AdminLogsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 日志系统 */}
    </AdminLayout>
  );
}
