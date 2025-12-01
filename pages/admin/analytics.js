// pages/admin/analytics.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Analytics - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="analytics">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">数据概览</h1>
            <p className="text-sm text-slate-600 mt-1">
              这里将来可以展示用户增长、生成次数、订阅转化等图表。当前版本主要是统一后台风格。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">今天新注册用户</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                接入真实统计后，可以在这里看到每天的新用户数量。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">今天生成的背景数</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                可以和 /admin/costs 的成本数据结合起来看。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">当前付费订阅数</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                接入 Stripe Webhook 后可以在这里实时展示。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                最近 30 天趋势（占位）
              </h2>
              <p className="text-xs text-slate-500">
                以后可以接入图表库（如 Recharts）展示注册 / 生成 / 订阅趋势。
              </p>
            </div>
            <div className="h-48 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
              <p className="text-xs text-slate-400">
                Trend chart placeholder（趋势图占位区域）
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
