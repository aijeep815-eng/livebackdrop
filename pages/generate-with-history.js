// pages/generate-with-history.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

const GENERATE_API_PATH = '/api/generate';

export default function GenerateWithHistoryPage() {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const presetPrompts = [
    "Cozy home office background with warm lighting, bookshelf, and soft shadows, suitable for livestreaming",
    "Minimalist white studio background with soft light, clean desk, modern shelves, perfect for professional livestreams",
    "Warm coffee shop interior with wooden tables, soft lighting, blurred customers, cinematic depth",
    "Futuristic tech studio with holographic screens, blue ambient lighting, sleek panels, modern livestream look",
    "Professional coaching studio background with bookshelves, soft key light, clean desk, academic atmosphere",
    "Cozy living room with soft sofa, indoor plants, warm ambient lighting, natural home feeling",
    "Modern conference room with glass walls, minimalist design, clean environment for business livestreams",
    "AI digital space with neon lights, futuristic patterns, floating particles, cyberpunk studio look"
  ];

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请先输入提示词');
      return;
    }

    setError('');
    setIsLoading(true);
    setImageUrl('');

    try {
      const res = await fetch(GENERATE_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), style: style || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');

      setImageUrl(data.imageUrl);

      try {
        await fetch('/api/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: data.imageUrl,
            thumbUrl: data.imageUrl,
            prompt: prompt.trim(),
            style: style || undefined,
            creditsCost: 1,
          }),
        });
      } catch (err) {
        console.error('log generation failed', err);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p>加载中...</p></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow rounded-2xl px-8 py-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">请先登录</h1>
          <a href="/auth/signin" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white">去登录</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Generate – LiveBackdrop</title></Head>

      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[3fr,2fr]">

          <div className="bg-white rounded-2xl shadow p-6">

            <h1 className="text-2xl font-bold mb-4">生成虚拟背景（带提示词模板）</h1>

            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 mb-2">常用提示词（点击自动填入）</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="text-left border border-slate-300 hover:border-blue-500 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">提示词</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 h-28"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">风格</label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
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

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button className="px-5 py-2 bg-blue-600 text-white rounded-xl" disabled={isLoading}>
                {isLoading ? '生成中...' : '生成背景'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <h2 className="text-sm font-semibold mb-3">预览</h2>
            <div className="border border-dashed border-slate-300 rounded-xl flex-1 flex items-center justify-center bg-slate-50">
              {imageUrl ? (
                <img src={imageUrl} className="max-w-full max-h-full" />
              ) : (
                <p className="text-xs text-slate-500">还没有生成结果</p>
              )}
            </div>

            {imageUrl && (
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-center bg-blue-600 text-white py-2 rounded-xl">
                下载原图
              </a>
            )}

            <a href="/history" className="mt-3 text-center border py-2 rounded-xl">查看 AI 生成历史</a>
          </div>
        </div>
      </div>
    </>
  );
}
