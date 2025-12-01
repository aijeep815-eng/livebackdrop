// pages/admin/subscriptions.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import dbConnect from '../../lib/dbConnect';

/**
 * 后台统一布局（与 /admin/costs 完全一致）
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

        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * 后台订阅管理页面（你以后可以在这里显示所有 Stripe Subscriptions）
 */
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
              在这里查看用户订阅、自动续费状态、到期日期等信息。（当前为占位 UI）
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

  await dbConnect();

  return {
    props: {},
  };
}
