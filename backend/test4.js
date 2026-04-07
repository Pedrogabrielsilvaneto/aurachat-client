const axios = require('axios');
const fs = require('fs');
const key = 'AIzaSyD7MlwbtsVYvT2PLgcc0v_tRBqVtKjfKwA';
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key;
const payload = {
   contents: [{ parts: [{ text: "oi" }] }]
};
console.log('Sending regular payload...');
axios.post(url, payload)
  .then(res => console.log('SUCCESS:', res.data.candidates[0].content.parts[0].text))
  .catch(err => console.log('ERROR:', err.response?.status, err.response?.data));
