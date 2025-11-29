// pages/profile.js
import { useSession } from 'next-auth/react';
import Head from 'next/head';

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return '?';
  const name = nameOrEmail.split('@')[0];
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 text-sm">加载中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow rounded-2xl px-8 py-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">请先登录</h1>
          <p className="text-slate-600 mb-4">
            用户中心需要账户登录。请先登录或注册，然后再访问本页面。
          </p>
          <a
            href="/auth/signin"
            className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            去登录
          </a>
        </div>
      </div>
    );
  }

  const user = session.user || {};
  const planName =
    user.planName ||
    user.plan ||
    user.subscriptionPlan ||
    'Free / 未开通订阅';
  const subscriptionStatus =
    user.subscriptionStatus ||
    user.status ||
    '正常';

  return (
    <>
      <Head>
        <title>Profile – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">
            用户中心
          </h1>

          {/* 基本信息卡片 */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                {getInitials(user.name || user.email)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">
                基本信息
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {user.name || '未设置昵称'}
              </p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>

          {/* 订阅信息 */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <p className="text-sm uppercase tracking-wide text-slate-400 mb-2">
              当前订阅
            </p>
            <p className="text-lg font-semibold text-slate-900 mb-1">
              {planName}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              状态：{subscriptionStatus}
            </p>
            <p className="text-xs text-slate-500">
              若你刚刚升级了套餐，可以尝试刷新页面。如果套餐信息与右上角显示不一致，
              以后我们会在这里同步显示 Stripe 的详细数据（到期时间、续费方式等）。
            </p>
          </div>

          {/* 使用情况概要（占位，后续可接真实数据） */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <p className="text-sm uppercase tracking-wide text-slate-400 mb-3">
              使用概况（预留区）
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-slate-900">—</p>
                <p className="text-xs text-slate-500 mt-1">已生成背景数</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">—</p>
                <p className="text-xs text-slate-500 mt-1">已上传素材数</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">—</p>
                <p className="text-xs text-slate-500 mt-1">当前权益</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              这里以后可以接入你的 AI 生成记录、上传素材数量等统计信息，用于展示你在
              LiveBackdrop 的使用情况。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
