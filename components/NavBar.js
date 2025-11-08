import Link from 'next/link'
import { useState } from 'react'

export default function NavBar() {
  const [openTools, setOpenTools] = useState(false);
  const [openScene, setOpenScene] = useState(false);

  // Inline styles to neutralize external CSS interference
  const barStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap'
  };

  const dropdownStyle = (open) => ({
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#ffffff',
    color: '#1e40af',
    borderRadius: '0.5rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    minWidth: '14rem',
    zIndex: 50
  });

  const subStyle = (open) => ({
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: '100%',
    backgroundColor: '#ffffff',
    color: '#1e40af',
    borderRadius: '0.5rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    minWidth: '16rem',
    zIndex: 50
  });

  const linkCls = "px-4 py-2 hover:bg-blue-100";
  const topLinkCls = "font-semibold hover:text-blue-300";

  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div style={barStyle}>
          <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-300">
            LiveBackdrop
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setOpenTools(true)}
            onMouseLeave={() => { setOpenTools(false); setOpenScene(false); }}
          >
            <button className={topLinkCls}>AI Tools ▾</button>
            <div style={dropdownStyle(openTools)}>
              <Link href="/generate" className={linkCls}>Generate Background</Link>
              <Link href="/upload" className={linkCls}>Upload & Edit</Link>

              <div
                className="relative"
                onMouseEnter={() => setOpenScene(true)}
                onMouseLeave={() => setOpenScene(false)}
              >
                <button className="text-left px-4 py-2 font-semibold hover:bg-blue-100">
                  Scene Mode ▸
                </button>
                <div style={subStyle(openScene)}>
                  <a href="#" className={linkCls}>Office & Meeting</a>
                  <a href="#" className={linkCls}>Streaming & Studio</a>
                  <a href="#" className={linkCls}>Indoor Living</a>
                  <a href="#" className={linkCls}>Outdoor & Nature</a>
                  <a href="#" className={linkCls}>Education & Presentation</a>
                  <a href="#" className={linkCls}>Business & Brand</a>
                  <a href="#" className={linkCls}>Creative & Theme</a>
                  <a href="#" className={linkCls}>Custom AI Mode</a>
                </div>
              </div>
            </div>
          </div>

          <Link href="/pricing" className={topLinkCls}>Pricing</Link>
          <Link href="/gallery" className={topLinkCls}>Gallery</Link>
          <Link href="/about" className={topLinkCls}>About</Link>
          <Link href="/contact" className={topLinkCls}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}
