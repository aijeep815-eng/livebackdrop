import Head from 'next/head';
import { useSession } from 'next-auth/react';

// 和后端保持同样的套餐识别逻辑
function getPlanKey(user = {}) {
  const raw =
    user.subscriptionPlan ||
    user.planName ||
    user.plan ||
    user.stripePlan ||
    '';
  const lower = raw.toString().toLowerCase();

  if (
    lower.includes('creator') ||
    lower.includes('pro') ||
    lower.includes('unlimited')
  ) {
    return 'pro';
  }

  return 'free';
}

export default function PricingPage() {
  const { data: session } = useSession();
  const planKey = getPlanKey(session?.user || {});
  const isLoggedIn = !!session;
  const isPro = planKey === 'pro';

  // CTA 链接策略：
  // - 未登录：跳登录页
  // - 已登录：跳生成页，让用户在右上角看到当前套餐/升级入口
  const freePrimaryHref = isLoggedIn ? '/generate' : '/auth/signin';
  const proPrimaryHref = isLoggedIn ? '/generate' : '/auth/signin?callbackUrl=/pricing';

  const freePrimaryText = !isLoggedIn
    ? '免费注册并开始使用'
    : '继续免费使用';

  let proPrimaryText = '升级到 CreatorUnlimited';
  let proSecondaryText = '登录后可在右上角帐号菜单中完成升级。';

  if (!isLoggedIn) {
    proPrimaryText = '登录后升级到 CreatorUnlimited';
    proSecondaryText = '我们会在你登录后为你保留当前套餐选择。';
  } else if (isPro) {
    proPrimaryText = '你已是 CreatorUnlimited 用户';
    proSecondaryText = '可以放心大量生成与上传，不用再担心每日限额。';
  }

  return (
    <>
      <Head>
        <title>定价与套餐 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* 标题区 */}
          <div className="text-center space-y-3">
            <p className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
              为直播、网课与内容创作者而生
            </p>
            <h1 className="text-4xl font-bold text-slate-900">
              每天次数不够用？升级一下就够了。
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              免费套餐适合体验和偶尔使用；当你发现每天 3 张背景、1 次实验室已经不够，
              就是升级到 <span className="font-semibold text-slate-900">CreatorUnlimited</span> 的时候。
            </p>
            {isLoggedIn && (
              <p className="text-xs text-slate-500">
                当前登录帐号套餐：{' '}
                <span className="font-semibold text-slate-900">
                  {isPro ? 'CreatorUnlimited（付费）' : 'Free（免费）'}
                </span>
              </p>
            )}
          </div>

          {/* 套餐卡片 */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Free */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">Free</h2>
                <p className="text-xs text-slate-500 mt-1">
                  适合刚开始尝试 AI 虚拟背景的个人用户。
                </p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900">$0</span>
                <span className="text-sm text-slate-500"> / 月</span>
              </div>

              <ul className="space-y-2 text-sm text-slate-700 flex-1">
                <li>· 每天最多 <span className="font-semibold">3 张</span> AI 背景</li>
                <li>· 每天最多 <span className="font-semibold">10 张</span> 素材上传</li>
                <li>· 图像实验室每天 <span className="font-semibold">1 次</span></li>
                <li>· 标准生成速度</li>
                <li>· 适合体验、轻度使用、偶尔开播</li>
              </ul>

              <div className="mt-6 space-y-2">
                <a
                  href={freePrimaryHref}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {freePrimaryText}
                </a>
                <p className="text-[11px] text-slate-500 text-center">
                  无需信用卡，随时可以升级到付费套餐。
                </p>
              </div>
            </div>

            {/* CreatorUnlimited / Pro */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-2xl shadow-lg border border-blue-500/60 p-6 text-white flex flex-col">
              {/* 推荐角标 */}
              <div className="absolute -top-3 right-4">
                <span className="inline-flex items-center rounded-full bg-amber-300 px-3 py-1 text-[11px] font-semibold text-amber-900 shadow">
                  ⭐ 推荐 · CreatorUnlimited
                </span>
              </div>

              <div className="mb-4 pt-1">
                <h2 className="text-xl font-bold">CreatorUnlimited</h2>
                <p className="text-xs text-blue-100 mt-1">
                  专为直播、短视频创作者、网课老师设计，直接当作生产工具使用。
                </p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold">$12</span>
                <span className="text-sm text-blue-100"> / 月</span>
                <p className="text-[11px] text-blue-100 mt-1">
                  价格只是示例，你可以在 Stripe 后台随时调整。
                </p>
              </div>

              <ul className="space-y-2 text-sm text-blue-50 flex-1">
                <li>· <span className="font-semibold">无限生成</span> AI 虚拟背景</li>
                <li>· <span className="font-semibold">无限上传</span> 素材并保存历史</li>
                <li>· 图像实验室 <span className="font-semibold">不限次数</span></li>
                <li>· 优先生成速度，更快出图体验</li>
                <li>· 适合长期直播、录课、剪辑内容的高频创作者</li>
                <li>· 可以当作你的“专属背景工厂”一直用</li>
              </ul>

              <div className="mt-6 space-y-2">
                <a
                  href={proPrimaryHref}
                  className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-md ${
                    isPro
                      ? 'bg-emerald-400 text-emerald-900 hover:bg-emerald-300'
                      : 'bg-white text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {proPrimaryText}
                </a>
                <p className="text-[11px] text-blue-100 text-center">
                  {proSecondaryText}
                </p>
              </div>
            </div>
          </div>

          {/* 对比表 */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">
              套餐对比一眼看懂
            </h2>
            <div className="overflow-x-auto text-xs md:text-sm">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead>
                  <tr>
                    <th className="text-left text-slate-500 font-medium py-2 pr-4"></th>
                    <th className="text-left text-slate-700 font-semibold py-2 px-3">
                      Free
                    </th>
                    <th className="text-left text-slate-700 font-semibold py-2 px-3">
                      CreatorUnlimited
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-slate-50/80">
                    <td className="py-2 pr-4 text-slate-600">每天 AI 背景生成</td>
                    <td className="py-2 px-3 text-slate-800">3 张</td>
                    <td className="py-2 px-3 text-blue-700 font-semibold">
                      不限张数
                    </td>
                  </tr>
                  <tr className="bg-slate-50/40">
                    <td className="py-2 pr-4 text-slate-600">每天素材上传</td>
                    <td className="py-2 px-3 text-slate-800">10 张</td>
                    <td className="py-2 px-3 text-blue-700 font-semibold">
                      不限张数
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80">
                    <td className="py-2 pr-4 text-slate-600">图像实验室</td>
                    <td className="py-2 px-3 text-slate-800">每天 1 次</td>
                    <td className="py-2 px-3 text-blue-700 font-semibold">
                      不限次数
                    </td>
                  </tr>
                  <tr className="bg-slate-50/40">
                    <td className="py-2 pr-4 text-slate-600">生成速度</td>
                    <td className="py-2 px-3 text-slate-800">标准</td>
                    <td className="py-2 px-3 text-blue-700 font-semibold">
                      优先 / 更快
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80">
                    <td className="py-2 pr-4 text-slate-600">适合人群</td>
                    <td className="py-2 px-3 text-slate-800">
                      体验、偶尔使用、临时开会
                    </td>
                    <td className="py-2 px-3 text-blue-700 font-semibold">
                      稳定直播、录课、短视频创作者
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400">
              上述限制来自你的后端逻辑（3 张生成 / 10 张上传 / 实验室 1 次），
              前端这里只是清晰地展示出来，方便用户理解为什么要升级。
            </p>
          </div>

          {/* 底部 CTA */}
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>
              你可以先从 Free 开始用，等每天次数常常不够用，再升级到 CreatorUnlimited 也不迟。
            </p>
            <p>
              所有订阅都可以在 Stripe 里随时取消或调整价格，不会强制绑定。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
