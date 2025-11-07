export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      textAlign: 'center',
      padding: '1.5rem 0',
      backgroundColor: '#f9fafb',
      color: '#6b7280',
      fontSize: '0.95rem',
      borderTop: '1px solid #e5e7eb',
      marginTop: '3rem'
    }}>
      <p>© {new Date().getFullYear()} LiveBackdrop. All rights reserved.</p>
    </footer>
  );
}
