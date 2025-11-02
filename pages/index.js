import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #d4fc79, #96e6a1)',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ marginBottom: '10px' }}>LiveBackdrop AI</h1>
      <p style={{ marginBottom: '20px' }}>Upload an image to generate a custom live background</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: '20px' }}
      />
      {preview && (
        <div>
          <h3>Preview:</h3>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '400px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}
          />
        </div>
      )}
    </div>
  );
}
