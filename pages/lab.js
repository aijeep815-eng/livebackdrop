import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const SUGGESTED_PROMPTS = [
  '适合在家办公的视频会议背景，简单干净，颜色柔和',
  '游戏直播用的霓虹科技感背景，偏蓝紫色，灯光有层次',
  '在线授课用的书房背景，有书架但不杂乱，光线柔和',
  '播客/访谈风格背景，暗灰+暖光，氛围感强一点',
];

export default function ImageLabPage() {
  const router = useRouter();
  const { image } = router.query;

  const [extraPrompt, setExtraPrompt] = useState('');
  const [activeOp, setActiveOp] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);
  const [hasUsedToday, setHasUsedToday] = useState(false);

  useEffect(() => {
    // 当切换图片时，重置结果和错误状态
    setResultImage(null);
    setError(null);
    setLimitInfo(null);
    setActiveOp(null);
  }, [image]);

  async function callLabApi(op) {
    if (!image) {
      setError('缺少要处理的图片，请先在“我的素材”中选择一张。');
      return;
    }

    // 如果后端已明确提示今天用完了，就直接在前端拦截
    if (limitInfo && limitInfo.type === 'lab' && Number.isFinite(limitInfo.limit) && limitInfo.used >= limitInfo.limit) {
      setError('你今天的图像实验室次数已经用完了，可以明天再来，或者升级套餐解锁不限量。');
      return;
    }

    setActiveOp(op);
    setLoading(true);
    setError(null);
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
          const info = {
            type: 'lab',
            limit: data.limit,
            used: data.used,
          };
          setLimitInfo(info);
          setHasUsedToday(true);
        }
        setError(
          data.error || '处理失败，请稍后再试。'
        );
        return;
      }

      setResultImage(data.imageUrl);

      if (Number.isFinite(data.limit)) {
        const info = {
          type: 'lab',
          limit: data.limit,
          used: data.used,
          remaining: data.remaining,
        };
        setLimitInfo(info);
        if (info.used >= info.limit) {
          setHasUsedToday(true);
        }
      }
    } catch (err) {
      console.error(err);
      setError('网络请求失败，请稍后再试。');
    } finally {
      setLoading(false);
      setActiveOp(null);
    }
  }

  const hasLimit =
    limitInfo && limitInfo.type === 'lab' && Number.isFinite(limitInfo.limit);
  const remaining =
    hasLimit && typeof limitInfo.remaining === 'number'
      ? limitInfo.remaining
      : null;

  return (
    <>
      <Head>
        <title>图像实验室 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 顶部标题区 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                图像实验室
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                基于你上传的图片，让 AI 帮你扩展、换风格、美化或更换背景，生成真正实用的虚拟背景。
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                免费用户每天可以使用 <span className="font-semibold">1</span> 次图像实验室；
                升级到 CreatorUnlimited 后不限次数。
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 md:items-end">
              <a
                href="/uploads"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                返回我的素材
              </a>
              {hasLimit && (
                <span className="text-[11px] text-slate-500">
                  今日使用：{limitInfo.used}/{limitInfo.limit}{' '}
                  {remaining !== null && remaining <= 0
                    ? '（今日次数已用完）'
                    : remaining !== null
                    ? `（还剩 ${remaining} 次）`
                    : null}
                </span>
              )}
            </div>
          </div>

          {/* 错误 & 限额提示 */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium mb-1">提示</p>
              <p className="mb-2">{error}</p>
              {limitInfo?.type === 'lab' && (
                <div className="flex flex-wrap items-center gap-2">
                  {hasLimit && (
                    <span>
                      今日图像实验室次数：{limitInfo.used}/{limitInfo.limit}
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

          {/* 主体双栏布局 */}
          <div className="grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,1.1fr)] gap-6">
            {/* 左侧：原图 + 控件 */}
            <div className="space-y-4">
              {/* 原图卡片 */}
              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">
                    原始图片
                  </h2>
                  {image && (
                    <span className="text-[11px] text-slate-400">
                      来自「我的素材」
                    </span>
                  )}
                </div>
                <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden rounded-xl">
                  {image ? (
                    <img
                      src={image}
                      alt="原始图片"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-500 text-sm px-4 text-center">
                      暂未选择图片，请先到
                      <span className="font-semibold">“我的素材”</span>
                      页面中，点击某张图片下方的「在图像实验室中打开」按钮。
                    </span>
                  )}
                </div>
              </div>

              {/* Extra Prompt 区块 + 常用提示词 */}
              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    可选的补充说明（Extra Prompt）
                  </label>
                  <span className="text-[11px] text-slate-400">
                    不填也可以正常使用
                  </span>
                </div>
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  placeholder="例如：偏暖色、适合游戏直播、科技感强一点、简洁干净…"
                />
                <p className="text-[11px] text-slate-500">
                  这里的内容会加在 AI 提示词后面，用来微调风格，不会直接暴露你的原始图片。
                </p>

                {/* 常用提示词快速选择 */}
                <div className="mt-2">
                  <p className="text-[11px] text-slate-500 mb-1">
                    懒得打字？可以点下面的常用提示词，自动填入再稍微改一改：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((text) => (
                      <button
                        key={text}
                        type="button"
                        onClick={() => setExtraPrompt(text)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-slate-800">
                    选择处理方式
                  </h2>
                  {hasUsedToday && (
                    <span className="text-[11px] text-red-500">
                      今天免费额度可能已用完，继续操作前建议先升级。
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('outpaint')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                      activeOp === 'outpaint'
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      扩展成宽屏背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      将当前画面概念扩展为 16:9 宽屏直播背景，适合作为主背景。
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('style')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                      activeOp === 'style'
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      生成同风格背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      按当前图片的氛围生成相似风格的多张背景，适合做一整套主题。
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('cleanup')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                      activeOp === 'cleanup'
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      美化 / 清理背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      将杂乱的房间重构为干净专业的背景，用于视频会议或在线授课。
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={loading || !image}
                    onClick={() => callLabApi('replace')}
                    className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                      activeOp === 'replace'
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    } disabled:opacity-60`}
                  >
                    <div className="font-semibold text-slate-900">
                      AI 换背景
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      保留人物大致位置感，生成完全不同的背景环境，适合打造“秒换场景”效果。
                    </div>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  免费用户四个功能每天总共只能使用 1 次；升级到 CreatorUnlimited 后不限次数。
                </p>
              </div>
            </div>

            {/* 右侧：结果预览 + 引导 */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow p-4 border border-slate-100 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">
                    处理结果预览
                  </h2>
                  <a
                    href="/history"
                    className="text-[11px] text-blue-600 underline"
                  >
                    查看全部生成历史
                  </a>
                </div>
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
                    <span className="text-sm text-slate-400 px-4 text-center">
                      还没有结果。请选择左侧的一种处理方式，AI 会基于你的图片和补充说明生成新的虚拟背景。
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-500">
                  <p>
                    每次处理结果都会自动保存到「生成历史」，方便你之后下载或再次查看。
                  </p>
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-full border border-blue-500 px-3 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    升级到 CreatorUnlimited，图像实验室不限次数
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
