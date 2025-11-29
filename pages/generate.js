// pages/generate.js
// 主生成页面：带提示词模板 + 自动写入生成历史记录
// 如果你的生成接口路径不是 `/api/generate`，请修改下面这个常量：
const GENERATE_API_PATH = '/api/generate';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePresetLang, setActivePresetLang] = useState('en');

  const presetGroups = [
    {
      id: 'en',
      label: '英文模板',
      items: [
        {
          label: 'Cozy home office for livestreams',
          value:
            'Cozy home office background with warm lighting, bookshelf, and soft shadows, suitable for livestreaming',
        },
        {
          label: 'Minimal white studio',
          value:
            'Minimalist white studio background with soft light, clean desk, modern shelves, perfect for professional livestreams',
        },
        {
          label: 'Warm coffee shop',
          value:
            'Warm coffee shop interior with wooden tables, soft lighting, blurred customers, cinematic depth',
        },
        {
          label: 'Futuristic tech studio',
          value:
            'Futuristic tech studio with holographic screens, blue ambient lighting, sleek panels, modern livestream look',
        },
        {
          label: 'Coaching / course studio',
          value:
            'Professional coaching studio background with bookshelves, soft key light, clean desk, academic atmosphere',
        },
        {
          label: 'Cozy living room',
          value:
            'Cozy living room with soft sofa, indoor plants, warm ambient lighting, natural home feeling',
        },
        {
          label: 'Modern conference room',
          value:
            'Modern conference room with glass walls, minimalist design, clean environment for business livestreams',
        },
        {
          label: 'AI / cyberpunk studio',
          value:
            'AI digital space with neon lights, futuristic patterns, floating particles, cyberpunk studio look',
        },
      ],
    },
    {
      id: 'zh',
      label: '中文模板（自动用英文生成）',
      items: [
        {
          label: '温馨家庭办公背景（适合直播）',
          value:
            'Cozy home office background with warm lighting, bookshelf, and soft shadows, suitable for livestreaming',
        },
        {
          label: '极简白色直播间',
          value:
            'Minimalist white studio background with soft light, clean desk, modern shelves, perfect for professional livestreams',
        },
        {
          label: '咖啡厅场景背景',
          value:
            'Warm coffee shop interior with wooden tables, soft lighting, blurred customers, cinematic depth',
        },
        {
          label: '高科技数字直播间',
          value:
            'Futuristic tech studio with holographic screens, blue ambient lighting, sleek panels, modern livestream look',
        },
        {
          label: '知识型导师 / 课程背景',
          value:
            'Professional coaching studio background with bookshelves, soft key light, clean desk, academic atmosphere',
        },
        {
          label: '温馨家庭客厅背景',
          value:
            'Cozy living room with soft sofa, indoor plants, warm ambient lighting, natural home feeling',
        },
        {
          label: '商务会议室背景',
          value:
            'Modern conference room with glass walls, minimalist design, clean environment for business livestreams',
        },
        {
          label: '虚拟 AI 科技世界背景',
          value:
            'AI digital space with neon lights, futuristic patterns, floating particles, cyberpunk studio look',
        },
      ],
    },
  ];

  const allPresetItems = presetGroups.flatMap((g) => g.items);

  function pickRandomPreset() {
    if (!allPresetItems.length) return;
    const idx = Math.floor(Math.random() * allPresetItems.length);
    const chosen = allPresetItems[idx];
    setPrompt(chosen.value);
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请先输入提示词，或者从上面的模板中点一个。');
      return;
    }

    setError('');
    setIsLoading(true);
    setImageUrl('');

    try {
      // 调用原有生成接口
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

      setImageUrl(data.imageUrl);

      // 记录到生成历史（失败不影响用户体验）
      try {
        await fetch('/api/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: data.imageUrl,
            thumbUrl: data.imageUrl,
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
            creditsCost: 1,
            meta: {
              source: 'generate-main',
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
          {/* 左侧：表单 + 模板 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-2 text-slate-900">
              生成虚拟背景
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              你可以直接输入提示词，或者点击下方模板快速选择一个合适的直播背景描述。
            </p>

            {/* 提示词模板切换 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-500">
                  常用提示词模板（点击自动填入）
                </p>
                <div className="flex items-center gap-2">
                  {presetGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setActivePresetLang(group.id)}
                      className={`px-2 py-1 rounded-lg text-[11px] border ${
                        activePresetLang === group.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      } transition`}
                    >
                      {group.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={pickRandomPreset}
                    className="px-2 py-1 rounded-lg text-[11px] border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
                  >
                    随机来一个
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetGroups
                  .find((g) => g.id === activePresetLang)
                  ?.items.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(item.value)}
                      className="text-left border border-slate-300 hover:border-blue-500 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      {item.label}
                    </button>
                  ))}
              </div>
            </div>

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
              每次生成成功后，我们会自动把结果记录到你的“AI 生成历史”页面，
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
                  还没有生成结果。可以先点上方的提示词模板，再点击“生成背景”，这里会显示最新生成的虚拟背景。
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
