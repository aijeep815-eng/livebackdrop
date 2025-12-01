import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const { data: session, status } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const userName =
    session?.user?.name ||
    (session?.user?.email ? session.user.email.split('@')[0] : '创作者');

  useEffect(() => {
    async function doRefresh() {
      try {
        setRefreshing(true);
        const res = await fetch('/api/auth/refresh');
        if (res.ok) {
          await fetch('/api/auth/session');
          setRefreshed(true);
        }
      } catch (e) {
        console.error('Failed to refresh session on success page:', e);
      } finally {
        setRefreshing(false);
      }
    }

    if (status === 'authenticated' && !refreshed) {
      doRefresh();
    }
  }, [status, refreshed]);

  return (
    <>
      <Head>
        <title>升级成功 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 flex items-start gap-3">
            <div className="mt-0.5 text-emerald-500">✔</div>
            <div className="text-sm text-emerald-800 space-y-1">
              <p className="font-semibold">
                你已成功升级为 CreatorUnlimited！
              </p>
              <p className="text-xs text-emerald-700">
                从现在起，你可以无限生成 AI 虚拟背景、无限上传素材，并且图像实验室不限次数。
              </p>
              {refreshing && (
                <p className="text-[11px] text-emerald-600">
                  正在刷新你的账号信息，请稍等 1 秒…
                </p>
              )}
              {refreshed && (
                <p className="text-[11px] text-emerald-600">
                  已获取最新套餐信息，你右上角的账号状态应该已经更新为 CreatorUnlimited。
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-2xl">
                <span role="img" aria-label="party">
                  🎉
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  升级成功，{userName}！
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  你的账号已经解锁全部高级功能，现在可以把 LiveBackdrop 当成你的「专属背景工厂」来用。
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1">
                <p className="font-semibold text-slate-900">
                  你现在可以：
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>· 无限生成高质量 AI 虚拟背景</li>
                  <li>· 无限上传你的素材并长期保存</li>
                  <li>· 图像实验室不限次数，随便玩</li>
                  <li>· 无需再担心「今日次数已用完」</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1">
                <p className="font-semibold text-slate-900">
                  接下来建议你：
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>1. 先生成一批适合你直播/录课的主背景</li>
                  <li>2. 把你现有的房间照片上传到「我的素材」</li>
                  <li>3. 用图像实验室美化/扩展/换背景</li>
                  <li>4. 把满意的背景保存到直播/会议软件里使用</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                从哪一步开始？下面三个入口都是为你准备的：
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/generate"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                  立即生成新的 AI 背景
                </a>
                <a
                  href="/lab"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  打开图像实验室玩一玩
                </a>
                <a
                  href="/profile"
                  className="inline-flex flex-1 items-center justify中心 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  查看我的套餐和使用统计
                </a>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1">
            <p>
              你的订阅会按月自动续费，你可以在「用户中心 / Profile」中随时查看当前套餐，并在 Stripe 订阅中心取消或调整价格。
            </p>
            <p>
              所有生成的背景都会自动保存到「生成历史 / History」页面，你可以随时重新下载。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
