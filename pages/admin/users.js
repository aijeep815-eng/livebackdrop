// pages/admin/users.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "User Management",
    desc: "Here you will be able to view and manage all users."
  },
  zh: {
    title: "用户管理",
    desc: "在这里你可以查看并管理所有用户。"
  },
  es: {
    title: "Gestión de Usuarios",
    desc: "Aquí podrás ver y gestionar todos los usuarios."
  }
};

export default function AdminUsersPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 用户列表表格 */}
    </AdminLayout>
  );
}
