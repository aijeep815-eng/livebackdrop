// pages/admin/settings.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSettingsPage() {
  return (
    <>
      <Head>
        <title>后台设置 - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="settings">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">后台设置</h1>
            <p className="text-sm text-slate-600 mt-1">
              在这里可以放站点的一些高级配置，例如公告、维护模式开关等。
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm text-slate-700">
              当前为占位页面，主要用于统一后台布局和颜色。等你需要具体功能时，再在这里接入数据库或 Stripe 数据。
            </p>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return { props: {} };
}
