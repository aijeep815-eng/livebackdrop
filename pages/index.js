import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Home(){
  const [preview, setPreview] = useState(null)
  const router = useRouter()
  const { locale } = router
  const tr = {
    en: { title: 'Create AI Virtual Backgrounds', upload: 'Upload Image', preview: 'Preview' },
    zh: { title: '创建 AI 虚拟背景', upload: '上传图片', preview: '预览' },
    es: { title: 'Crea Fondos Virtuales AI', upload: 'Subir Imagen', preview: 'Vista Previa' }
  }[locale || 'en']
  function onFile(e){
    const f = e.target.files?.[0]
    if(!f) return
    const url = URL.createObjectURL(f)
    setPreview(url)
  }
  return (
    <div className="wrap">
      <Head><title>LiveBackdrop</title></Head>
      <Nav />
      <main className="container">
        <h1>{tr.title}</h1>
        <label className="btn">{tr.upload}<input type="file" accept="image/*" onChange={onFile} hidden /></label>
        <div className="preview">{preview ? <img src={preview} alt="preview" /> : <div className="placeholder">{tr.preview}</div>}</div>
      </main>
      <Footer />
    </div>
  )
}
