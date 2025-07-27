export default async function handler(req, res) {
  const apiKey = process.env.GEMMA_API_KEY;
  const { prompt, message } = req.body;

  const fullText = `${prompt}\n\n${message}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent?key=${apiKey}`;

  try {
    const aiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullText }]
          }
        ]
      })
    });
    const data = await aiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghubungi Gemma API" });
  }
}
