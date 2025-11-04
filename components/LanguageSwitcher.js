import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/navbar.module.css';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  useEffect(() => {
    // Prefetch locale routes to avoid flicker on switch
    ['en', 'zh', 'es'].forEach(lc => {
      if (lc !== locale) {
        router.prefetch({ pathname, query }, asPath, { locale: lc }).catch(() => {});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, pathname, asPath]);

  const changeLanguage = (newLocale) => {
    if (newLocale === locale) return;
    router.push({ pathname, query }, asPath, { locale: newLocale, scroll: false }).catch(() => {});
  };

  return (
    <div className={styles.lang}>
      <button
        onClick={() => changeLanguage('en')}
        className={locale === 'en' ? styles.langActive : styles.langLink}
      >
        EN
      </button>
      <span className={styles.langSep}>/</span>
      <button
        onClick={() => changeLanguage('zh')}
        className={locale === 'zh' ? styles.langActive : styles.langLink}
      >
        中文
      </button>
      <span className={styles.langSep}>/</span>
      <button
        onClick={() => changeLanguage('es')}
        className={locale === 'es' ? styles.langActive : styles.langLink}
      >
        ES
      </button>
    </div>
  );
}
