const axios = require('axios');
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD7MlwbtsVYvT2PLgcc0v_tRBqVtKjfKwA';
axios.post(url, {
  contents: [{ parts: [{ text: 'Hello' }] }]
}).then(res => console.log('SUCCESS:', res.data.candidates[0].content.parts[0].text))
  .catch(err => console.log('ERROR:', err.response?.status, err.response?.data));
