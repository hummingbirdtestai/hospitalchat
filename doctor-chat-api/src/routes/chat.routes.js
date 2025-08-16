import express from "express";
import { sendChat, getHistory } from "../controllers/chat.controller.js";

const router = express.Router();

// 👇 only relative paths here
router.post("/", sendChat);  
router.get("/conversations/:conversation_id", getHistory);

export default router;
