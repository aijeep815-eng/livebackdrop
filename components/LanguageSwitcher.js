import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // priority: url ?lang= -> localStorage -> default en
    const urlLang = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('lang')
      : null;
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lb_lang') : null;
    const active = (urlLang || saved || 'en');
    setLang(active);
  }, []);

  const changeLang = (code) => {
    setLang(code);
    try { localStorage.setItem('lb_lang', code); } catch {}
    // Keep current path, swap/append ?lang=code
    const qp = new URLSearchParams(window.location.search);
    qp.set('lang', code);
    const url = `${window.location.pathname}?${qp.toString()}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {LANGS.map((l, idx) => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          className={`hover:text-blue-300 transition-colors ${lang===l.code ? 'font-semibold underline' : ''}`}
          aria-label={`Switch language to ${l.label}`}
        >
          {l.label}
        </button>
      )).reduce((prev, curr, i) => prev === null ? [curr] : [...prev, <span key={'sep'+i} className="opacity-80">|</span>, curr], null)}
    </div>
  );
}
