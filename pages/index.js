import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function Home(){
  const [preview, setPreview] = useState(null)
  const router = useRouter()
  const { locale } = router

  const tr = {
    en: {
      title: 'Create AI Virtual Backgrounds for Your Live Streams',
      sub: 'Upload a photo or describe the backdrop. Free preview — upgrade for HD downloads.',
      upload: 'Upload an image',
      preview: 'Preview',
      note: 'This is a demo preview. AI generation will be connected next.',
      generate: 'Generate Preview (Demo)'
    },
    zh: {
      title: '为你的直播生成 AI 虚拟背景',
      sub: '上传照片或描述背景。先试预览—升级获取高清下载。',
      upload: '上传图片',
      preview: '预览',
      note: '这是演示预览，真实 AI 生成稍后接入。',
      generate: '生成预览（演示）'
    },
    es: {
      title: 'Crea fondos virtuales con IA para tus transmisiones',
      sub: 'Sube una foto o describe el fondo. Vista previa gratis — HD en versión Pro.',
      upload: 'Subir imagen',
      preview: 'Vista previa',
      note: 'Esta es una demo. Conectaremos la IA real después.',
      generate: 'Generar vista previa (Demo)'
    }
  }[locale || 'en']

  function onFile(e){
    const f = e.target.files?.[0]
    if(!f) return
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  return (
    <div className="wrap">
      <Head>
        <title>LiveBackdrop — AI Virtual Backgrounds</title>
      </Head>
      <Nav />
      <main className="container">
        <section className="hero">
          <div className="left">
            <h1>{tr.title}</h1>
            <p className="sub">{tr.sub}</p>
            <label className="btn">
              {tr.upload}
              <input type="file" accept="image/*" onChange={onFile} hidden />
            </label>
            <button className="btn ghost" onClick={()=>alert('Demo only')}>{tr.generate}</button>
            <p className="note">{tr.note}</p>
          </div>
          <div className="right">
            <div className="preview">{preview ? <img src={preview} alt="preview" /> : <div className="placeholder">{tr.preview}</div>}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
