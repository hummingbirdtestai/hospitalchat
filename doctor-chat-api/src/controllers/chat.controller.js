import { getDoctorReply } from "../services/openai.service.js";
import { getOrCreateConversation, getConversationHistory, addMessage } from "../services/conversation.service.js";

export async function chatHandler(req, res, next) {
  try {
    const { patient_id, message } = req.body;
    if (!patient_id || !message) return res.status(400).json({ error: "Missing patient_id or message" });

    const conversation = await getOrCreateConversation(patient_id);
    await addMessage(conversation.id, "patient", message);

    const history = await getConversationHistory(conversation.id);
    const reply = await getDoctorReply(history, message);

    await addMessage(conversation.id, "doctor", reply);

    res.json({ reply });
  } catch (err) {
    next(err);
  }
}
