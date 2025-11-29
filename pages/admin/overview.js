import Head from 'next/head';
import { getSession, useSession } from 'next-auth/react';
import dbConnect from '../../lib/dbConnect';
import Generation from '../../models/Generation';
import Upload from '../../models/Upload';
import mongoose from 'mongoose';

export default function AdminOverviewPage({ stats }) {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <>
      <Head>
        <title>Admin · 数据库总览 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 标题区 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                管理后台 · 数据库状态总览
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                这里汇总了当前 LiveBackdrop 的核心数据：用户、生成记录、上传记录等，方便你快速判断系统是否健康、使用量如何。
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                所有数据均来自 MongoDB（Generation / Upload / users 集合），刷新页面即可获取最新统计。
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1 text-xs text-slate-500">
              <span>
                登录状态：{' '}
                <span className="font-semibold text-slate-900">
                  {isLoggedIn ? '已登录' : '未登录'}
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/admin"
                  className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  返回 Admin 首页
                </a>
                <a
                  href="/admin/subscriptions"
                  className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  订阅管理
                </a>
              </div>
            </div>
          </div>

          {/* 核心统计卡片 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-xs font-semibold text-slate-500 mb-2">
                用户数（users 集合）
              </h2>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalUsers === null ? '—' : stats.totalUsers}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                统计来自数据库直接 count 集合 <code>users</code>。
                如为 <code>—</code> 则说明当前无法访问该集合或尚未创建。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-xs font-semibold text-slate-500 mb-2">
                累计生成记录（Generation）
              </h2>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalGenerations}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                包括普通生成与图像实验室生成，全部存储在 <code>Generation</code> 表。
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-xs font-semibold text-slate-500 mb-2">
                累计上传记录（Upload）
              </h2>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalUploads}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                统计所有用户通过 Cloudinary 上传并写入 <code>Upload</code> 表的记录。
              </p>
            </div>
          </div>

          {/* 今日使用情况 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                今日 AI 背景生成（Generation）
              </h2>
              <p className="text-2xl font-bold text-slate-900">
                {stats.todayGenerations}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                从今天 00:00 统计到现在的 <code>Generation</code> 条数。
                包含普通生成和图像实验室生成。
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                <p>
                  今日普通生成（operation 为空）：{stats.todayPlainGenerations}
                </p>
                <p>
                  今日实验室（operation 有值）：{stats.todayLabGenerations}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                今日素材上传（Upload）
              </h2>
              <p className="text-2xl font-bold text-slate-900">
                {stats.todayUploads}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                从今天 00:00 统计到现在的 <code>Upload</code> 条数。
              </p>
            </div>
          </div>

          {/* 最近记录时间 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                最近一次生成记录
              </h2>
              {stats.lastGenerationAt ? (
                <>
                  <p className="text-sm text-slate-800">
                    {stats.lastGenerationAt}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    如果时间很久远，说明最近没有用户生成背景，需要检查前端调用或限额设置是否过于严格。
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  暂无任何生成记录。
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                最近一次上传记录
              </h2>
              {stats.lastUploadAt ? (
                <>
                  <p className="text-sm text-slate-800">
                    {stats.lastUploadAt}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    如果长时间没有上传记录，可以检查 Cloudinary 配置、前端上传组件是否正常。
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  暂无任何上传记录。
                </p>
              )}
            </div>
          </div>

          {/* 底部说明 */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 p-4 text-[11px] text-slate-500 space-y-1">
            <p>
              本页数据全部由 <code>getServerSideProps</code> 在服务器端直接查询 MongoDB 获得，
              不额外暴露新的 Admin API，避免多余的接口被滥用。
            </p>
            <p>
              如果你以后需要更细的分析（按用户、按套餐、按国家等），可以在此页面基础上继续扩展，
              或者单独写脚本对 MongoDB 做离线统计。
            </p>
          </div>
        </div>
      </div>
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

  await dbConnect();

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // 生成与上传统计
  const [
    totalGenerations,
    todayGenerations,
    totalUploads,
    todayUploads,
    todayPlainGenerations,
    todayLabGenerations,
    lastGenerationDoc,
    lastUploadDoc,
  ] = await Promise.all([
    Generation.countDocuments({}),
    Generation.countDocuments({ createdAt: { $gte: startOfDay } }),
    Upload.countDocuments({}),
    Upload.countDocuments({ createdAt: { $gte: startOfDay } }),
    Generation.countDocuments({
      createdAt: { $gte: startOfDay },
      $or: [{ operation: { $exists: false } }, { operation: null }],
    }),
    Generation.countDocuments({
      createdAt: { $gte: startOfDay },
      operation: { $in: ['outpaint', 'style', 'cleanup', 'replace'] },
    }),
    Generation.findOne({}).sort({ createdAt: -1 }).lean(),
    Upload.findOne({}).sort({ createdAt: -1 }).lean(),
  ]);

  // 用户总数（直接访问 users 集合）
  let totalUsers = null;
  try {
    const col = mongoose.connection.db.collection('users');
    totalUsers = await col.countDocuments({});
  } catch (err) {
    console.error('Failed to count users collection:', err);
    totalUsers = null;
  }

  function formatDate(doc) {
    if (!doc || !doc.createdAt) return null;
    try {
      const d = new Date(doc.createdAt);
      return d.toLocaleString('zh-CN', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return String(doc.createdAt);
    }
  }

  return {
    props: {
      stats: {
        totalUsers: totalUsers === null ? null : Number(totalUsers) || 0,
        totalGenerations: Number(totalGenerations) || 0,
        todayGenerations: Number(todayGenerations) || 0,
        totalUploads: Number(totalUploads) || 0,
        todayUploads: Number(todayUploads) || 0,
        todayPlainGenerations: Number(todayPlainGenerations) || 0,
        todayLabGenerations: Number(todayLabGenerations) || 0,
        lastGenerationAt: formatDate(lastGenerationDoc),
        lastUploadAt: formatDate(lastUploadDoc),
      },
    },
  };
}
