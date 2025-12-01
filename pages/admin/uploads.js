// pages/admin/uploads.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminUploadsPage() {
  return (
    <>
      <Head>
        <title>素材上传管理 - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="uploads">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">素材上传管理</h1>
            <p className="text-sm text-slate-600 mt-1">
              在这里可以查看用户上传的素材图片，排查违规内容（后续接入）。
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
