import express from 'express';
import { getResponse } from '../functions/chat_functions.js';

const router = express.Router();


/**
 * @route POST /chatbot
 * @description Handles incoming chatbot messages and returns a reply
 * @param {string} req.body.message - The user's message to the chatbot
 * @returns {Object} 200 - JSON object with chatbot reply
 * @returns {Object} 400 - If message is missing
 * @returns {Object} 500 - On internal server error
 */
router.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required." });

  try {
    const reply = await getResponse(message);
    res.status(200).json({ reply });

  } catch (error) {
    console.error("NovaBot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;