// pages/profile.js
import { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState({
    generationCount: null,
    uploadCount: null,
    currentRights: '',
  });
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  async function fetchStats() {
    try {
      setStatsError('');
      const res = await fetch('/api/stats');
      if (!res.ok) {
        throw new Error('Failed to load stats');
      }
      const data = await res.json();
      setStats({
        generationCount:
          typeof data.generationCount === 'number'
            ? data.generationCount
            : null,
        uploadCount:
          typeof data.uploadCount === 'number' ? data.uploadCount : null,
        currentRights: data.currentRights || '',
      });
    } catch (err) {
      console.error('Fetch stats error:', err);
      setStatsError('使用统计加载失败，稍后再试。');
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

  const generationCountText =
    stats.generationCount == null ? '—' : stats.generationCount;
  const uploadCountText =
    stats.uploadCount == null ? '—' : stats.uploadCount;
  const rightsText =
    stats.currentRights ||
    (planName.startsWith('Free')
      ? '免费用户：每天可生成有限数量背景'
      : '付费用户：可享受更高的生成次数和优先队列');

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

          {/* 使用情况概要 */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <p className="text-sm uppercase tracking-wide text-slate-400 mb-3">
              使用概况
            </p>

            {statsError && (
              <p className="text-xs text-red-600 mb-2">{statsError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {generationCountText}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  已生成背景数
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {uploadCountText}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  已上传素材数
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-700 leading-snug">
                  {rightsText}
                </p>
                <p className="text-xs text-slate-400 mt-1">当前权益</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              使用统计来自你的真实历史数据：AI 生成记录与素材上传记录。以后我们可以增加更多维度
              （按日期统计、本月使用情况等），用于帮助你规划套餐与使用频率。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
