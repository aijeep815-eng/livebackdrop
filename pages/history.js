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

function extractImageUrl(doc) {
  if (!doc || typeof doc !== 'object') return '';

  if (doc.imageUrl) return doc.imageUrl;
  if (doc.resultUrl) return doc.resultUrl;
  if (doc.url) return doc.url;

  if (doc.image) return doc.image;
  if (doc.image_url) return doc.image_url;
  if (doc.fullUrl) return doc.fullUrl;
  if (doc.thumbnailUrl) return doc.thumbnailUrl;
  if (doc.previewUrl) return doc.previewUrl;

  if (doc.data) {
    if (doc.data.imageUrl) return doc.data.imageUrl;
    if (doc.data.url) return doc.data.url;
  }
  if (doc.result) {
    if (doc.result.imageUrl) return doc.result.imageUrl;
    if (doc.result.url) return doc.result.url;
  }

  if (Array.isArray(doc.images) && doc.images.length > 0) {
    if (typeof doc.images[0] === 'string') return doc.images[0];
    if (doc.images[0]?.url) return doc.images[0].url;
  }
  if (Array.isArray(doc.outputs) && doc.outputs.length > 0) {
    if (typeof doc.outputs[0] === 'string') return doc.outputs[0];
    if (doc.outputs[0]?.url) return doc.outputs[0].url;
  }

  return '';
}

export default function HistoryPage({ items }) {
  async function handleCopy(url) {
    try {
      if (!url) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert('图片链接已复制，可以粘贴给朋友或发到社交媒体。');
      } else {
        window.prompt('复制下面的链接：', url);
      }
    } catch (e) {
      console.error('Copy failed', e);
      window.prompt('复制下面的链接：', url);
    }
  }

  async function handleWebShare(item) {
    const url = item.imageUrl;
    if (!url) return;
    const text = item.prompt || 'LiveBackdrop 生成的虚拟背景';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LiveBackdrop 虚拟背景',
          text,
          url,
        });
      } catch (e) {
        console.error('Web share failed', e);
      }
    } else {
      handleCopy(url);
    }
  }

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
              这里会显示你最近生成的虚拟背景，方便你再次下载、分享或对比效果。
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
                  <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.prompt || '生成结果'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 px-3 text-center">
                        这条记录当时没有把图片地址写进数据库，只能显示文字信息。
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col px-4 py-3 space-y-2">
                    <div className="text-xs text-slate-800 line-clamp-3">
                      {item.prompt || '（无提示词）'}
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p>时间：{formatDate(item.createdAt)}</p>
                      <p>来源：{item.source || 'unknown'}</p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.imageUrl && (
                        <>
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
                          >
                            打开原图
                          </a>
                          <a
                            href={item.imageUrl}
                            download
                            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            下载图片
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.imageUrl)}
                            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                          >
                            复制链接
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWebShare(item)}
                            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                          >
                            分享给朋友
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-4">
            说明：老版本生成的记录，有些当时没有把图片地址字段写进 Generation 表，这部分只能显示文字。
            从现在开始，所有新生成的背景都会保存 imageUrl 字段并显示缩略图，你可以方便地下载和分享。
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

  const items = docs.map((doc) => {
    const imageUrl = extractImageUrl(doc);
    return {
      id: doc._id.toString(),
      imageUrl,
      prompt: doc.prompt || doc.input || '',
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
      source: doc.operation || doc.source || 'unknown',
    };
  });

  return {
    props: {
      items,
    },
  };
}
