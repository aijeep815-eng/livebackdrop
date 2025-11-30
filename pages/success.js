// pages/success.js

import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function SuccessPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '用户';
  const currentPlan = session?.user?.plan || 'Creator Unlimited';

  return (
    <>
      <Head>
        <title>Upgrade Successful | LiveBackdrop</title>
      </Head>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white border rounded-2xl p-8 shadow-lg">
          <h1 className="text-xl font-bold">升级成功！</h1>

          <div className="mt-4 text-sm">
            <p>账号：<b>{userEmail}</b></p>
            <p>当前套餐：<b>{currentPlan}</b></p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link href="/generate" className="text-center bg-blue-600 text-white py-2 rounded-xl">
              去生成背景
            </Link>
            <Link href="/profile" className="text-center border py-2 rounded-xl">
              查看账号
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
