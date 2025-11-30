// pages/pricing.js

import { useState } from 'react';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';

const CHECKOUT_API = '/api/stripe/create-checkout-session';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAuthenticated = status === 'authenticated';
  const currentPlan = session?.user?.plan || 'FREE';
  const isCreator = currentPlan.toLowerCase().includes('creator');

  async function handleUpgradeClick() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'creator_unlimited' }),
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
      setError('无法启动升级流程，请稍后再试。');
      setLoading(false);
    }
  }

  function handleSignInClick() {
    signIn();
  }

  return (
    <>
      <Head>
        <title>Pricing | LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50">
        <header className="w-full border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Pricing & Plans</h1>
              <p className="text-sm text-slate-500 mt-1">自由体验 + 简单升级</p>
            </div>
            {isAuthenticated && (
              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-600">
                已登录：{session?.user?.email}
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10">
          {isAuthenticated && (
            <div className="mb-6 rounded-xl border bg-white px-4 py-3 text-sm">
              当前套餐：<b>{isCreator ? 'Creator Unlimited' : 'Free'}</b>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border rounded-2xl p-6 bg-white">
              <h2 className="text-lg font-semibold">Free</h2>
              <p className="mt-1 text-sm text-slate-500">适合体验用户。</p>
              <div className="mt-4 text-3xl font-bold">$0</div>
              <ul className="mt-4 text-sm space-y-2">
                <li>· 每日有限制的生成次数</li>
                <li>· 标准分辨率背景</li>
                <li>· 无需信用卡</li>
              </ul>
              <div className="mt-6">
                {isAuthenticated ? (
                  <button className="w-full border py-2 rounded-xl" disabled>
                    当前正在使用
                  </button>
                ) : (
                  <button onClick={handleSignInClick} className="w-full border py-2 rounded-xl">
                    登录后使用免费版
                  </button>
                )}
              </div>
            </div>

            <div className="border border-blue-500 rounded-2xl p-6 bg-white shadow-xl">
              <h2 className="text-lg font-semibold">Creator Unlimited</h2>
              <p className="mt-1 text-sm text-slate-500">适合专业创作者。</p>
              <div className="mt-4 text-3xl font-bold">$X.XX</div>
              <ul className="mt-4 text-sm space-y-2">
                <li>· 无限生成次数</li>
                <li>· 高分辨率输出</li>
                <li>· 适配直播、Zoom、录课</li>
              </ul>

              <div className="mt-6">
                {!isAuthenticated && (
                  <button onClick={handleSignInClick} className="w-full bg-blue-600 text-white py-2 rounded-xl">
                    登录后升级
                  </button>
                )}

                {isAuthenticated && isCreator && (
                  <button className="w-full bg-emerald-600 text-white py-2 rounded-xl" disabled>
                    已是 Creator 套餐
                  </button>
                )}

                {isAuthenticated && !isCreator && (
                  <button
                    onClick={handleUpgradeClick}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl"
                    disabled={loading}
                  >
                    {loading ? '正在跳转…' : '升级到 Creator Unlimited'}
                  </button>
                )}

                {error && <p className="text-red-600 text-xs mt-3">{error}</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
