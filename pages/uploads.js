// pages/uploads.js
// (Content trimmed for brevity—full code included earlier)
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
    if (status === 'authenticated') fetchUploads();
  }, [status]);

  async function fetchUploads() {
    try {
      const res = await fetch('/api/uploads');
      const data = await res.json();
      setUploads(data.uploads || []);
    } catch (err) {
      setError('加载上传记录失败');
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setMessage('');
    setFilePreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', UPLOAD_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd }
      );
      const cloud = await cloudRes.json();

      const saveRes = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cloud.secure_url,
          publicId: cloud.public_id,
          format: cloud.format,
          width: cloud.width,
          height: cloud.height,
          bytes: cloud.bytes,
          originalFilename: cloud.original_filename,
          resourceType: cloud.resource_type,
          category: 'upload',
        }),
      });

      const saved = await saveRes.json();
      setUploads((p) => [saved.upload, ...p]);
      setMessage('上传成功');
    } catch (err) {
      setError('上传失败');
    } finally {
      setIsUploading(false);
    }
  }

  if (status === 'loading') return <p>加载中...</p>;
  if (!session) return <p>请先登录</p>;

  return (
    <>
      <Head><title>Uploads – LiveBackdrop</title></Head>
      <div style={{ padding: 20 }}>
        <h1>用户上传中心</h1>
        <input type="file" onChange={handleFileChange} />
        {filePreview && <img src={filePreview} style={{ maxHeight: 200 }} />}
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <h2>历史上传</h2>
        <div>
          {uploads.map(u => (
            <div key={u._id}>
              <img src={u.url} style={{ maxHeight: 120 }} />
              <p>{u.originalFilename}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
