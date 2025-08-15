import { supabase } from "../config/supabaseClient.js";

export async function getOrCreateConversation(patientId) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("patient_id", patientId)
    .order("last_updated", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) return data;

  const { data: newConv } = await supabase
    .from("conversations")
    .insert({ patient_id: patientId })
    .select()
    .single();

  return newConv;
}

export async function getConversationHistory(conversationId) {
  const { data } = await supabase
    .from("messages")
    .select("sender, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return data || [];
}

export async function addMessage(conversationId, sender, content) {
  await supabase.from("messages").insert({ conversation_id: conversationId, sender, content });
}
