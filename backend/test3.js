const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const key = process.env.OPENAI_API_KEY || 'AIzaSyD7MlwbtsVYvT2PLgcc0v_tRBqVtKjfKwA';
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key;
const payload = {
   contents: [{ parts: [{ text: "oi" }] }],
   system_instruction: { parts: [{ text: "Você é a Aura" }] },
   generationConfig: { temperature: 0.7 }
};
console.log('Sending payload...', JSON.stringify(payload));
axios.post(url, payload)
  .then(res => console.log('SUCCESS:', res.data.candidates[0].content.parts[0].text))
  .catch(err => console.log('ERROR:', err.response?.status, err.response?.data));
