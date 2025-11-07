import { useState } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand">LiveBackdrop</div>

        {/* Desktop menu */}
        <div className="menu desktop">
          <a className="link" href="/">Home</a>

          <div className="dropdown">
            <button className="link" onClick={() => setAiOpen(!aiOpen)}>AI Tools ▾</button>
            {aiOpen && (
              <div className="panel">
                <a className="item" href="/ai/generate">Generate Background</a>
                <a className="item" href="/ai/upload">Upload & Edit</a>
                <button className="item nested-btn" onClick={() => setSceneOpen(!sceneOpen)}>Scene Mode ▸</button>
                {sceneOpen && (
                  <div className="nested-panel">
                    <a className="item" href="/scene/office">Office & Meeting</a>
                    <a className="item" href="/scene/streaming">Streaming & Studio</a>
                    <a className="item" href="/scene/indoor">Indoor Living</a>
                    <a className="item" href="/scene/outdoor">Outdoor & Nature</a>
                    <a className="item" href="/scene/education">Education & Presentation</a>
                    <a className="item" href="/scene/business">Business & Brand</a>
                    <a className="item" href="/scene/creative">Creative & Theme</a>
                    <a className="item" href="/scene/custom">Custom AI Mode</a>
                  </div>
                )}
              </div>
            )}
          </div>

          <a className="link" href="/pricing">Pricing</a>
          <a className="link" href="/gallery">Gallery</a>
          <a className="link" href="/about">About</a>
          <a className="link" href="/contact">Contact</a>
        </div>

        {/* Mobile toggle */}
        <button className="hamburger mobile" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="mobile-menu">
          <a className="m-item" href="/">Home</a>
          <button className="m-item" onClick={() => setAiOpen(!aiOpen)}>AI Tools ▾</button>
          {aiOpen && (
            <div className="m-sub">
              <a className="m-item" href="/ai/generate">Generate Background</a>
              <a className="m-item" href="/ai/upload">Upload & Edit</a>
              <button className="m-item" onClick={() => setSceneOpen(!sceneOpen)}>Scene Mode ▾</button>
              {sceneOpen && (
                <div className="m-sub">
                  <a className="m-item" href="/scene/office">Office & Meeting</a>
                  <a className="m-item" href="/scene/streaming">Streaming & Studio</a>
                  <a className="m-item" href="/scene/indoor">Indoor Living</a>
                  <a className="m-item" href="/scene/outdoor">Outdoor & Nature</a>
                  <a className="m-item" href="/scene/education">Education & Presentation</a>
                  <a className="m-item" href="/scene/business">Business & Brand</a>
                  <a className="m-item" href="/scene/creative">Creative & Theme</a>
                  <a className="m-item" href="/scene/custom">Custom AI Mode</a>
                </div>
              )}
            </div>
          )}
          <a className="m-item" href="/pricing">Pricing</a>
          <a className="m-item" href="/gallery">Gallery</a>
          <a className="m-item" href="/about">About</a>
          <a className="m-item" href="/contact">Contact</a>
        </div>
      )}

      <style jsx>{`
        .navbar {
          width: 100% !important;
          position: sticky !important;
          top: 0 !important;
          background: #ffffff !important;
          border-bottom: 2px solid #dbeafe !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
          z-index: 9999 !important;
        }
        .nav-container {
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 0 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          height: 70px !important;
        }
        .brand {
          font-weight: 800 !important;
          font-size: 22px !important;
          color: #1e3a8a !important;
        }
        .menu {
          display: none !important;
          gap: 24px !important;
          align-items: center !important;
        }
        .link {
          color: #1e40af !important;
          background: transparent !important;
          border: none !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
          padding: 6px 10px !important;
          transition: all 0.2s !important;
        }
        .link:hover {
          color: #2563eb !important;
          background: #eff6ff !important;
          border-radius: 6px !important;
        }
        .dropdown {
          position: relative !important;
          display: inline-block !important;
        }
        .panel {
          position: fixed !important;
          background: #e3ecfb !important;
          border-radius: 10px !important;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1) !important;
          min-width: 230px !important;
          top: 75px !important;
          padding: 8px 0 !important;
        }
        .item {
          display: block !important;
          padding: 10px 16px !important;
          color: #1f2937 !important;
          text-decoration: none !important;
        }
        .item:hover {
          background: #d9e5fa !important;
          color: #1e3a8a !important;
        }
        .nested-panel {
          position: fixed !important;
          background: #e3ecfb !important;
          border-radius: 10px !important;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1) !important;
          min-width: 230px !important;
          top: 75px !important;
          left: 280px !important;
          padding: 8px 0 !important;
        }
        .hamburger {
          background: transparent !important;
          border: none !important;
          font-size: 26px !important;
          color: #1e40af !important;
          cursor: pointer !important;
        }
        .mobile-menu {
          background: #e3ecfb !important;
          border-top: 2px solid #dbeafe !important;
          padding: 10px 0 !important;
        }
        .m-item {
          display: block !important;
          padding: 12px 18px !important;
          color: #1f2937 !important;
          font-weight: 600 !important;
          text-decoration: none !important;
        }
        .m-item:hover {
          background: #d9e5fa !important;
          color: #1e3a8a !important;
        }
        .m-sub { padding-left: 12px !important; }
        @media (min-width: 768px) {
          .menu { display: flex !important; }
          .mobile, .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
