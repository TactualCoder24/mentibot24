const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';
const HF_API_KEY = process.env.HF_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const { input } = req.body;

    const response = await axios.post(HF_API_URL, {
      inputs: `You are an expert Model UN speech and debate advisor. Please provide responses that:
        1. Use formal diplomatic language
        2. Incorporate relevant UN frameworks and resolutions
        3. Suggest specific examples and evidence
        4. Maintain a balanced and diplomatic tone
        5. Follow proper MUN protocol and etiquette

        User: ${input}`,
      parameters: {
        temperature: 0.7,
        max_new_tokens: 1000
      }
    }, {
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data[0].generated_text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
