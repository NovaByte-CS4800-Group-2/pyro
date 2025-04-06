import express from 'express';
import { getResponse } from '../functions/chat_functions.js';

const router = express.Router();

router.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const reply = await getResponse(message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("NovaBot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;