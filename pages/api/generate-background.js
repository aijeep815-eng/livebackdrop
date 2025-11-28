import { useState } from "react";

export default function AIBackground() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to generate background.");
      } else {
        setImageUrl(data.imageUrl);
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        AI Background Generator
      </h1>

      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your background description..."
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "12px",
          padding: "10px 20px",
          background: loading ? "#888" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Background"}
      </button>

      {errorMsg && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "#ffe5e5",
            border: "1px solid #ff8b8b",
            color: "#cc0000",
            borderRadius: "6px",
            whiteSpace: "pre-wrap", // 🔥 保证换行完整显示
          }}
        >
          {errorMsg}
        </div>
      )}

      {imageUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3>Generated Background:</h3>
          <img
            src={imageUrl}
            alt="Generated Background"
            style={{
              width: "100%",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
}
