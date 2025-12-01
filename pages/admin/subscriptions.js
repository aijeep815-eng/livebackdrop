// pages/admin/subscriptions.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSubscriptionsPage() {
  return (
    <>
      <Head>
        <title>Subscriptions - Admin - LiveBackdrop</title>
      </Head>

      <AdminLayout active="subscriptions">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">订阅管理</h1>
            <p className="text-sm text-slate-600 mt-1">
              在这里查看用户订阅、自动续费状态、到期日期等信息。（当前为占位 UI，后续接入 Stripe 数据）
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-slate-700">
            <p>这个页面已经接入统一后台布局。你可以在这里扩展：</p>
            <ul className="list-disc ml-6 mt-3 text-sm">
              <li>显示所有用户的当前套餐</li>
              <li>显示 Stripe Subscription ID</li>
              <li>显示订阅是否有效、到期时间</li>
              <li>接入 Stripe Webhook 后自动同步</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500">
              （目前只是基础结构，后续你要我扩展我可以继续加功能。）
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

  return {
    props: {},
  };
}
