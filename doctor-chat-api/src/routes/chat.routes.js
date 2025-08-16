import express from "express";
import { sendChat, getHistory } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/chat", sendChat);
router.get("/conversations/:conversation_id", getHistory);

export default router;
