// pages/api/gallery.js
// 读取 /public/gallery 下的所有图片文件，并返回给前端使用

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');

    // 如果目录不存在，返回空数组，避免直接报错
    if (!fs.existsSync(galleryDir)) {
      return res.status(200).json({ images: [] });
    }

    const files = fs
      .readdirSync(galleryDir)
      .filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name));

    const images = files.map((name) => ({
      url: `/gallery/${name}`,
      filename: name,
    }));

    return res.status(200).json({ images });
  } catch (err) {
    console.error('Error reading gallery directory:', err);
    return res
      .status(500)
      .json({ images: [], error: 'Failed to load gallery images' });
  }
}
