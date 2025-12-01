// pages/gallery.js
// Gallery 页面 —— 已移除重复 Footer，保持全局 Footer 自动渲染

import Head from 'next/head';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function GalleryPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <>
      <Head>
        <title>Gallery - LiveBackdrop</title>
        <meta
          name="description"
          content="Explore AI-generated livestream backgrounds from the LiveBackdrop gallery."
        />
      </Head>

      {/* 顶部导航栏（保持蓝色） */}
      <NavBar />

      <main className="min-h-screen bg-slate-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-33xl font-bold text-slate-900 mb-6">
            AI 背景图库
          </h1>
          <p className="text-slate-600 mb-10 text-sm">
            以下是 AI 自动生成的虚拟直播背景示例。
          </p>

          {/* 图片网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <img
                  src={img.url}
                  alt={`gallery-${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {images.length === 0 && (
              <p className="text-center text-slate-500 col-span-full">
                暂无图片，请稍后再试…
              </p>
            )}
          </div>
        </div>
      </main>

      {/* 注意：不再单独写 <Footer />，footer 会由全局 Layout 自动渲染 */}
    </>
  );
}
