// pages/admin/uploads.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Upload Library",
    desc: "View and manage all uploaded assets."
  },
  zh: {
    title: "素材库",
    desc: "在这里查看和管理所有上传的素材。"
  },
  es: {
    title: "Biblioteca de Archivos",
    desc: "Aquí puedes ver y gestionar todos los archivos subidos."
  }
};

export default function AdminUploadsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 素材列表 */}
    </AdminLayout>
  );
}
