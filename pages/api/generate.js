export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt, size = '1024x1024' } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ message: 'Missing prompt' });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ message: 'OPENAI_API_KEY is not set on the server.' });
  }

  try {
    // Fallback: ensure size is supported
    const allowed = ['1024x1024','1024x576','768x1024'];
    const finalSize = allowed.includes(size) ? size : '1024x1024';

    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: finalSize,
        response_format: 'b64_json'
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(500).json({ message: 'OpenAI error', detail: txt });
    }

    const json = await resp.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ message: 'No image returned from API.' });
    }

    const dataUrl = `data:image/png;base64,${b64}`;
    return res.status(200).json({ image: dataUrl });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', detail: String(err) });
  }
}
