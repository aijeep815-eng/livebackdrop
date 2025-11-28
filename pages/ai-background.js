// pages/ai-background.js
import { useState } from "react";
import NavBar from "../components/NavBar";

export default function AIGenerateBackgroundPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 会员 / 使用次数 UI 预留（当前是前端预览，不连后台）
  const PLAN_NAME = "Free";
  const DAILY_LIMIT = 5;
  const [usedToday, setUsedToday] = useState(0);

  const examplePrompts = [
    "modern minimalist home office with soft lighting",
    "cyberpunk neon city street at night, rain, reflections",
    "clean abstract gradient background in blue and purple",
    "cozy living room with warm light and bookshelf",
  ];

  const handleUseExample = (text) => {
    setPrompt(text);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setImageUrl("");

    const trimmed = prompt.trim();
    if (trimmed.length < 5) {
      setErrorMsg("Prompt is too short. Please describe the background in more detail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (_) {
        // not JSON, keep raw text
      }

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          text ||
          `Request failed with status ${res.status}`;
        setErrorMsg(msg);
        return;
      }

      const url = data?.imageUrl;
      if (!url) {
        setErrorMsg("No image URL returned from server.");
        return;
      }

      setImageUrl(url);

      // 本地前端预览：成功生成一次，就+1（真实限制以后放在后台）
      setUsedToday((prev) => {
        if (prev >= DAILY_LIMIT) return prev;
        return prev + 1;
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to generate background. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 计算进度百分比（用于进度条显示）
  const usagePercent = Math.min(100, Math.round((usedToday / DAILY_LIMIT) * 100));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />

      <main className="flex-1">
        <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">
          {/* 顶部标题 + 使用情况 / 会员提示 */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                AI Background Generator
              </h1>
              <p className="mt-2 text-slate-600">
                Generate high-quality virtual backgrounds optimized for live streaming and video calls.
              </p>
            </div>

            {/* 使用情况 / 会员小卡片（UI 预览） */}
            <div className="w-full max-w-xs rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Plan: {PLAN_NAME}</span>
                <span className="text-xs text-sky-700">Preview</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Today: <span className="font-semibold text-slate-800">{usedToday}</span>
                {" / "}
                <span className="font-semibold text-slate-800">{DAILY_LIMIT}</span> AI generations
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <button
                type="button"
                className="mt-3 w-full rounded-xl border border-sky-500/60 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
                onClick={() => {
                  // 先跳到 pricing 页面，后面再接 Stripe
                  window.location.href = "/pricing";
                }}
              >
                Upgrade plan (coming soon)
              </button>
            </div>
          </div>

          {/* 中间：左 Prompt / 右 示例 */}
          <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
            {/* 左边：Prompt 表单 */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                <label className="text-sm font-medium text-slate-800">
                  Prompt (English recommended)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="e.g. modern studio with soft blue lighting and a blurred city skyline outside the window"
                />

                {errorMsg && (
                  <p className="whitespace-pre-wrap rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Generating..." : "Generate Background"}
                </button>

                <p className="text-xs text-slate-500">
                  Tip: keep it simple and clear. Avoid adding text or logos in the description.
                </p>
              </form>
            </div>

            {/* 右边：示例 prompt */}
            <div className="rounded-2xl bg-slate-900 p-5 text-slate-100 shadow-sm">
              <h2 className="text-sm font-semibold tracking-wide text-sky-200">
                Example prompts
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Click to use an example and then customize it.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {examplePrompts.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => handleUseExample(ex)}
                    className="w-full rounded-lg border border-sky-500/40 bg-slate-800 px-3 py-2 text-left text-xs text-slate-100 transition hover:border-sky-300 hover:bg-slate-700"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 结果区域 */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Generated background
            </h2>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
                <span>Generating a new background…</span>
              </div>
            )}

            {!loading && !imageUrl && !errorMsg && (
              <p className="text-sm text-slate-500">
                Your generated image will appear here. After it loads, you can right-click to
                save it and use it in Zoom, OBS, or any other app.
              </p>
            )}

            {!loading && imageUrl && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="AI generated virtual background"
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
