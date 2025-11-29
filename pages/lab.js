// pages/lab.js
// 图像实验室：对已上传的图片进行 AI 处理（扩图 / 风格一致 / 美化 / 换背景）

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';

function useImageParam() {
  const router = useRouter();
  const { image } = router.query || {};
  if (!image) return '';
  if (Array.isArray(image)) return image[0];
  try {
    return decodeURIComponent(image);
  } catch {
    return image;
  }
}

export default function ImageLabPage() {
  const { data: session, status } = useSession();
  const imageUrl = useImageParam();

  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [extraPrompt, setExtraPrompt] = useState('');
  const [lastOp, setLastOp] = useState('');

  async function callLabApi(action) {
    if (!imageUrl) {
      setError('缺少要处理的图片，请从“我的素材”页面点击进入图像实验室。');
      return;
    }

    setError('');
    setIsLoading(action);
    setResultUrl('');
    setLastOp(action);

    try {
      const res = await fetch(`/api/lab/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          extraPrompt: extraPrompt.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || '处理失败，请稍后再试。');
      }

      if (!data.imageUrl) {
        throw new Error('接口没有返回处理后的图片地址。');
      }

      setResultUrl(data.imageUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || '处理失败，请稍后再试。');
    } finally {
      setIsLoading('');
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
            使用图像实验室需要登录账户。请先登录或注册，然后再访问本页面。
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
        <title>图像实验室 – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[3fr,3fr]">
          {/* 左侧：原图 + 操作 */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-2 text-slate-900">
              图像实验室
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              从“我的素材”中选择一张图片进入本页面，然后在右侧选择要应用的 AI 功能。
              这是你上传素材的进阶玩法：扩展、风格统一、美化或换背景。
            </p>

            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 mb-1">
                原始图片
              </p>
              <div className="border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center min-h-[220px] overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Source"
                    className="max-h-[360px] max-w-full object-contain"
                  />
                ) : (
                  <p className="text-xs text-slate-500 px-4 text-center">
                    当前没有指定图片。
                    请先到“我的素材 / 上传图片”页面，点击某一张图片的“在图像实验室中打开”按钮进入这里。
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                可选的补充说明（Extra Prompt）
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：背景偏暖色、适合游戏直播、突出科技感、保持干净简洁等。"
                value={extraPrompt}
                onChange={(e) => setExtraPrompt(e.target.value)}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                这些说明不会把原图传给模型（目前版本仅通过文字控制），
                但会影响生成的风格和细节。以后升级到支持真正的图像扩展和参考风格时，我们会在这里直接用到你的原图。
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-600 mb-2">{error}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              <button
                type="button"
                onClick={() => callLabApi('outpaint')}
                disabled={!imageUrl || isLoading === 'outpaint'}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <span className="block text-[11px] text-slate-500 mb-0.5">
                  功能一
                </span>
                {isLoading === 'outpaint'
                  ? '扩展背景中...'
                  : '扩展成宽屏 16:9 背景'}
              </button>

              <button
                type="button"
                onClick={() => callLabApi('style')}
                disabled={!imageUrl || isLoading === 'style'}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <span className="block text-[11px] text-slate-500 mb-0.5">
                  功能二
                </span>
                {isLoading === 'style'
                  ? '生成同风格背景中...'
                  : '生成多张同风格背景（随机变体）'}
              </button>

              <button
                type="button"
                onClick={() => callLabApi('cleanup')}
                disabled={!imageUrl || isLoading === 'cleanup'}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <span className="block text-[11px] text-slate-500 mb-0.5">
                  功能三
                </span>
                {isLoading === 'cleanup'
                  ? '美化背景中...'
                  : '美化 / 清理背景（更干净、更专业）'}
              </button>

              <button
                type="button"
                onClick={() => callLabApi('replace')}
                disabled={!imageUrl || isLoading === 'replace'}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <span className="block text-[11px] text-slate-500 mb-0.5">
                  功能四
                </span>
                {isLoading === 'replace'
                  ? '更换背景中...'
                  : 'AI 换背景（保持主体气质，替换环境）'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              当前版本的图像实验室使用的是文字控制方式（Prompt-based），
              主要用于探索你的上传素材可以被生成哪些不同风格的背景。
              随着后期升级，我们会逐步加入真正的图像扩展、参考风格和背景替换能力。
            </p>
          </div>

          {/* 右侧：结果预览 */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              处理结果预览
            </h2>
            <div className="flex-1 border border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden bg-slate-50">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Result"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-xs text-slate-500 px-4 text-center">
                  还没有生成结果。请选择左侧的一项功能（例如“扩展成宽屏 16:9 背景”），
                  等待 AI 处理完成后，这里会展示最新结果。
                </p>
              )}
            </div>
            {resultUrl && (
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block w-full text-center text-xs font-medium rounded-xl bg-blue-600 text-white py-2 hover:bg-blue-700 transition"
              >
                打开原图 / 下载处理结果
              </a>
            )}

            <a
              href="/history"
              className="mt-3 inline-block w-full text-center text-xs font-medium rounded-xl border border-slate-300 text-slate-700 py-2 hover:bg-slate-50 transition"
            >
              查看所有 AI 生成历史
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
