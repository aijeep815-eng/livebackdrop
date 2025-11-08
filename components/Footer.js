import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('lb_lang') || 'en');
    }
  }, []);

  const text = {
    en: {
      copyright: '© 2025 LiveBackdrop. All rights reserved.',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Generate Background', href: '/generate' },
        { name: 'Upload & Edit', href: '/upload' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    zh: {
      copyright: '© 2025 LiveBackdrop 版权所有。',
      links: [
        { name: '关于我们', href: '/about' },
        { name: '价格方案', href: '/pricing' },
        { name: '作品展示', href: '/gallery' },
        { name: '生成背景', href: '/generate' },
        { name: '上传与编辑', href: '/upload' },
        { name: '联系我们', href: '/contact' },
      ],
    },
    es: {
      copyright: '© 2025 LiveBackdrop. Todos los derechos reservados.',
      links: [
        { name: 'Sobre Nosotros', href: '/about' },
        { name: 'Precios', href: '/pricing' },
        { name: 'Galería', href: '/gallery' },
        { name: 'Generar Fondo', href: '/generate' },
        { name: 'Subir y Editar', href: '/upload' },
        { name: 'Contacto', href: '/contact' },
      ],
    },
  };

  return (
    <footer className="bg-blue-800 text-white text-center py-8 mt-20">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3 text-sm">
        {text[lang].links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-blue-300 transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <p className="text-xs opacity-80">{text[lang].copyright}</p>
    </footer>
  );
}
