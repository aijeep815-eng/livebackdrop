import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import SEOHead from '../components/SEOHead';
import styles from '../styles/generate.module.css';

export default function GeneratePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;

  const [prompt, setPrompt] = useState('Modern, soft blue office studio with subtle lighting, bokeh background, clean and minimal for live streaming');
  const [size, setSize] = useState('1024x1024');
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const downloadRef = useRef(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImg(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Generation failed.');
      setImg(data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!img) return;
    const a = document.createElement('a');
    a.href = img;
    a.download = 'livebackdrop.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (status === 'loading') {
    return <div className={styles.center}><p>Loading session...</p></div>;
  }

  if (!session) {
    return (
      <div className={styles.container}>
        <SEOHead
          title="AI Background Generator"
          description="Generate beautiful AI-powered virtual backgrounds for Zoom, streaming, and video meetings with LiveBackdrop."
          keywords="AI background generator, virtual background, live streaming, Zoom backdrop, AI backdrop maker"
        />
        <div className={styles.header}>
          <h1>AI Background Generator</h1>
          <p>Please log in to generate backgrounds.</p>
        </div>
        <div className={styles.card} style={{textAlign:'center'}}>
          <button className={styles.primary} onClick={() => signIn()}>Login to Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SEOHead
        title="AI Background Generator"
        description="Use AI to generate professional studio-quality virtual backdrops for Zoom, live streaming, and video production."
        keywords="AI background generator, virtual background, live streaming, Zoom backdrop, AI backdrop maker"
      />

      <div className={styles.header}>
        <h1>AI Background Generator</h1>
        <p>Turn your ideas into studio‑ready virtual backdrops.</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleGenerate}>
          <div className={styles.formRow}>
            <label className={styles.label}>Prompt</label>
            <textarea
              className={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your background..."
              required
            />
            <div className={styles.note}>
              Tips: mention lighting (soft, cinematic), mood (calm, professional), and theme (office, studio, nature).
            </div>
          </div>

          <div className={styles.controls}>
            <select className={styles.select} value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="1024x1024">1024 × 1024 (Square)</option>
              <option value="1024x576">1024 × 576 (16:9)</option>
              <option value="768x1024">768 × 1024 (Portrait)</option>
            </select>

            <div className={styles.buttons}>
              <button type="submit" className={styles.primary} disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
              </button>
              <button type="button" className={styles.secondary} onClick={() => { setImg(null); setError(''); }}>
                Reset
              </button>
            </div>
          </div>
        </form>

        {error && <p className={styles.note} style={{color:'#b00020'}}>{error}</p>}

        {img && (
          <div className={styles.grid}>
            <img className={styles.preview} src={img} alt="AI background preview" />
            <div className={styles.footerBar}>
              <span className={styles.badge}>Ready to use</span>
              <button className={styles.primary} onClick={handleDownload}>Download PNG</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
