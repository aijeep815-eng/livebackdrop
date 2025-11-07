import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function DropdownPortal({ open, anchorRef, onClose, children, width=260 }) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const elRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const left = Math.min(rect.left, window.innerWidth - width - 12);
    setPos({ top, left });
  }, [open, anchorRef, width]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => onClose?.();
    const onResize = () => onClose?.();
    const onClickAway = (e) => {
      if (!elRef.current) return;
      if (!elRef.current.contains(e.target) && !anchorRef.current?.contains(e.target)) onClose?.();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onClickAway);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onClickAway);
    };
  }, [open, onClose, anchorRef]);

  if (!mounted || !open) return null;

  const panel = (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width,
        background: 'rgba(255, 0, 0, 0.3)', // 红色透明背景用于定位
        borderRadius: 10,
        boxShadow: '0 10px 24px rgba(0,0,0,.12)',
        border: '1px solid red',
        zIndex: 999999,
        padding: '10px'
      }}
    >
      {children}
    </div>
  );
  return createPortal(panel, document.body);
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);

  const aiBtnRef = useRef(null);
  const sceneBtnRef = useRef(null);

  return (
    <nav className="lb-nav">
      <div className="lb-wrap">
        <div className="lb-brand">LiveBackdrop</div>
        <div className="lb-menu">
          <a className="lb-link" href="/">Home</a>
          <button ref={aiBtnRef} className="lb-link lb-btn" onClick={() => { setAiOpen(v=>!v); setSceneOpen(false); }}>AI Tools ▾</button>
          <DropdownPortal open={aiOpen} anchorRef={aiBtnRef} onClose={() => setAiOpen(false)} width={260}>
            <a className="lb-item" href="/ai/generate">Generate Background</a>
            <a className="lb-item" href="/ai/upload">Upload & Edit</a>
            <button ref={sceneBtnRef} className="lb-item lb-btn" onClick={() => setSceneOpen(v=>!v)}>Scene Mode ▸</button>
          </DropdownPortal>
          <DropdownPortal open={sceneOpen} anchorRef={sceneBtnRef} onClose={() => setSceneOpen(false)} width={280}>
            <a className="lb-item" href="/scene/office">Office & Meeting</a>
            <a className="lb-item" href="/scene/streaming">Streaming & Studio</a>
            <a className="lb-item" href="/scene/indoor">Indoor Living</a>
            <a className="lb-item" href="/scene/outdoor">Outdoor & Nature</a>
            <a className="lb-item" href="/scene/education">Education & Presentation</a>
            <a className="lb-item" href="/scene/business">Business & Brand</a>
            <a className="lb-item" href="/scene/creative">Creative & Theme</a>
            <a className="lb-item" href="/scene/custom">Custom AI Mode</a>
          </DropdownPortal>
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
          <button className="lb-m lb-btn" onClick={() => setAiOpen(v=>!v)}>AI Tools ▾</button>
          {aiOpen && (
            <div className="lb-sub">
              <a className="lb-m" href="/ai/generate">Generate Background</a>
              <a className="lb-m" href="/ai/upload">Upload & Edit</a>
              <button className="lb-m lb-btn" onClick={() => setSceneOpen(v=>!v)}>Scene Mode ▾</button>
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
        .lb-nav { width: 100%; background: white; border-bottom: 2px solid #dbeafe; }
        .lb-wrap { max-width: 1200px; margin: 0 auto; height: 70px; display: flex; align-items: center; justify-content: space-between; }
        .lb-brand { font-weight: bold; font-size: 22px; color: #1e3a8a; }
        .lb-menu { display: none; gap: 20px; align-items: center; }
        .lb-link { color: #1e40af; text-decoration: none; font-weight: 600; padding: 8px 10px; border-radius: 6px; background: transparent; border: 0; cursor: pointer; }
        .lb-link:hover { color: #2563eb; background: #eff6ff; }
        .lb-ham { background: transparent; border: 0; font-size: 24px; color: #1e40af; cursor: pointer; }
        .lb-item { display: block; padding: 10px 14px; color: #1f2937; text-decoration: none; font-weight: 600; }
        .lb-item:hover { background: rgba(255,0,0,0.2); color: #1e3a8a; }
        .lb-drawer { background: #E3ECFB; border-top: 2px solid #dbeafe; padding: 8px 0; }
        .lb-m { display: block; padding: 12px 16px; color: #1f2937; text-decoration: none; font-weight: 600; }
        .lb-m:hover { background: rgba(255,0,0,0.2); color: #1e3a8a; }
        .lb-sub { padding-left: 12px; }
        @media(min-width:768px) { .lb-menu{display:flex;} .lb-ham,.lb-drawer{display:none;} }
      `}</style>
    </nav>
  );
}
