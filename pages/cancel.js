// pages/cancel.js

import Head from 'next/head';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <>
      <Head>
        <title>Payment Canceled | LiveBackdrop</title>
        <meta
          name="description"
          content="Your payment was canceled. You can try again anytime."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                支付已取消
              </h1>
              <p className="text-sm text-slate-500">
                你刚才取消了支付，如果只是想再考虑一下，随时可以重新升级。
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              返回套餐页面
            </Link>

            <Link
              href="/generate"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              继续使用免费版
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            如果你在支付过程中遇到错误或重复扣款的问题，请尽快联系站长处理。
          </p>
        </div>
      </div>
    </>
  );
}
