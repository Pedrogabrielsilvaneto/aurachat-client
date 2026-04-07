const axios = require('axios');
axios.get('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyD7MlwbtsVYvT2PLgcc0v_tRBqVtKjfKwA')
  .then(r => console.log('MODELS:', r.data.models.map(m => m.name).join(', ')))
  .catch(e => console.error('ERROR:', e.response?.data));
