// pages/admin/users.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "User Management",
    desc: "Showing real users from MongoDB.",
    email: "Email",
    role: "Role",
    createdAt: "Created at",
    loading: "Loading users...",
    empty: "No users found.",
    admin: "Admin",
    user: "User"
  },
  zh: {
    title: "用户管理",
    desc: "显示来自 MongoDB 的真实用户数据。",
    email: "邮箱",
    role: "角色",
    createdAt: "创建时间",
    loading: "正在加载用户...",
    empty: "没有找到用户。",
    admin: "管理员",
    user: "普通用户"
  },
  es: {
    title: "Gestión de Usuarios",
    desc: "Mostrando usuarios reales desde MongoDB.",
    email: "Correo",
    role: "Rol",
    createdAt: "Creado en",
    loading: "Cargando usuarios...",
    empty: "No se encontraron usuarios.",
    admin: "Administrador",
    user: "Usuario"
  }
};

export default function AdminUsersPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;
  const [users, setUsers] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600 mb-4">{t.desc}</p>

      {users === null ? (
        <p className="text-sm text-gray-500">{t.loading}</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">{t.empty}</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  {t.email}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  {t.role}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  {t.createdAt}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">
                    {u.role === "admin" ? t.admin : t.user}
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {u.createdAt ? String(u.createdAt).slice(0, 10) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
