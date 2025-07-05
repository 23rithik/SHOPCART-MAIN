const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

router.post('/ai-chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

module.exports = router; // ✅ CommonJS export
