// pages/history.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGenerations();
    }
  }, [status]);

  async function fetchGenerations() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generations');
      if (!res.ok) {
        throw new Error('Failed to load generations');
      }
      const data = await res.json();
      setGenerations(Array.isArray(data.generations) ? data.generations : []);
    } catch (err) {
      console.error('Fetch generations error:', err);
      setError('加载生成记录失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 text-sm">加载中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow rounded-2xl px-8 py-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">请先登录</h1>
          <p className="text-slate-600 mb-4">
            生成历史需要账户登录。请先登录或注册，然后再访问本页面。
          </p>
          <a
            href="/auth/signin"
            className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            去登录
          </a>
        </div>
      </div>
    );
  }

  const hasData = generations && generations.length > 0;

  return (
    <>
      <Head>
        <title>History – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            AI 生成历史
          </h1>
          <p className="text-slate-600 mb-6">
            这里会显示你最近生成的虚拟背景，方便你再次下载或对比效果。
          </p>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            {loading && (
              <p className="text-sm text-slate-600">正在加载生成记录...</p>
            )}
            {error && (
              <p className="text-sm text-red-600 mb-2">
                {error}
              </p>
            )}
            {!loading && !hasData && !error && (
              <p className="text-sm text-slate-500">
                你还没有任何生成记录。去首页生成几个虚拟背景，稍后再回来看看这里吧。
              </p>
            )}
            {!loading && hasData && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {generations
                  .filter((item) => !!item && !!item.imageUrl)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col"
                    >
                      <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.thumbUrl || item.imageUrl}
                          alt={item.prompt || 'generated background'}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <p className="text-xs text-slate-500 line-clamp-3 mb-2">
                          {item.prompt || '未保存提示词'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-auto">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ''}
                        </p>
                        {item.planAtGeneration && (
                          <p className="text-[11px] text-slate-400">
                            套餐：{item.planAtGeneration}
                          </p>
                        )}
                      </div>
                      <div className="px-3 pb-3">
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full text-center text-xs font-medium rounded-lg bg-blue-600 text-white py-1.5 hover:bg-blue-700 transition"
                        >
                          打开原图
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            提示：当前页面只显示最近 50 条生成记录。以后我们可以增加更多筛选条件
            （按日期、风格、套餐等）以及一键再次生成的功能。
          </p>
        </div>
      </div>
    </>
  );
}
