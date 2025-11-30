// pages/success.js

import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function SuccessPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'LiveBackdrop 用户';
  const currentPlan = session?.user?.plan || 'Creator Unlimited';

  return (
    <>
      <Head>
        <title>Upgrade Successful | LiveBackdrop</title>
        <meta
          name="description"
          content="Your LiveBackdrop plan has been upgraded successfully."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                升级成功！
              </h1>
              <p className="text-sm text-slate-500">
                感谢你的支持，你的 LiveBackdrop 套餐已经升级完成。
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <p>
              账号邮箱：{' '}
              <span className="font-semibold text-slate-900">
                {userEmail}
              </span>
            </p>
            <p>
              当前套餐：{' '}
              <span className="font-semibold text-slate-900">
                {currentPlan}
              </span>
            </p>
            <p className="text-slate-500 text-xs">
              如果页面显示的套餐名称暂时没有更新，你可以稍后刷新页面或重新登录账号。
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              去生成 AI 背景
            </Link>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              查看我的账号
            </Link>
          </div>

          <div className="mt-6 text-xs text-slate-500 space-y-2">
            <p>
              · 如果你需要开具账单或管理订阅（取消 / 修改支付方式），可以在账号页面中进入订阅管理，或通过
              Stripe 收据邮件中的链接进行操作。
            </p>
            <p>
              · 如发现额度没有正常生效，可以先刷新页面、重新登录。如果问题仍然存在，请联系站长处理。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
