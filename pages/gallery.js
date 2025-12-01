// pages/gallery.js
// Gallery · 示例直播背景库（卡片布局 + 实际图片）

import Head from 'next/head';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

const CATEGORY_TABS = [
  { key: 'all', label: '全部' },
  { key: 'commerce', label: '带货直播' },
  { key: 'normal', label: '普通直播' },
  { key: 'outdoor', label: '户外场景' },
  { key: 'future', label: '科技未来' },
  { key: 'shop', label: '电商直播间' },
];

const CARD_SLOTS = Array.from({ length: 15 }).map((_, idx) => ({
  index: idx,
  title: `直播背景图 ${String(idx + 1).padStart(2, '0')}`,
  number: `#${String(idx + 1).padStart(2, '0')}`,
}));

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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
        <title>Gallery · 示例直播背景库 - LiveBackdrop</title>
        <meta
          name="description"
          content="示例直播背景图库，包含带货直播、普通直播、户外场景、科技未来、电商直播间等多种风格。"
        />
      </Head>

      <NavBar />

      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Gallery · 示例直播背景库
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              这是当前站点内置的示例背景图合集，包含带货直播、普通直播、户外场景、科技未来、电商直播间等多种风格。
            </p>
          </header>

          <div className="flex flex-wrap gap-3 mb-8">
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    'px-4 py-1.5 rounded-full text-sm border transition',
                    isActive
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400 hover:text-sky-700',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading && (
            <p className="text-sm text-slate-500">正在加载示例背景，请稍候…</p>
          )}

          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
            {CARD_SLOTS.map((slot, idx) => {
              const img = images[idx];
              return (
                <div
                  key={slot.index}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm px-4 pt-4 pb-3 flex flex-col"
                >
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {slot.title}
                    </p>
                  </div>

                  <div className="relative rounded-2xl bg-slate-100 overflow-hidden aspect-[4/3] mb-3 border border-slate-100">
                    {img ? (
                      <img
                        src={img.url}
                        alt={img.filename || slot.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        示例占位图
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-sky-600 font-medium">
                      {slot.number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                        带货直播
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        示例背景
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && images.length === 0 && (
            <p className="mt-6 text-xs text-slate-500">
              提示：当前没有可用的示例图片，请确认
              <code className="mx-1 bg-slate-100 px-1 rounded">
                public/gallery
              </code>
              目录下已经上传了图片文件。
            </p>
          )}
        </div>
      </main>
    </>
  );
}
