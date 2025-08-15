import axios from "axios";
import { config } from "../config/env.js";

const SYSTEM_PROMPT = `
You are Dr. Chiranjeevi, an experienced physician.
Ask relevant history, follow up, give differential diagnoses, and suggest investigations.
Be empathetic. Mix English and Telugu if the patient does so.
`;

export async function getDoctorReply(history, patientMessage) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.sender === "doctor" ? "assistant" : "user",
      content: m.content
    })),
    { role: "user", content: patientMessage }
  ];

  const resp = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini", // Replace with gpt-5-mini once available
      messages,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${config.openaiApiKey}`,
        "Content-Type": "application/json"
      }
    }
  );

  return resp.data.choices[0].message.content;
}
