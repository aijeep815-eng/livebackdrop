import { useState, useEffect } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className="nav">
      <div className="container">
        <div className="brand">LiveBackdrop</div>
        <div className="desktopMenu">
          <a href="/" className="link">Home</a>

          <div className="dropdown">
            <button className="link" onClick={() => setAiOpen(!aiOpen)}>
              AI Tools ▾
            </button>
            {aiOpen && (
              <div className="panel">
                <a href="/ai/generate" className="item">Generate Background</a>
                <a href="/ai/upload" className="item">Upload & Edit</a>
                <div className="nested">
                  <button className="item nestedBtn" onClick={() => setSceneOpen(!sceneOpen)}>
                    Scene Mode ▸
                  </button>
                  {sceneOpen && (
                    <div className="nestedPanel">
                      <a href="/scene/office" className="item">Office & Meeting</a>
                      <a href="/scene/streaming" className="item">Streaming & Studio</a>
                      <a href="/scene/indoor" className="item">Indoor Living</a>
                      <a href="/scene/outdoor" className="item">Outdoor & Nature</a>
                      <a href="/scene/education" className="item">Education & Presentation</a>
                      <a href="/scene/business" className="item">Business & Brand</a>
                      <a href="/scene/creative" className="item">Creative & Theme</a>
                      <a href="/scene/custom" className="item">Custom AI Mode</a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <a href="/pricing" className="link">Pricing</a>
          <a href="/gallery" className="link">Gallery</a>
          <a href="/about" className="link">About</a>
          <a href="/contact" className="link">Contact</a>
        </div>

        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>

      {isOpen && (
        <div className="mobileMenu">
          <a href="/" className="mItem">Home</a>
          <button className="mItem" onClick={() => setAiOpen(!aiOpen)}>AI Tools ▾</button>
          {aiOpen && (
            <div className="mSub">
              <a href="/ai/generate" className="mItem">Generate Background</a>
              <a href="/ai/upload" className="mItem">Upload & Edit</a>
              <button className="mItem" onClick={() => setSceneOpen(!sceneOpen)}>Scene Mode ▾</button>
              {sceneOpen && (
                <div className="mSub">
                  <a href="/scene/office" className="mItem">Office & Meeting</a>
                  <a href="/scene/streaming" className="mItem">Streaming & Studio</a>
                  <a href="/scene/indoor" className="mItem">Indoor Living</a>
                  <a href="/scene/outdoor" className="mItem">Outdoor & Nature</a>
                  <a href="/scene/education" className="mItem">Education & Presentation</a>
                  <a href="/scene/business" className="mItem">Business & Brand</a>
                  <a href="/scene/creative" className="mItem">Creative & Theme</a>
                  <a href="/scene/custom" className="mItem">Custom AI Mode</a>
                </div>
              )}
            </div>
          )}
          <a href="/pricing" className="mItem">Pricing</a>
          <a href="/gallery" className="mItem">Gallery</a>
          <a href="/about" className="mItem">About</a>
          <a href="/contact" className="mItem">Contact</a>
        </div>
      )}

      <style jsx>{`
        .nav {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
        }
        .container {
          max-width: 1120px;
          margin: 0 auto;
          height: 64px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .desktopMenu {
          display: none;
          gap: 24px;
          align-items: center;
          font-weight: 600;
        }
        .link {
          color: #374151;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 6px 8px;
          transition: color 0.2s;
        }
        .link:hover {
          color: #2563EB;
        }
        .dropdown { position: relative; display: inline-block; }
        .panel {
          position: absolute;
          top: 38px;
          left: 0;
          background: #E3ECFB;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          min-width: 220px;
          padding: 6px 0;
          z-index: 30;
        }
        .item {
          display: block;
          padding: 10px 14px;
          color: #1f2937;
          text-decoration: none;
          background: transparent;
        }
        .item:hover {
          background: #d9e5fa;
          color: #3B82F6;
        }
        .nested { position: relative; }
        .nestedPanel {
          position: absolute;
          top: 0;
          left: 100%;
          background: #E3ECFB;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          min-width: 220px;
          margin-left: 6px;
          padding: 6px 0;
          z-index: 40;
        }
        .hamburger {
          background: transparent;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: #374151;
        }
        .mobileMenu {
          border-top: 1px solid #e5e7eb;
          background: #E3ECFB;
          padding: 8px 0;
        }
        .mItem {
          display: block;
          padding: 12px 16px;
          color: #1f2937;
          text-decoration: none;
          font-weight: 600;
        }
        .mItem:hover {
          background: #d9e5fa;
          color: #3B82F6;
        }
        .mSub { padding-left: 12px; }
        @media (min-width: 768px) {
          .desktopMenu { display: flex; }
          .hamburger, .mobileMenu { display: none; }
        }
      `}</style>
    </nav>
  );
}
