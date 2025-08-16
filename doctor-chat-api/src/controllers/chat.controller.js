import { getDoctorReply } from "../services/openai.service.js";
import {
  getOrCreateConversation,
  getConversationHistory,
  addMessage
} from "../services/conversation.service.js";
import { supabase } from "../config/supabaseClient.js";

export async function sendChat(req, res, next) {
  try {
    const { patient_id, message } = req.body;
    if (!patient_id || !message) {
      return res.status(400).json({ error: "Missing patient_id or message" });
    }

    // check profile exists
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", patient_id)
      .maybeSingle();

    if (profErr || !profile) {
      return res.status(400).json({ error: "Profile not found" });
    }

    // get/create conversation
    const conversation = await getOrCreateConversation(patient_id);

    // user message
    await addMessage(conversation.id, "user", message);

    // AI reply
    const reply = await getDoctorReply(message);

    // assistant message
    await addMessage(conversation.id, "assistant", reply);

    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const { conversation_id } = req.params;
    if (!conversation_id) {
      return res.status(400).json({ error: "Missing conversation_id" });
    }
    const history = await getConversationHistory(conversation_id);
    res.json(history);
  } catch (err) {
    next(err);
  }
}
