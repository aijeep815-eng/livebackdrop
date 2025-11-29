// pages/profile.js
// 用户中心页面：展示基本信息、当前订阅、使用概况
// 本版本增加：点击“已生成背景数”跳转到 /history，点击“已上传素材数”跳转到 /uploads。

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalUploads: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      loadStats();
    }
  }, [status]);

  async function loadStats() {
    try {
      setLoadingStats(true);
      setStatsError('');
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load stats');
      }
      setStats({
        totalGenerations: data.totalGenerations || 0,
        totalUploads: data.totalUploads || 0,
      });
    } catch (err) {
      console.error('load stats error', err);
      setStatsError(err.message || '加载使用统计失败。');
    } finally {
      setLoadingStats(false);
    }
  }

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
            查看用户中心需要登录账户。请先登录或注册，然后再访问本页面。
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
    user.subscriptionPlan ||
    user.planName ||
    user.plan ||
    'Free / 未开通订阅';

  const planStatusText = '正常';

  return (
    <>
      <Head>
        <title>用户中心 – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 基本信息 */}
          <section className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
              {user.name
                ? user.name[0]?.toUpperCase()
                : user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">基本信息</p>
              <p className="text-lg font-semibold text-slate-900">
                {user.name || '未设置昵称'}
              </p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </section>

          {/* 当前订阅 */}
          <section className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-slate-500 mb-2">当前订阅</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <p className="text-lg font-semibold text-slate-900">
                {planName}
              </p>
              <p className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                状态：{planStatusText}
              </p>
            </div>
            <p className="text-xs text-slate-500">
              若你刚刚升级了套餐，可以尝试刷新页面。如果套餐信息与右上角显示不一致，以后我们会在这里同步显示 Stripe 的详细数据（到期时间、续费方式等）。
            </p>
          </section>

          {/* 使用概况 */}
          <section className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-slate-500 mb-3">使用概况（预留区）</p>

            {statsError && (
              <p className="text-xs text-red-600 mb-2">{statsError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 已生成背景数 → /history */}
              <a
                href="/history"
                className="group border border-slate-200 rounded-2xl px-4 py-3 hover:border-blue-500 hover:bg-blue-50/40 transition flex flex-col justify-between"
              >
                <div>
                  <p className="text-2xl font-semibold text-slate-900 group-hover:text-blue-700">
                    {loadingStats ? '—' : stats.totalGenerations}
                  </p>
                  <p className="text-xs text-slate-500">
                    已生成背景数
                  </p>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 group-hover:text-blue-600">
                  点击查看 AI 生成历史记录。
                </p>
              </a>

              {/* 已上传素材数 → /uploads */}
              <a
                href="/uploads"
                className="group border border-slate-200 rounded-2xl px-4 py-3 hover:border-blue-500 hover:bg-blue-50/40 transition flex flex-col justify-between"
              >
                <div>
                  <p className="text-2xl font-semibold text-slate-900 group-hover:text-blue-700">
                    {loadingStats ? '—' : stats.totalUploads}
                  </p>
                  <p className="text-xs text-slate-500">
                    已上传素材数
                  </p>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 group-hover:text-blue-600">
                  点击进入素材管理页面。
                </p>
              </a>

              {/* 当前权益说明 */}
              <div className="border border-slate-200 rounded-2xl px-4 py-3 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">当前权益</p>
                  <p className="text-sm font-medium text-slate-800">
                    免费用户：每天可生成有限数量背景，适合轻量使用。
                  </p>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  使用统计来自你的真实历史数据：AI 生成记录与素材上传记录。以后我们可以增加更多维度（按日期统计、本月使用情况等），用于帮助你规划套餐与使用策略。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
