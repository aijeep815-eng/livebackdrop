// pages/admin/membership.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminMembershipPage() {
  return (
    <>
      <Head>
        <title>会员配置 - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="membership">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">会员配置</h1>
            <p className="text-sm text-slate-600 mt-1">
              将来可以在这里配置不同会员等级的权限与限额。
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
