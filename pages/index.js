import Image from 'next/image';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', backgroundColor: '#fff', width: '100%' }}>
      <main className="py-10 px-4 w-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Hero 区域 */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Bring Your Live to Life</h1>
          <p style={{ color: '#4b5563', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto' }}>
            Create stunning virtual backgrounds with AI. Generate, customize, and download in seconds.
          </p>
        </section>

        {/* 三个功能图片区 - 彻底居中对齐 */}
        <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', width: '100%', maxWidth: '1200px' }}>
          <div style={{ maxWidth: '20rem', textAlign: 'center' }}>
            <Image src="/ai-generate.png" alt="AI Generate" width={300} height={200} style={{ borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1rem' }}>AI Generate</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem', padding: '0 1rem' }}>Automatically create virtual backgrounds with AI power.</p>
          </div>

          <div style={{ maxWidth: '20rem', textAlign: 'center' }}>
            <Image src="/customize.png" alt="Customize" width={300} height={200} style={{ borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1rem' }}>Customize</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem', padding: '0 1rem' }}>Adjust lighting, colors, and style for your unique brand.</p>
          </div>

          <div style={{ maxWidth: '20rem', textAlign: 'center' }}>
            <Image src="/download.png" alt="Download" width={300} height={200} style={{ borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', margin: '0 auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1rem' }}>Download</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem', padding: '0 1rem' }}>Instantly download and use your new virtual background.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
