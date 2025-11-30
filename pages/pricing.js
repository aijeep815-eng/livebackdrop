// pages/pricing.js

import { useState } from 'react';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';

// 如果你已经有别的 Stripe 接口路径，可以把这行改成你的路径
const CHECKOUT_API = '/api/stripe/create-checkout-session';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAuthenticated = status === 'authenticated';

  // 如果你的 session 结构不同，可以按实际修改这里
  const currentPlan = session?.user?.plan || 'FREE';
  const isCreator = currentPlan.toLowerCase().includes('creator');

  async function handleUpgradeClick() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'creator_unlimited',
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to start checkout session');
      }

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setError('无法启动升级流程，请稍后再试。如果问题反复出现，请联系站长。');
      setLoading(false);
    }
  }

  function handleSignInClick() {
    // 如果你有自定义登录页路径，可以在这里传 callbackUrl
    signIn();
  }

  return (
    <>
      <Head>
        <title>Pricing | LiveBackdrop</title>
        <meta
          name="description"
          content="Upgrade your LiveBackdrop plan to unlock high-quality AI virtual backgrounds for streaming, Zoom, YouTube and more."
        />
      </Head>

      <div className="min-h-screen bg-slate-50">
        {/* 这里只是页面内部标题，不会动你的全站导航栏 */}
        <header className="w-full border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Pricing &amp; Plans
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                自由体验 + 简单升级，让你的直播和会议背景更专业。
              </p>
            </div>
            {isAuthenticated && (
              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-600">
                已登录账号：{' '}
                <span className="font-medium text-slate-900">
                  {session?.user?.email || '用户'}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10">
          {/* 当前套餐提示 */}
          {isAuthenticated && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  当前套餐：{' '}
                  <span className="font-semibold text-slate-900">
                    {isCreator ? 'Creator Unlimited' : 'Free'}
                  </span>
                </span>
                {isCreator && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    已解锁无限生成
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 套餐卡片 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Free Plan */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Free</h2>
              <p className="mt-1 text-sm text-slate-500">
                适合体验 LiveBackdrop 或偶尔使用虚拟背景的用户。
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">$0</span>
                <span className="text-sm text-slate-500"> / forever</span>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• 每日有限制的生成次数</li>
                <li>• 标准分辨率背景</li>
                <li>• 适合个人测试与尝鲜</li>
                <li>• 无需绑定信用卡</li>
              </ul>

              <div className="mt-6">
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    disabled
                  >
                    当前正在使用
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    登录后使用免费版
                  </button>
                )}
              </div>
            </div>

            {/* Creator Unlimited Plan */}
            <div className="relative flex flex-col rounded-2xl border border-blue-500 bg-white p-6 shadow-[0_10px_40px_rgba(37,99,235,0.15)]">
              <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                推荐
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                Creator Unlimited
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                为主播、YouTuber、课程制作者、线上会议重度用户准备的专业方案。
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">
                  $4.99
                </span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• 无限次数 AI 背景生成</li>
                <li>• 优先队列，生成速度更快</li>
                <li>• 更高分辨率、更干净的画面质量</li>
                <li>• 适配直播、Zoom、录课、短视频</li>
                <li>• 持续更新的专业风格背景库</li>
              </ul>

              <div className="mt-6">
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    登录后升级到 Creator
                  </button>
                )}

                {isAuthenticated && isCreator && (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    disabled
                  >
                    已是 Creator Unlimited 套餐
                  </button>
                )}

                {isAuthenticated && !isCreator && (
                  <button
                    type="button"
                    onClick={handleUpgradeClick}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? '正在跳转到 Stripe…' : '升级到 Creator Unlimited'}
                  </button>
                )}

                {error && (
                  <p className="mt-3 text-xs text-red-600">
                    {error}
                  </p>
                )}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                升级通过 Stripe 安全支付，你可以随时在账号中取消订阅。取消后当前计费周期结束前仍可继续使用。
              </p>
            </div>
          </div>

          {/* 简单 FAQ，可按需要删掉或改文案 */}
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
            <h3 className="text-base font-semibold text-slate-900">
              常见问题（简版）
            </h3>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium text-slate-900">
                  升级之后多久生效？
                </p>
                <p className="text-slate-600">
                  Stripe 支付成功后，套餐通常会立即生效。如果你没有看到额度变化，可以刷新页面或重新登录账号。
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  可以随时取消订阅吗？
                </p>
                <p className="text-slate-600">
                  可以。你可以在账号页面或 Stripe 收据中的“管理订阅”中取消。取消后，本周期结束前你仍然可以继续使用高级功能。
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
