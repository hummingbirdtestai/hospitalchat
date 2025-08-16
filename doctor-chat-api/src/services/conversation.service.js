import { supabase } from "../config/supabaseClient.js";

/**
 * Ensure a conversation exists for this patient.
 * If not found, create a new one.
 */
export async function getOrCreateConversation(patientId) {
  // 1. Make sure patient exists in profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", patientId)
    .single();

  if (profileError || !profile) {
    throw new Error(`Patient ${patientId} not found in profiles`);
  }

  // 2. Get latest conversation for this patient
  const { data: existingConv, error: convError } = await supabase
    .from("conversations")
    .select("*")
    .eq("patient_id", patientId)
    .order("last_updated", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (convError) throw new Error(`Error fetching conversation: ${convError.message}`);
  if (existingConv) return existingConv;

  // 3. If no conversation, create one
  const { data: newConv, error: newConvError } = await supabase
    .from("conversations")
    .insert([{ patient_id: patientId }])
    .select()
    .single();

  if (newConvError) throw new Error(`Error creating conversation: ${newConvError.message}`);

  return newConv;
}

/**
 * Get conversation history (all messages).
 */
export async function getConversationHistory(conversationId) {
  const { data, error } = await supabase
    .from("messages")
    .select("sender, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Error fetching messages: ${error.message}`);
  return data || [];
}

/**
 * Add a new message to conversation.
 * Also updates the conversation's last_updated timestamp.
 */
export async function addMessage(conversationId, sender, content) {
  const { error: insertError } = await supabase
    .from("messages")
    .insert([{ conversation_id: conversationId, sender, content }]);

  if (insertError) throw new Error(`Error inserting message: ${insertError.message}`);

  const { error: updateError } = await supabase
    .from("conversations")
    .update({ last_updated: new Date().toISOString() })
    .eq("id", conversationId);

  if (updateError) throw new Error(`Error updating conversation timestamp: ${updateError.message}`);
}
