// components/admin/AdminLayout.js
// 统一后台布局：浅色风格 + 左侧导航
export default function AdminLayout({ active, children }) {
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
