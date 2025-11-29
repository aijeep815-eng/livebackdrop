import Head from 'next/head';
import { getSession, useSession } from 'next-auth/react';
import dbConnect from '../lib/dbConnect';
import Generation from '../models/Generation';
import Upload from '../models/Upload';

// 和后端保持一致的套餐识别逻辑
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

function getPlanInfo(planKey) {
  if (planKey === 'pro') {
    return {
      label: 'CreatorUnlimited',
      badge: '专业创作者套餐',
      description:
        '无限生成 AI 背景、无限素材上传、图像实验室不限次数，适合直播、视频创作者长期使用。',
      limits: '生成 / 上传 / 实验室均不再限制次数。',
      highlight: '你已经是付费用户，可以放心大量使用，不用担心今日次数用完。',
    };
  }

  return {
    label: 'Free',
    badge: '免费体验套餐',
    description:
      '适合体验和轻度使用，每天有一定免费额度，足够测试效果和偶尔使用。',
    limits:
      '每天最多 3 张 AI 背景、10 张素材上传、图像实验室 1 次。',
    highlight:
      '如果你发现每天额度不够用，可以在下方升级到 CreatorUnlimited，解锁不限量。',
  };
}

export default function ProfilePage({ statsFromServer, initialPlanKey }) {
  // 为了保持和全站一致，这里还是用 useSession 读取最新用户信息
  const { data: session } = useSession();
  const planKey = getPlanKey(session?.user || {}) || initialPlanKey || 'free';
  const planInfo = getPlanInfo(planKey);

  const stats = statsFromServer || {
    totalGenerations: 0,
    todayGenerations: 0,
    totalUploads: 0,
    todayUploads: 0,
  };

  return (
    <>
      <Head>
        <title>用户中心 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            用户中心
          </h1>
          <p className="text-slate-600 text-sm">
            在这里查看你的当前套餐、使用统计，以及升级路径。
          </p>

          {/* 套餐信息卡片 */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">
                  当前套餐
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {planInfo.label}
                </span>
                <span className="text-[11px] text-slate-400">
                  {planInfo.badge}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700">
                {planInfo.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                当前规则：{planInfo.limits}
              </p>
              <p className="mt-2 text-xs text-emerald-600">
                {planInfo.highlight}
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-2 min-w-[180px]">
              {planKey === 'free' ? (
                <>
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    升级到 CreatorUnlimited
                  </a>
                  <span className="text-[11px] text-slate-500 text-center">
                    升级后即可无限生成背景、无限上传素材、图像实验室不限次数。
                  </span>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    已是付费用户
                  </div>
                  <span className="text-[11px] text-slate-500 text-center">
                    如需调整套餐，请前往 Stripe 订阅中心或联系站长。
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 使用统计卡片 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                AI 背景使用情况
              </h2>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  今日已生成：
                  <span className="font-semibold text-slate-900">
                    {stats.todayGenerations}
                  </span>{' '}
                  张
                </p>
                <p>
                  累计生成总数：
                  <span className="font-semibold text-slate-900">
                    {stats.totalGenerations}
                  </span>{' '}
                  张
                </p>
              </div>
              <div className="mt-4 flex gap-2 text-xs text-slate-500">
                <a href="/generate" className="underline">
                  去生成新的背景
                </a>
                <span>·</span>
                <a href="/history" className="underline">
                  查看生成历史
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                素材上传 & 图像实验室
              </h2>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  今日已上传：
                  <span className="font-semibold text-slate-900">
                    {stats.todayUploads}
                  </span>{' '}
                  张
                </p>
                <p>
                  累计上传总数：
                  <span className="font-semibold text-slate-900">
                    {stats.totalUploads}
                  </span>{' '}
                  张
                </p>
              </div>
              <div className="mt-4 flex gap-2 text-xs text-slate-500">
                <a href="/uploads" className="underline">
                  管理我的素材
                </a>
                <span>·</span>
                <a href="/lab" className="underline">
                  打开图像实验室
                </a>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            使用统计基于服务器实时数据（Generation / Upload 表），如果你刚刚生成或上传，
            刷新页面即可看到最新数字。
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.id) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  await dbConnect();
  const userId = session.user.id;

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [totalGenerations, todayGenerations, totalUploads, todayUploads] =
    await Promise.all([
      Generation.countDocuments({ user: userId }),
      Generation.countDocuments({
        user: userId,
        createdAt: { $gte: startOfDay },
      }),
      Upload.countDocuments({ user: userId }),
      Upload.countDocuments({
        user: userId,
        createdAt: { $gte: startOfDay },
      }),
    ]);

  const initialPlanKey = getPlanKey(session.user);

  return {
    props: {
      statsFromServer: {
        totalGenerations: Number(totalGenerations) || 0,
        todayGenerations: Number(todayGenerations) || 0,
        totalUploads: Number(totalUploads) || 0,
        todayUploads: Number(todayUploads) || 0,
      },
      initialPlanKey,
    },
  };
}
