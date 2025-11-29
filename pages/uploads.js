// pages/uploads.js
// 我的素材：上传图片 + 查看素材列表 + 进入图像实验室

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';

export default function UploadsPage() {
  const { data: session, status } = useSession();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const loadUploads = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/uploads');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '加载素材失败');
      }
      setUploads(data.uploads || []);
    } catch (err) {
      console.error('load uploads error', err);
      setError(err.message || '加载素材失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      loadUploads();
    }
  }, [status, loadUploads]);

  async function openUploadWidget() {
    if (!window.cloudinary) {
      alert('Cloudinary 组件尚未加载，请稍后重试。');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('缺少 Cloudinary 配置，请先在环境变量中设置。');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url'],
        multiple: false,
        folder: 'livebackdrop_uploads',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary widget error', error);
          return;
        }
        if (result && result.event === 'success') {
          const info = result.info;
          try {
            setIsUploading(true);
            const res = await fetch('/api/uploads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: info.secure_url,
                publicId: info.public_id,
                width: info.width,
                height: info.height,
                bytes: info.bytes,
                format: info.format,
                resourceType: info.resource_type,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || '保存上传记录失败');
            }
            loadUploads();
          } catch (err) {
            console.error('save upload error', err);
            alert(err.message || '保存上传记录失败，请稍后再试。');
          } finally {
            setIsUploading(false);
          }
        }
      }
    );

    widget.open();
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
            管理你的素材需要登录账户。请先登录或注册，然后再访问本页面。
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
        <title>我的素材 – LiveBackdrop</title>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" defer />
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <section className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-slate-900">
                我的素材
              </h1>
              <p className="text-sm text-slate-600">
                这里存放你上传的图片素材。以后可以在“图像实验室”中基于这些素材生成更多虚拟背景。
              </p>
            </div>
            <button
              type="button"
              onClick={openUploadWidget}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isUploading ? '上传中...' : '上传新素材'}
            </button>
          </section>

          <section className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">素材列表</p>
              <a
                href="/lab"
                className="text-xs text-blue-600 hover:underline"
              >
                打开图像实验室（无默认图片）
              </a>
            </div>

            {error && (
              <p className="text-xs text-red-600 mb-2">{error}</p>
            )}

            {loading ? (
              <p className="text-xs text-slate-500">加载中...</p>
            ) : uploads.length === 0 ? (
              <p className="text-xs text-slate-500">
                还没有上传任何素材。点击右上角按钮上传第一张图片吧。
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploads.map((u) => (
                  <div
                    key={u._id || u.publicId}
                    className="border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-slate-50"
                  >
                    <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={u.url}
                        alt={u.publicId}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-2 py-2 flex flex-col gap-1">
                      <p className="text-[11px] text-slate-500 truncate">
                        {u.format?.toUpperCase() || 'IMG'} ·{' '}
                        {u.width && u.height
                          ? `${u.width}×${u.height}`
                          : '尺寸未知'}
                      </p>
                      <a
                        href={`/lab?image=${encodeURIComponent(u.url)}`}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        在图像实验室中打开
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
