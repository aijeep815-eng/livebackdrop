import dynamic from 'next/dynamic';

// 动态加载 NavBar，防止构建时全局干扰
const NavBar = dynamic(() => import('@/components/NavBar'), { ssr: false });

export default function DebugPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      padding: '40px',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#1e3a8a', marginBottom: '20px' }}>Debug Mode: Clean NavBar Test</h1>
      <p style={{ color: '#475569', marginBottom: '40px' }}>
        This page ignores global styles and layouts. Only the NavBar component is loaded.
      </p>
      <div style={{ border: '2px dashed #93c5fd', padding: '20px' }}>
        <NavBar />
      </div>
    </div>
  );
}
