import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getDoctorReply(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You are a helpful medical assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 200
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI error:", err);
    return "⚠️ Sorry, I couldn’t process your request right now.";
  }
}

