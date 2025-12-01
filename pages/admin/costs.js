// pages/admin/costs.js
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import dbConnect from '../../lib/dbConnect';
import DailyUsage from '../../models/DailyUsage';
import AdminLayout from '../../components/admin/AdminLayout';

function formatDate(dateStr) {
  if (!dateStr) return '未知';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    return dateStr;
  }
}

function formatMoney(n) {
  if (!n || Number.isNaN(n)) return '$0.00';
  return `$${n.toFixed(4)}`;
}

export default function AdminCostsPage({
  summary,
  daily,
  isAdmin,
}) {
  return (
    <>
      <Head>
        <title>成本监控 - Admin - LiveBackdrop</title>
      </Head>
      <AdminLayout active="costs">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              成本监控（估算）
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              这里只是根据每次生成调用的大致单价进行估算，用来帮你感知 OpenAI 成本走势。
            </p>
            {!isAdmin && (
              <p className="text-xs text-rose-500 mt-1">
                提示：当前账号不是管理员，只能查看自己使用记录。
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
              <p className="text-xs text-slate-500">今天（所有用户）</p>
              <p className="text-xl font-bold text-slate-900">
                {formatMoney(summary.today.costUsd)}
              </p>
              <p className="text-xs text-slate-500">
                生成图片：{summary.today.images} 张
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
              <p className="text-xs text-slate-500">最近 7 天</p>
              <p className="text-xl font-bold text-slate-900">
                {formatMoney(summary.last7.costUsd)}
              </p>
              <p className="text-xs text-slate-500">
                生成图片：{summary.last7.images} 张
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
              <p className="text-xs text-slate-500">最近 30 天</p>
              <p className="text-xl font-bold text-slate-900">
                {formatMoney(summary.last30.costUsd)}
              </p>
              <p className="text-xs text-slate-500">
                生成图片：{summary.last30.images} 张
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify_between">
              <h2 className="text-base font-semibold text-slate-900">
                每日成本明细（最近 30 天）
              </h2>
              <p className="text-xs text-slate-500">
                这里只显示有调用记录的日期。
              </p>
            </div>

            {daily.length === 0 && (
              <p className="text-sm text-slate-500">
                暂时还没有任何生成记录。
              </p>
            )}

            {daily.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-2 px-2 text-slate-500 font-medium">
                        日期
                      </th>
                      <th className="text-left py-2 px-2 text-slate-500 font-medium">
                        生成图片数
                      </th>
                      <th className="text-left py-2 px-2 text-slate-500 font-medium">
                        估算成本 (USD)
                      </th>
                      <th className="text-left py-2 px-2 text-slate-500 font-medium">
                        平均单价
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily.map((row) => {
                      const avg =
                        row.imageGenerations > 0
                          ? row.costUsd / row.imageGenerations
                          : 0;
                      return (
                        <tr
                          key={row.date}
                          className="border-b border-slate-100 hover:bg-slate-50/60"
                        >
                          <td className="py-2 px-2 text-slate-800">
                            {formatDate(row.date)}
                          </td>
                          <td className="py-2 px-2 text-slate-800">
                            {row.imageGenerations}
                          </td>
                          <td className="py-2 px-2 text-slate-800">
                            {formatMoney(row.costUsd)}
                          </td>
                          <td className="py-2 px-2 text-slate-800">
                            {formatMoney(avg)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            说明：这里的成本是按固定单价粗略估算的（默认每张{' '}
            {process.env.COST_PER_IMAGE_USD || '0.011'} 美元），
            仅用于「心里有数」。真实账单以 OpenAI 控制台为准。
          </p>
        </div>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    !adminEmail ||
    (session.user.email &&
      session.user.email.toLowerCase() === adminEmail.toLowerCase());

  await dbConnect();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

  const last7Start = new Date(todayStart);
  last7Start.setUTCDate(last7Start.getUTCDate() - 6);

  const last30Start = new Date(todayStart);
  last30Start.setUTCDate(last30Start.getUTCDate() - 29);

  const matchCondition = isAdmin
    ? {}
    : { user: session.user.id };

  async function aggregateRange(from, to) {
    const cond = {
      ...matchCondition,
      date: { $gte: from, $lt: to },
    };

    const docs = await DailyUsage.find(cond).lean();
    let images = 0;
    let costUsd = 0;
    for (const d of docs) {
      images += d.imageGenerations || 0;
      costUsd += d.costUsd || 0;
    }
    return { images, costUsd };
  }

  const [today, last7, last30, dailyDocs] = await Promise.all([
    aggregateRange(todayStart, tomorrowStart),
    aggregateRange(last7Start, tomorrowStart),
    aggregateRange(last30Start, tomorrowStart),
    DailyUsage.find({
      ...matchCondition,
      date: { $gte: last30Start, $lt: tomorrowStart },
    })
      .sort({ date: -1 })
      .lean(),
  ]);

  const daily = dailyDocs.map((d) => ({
    date: d.date.toISOString(),
    imageGenerations: d.imageGenerations || 0,
    costUsd: d.costUsd || 0,
  }));

  return {
    props: {
      summary: {
        today,
        last7,
        last30,
      },
      daily,
      isAdmin,
    },
  };
}
