// pages/generate-with-history.js
// 新版生成页面（带自动写入生成历史记录 Generation 表）
// 如果你原来的生成接口路径不是 `/api/generate`，可以修改下面这个常量：
const GENERATE_API_PATH = '/api/generate';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function GenerateWithHistoryPage() {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请先输入提示词（你想要什么样的背景）');
      return;
    }

    setError('');
    setIsLoading(true);
    setImageUrl('');

    try {
      // 1）调用原有生成接口
      const res = await fetch(GENERATE_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: style || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '生成失败，请稍后再试。');
      }

      if (!data.imageUrl) {
        throw new Error('生成接口没有返回 imageUrl。');
      }

      // 显示生成结果
      setImageUrl(data.imageUrl);

      // 2）记录到 /api/generations（不影响用户体验，失败就算了）
      try {
        await fetch('/api/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: data.imageUrl,
            thumbUrl: data.imageUrl, // 暂时用原图作为缩略图
            prompt: prompt.trim(),
            style: style || undefined,
            planAtGeneration:
              data.plan ||
              data.planName ||
              data.subscriptionPlan ||
              (session?.user?.planName ||
                session?.user?.plan ||
                session?.user?.subscriptionPlan ||
                'unknown'),
            creditsCost: 1, // 以后可以根据尺寸/套餐动态计算
            meta: {
              source: 'generate-with-history',
            },
          }),
        });
      } catch (logErr) {
        console.error('log generation failed', logErr);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || '生成失败，请稍后再试。');
    } finally {
      setIsLoading(false);
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
            生成 AI 背景并保存历史记录需要登录账户。请先登录或注册，然后再访问本页面。
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

  return (
    <>
      <Head>
        <title>Generate – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[3fr,2fr]">
          {/* 左侧：生成表单 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-2 text-slate-900">
              生成虚拟背景（带历史记录）
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              输入你想要的直播背景描述，选择风格，我们会为你生成专属虚拟背景，并自动保存到生成历史中。
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  提示词（Prompt）
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：a cozy, modern home office background with warm lighting and a bookshelf behind, suitable for livestreaming"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  风格（可选）
                </label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="">不指定风格</option>
                  <option value="realistic">真实写实</option>
                  <option value="studio">摄影棚 / 直播间</option>
                  <option value="cartoon">卡通插画</option>
                  <option value="minimal">极简风</option>
                </select>
              </div>

              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isLoading ? '生成中...' : '生成背景'}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-4">
              提示：每次生成成功后，我们会自动把结果记录到你的“AI 生成历史”页面，
              方便你以后再次下载或对比不同版本。
            </p>
          </div>

          {/* 右侧：预览 */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              预览
            </h2>
            <div className="flex-1 border border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden bg-slate-50">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Generated background"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-xs text-slate-500 px-4 text-center">
                  还没有生成结果。输入提示词并点击“生成背景”，这里会显示最新生成的虚拟背景。
                </p>
              )}
            </div>
            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block w-full text-center text-xs font-medium rounded-xl bg-blue-600 text-white py-2 hover:bg-blue-700 transition"
              >
                打开原图 / 下载
              </a>
            )}
            <a
              href="/history"
              className="mt-3 inline-block w-full text-center text-xs font-medium rounded-xl border border-slate-300 text-slate-700 py-2 hover:bg-slate-50 transition"
            >
              查看 AI 生成历史
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
