import '@/styles/globals.css'  // 确保 Tailwind 样式被加载
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 在客户端确保 Tailwind 动态加载后刷新样式
    document.body.classList.add('bg-gray-50')
  }, [])

  return <Component {...pageProps} />
}
