import { useState, useEffect } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(false);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className="nav">
      <div className="container">
        <div className="brand">LiveBackdrop</div>

        {/* Desktop menu */}
        <div className="menu desktop">
          <a className="link" href="/">Home</a>

          <div
            className="dropdown"
            onMouseEnter={() => isDesktop && setAiOpen(true)}
            onMouseLeave={() => isDesktop && setAiOpen(false)}
          >
            <button className="link btn" onClick={() => !isDesktop && setAiOpen(v => !v)}>
              AI Tools ▾
            </button>

            {aiOpen && (
              <div className="panel">
                <a className="item" href="/ai/generate">Generate Background</a>
                <a className="item" href="/ai/upload">Upload &amp; Edit</a>

                <div
                  className="dropdown nested"
                  onMouseEnter={() => isDesktop && setSceneOpen(true)}
                  onMouseLeave={() => isDesktop && setSceneOpen(false)}
                >
                  <button className="item btn nestedBtn" onClick={() => !isDesktop && setSceneOpen(v => !v)}>
                    Scene Mode ▸
                  </button>

                  {sceneOpen && (
                    <div className="panel nestedPanel">
                      <a className="item" href="/scene/office">Office &amp; Meeting</a>
                      <a className="item" href="/scene/streaming">Streaming &amp; Studio</a>
                      <a className="item" href="/scene/indoor">Indoor Living</a>
                      <a className="item" href="/scene/outdoor">Outdoor &amp; Nature</a>
                      <a className="item" href="/scene/education">Education &amp; Presentation</a>
                      <a className="item" href="/scene/business">Business &amp; Brand</a>
                      <a className="item" href="/scene/creative">Creative &amp; Theme</a>
                      <a className="item" href="/scene/custom">Custom AI Mode</a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <a className="link" href="/pricing">Pricing</a>
          <a className="link" href="/gallery">Gallery</a>
          <a className="link" href="/about">About</a>
          <a className="link" href="/contact">Contact</a>
        </div>

        {/* Mobile toggle */}
        <button className="hamburger mobile" onClick={() => setIsOpen(v => !v)} aria-label="Menu">
          ☰
        </button>
      </div>

      {/* Mobile menu drawer */}
      {isOpen && (
        <div className="mobileDrawer mobile">
          <a className="mItem" href="/">Home</a>

          <button className="mItem btn" onClick={() => setAiOpen(v => !v)}>AI Tools ▾</button>
          {aiOpen && (
            <div className="mSub">
              <a className="mItem" href="/ai/generate">Generate Background</a>
              <a className="mItem" href="/ai/upload">Upload &amp; Edit</a>

              <button className="mItem btn" onClick={() => setSceneOpen(v => !v)}>Scene Mode ▾</button>
              {sceneOpen && (
                <div className="mSub">
                  <a className="mItem" href="/scene/office">Office &amp; Meeting</a>
                  <a className="mItem" href="/scene/streaming">Streaming &amp; Studio</a>
                  <a className="mItem" href="/scene/indoor">Indoor Living</a>
                  <a className="mItem" href="/scene/outdoor">Outdoor &amp; Nature</a>
                  <a className="mItem" href="/scene/education">Education &amp; Presentation</a>
                  <a className="mItem" href="/scene/business">Business &amp; Brand</a>
                  <a className="mItem" href="/scene/creative">Creative &amp; Theme</a>
                  <a className="mItem" href="/scene/custom">Custom AI Mode</a>
                </div>
              )}
            </div>
          )}

          <a className="mItem" href="/pricing">Pricing</a>
          <a className="mItem" href="/gallery">Gallery</a>
          <a className="mItem" href="/about">About</a>
          <a className="mItem" href="/contact">Contact</a>
        </div>
      )}

      <style jsx>{`
        .nav {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 16px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-weight: 800;
          font-size: 22px;
          color: #0f172a;
          letter-spacing: 0.2px;
        }
        .menu {
          display: flex;
          align-items: center;
          gap: 24px;
          font-weight: 600;
        }
        .link, .btn {
          background: transparent;
          border: 0;
          padding: 6px 2px;
          cursor: pointer;
          color: #374151;
          text-decoration: none;
        }
        .link:hover, .btn:hover {
          color: #2563eb;
        }

        /* Dropdown */
        .dropdown { position: relative; }
        .panel {
          position: absolute;
          top: 36px;
          left: 0;
          width: 240px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          padding: 8px 0;
        }
        .item {
          display: block;
          padding: 10px 14px;
          color: #374151;
          text-decoration: none;
          white-space: nowrap;
          background: transparent;
          border: 0;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        .item:hover { background: #f3f4f6; color: #1d4ed8; }

        /* Nested dropdown */
        .nested { position: relative; }
        .nestedBtn { width: 100%; text-align: left; }
        .nestedPanel {
          position: absolute;
          top: 0;
          left: 100%;
          margin-left: 6px;
          width: 280px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          padding: 8px 0;
        }

        /* Mobile */
        .hamburger {
          background: transparent;
          border: 0;
          font-size: 22px;
          color: #374151;
          cursor: pointer;
        }
        .mobileDrawer {
          border-top: 1px solid #e5e7eb;
          background: #ffffff;
          padding: 8px 0;
        }
        .mItem {
          display: block;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          font-weight: 600;
        }
        .mItem:hover { background: #f3f4f6; color: #1d4ed8; }
        .mSub { padding-left: 8px; }

        /* Visibility */
        .desktop { display: none; }
        .mobile { display: inline-flex; }

        @media (min-width: 768px) {
          .desktop { display: inline-flex; }
          .mobile { display: none; }
        }
      `}</style>
    </nav>
  );
}
