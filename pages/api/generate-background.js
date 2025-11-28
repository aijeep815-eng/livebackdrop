import { useState } from "react";
import NavBar from "../components/NavBar"; // 保留导航栏

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

  const handleUseExample = (text) => setPrompt(text);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setImageUrl("");

    const trimmed = prompt.trim();
    if (trimmed.length < 5) {
      setErrorMsg("Prompt too short. Please describe the background more clearly.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          text ||
          `Request failed: ${res.status}`;
        setErrorMsg(msg);
        return;
      }

      const url = data?.imageUrl;
      if (!url) {
        setErrorMsg("No image returned.");
        return;
      }

      setImageUrl(url);
    } catch (err) {
      setErrorMsg(err?.message || "Failed to generate background.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-10 md:py-14">

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            AI Background Generator
          </h1>
          <p className="mt-2 text-slate-600">
            Generate high-quality virtual backgrounds for live streaming.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[2fr,1.2fr]">

            {/* 左边 - Prompt */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                <label className="text-sm font-medium text-slate-800">
                  Prompt
                </label>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                {errorMsg && (
                  <p className="whitespace-pre-wrap rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-70"
                >
                  {loading ? "Generating..." : "Generate Background"}
                </button>
              </form>
            </div>

            {/* 右边 - 示例 */}
            <div className="rounded-2xl bg-slate-900 p-5 text-slate-100 shadow-sm">
              <h2 className="text-sm font-semibold tracking-wide text-sky-200">
                Example prompts
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                {examplePrompts.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => handleUseExample(ex)}
                    className="w-full rounded-lg border border-sky-500/40 bg-slate-800 px-3 py-2 text-left text-xs hover:bg-slate-700"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 结果 */}
          <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Generated background
            </h2>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
                Generating...
              </div>
            )}

            {!loading && !imageUrl && !errorMsg && (
              <p className="text-sm text-slate-500">
                Your generated image will appear here.
              </p>
            )}

            {!loading && imageUrl && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={imageUrl}
                  alt="Generated background"
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>

        </section>
      </main>
      {/* ❗Footer 由 Layout 自动渲染，这里删除 */}
    </div>
  );
}
