import '@/styles/globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* 头部导航栏 */}
      <NavBar />
      
      {/* 页面内容 */}
      <main>
        <Component {...pageProps} />
      </main>

      {/* 页脚（如果没有 Footer.js，可以先删掉这行） */}
      <Footer />
    </>
  )
}
