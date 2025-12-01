// pages/admin/index.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="dashboard">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">后台总览</h1>
            <p className="text-sm text-slate-600 mt-1">
              这里是 LiveBackdrop 的后台首页，你可以从左侧切换到不同的管理模块。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 mb-1">订阅概览</p>
              <p className="text-lg font-semibold text-slate-900">Subscriptions</p>
              <p className="text-[11px] text-slate-500 mt-1">
                通过 Subscriptions 和 Costs，可以查看收入与大致成本。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 mb-1">用户与生成</p>
              <p className="text-lg font-semibold text-slate-900">Users & Backgrounds</p>
              <p className="text-[11px] text-slate-500 mt-1">
                将来可以在 Users / Backgrounds 模块中查看用户使用情况。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 mb-1">统计与日志</p>
              <p className="text-lg font-semibold text-slate-900">Analytics & Logs</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Analytics、Logs 可以帮助你排查问题、了解系统健康状态。
              </p>
            </div>
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
