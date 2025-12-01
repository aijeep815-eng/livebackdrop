import React, { useState } from 'react';
import NavBar from '../components/NavBar';

const TOTAL_IMAGES = 46;

// 根据编号分配分类
function getCategory(id) {
  if (id >= 1 && id <= 15) return '带货直播';
  if (id >= 16 && id <= 34) return '普通直播';
  if (id >= 35 && id <= 37) return '户外背景';
  if (id >= 38 && id <= 40) return '科技未来';
  if (id >= 41 && id <= 46) return '电商直播间';
  return '其它';
}

const CATEGORY_TABS = [
  { key: 'all', label: '全部' },
  { key: '带货直播', label: '带货直播' },
  { key: '普通直播', label: '普通直播' },
  { key: '户外背景', label: '户外背景' },
  { key: '科技未来', label: '科技未来' },
  { key: '电商直播间', label: '电商直播间' },
];

const images = Array.from({ length: TOTAL_IMAGES }, (_, index) => {
  const id = index + 1;
  const padded = String(id).padStart(2, '0');

  return {
    id,
    // 注意：这里已经改成 .png，图片放在 public/gallery/
    src: `/gallery/gallery_${padded}.png`,
    alt: `直播背景图 ${padded}`,
    category: getCategory(id),
  };
});

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <>
      <NavBar />

      <main className="gallery-page">
        <section className="gallery-hero">
          <h1>Gallery · 示例直播背景库</h1>
          <p>
            这是当前站点内置的示例背景图合集，包含带货直播、普通直播、户外场景、科技未来、电商直播间等多种风格。
            实际使用时，用户上传或生成的背景可以与这些示例一起使用。
          </p>
        </section>

        <section className="gallery-filters">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={
                'gallery-tab' +
                (activeCategory === tab.key ? ' gallery-tab--active' : '')
              }
              onClick={() => setActiveCategory(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </section>

        <section className="gallery-grid">
          {filteredImages.map((img) => (
            <figure key={img.id} className="gallery-item">
              <div className="gallery-thumb">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
              <figcaption className="gallery-caption">
                <div className="gallery-caption-left">
                  <span className="gallery-id">
                    #{String(img.id).padStart(2, '0')}
                  </span>
                  <span className="gallery-category">{img.category}</span>
                </div>
                <span className="gallery-label">示例背景</span>
              </figcaption>
            </figure>
          ))}

          {filteredImages.length === 0 && (
            <div className="gallery-empty">当前分类下没有图片。</div>
          )}
        </section>
      </main>

      <style jsx>{`
        .gallery-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 80px 16px 40px;
        }

        .gallery-hero {
          max-width: 960px;
          margin: 0 auto 16px;
          text-align: left;
        }

        .gallery-hero h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #111827;
        }

        .gallery-hero p {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
        }

        .gallery-filters {
          max-width: 960px;
          margin: 0 auto 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .gallery-tab {
          border-radius: 9999px;
          border: 1px solid #cbd5f5;
          padding: 6px 14px;
          font-size: 13px;
          background: #ffffff;
          cursor: pointer;
          color: #4b5563;
          transition: all 0.15s ease;
        }

        .gallery-tab:hover {
          border-color: #2563eb;
          color: #1d4ed8;
        }

        .gallery-tab--active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
        }

        .gallery-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .gallery-item {
          background: #ffffff;
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.25);
        }

        .gallery-thumb {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          border-radius: 12px;
          overflow: hidden;
          background: #e5e7eb;
        }

        .gallery-thumb img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-caption {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
        }

        .gallery-caption-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gallery-id {
          font-weight: 600;
          color: #2563eb;
        }

        .gallery-category {
          padding: 2px 8px;
          border-radius: 9999px;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .gallery-label {
          padding: 2px 8px;
          border-radius: 9999px;
          background: #e5e7eb;
          color: #374151;
        }

        .gallery-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 0;
          color: #6b7280;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .gallery-page {
            padding-top: 72px;
          }

          .gallery-hero h1 {
            font-size: 22px;
          }

          .gallery-grid {
            gap: 12px;
          }

          .gallery-item {
            border-radius: 12px;
          }
        }
      `}</style>
    </>
  );
}
