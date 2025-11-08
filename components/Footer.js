import { useEffect, useState } from 'react';

export default function Footer() {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('lb_lang') || 'en');
    }
  }, []);

  const text = {
    en: '© 2025 LiveBackdrop. All rights reserved.',
    zh: '© 2025 LiveBackdrop 版权所有。',
    es: '© 2025 LiveBackdrop. Todos los derechos reservados.',
  };

  return (
    <footer className="bg-blue-800 text-white text-center py-6 mt-20">
      <p className="text-sm">{text[lang]}</p>
    </footer>
  );
}
