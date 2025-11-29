import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ImageLabPage() {
  const router = useRouter();
  const { image } = router.query;

  const [extraPrompt, setExtraPrompt] = useState('');
  const [activeOp, setActiveOp] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  useEffect(() => {
    // 当切换图片时，重置结果和提示
    setResultImage(null);
    setError(null);
    setLimitInfo(null);
    setActiveOp(null);
  }, [image]);

  async function callLabApi(op) {
    if (!image) {
      setError('缺少要处理的图片，请从“我的素材”中选择一张。');
      return;
    }

    setActiveOp(op);
    setLoading(true);
    setError(null);
    setLimitInfo(null);
    setResultImage(null);

    try {
      const res = await fetch(`/api/lab/${op}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: image,
          extraPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'LAB_LIMIT_REACHED') {
          setLimitInfo({
            type: 'lab',
            limit: data.limit,
            used: data.used,
          });
        }
        setError(
          data.error || '处理失败，请稍后再试。'
        );
        return;
      }

      setResultImage(data.imageUrl);
      if (Number.isFinite(data.limit)) {
        setLimitInfo({
          type: 'lab',
          limit: data.limit,
          used: data.used,
          remaining: data.remaining,
        });
      }
    } catch (err) {
      console.error(err);
      setError('网络请求失败，请稍后再试。');
    } finally {
      setLoading(false);
      setActiveOp(null);
    }
  }

  return (
    <>
      <Head>
        <title>图像实验室 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                图像实验室
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                从“我的素材”中选择一张图片，在这里扩展、统一风格、美化或更换背景。
                免费用户每天可以使用 <span className="font-semibold">1</span> 次，升级套餐后不限次数。
              </p>
            </div>
            <a
              href="/uploads"
              className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              返回我的素材
            </a>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium mb-1">提示</p>
              <p className="mb-2">{error}</p>
              {limitInfo?.type === 'lab' && (
                <div className="flex flex-wrap items-center gap-2">
                  {Number.isFinite(limitInfo.limit) && (
                    <span>
                      今日图像实验室次数：{limitInfo.used}/
                      {limitInfo.limit}
                    </span>
                  )}
                  <a
                    href="/pricing"
                    className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    升级套餐，解锁不限量图像实验室
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-[minmax(0,1.1fr),minmax(0,1.2fr)] gap-6">
            {/* 左侧：原图 + 控件 */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-800 mb-3">
                  原始图片
                </h2>
                <div className="aspect-video bg-slate-200 flex items-center justify-center overflow-hidden rounded-xl">
                  {image ? (
                    <img
                      src={image}
                      alt="原始图片"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-500 text-sm">
                      暂未选择图片，请先到“我的素材”中点击“在图像实验室中打开”。
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100 space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  可选的补充说明（Extra Prompt）
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  placeholder="例如：偏暖色、适合游戏直播、科技感强一点、简洁干净…"
                />
                <p className="text-[11px] text-slate-500">
                  这里的内容会加在 AI 提示词后面，用来微调风格，但不会暴露你的原始图片。
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100 space-y-3">
                <h2 className="text-sm font-semibold text-slate-800 mb-1">
                  选择处理方式
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('outpaint')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm ${
                      activeOp === 'outpaint'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-slate-50'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      扩展成宽屏背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      将当前画面概念扩展为 16:9 宽屏直播背景。
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('style')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm ${
                      activeOp === 'style'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-slate-50'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      生成多张同风格背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      根据当前氛围生成类似风格的背景。
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('cleanup')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm ${
                      activeOp === 'cleanup'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-slate-50'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      美化 / 清理背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      将杂乱场景重构为干净、专业的背景。
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('replace')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm ${
                      activeOp === 'replace'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-slate-50'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      AI 换背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      保留人物位置感觉，生成新的背景环境。
                    </div>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  免费用户四个功能每天总共只能使用 1 次；升级后不限次数。
                </p>
              </div>
            </div>

            {/* 右侧：结果预览 */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100 flex flex-col">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                处理结果预览
              </h2>
              <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden">
                {loading ? (
                  <span className="text-sm text-slate-500">
                    {activeOp === 'outpaint' && '正在扩展宽屏背景…'}
                    {activeOp === 'style' && '正在生成同风格背景…'}
                    {activeOp === 'cleanup' && '正在美化 / 清理背景…'}
                    {activeOp === 'replace' && '正在更换背景…'}
                    {!activeOp && '处理中…'}
                  </span>
                ) : resultImage ? (
                  <img
                    src={resultImage}
                    alt="处理结果"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-slate-400">
                    还没有结果，先在左侧选择一种处理方式。
                  </span>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                <a href="/history" className="underline">
                  查看全部生成历史
                </a>
                <a href="/pricing" className="text-blue-600 underline">
                  升级到 CreatorUnlimited 解锁不限量图像实验室
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
