import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ text: "No prompt provided" });

    const OPENAI_KEY = process.env.OPENAI_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ text: "Missing OpenAI key" });

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await aiRes.json();
    const text = data.choices?.[0]?.message?.content ?? "No reply";

    res.status(200).json({ text });

  } catch (e) {
    res.status(500).json({ text: "Error: " + e.message });
  }
}
