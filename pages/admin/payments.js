// pages/admin/payments.js
import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";

const textMap = {
  en: {
    title: "Payments & Orders",
    desc: "View and manage payment records and orders."
  },
  zh: {
    title: "支付与订单",
    desc: "在这里查看和管理支付记录与订单。"
  },
  es: {
    title: "Pagos y Órdenes",
    desc: "Aquí puedes ver y gestionar pagos y órdenes."
  }
};

export default function AdminPaymentsPage() {
  const { locale } = useRouter();
  const t = textMap[locale] || textMap.en;

  return (
    <AdminLayout title={t.title}>
      <p className="text-sm text-gray-600">{t.desc}</p>
      {/* TODO: 接入支付后展示订单 */}
    </AdminLayout>
  );
}
