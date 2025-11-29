import { useState } from 'react';
import Head from 'next/head';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请先输入你想要的背景效果。');
      return;
    }
    setLoading(true);
    setError(null);
    setLimitInfo(null);
    setImageUrl(null);

    try {
      const res = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 限额类型错误
        if (data.code === 'GEN_LIMIT_REACHED') {
          setLimitInfo({
            type: 'generate',
            planKey: data.planKey || 'free',
            limit: data.limit,
            used: data.used,
          });
        }
        setError(
          data.error ||
            '生成失败，请稍后再试。'
        );
        return;
      }

      setImageUrl(data.imageUrl);
      if (Number.isFinite(data.limit)) {
        setLimitInfo({
          type: 'generate',
          planKey: data.planKey || 'free',
          limit: data.limit,
          used: data.used,
          remaining: data.remaining,
        });
      }
    } catch (err) {
      console.error(err);
      setError('网络请求失败，请检查网络或稍后再试。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>生成虚拟背景 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">
            生成 AI 虚拟背景
          </h1>
          <p className="text-slate-600">
            输入一句话描述，你每天可以免费生成 <span className="font-semibold">3</span> 张背景。
            想要不限量生成，可以随时在 <a href="/pricing" className="text-blue-600 underline">定价页</a> 升级套餐。
          </p>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium mb-1">提示</p>
              <p className="mb-2">{error}</p>
              {limitInfo?.type === 'generate' && (
                <div className="flex flex-wrap items-center gap-2">
                  {Number.isFinite(limitInfo.limit) && (
                    <span>
                      今日生成次数：{limitInfo.used}/{limitInfo.limit}
                    </span>
                  )}
                  <a
                    href="/pricing"
                    className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    升级套餐，解锁不限量生成
                  </a>
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={handleGenerate}
            className="bg-white rounded-2xl shadow p-6 space-y-4 border border-slate-100"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                提示词（你想要的背景）
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：蓝紫色渐变科技感直播背景，右侧留出人物位置，整体简洁干净。"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  风格（可选）
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="例如：cyberpunk, anime, minimal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  宽高比例
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                >
                  <option value="16:9">16:9（横屏推荐）</option>
                  <option value="1:1">1:1</option>
                  <option value="9:16">9:16（竖屏）</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? '生成中…' : '生成背景'}
            </button>
          </form>

          {imageUrl && (
            <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                生成结果
              </h2>
              <div className="w-full flex justify-center">
                <img
                  src={imageUrl}
                  alt="生成的背景"
                  className="rounded-xl max-h-[480px] w-auto"
                />
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
                <a href="/history" className="underline">
                  查看全部生成历史
                </a>
                <a href="/pricing" className="text-blue-600 underline">
                  升级到 CreatorUnlimited
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
