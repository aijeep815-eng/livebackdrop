import { useState, useRef } from 'react';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);

  const toggleAI = () => {
    setAiOpen(v => !v);
    setSceneOpen(false);
  };

  const toggleScene = () => setSceneOpen(v => !v);

  return (
    <nav className="lb-nav">
      <div className="lb-wrap">
        <div className="lb-brand">LiveBackdrop</div>
        <div className="lb-menu">
          <a className="lb-link" href="/">Home</a>

          <div className="lb-dropdown">
            <button className="lb-link lb-btn" onClick={toggleAI}>AI Tools ▾</button>
            {aiOpen && (
              <div className="lb-panel">
                <a className="lb-item" href="/ai/generate">Generate Background</a>
                <a className="lb-item" href="/ai/upload">Upload & Edit</a>
                <button className="lb-item lb-btn" onClick={toggleScene}>Scene Mode ▸</button>
                {sceneOpen && (
                  <div className="lb-subpanel">
                    <a className="lb-item" href="/scene/office">Office & Meeting</a>
                    <a className="lb-item" href="/scene/streaming">Streaming & Studio</a>
                    <a className="lb-item" href="/scene/indoor">Indoor Living</a>
                    <a className="lb-item" href="/scene/outdoor">Outdoor & Nature</a>
                    <a className="lb-item" href="/scene/education">Education & Presentation</a>
                    <a className="lb-item" href="/scene/business">Business & Brand</a>
                    <a className="lb-item" href="/scene/creative">Creative & Theme</a>
                    <a className="lb-item" href="/scene/custom">Custom AI Mode</a>
                  </div>
                )}
              </div>
            )}
          </div>

          <a className="lb-link" href="/pricing">Pricing</a>
          <a className="lb-link" href="/gallery">Gallery</a>
          <a className="lb-link" href="/about">About</a>
          <a className="lb-link" href="/contact">Contact</a>
        </div>

        <button className="lb-ham" onClick={() => setMobileOpen(v=>!v)} aria-label="Menu">☰</button>
      </div>

      {mobileOpen && (
        <div className="lb-drawer">
          <a className="lb-m" href="/">Home</a>
          <button className="lb-m lb-btn" onClick={toggleAI}>AI Tools ▾</button>
          {aiOpen && (
            <div className="lb-sub">
              <a className="lb-m" href="/ai/generate">Generate Background</a>
              <a className="lb-m" href="/ai/upload">Upload & Edit</a>
              <button className="lb-m lb-btn" onClick={toggleScene}>Scene Mode ▾</button>
              {sceneOpen && (
                <div className="lb-sub">
                  <a className="lb-m" href="/scene/office">Office & Meeting</a>
                  <a className="lb-m" href="/scene/streaming">Streaming & Studio</a>
                  <a className="lb-m" href="/scene/indoor">Indoor Living</a>
                  <a className="lb-m" href="/scene/outdoor">Outdoor & Nature</a>
                  <a className="lb-m" href="/scene/education">Education & Presentation</a>
                  <a className="lb-m" href="/scene/business">Business & Brand</a>
                  <a className="lb-m" href="/scene/creative">Creative & Theme</a>
                  <a className="lb-m" href="/scene/custom">Custom AI Mode</a>
                </div>
              )}
            </div>
          )}
          <a className="lb-m" href="/pricing">Pricing</a>
          <a className="lb-m" href="/gallery">Gallery</a>
          <a className="lb-m" href="/about">About</a>
          <a className="lb-m" href="/contact">Contact</a>
        </div>
      )}

      <style jsx>{`
        .lb-nav {
          width: 100%;
          position: sticky;
          top: 0;
          background: #fff;
          border-bottom: 2px solid #dbeafe;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          z-index: 2000;
        }
        .lb-wrap {
          max-width: 1200px;
          margin: 0 auto;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }
        .lb-brand { font-weight: 800; font-size: 22px; color: #1e3a8a; }
        .lb-menu { display: none; gap: 22px; align-items: center; position: relative; }
        .lb-link {
          color: #1e40af;
          text-decoration: none;
          font-weight: 600;
          padding: 8px 10px;
          border-radius: 6px;
          background: transparent;
          border: 0;
          cursor: pointer;
          transition: all .2s;
        }
        .lb-link:hover { color: #2563eb; background: #eff6ff; }
        .lb-ham { background: transparent; border: 0; font-size: 26px; color: #1e40af; cursor: pointer; }

        .lb-dropdown { position: relative; }
        .lb-panel {
          position: absolute;
          top: 100%;
          left: 0;
          background: #E3ECFB;
          border: 1px solid #DBEAFE;
          border-radius: 8px;
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
          padding: 6px 0;
          z-index: 3000;
          min-width: 260px;
        }
        .lb-subpanel {
          position: absolute;
          top: 0;
          left: 100%;
          background: #E3ECFB;
          border: 1px solid #DBEAFE;
          border-radius: 8px;
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
          padding: 6px 0;
          z-index: 3100;
          min-width: 260px;
        }
        .lb-item { display: block; padding: 10px 14px; color: #1f2937; font-weight: 600; text-decoration: none; }
        .lb-item:hover { background: #d9e5fa; color: #1e3a8a; }

        .lb-drawer { background: #E3ECFB; border-top: 2px solid #dbeafe; padding: 8px 0; }
        .lb-m { display: block; padding: 12px 16px; color: #1f2937; text-decoration: none; font-weight: 600; }
        .lb-m:hover { background: #d9e5fa; color: #1e3a8a; }
        .lb-sub { padding-left: 12px; }
        @media(min-width:768px){ .lb-menu{display:flex;} .lb-ham,.lb-drawer{display:none;} }
      `}</style>
    </nav>
  );
}
