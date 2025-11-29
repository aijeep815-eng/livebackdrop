import { useEffect, useState } from 'react';
import Head from 'next/head';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function UploadsPage() {
  const [uploads, setUploads] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUploads();
  }, []);

  async function fetchUploads() {
    setLoadingList(true);
    setError(null);
    try {
      const res = await fetch('/api/uploads');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '加载素材失败，请稍后再试。');
        return;
      }
      setUploads(data.uploads || []);
    } catch (err) {
      console.error(err);
      setError('网络请求失败，请稍后再试。');
    } finally {
      setLoadingList(false);
    }
  }

  function openUploadWidget() {
    if (!cloudName || !uploadPreset) {
      setError('缺少 Cloudinary 配置，请联系站长。');
      return;
    }
    setError(null);
    setLimitInfo(null);

    // 确保 widget 脚本已加载
    if (typeof window === 'undefined' || !window.cloudinary) {
      setError('上传组件尚未加载完成，请稍后再试。');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        cropping: false,
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary widget error:', error);
          return;
        }
        if (result && result.event === 'success') {
          const info = result.info;
          setUploading(true);
          try {
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
              if (data.code === 'UPLOAD_LIMIT_REACHED') {
                setLimitInfo({
                  type: 'upload',
                  planKey: data.planKey || 'free',
                  limit: data.limit,
                  used: data.used,
                });
              }
              setError(
                data.error || '保存上传记录失败，请稍后再试。'
              );
              return;
            }
            // 成功后刷新列表
            await fetchUploads();
          } catch (err) {
            console.error(err);
            setError('网络请求失败，请稍后再试。');
          } finally {
            setUploading(false);
          }
        }
      }
    );

    widget.open();
  }

  return (
    <>
      <Head>
        <title>我的素材 - LiveBackdrop</title>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" defer />
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                我的素材
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                免费用户每天可以上传 <span className="font-semibold">10</span> 张图片，
                可在图像实验室中进一步处理。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={openUploadWidget}
                disabled={uploading}
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {uploading ? '上传中…' : '上传新素材'}
              </button>
              <a
                href="/lab"
                className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                打开图像实验室
              </a>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium mb-1">提示</p>
              <p className="mb-2">{error}</p>
              {limitInfo?.type === 'upload' && (
                <div className="flex flex-wrap items-center gap-2">
                  {Number.isFinite(limitInfo.limit) && (
                    <span>
                      今日上传次数：{limitInfo.used}/{limitInfo.limit}
                    </span>
                  )}
                  <a
                    href="/pricing"
                    className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    升级套餐，解锁不限量上传
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              素材列表
            </h2>
            {loadingList ? (
              <p className="text-sm text-slate-500">加载中…</p>
            ) : uploads.length === 0 ? (
              <p className="text-sm text-slate-500">
                暂无素材，先上传一张试试吧。
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {uploads.map((item) => (
                  <div
                    key={item._id || item.publicId}
                    className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-video bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.publicId}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-3 text-xs text-slate-600 flex-1 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span>{item.format?.toUpperCase() || 'IMG'}</span>
                        {item.width && item.height && (
                          <span>
                            {item.width}×{item.height}
                          </span>
                        )}
                      </div>
                      <a
                        href={`/lab?image=${encodeURIComponent(
                          item.url
                        )}`}
                        className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
                      >
                        在图像实验室中打开
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
