// pages/analytics.js
import Head from 'next/head';

/**
 * 前台 Analytics 页面
 * 使用和其他普通页面一致的配色：浅灰背景 + 白色卡片
 * 头部 / 脚部如果在 _app.js 里做了全局布局，这里不需要单独引入。
 */
export default function PublicAnalyticsPage() {
  return (
    <>
      <Head>
        <title>使用数据概览 - LiveBackdrop</title>
        <meta
          name="description"
          content="查看 LiveBackdrop 最近的虚拟背景生成趋势和基础使用数据。"
        />
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              使用数据概览（预览）
            </h1>
            <p className="text-sm text-slate-600">
              这是一个对外的简单数据展示页面，用于告诉潜在用户：这个站点是「活的」，有人在使用。
              当前为静态占位内容，后续可以接入真实统计数据。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">最近 24 小时生成背景</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                接入真实统计后，这里可以显示昨天到底生成了多少张虚拟背景。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">最近 7 天活跃用户</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                用于展示项目的「热度」，可以放在对外宣传里。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <p className="text-xs text-slate-500">累计生成背景总数</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
              <p className="text-[11px] text-slate-500">
                以后可以根据 Generation 表统计，变成一个漂亮的大数字。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              为什么要有这个页面？
            </h2>
            <p className="text-sm text-slate-700">
              对外公开一点点「产品健康度」的信息，会让新用户更有信心：说明这个工具有人在用，也在持续改进。
              同时，搜索引擎也喜欢这种有实际内容的页面，有利于 SEO。
            </p>
            <p className="text-sm text-slate-700">
              现在这个页面只是视觉风格统一的占位版本，等你把内部成本、收入、使用量都跑通之后，
              可以从 Admin 后台提取部分安全的数据在这里展示。
            </p>
          </div>

          <p className="text-[11px] text-slate-400">
            当前数据为占位符。实际统计数据以后可以从数据库或日志中聚合而来。
          </p>
        </div>
      </div>
    </>
  );
}
