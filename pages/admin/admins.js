// pages/admin/admins.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Admin Accounts",
    desc: "Manage admin accounts and permissions."
  },
  zh: {
    title: "管理员账户",
    desc: "在这里管理管理员账户和权限。"
  },
  es: {
    title: "Cuentas de Administradores",
    desc: "Administra aquí las cuentas de administradores y permisos."
  }
};

export default function AdminAdminsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 管理员列表、权限设定 */}
    </AdminLayout>
  );
}
