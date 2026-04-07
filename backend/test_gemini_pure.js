const axios = require('axios');
const API_KEY = 'AIzaSyD7MlwbtsVYvT2PLgcc0v_tRBqVtKjfKwA';
const payload = { contents: [{ role: 'user', parts: [{ text: 'Oi, Sonia, tudo bem?' }] }] };

async function test() {
  console.log("--- INICIANDO TESTE GEMINI V1 ---");
  try {
    const res = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, payload);
    console.log("✅ SUCESSO!", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("❌ ERRO V1:", err.response?.status, JSON.stringify(err.response?.data, null, 2));
  }

  console.log("--- TESTANDO V1BETA ---");
  try {
    const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, payload);
    console.log("✅ SUCESSO BETA!", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log("❌ ERRO BETA:", err.response?.status, JSON.stringify(err.response?.data, null, 2));
  }
}
test();
