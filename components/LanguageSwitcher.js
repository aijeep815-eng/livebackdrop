import { useRouter } from 'next/router';
import styles from '../styles/navbar.module.css';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const changeLanguage = async (newLocale) => {
    if (newLocale === locale) return;
    await router.push({ pathname, query }, asPath, {
      locale: newLocale,
      scroll: false,
      shallow: true
    });
  };

  return (
    <div className={styles.lang}>
      <button onClick={() => changeLanguage('en')} className={locale === 'en' ? styles.langActive : styles.langLink}>
        EN
      </button>
      <span className={styles.langSep}>/</span>
      <button onClick={() => changeLanguage('zh')} className={locale === 'zh' ? styles.langActive : styles.langLink}>
        中文
      </button>
      <span className={styles.langSep}>/</span>
      <button onClick={() => changeLanguage('es')} className={locale === 'es' ? styles.langActive : styles.langLink}>
        ES
      </button>
    </div>
  );
}
