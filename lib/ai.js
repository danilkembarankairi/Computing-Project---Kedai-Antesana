const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getAIRecommendation(userMessage, menuItems) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  // Format menu jadi string
  const menuList = menuItems
    .map(
      (m) =>
        `- ${m.name} (${m.category}): Rp ${m.price.toLocaleString("id-ID")}${
          m.description ? ` - ${m.description}` : ""
        }`,
    )
    .join("\n");

  const systemPrompt = `Kamu adalah asisten ramah di Kedai Antasena, kedai kopi di Purwokerto dengan harga pelajar (Rp 1.000 - 25.000). 
Tugas kamu: membantu pelanggan memilih menu yang cocok berdasarkan preferensi mereka.

ATURAN:
1. Jawab singkat, maksimal 3-4 kalimat
2. Rekomendasikan 2-3 menu yang paling cocok
3. Gunakan bahasa santai ala anak muda Banyumas
4. Jangan sebut harga kecuali ditanya
5. Kalau pertanyaan di luar konteks menu/kopi, arahkan kembali ke menu

DAFTAR MENU YANG TERSEDIA:
${menuList}

Jawab pertanyaan pelanggan dengan ramah dan helpful.`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
