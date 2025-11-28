// pages/ai-background.js
import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AIGenerateBackgroundPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      setErrorMsg(
        "Prompt is too short. Please describe the background in more detail."
      );
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

      // 先拿原始文本
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (_) {
        // 不是 JSON，就保持 text 原样
      }

      if (!res.ok) {
        // 尽量把后端的 error 原样显示出来
        const msg =
          (data && (data.error || data.message)) ||
          text ||
          `Request failed with status ${res.status}`;
        setErrorMsg(msg);
        return;
      }

      const image =
        (data && data.imageUrl) ||
        (() => {
          try {
            const parsed = JSON.parse(text);
            return parsed.imageUrl;
          } catch {
            return "";
          }
        })();

      if (!image) {
        setErrorMsg("No image URL returned from server.");
        return;
      }

      setImageUrl(image);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.message || "Failed to generate background. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />

      <main className="flex-1">
        <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:py-14">
          {/* 标题 */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              AI Background Generator
            </h1>
            <p className="mt-2 text-slate-600">
              Describe the scene you want, and we will generate a virtual
              background optimized for live streaming and video calls.
            </p>
          </div>

          {/* 左：表单 右：示例 */}
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
                  Tip: keep it simple and clear. Avoid adding text or logos in
                  the description.
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
                Your generated image will appear here. After it loads, you can
                right-click to save it and use it in Zoom, OBS, or any other
                app.
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

      <Footer />
    </div>
  );
}
