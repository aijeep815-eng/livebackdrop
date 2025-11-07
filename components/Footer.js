export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      textAlign: 'center',
      backgroundColor: '#E8F1FB',
      color: '#374151',
      padding: '2rem 1rem',
      borderTop: '1px solid #d1d5db',
      marginTop: '3rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <p>© {new Date().getFullYear()} LiveBackdrop. All rights reserved.</p>
      </div>

      {/* SEO 关键词行 */}
      <div style={{
        fontSize: '0.85rem',
        color: '#6B7280',
        maxWidth: '900px',
        margin: '0 auto',
        lineHeight: '1.5',
      }}>
        <p>
          AI Virtual Background ｜ Live Stream Backdrops ｜ Virtual Studio ｜ AI Background Generator ｜ Zoom Backgrounds ｜ 
          Office Meeting Background ｜ Real-Time AI Backdrop ｜ Outdoor Nature Scene ｜ Creative Studio ｜ Custom AI Background
        </p>
      </div>
    </footer>
  );
}
