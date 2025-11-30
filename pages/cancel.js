// pages/cancel.js

import Head from 'next/head';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <>
      <Head>
        <title>Payment Canceled | LiveBackdrop</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white border rounded-2xl p-8 shadow-lg">
          <h1 className="text-xl font-bold">支付已取消</h1>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link href="/pricing" className="text-center bg-blue-600 text-white py-2 rounded-xl">
              返回套餐
            </Link>
            <Link href="/generate" className="text-center border py-2 rounded-xl">
              使用免费版
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
