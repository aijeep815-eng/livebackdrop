import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const router = useRouter()
  const { locale, pathname, asPath, query } = router

  const t = {
    en: { home: 'Home', pricing: 'Pricing', about: 'About', lang: 'Language' },
    zh: { home: '首页', pricing: '价格', about: '关于', lang: '语言' },
    es: { home: 'Inicio', pricing: 'Precios', about: 'Acerca de', lang: 'Idioma' },
  }[locale || 'en']

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link href="/" className="brand">LiveBackdrop</Link>
        <Link href="/" className="link">{t.home}</Link>
        <Link href="/pricing" className="link">{t.pricing}</Link>
        <Link href="/about" className="link">{t.about}</Link>
      </div>
      <div className="nav-right">
        <span className="muted">{t.lang}:</span>
        <Link href={{ pathname, query }} as={asPath} locale="en" className={"chip"+((locale==='en' || !locale)?' active':'')}>EN</Link>
        <Link href={{ pathname, query }} as={asPath} locale="zh" className={"chip"+(locale==='zh'?' active':'')}>中文</Link>
        <Link href={{ pathname, query }} as={asPath} locale="es" className={"chip"+(locale==='es'?' active':'')}>ES</Link>
      </div>
    </nav>
  )
}
