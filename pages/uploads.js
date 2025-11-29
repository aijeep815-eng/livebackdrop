// pages/uploads.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function UploadsPage() {
  const { data: session, status } = useSession();
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUploads();
    }
  }, [status]);

  async function fetchUploads() {
    try {
      const res = await fetch('/api/uploads');
      if (!res.ok) {
        throw new Error('Failed to load uploads');
      }
      const data = await res.json();
      setUploads(Array.isArray(data.uploads) ? data.uploads : []);
    } catch (err) {
      console.error('Fetch uploads error:', err);
      setError('加载上传记录失败，请稍后再试。');
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setMessage('');
    setFilePreview(URL.createObjectURL(file));

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Cloudinary 配置缺失，请先在环境变量中设置 CLOUD 名称和上传预设。');
      return;
    }

    setIsUploading(true);

    try {
      // 1) 上传到 Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error('Cloudinary error:', cloudinaryData);
        throw new Error(
          cloudinaryData?.error?.message || 'Cloudinary 上传失败，请检查配置。'
        );
      }

      // 2) 保存到我们自己的数据库（只存元数据）
      const saveRes = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          format: cloudinaryData.format,
          width: cloudinaryData.width,
          height: cloudinaryData.height,
          bytes: cloudinaryData.bytes,
          originalFilename: cloudinaryData.original_filename,
          resourceType: cloudinaryData.resource_type,
          category: 'upload',
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.upload) {
        console.error('Save upload error:', saveData);
        throw new Error(saveData.error || '保存上传记录失败。');
      }

      setMessage('上传成功！');
      setUploads((prev) => [saveData.upload, ...(Array.isArray(prev) ? prev : [])]);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || '上传失败，请稍后重试。');
    } finally {
      setIsUploading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow rounded-2xl px-8 py-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">请先登录</h1>
          <p className="text-slate-600 mb-4">
            上传素材需要账户登录。请先登录或注册，然后再访问本页面。
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
        <title>Uploads – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            用户上传中心
          </h1>
          <p className="text-slate-600 mb-6">
            在这里上传你的直播素材或背景参考图。我们会安全保存链接，后续可以用于 AI 生成专属虚拟背景。
          </p>

          <div className="bg-white rounded-2xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">上传新的素材</h2>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center mb-4">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                选择图片文件
              </label>
              <p className="text-xs text-slate-500 mt-2">
                支持常见图片格式（JPG、PNG、WEBP），建议不超过 5MB。
              </p>
            </div>

            {filePreview && (
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">预览：</p>
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-h-64 rounded-xl border border-slate-200 object-contain"
                />
              </div>
            )}

            {isUploading && (
              <p className="text-sm text-blue-600">正在上传，请稍候...</p>
            )}
            {message && (
              <p className="text-sm text-green-600 mt-2">{message}</p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">我的上传历史</h2>

            {!uploads || uploads.length === 0 ? (
              <p className="text-slate-500 text-sm">
                你还没有上传任何素材。上传一张图片后，这里会显示你的历史记录。
              </p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {uploads
                  .filter((item) => !!item && !!item.url)
                  .map((item) => (
                    <div
                      key={item._id || item.publicId}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
                    >
                      <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.originalFilename || item.publicId || 'upload'}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-slate-500 mb-1 truncate">
                          {item.originalFilename || item.publicId}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.width} × {item.height}{' '}
                          {item.bytes
                            ? `· ${(item.bytes / 1024 / 1024).toFixed(2)} MB`
                            : ''}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ''}
                        </p>
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
