import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/navbar.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>LiveBackdrop</Link>
        </div>

        <nav className={styles.nav}>
          <div
            className={styles.navItem}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span className={styles.navLink}>Products ▾</span>
            {open && (
              <div className={styles.dropdown}>
                <Link href="/generate" className={styles.dropLink}>AI Background Generator</Link>
                <Link href="/about" className={styles.dropLink}>How It Works</Link>
                <Link href="/pricing" className={styles.dropLink}>Pricing</Link>
              </div>
            )}
          </div>

          <Link href="/generate" className={styles.navLink}>Generate</Link>
          <Link href="/auth/login" className={styles.navLink}>Login</Link>
          <Link href="/auth/register" className={styles.cta}>Get Started</Link>
        </nav>

        <div className={styles.lang}>
          <Link href="/en" className={styles.langLink}>EN</Link>
          <span className={styles.langSep}>/</span>
          <Link href="/zh" className={styles.langLink}>中文</Link>
          <span className={styles.langSep}>/</span>
          <Link href="/es" className={styles.langLink}>ES</Link>
        </div>
      </div>
    </header>
  );
}
