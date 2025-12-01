// pages/admin/analytics.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';

/**
 * 后台统一布局：左侧侧边栏 + 右侧内容
 * 和 /admin/costs、/admin/subscriptions 保持一致
 */
function AdminLayout({ active, children }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', href: '/admin' },
    { key: 'analytics', label: 'Analytics', href: '/admin/analytics' },
    { key: 'users', label: 'Users', href: '/admin/users' },
    { key: 'subscriptions', label: 'Subscriptions', href: '/admin/subscriptions' },
    { key: 'backgrounds', label: 'Backgrounds', href: '/admin/backgrounds' },
    { key: 'uploads', label: 'Uploads', href: '/admin/uploads' },
    { key: 'feedback', label: 'Feedback', href: '/admin/feedback' },
    { key: 'logs', label: 'Logs', href: '/admin/logs' },
    { key: 'membership', label: 'Membership', href: '/admin/membership' },
    { key: 'payments', label: 'Payments', href: '/admin/payments' },
    { key: 'costs', label: 'Costs', href: '/admin/costs' },
    { key: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* 左侧侧边栏 */}
        <aside className="w-56 bg-white border-r border-slate-200 px-4 py-6">
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
              Admin
            </p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.key === active;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className={[
                    'block rounded-xl px-3 py-2 text-sm',
                    isActive
                      ? 'bg-sky-100 text-sky-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* 右侧主内容 */}
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Analytics - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="analytics">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">数据概览（占位）</h1>
            <p className="text-sm text-slate-600 mt-1">
              这里将来可以展示用户增长、生成次数、订阅转化等图表。当前版本只做统一风格，占位 UI。
            </p>
          </div>

          {/* 顶部统计卡片 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">今天新注册用户</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                Stripe Webhook 和用户事件打通后，会自动统计这里的数据。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">今天生成的背景数</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                可与 /admin/costs 的成本数据对比，算出每个用户的平均消耗。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">当前付费订阅数</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                接入 Stripe Webhook 后，可以在这里实时显示订阅数量。
              </p>
            </div>
          </div>

          {/* 占位图表区域 */}
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

  // 目前不拉取任何统计数据，只做权限保护和占位 UI
  return {
    props: {},
  };
}
