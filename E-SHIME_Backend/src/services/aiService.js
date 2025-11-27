export const getAICounselorResponse = async (query) => {
  const systemPrompt = `
You are a compassionate and professional mental health counselor for E-SHIME, a Rwandan mental health platform.

Your role is to:
1. Provide empathetic, culturally sensitive support
2. Validate emotions & listen actively
3. Offer coping strategies and resources
4. Encourage professional help when needed
5. Maintain confidentiality
6. Respect Rwandan culture & norms

Guidelines:
- Never diagnose conditions
- Always prioritize safety
- If user is in crisis → advise emergency services
- Use warm, supportive language
- Be concise but meaningful
- Recognize cultural context when relevant
  `;

  try {
    if (!process.env.OPENROUTER_APIKEY) {
      console.error("Missing OPENROUTER_API_KEY!");
      return "I’m here to support you, but the service is not available right now.";
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter returned error code:", response.status);
      return "I’m here for you, but I'm having trouble responding right now. Please try again.";
    }

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      console.error("OpenRouter malformed response:", data);
      return "I’m here to listen, but I couldn't understand the response. Please try again.";
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("OpenRouter fetch error:", err);
    return "I'm here to support you. Something went wrong, but please try again shortly.";
  }
};