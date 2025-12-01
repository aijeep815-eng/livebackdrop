// pages/gallery.js
// Gallery 页面 —— 干净版，无重复 Footer，保留原来的布局结构

import Head from 'next/head';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error('加载图库失败:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Head>
        <title>AI 背景图库 - LiveBackdrop</title>
        <meta
          name="description"
          content="浏览 LiveBackdrop 为直播和视频创作者生成的 AI 虚拟背景示例。"
        />
      </Head>

      <NavBar />

      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              AI 背景图库
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              这里展示了一部分示例背景，用于直播、线上课程、产品带货等场景。
            </p>
          </header>

          {loading && (
            <p className="text-sm text-slate-500">正在加载图库，请稍候…</p>
          )}

          {!loading && images.length === 0 && (
            <p className="text-sm text-slate-500">
              目前还没有可展示的图库图片。请确认 public/gallery 目录下有图片文件。
            </p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <a
                  key={idx}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.filename || `gallery-${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
