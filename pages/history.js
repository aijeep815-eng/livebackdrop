import Head from 'next/head';
import { getSession } from 'next-auth/react';
import dbConnect from '../lib/dbConnect';
import Generation from '../models/Generation';

function formatDate(iso) {
  if (!iso) return '未知';
  try {
    const d = new Date(iso);
    return d.toLocaleString('zh-CN', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (e) {
    return iso;
  }
}

export default function HistoryPage({ items }) {
  return (
    <>
      <Head>
        <title>AI 生成历史 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI 生成历史
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              这里会显示你最近生成的虚拟背景，方便你再次下载或对比效果。
            </p>
          </div>

          {(!items || items.length === 0) && (
            <p className="text-sm text-slate-500">
              你还没有任何生成记录。先去首页生成几个虚拟背景，然后再回来看看这里吧。
            </p>
          )}

          {items && items.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow border border-slate-200 flex flex-col overflow-hidden"
                >
                  {/* 缩略图区域 */}
                  <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.prompt || '生成结果'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 px-3 text-center">
                        暂无缩略图（数据库中没有保存 imageUrl 字段）。
                      </span>
                    )}
                  </div>

                  {/* 文本信息区域 */}
                  <div className="flex-1 flex flex-col px-4 py-3 space-y-2">
                    <div className="text-xs text-slate-800 line-clamp-3">
                      {item.prompt || '（无提示词）'}
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p>时间：{formatDate(item.createdAt)}</p>
                      <p>来源：{item.source || 'unknown'}</p>
                    </div>
                    <div className="mt-auto pt-2">
                      {item.imageUrl && (
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          打开原图
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-4">
            提示：当前页面只显示最近 50 条生成记录。以后我们可以增加更多筛选条件（按日期、风格、套餐等），以及一键再次生成的功能。
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

  const docs = await Generation.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const items = docs.map((doc) => ({
    id: doc._id.toString(),
    imageUrl:
      doc.imageUrl ||
      doc.resultUrl ||
      doc.url ||
      '',
    prompt: doc.prompt || doc.input || '',
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    source: doc.operation || doc.source || 'unknown',
  }));

  return {
    props: {
      items,
    },
  };
}
