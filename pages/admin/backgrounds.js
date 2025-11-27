// pages/admin/backgrounds.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Background Records",
    desc: "Here you will see AI generated backgrounds once the generation feature is online.",
    email: "User Email",
    prompt: "Prompt",
    model: "Model",
    preview: "Preview",
    createdAt: "Created at",
    loading: "Loading background records...",
    empty: "No background records yet."
  },
  zh: {
    title: "背景记录",
    desc: "当生成功能上线后，这里会显示所有 AI 生成的背景记录。",
    email: "用户邮箱",
    prompt: "提示词",
    model: "模型",
    preview: "预览",
    createdAt: "创建时间",
    loading: "正在加载背景记录...",
    empty: "目前还没有任何背景记录。"
  },
  es: {
    title: "Fondos Generados",
    desc: "Cuando la función de generación esté activa, aquí verás todos los fondos generados por IA.",
    email: "Correo del usuario",
    prompt: "Prompt",
    model: "Modelo",
    preview: "Vista previa",
    createdAt: "Creado en",
    loading: "Cargando registros de fondos...",
    empty: "Todavía no hay registros de fondos."
  }
};

export default function AdminBackgroundsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/backgrounds")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600 mb-4">{t.desc}</p>

      {items === null ? (
        <p className="text-sm text-gray-500">{t.loading}</p>
      ) : items.length === 0 ? (
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
                  {t.prompt}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  {t.model}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  {t.preview}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  {t.createdAt}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t align-top">
                  <td className="px-3 py-2">{item.email}</td>
                  <td className="px-3 py-2 max-w-xs break-words">
                    {item.prompt}
                  </td>
                  <td className="px-3 py-2">{item.model}</td>
                  <td className="px-3 py-2">
                    {item.imageUrl ? (
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-blue-600"
                      >
                        {t.preview}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {item.createdAt ? String(item.createdAt).slice(0, 10) : ""}
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
