const https = require('https');

function makeRequest(host, path, method = 'GET', data = null, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: 443,
      path: path + (apiKey ? `?key=${apiKey}` : ''),
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = https.request(options, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(rawData);
        } catch (e) {
          parsedData = rawData;
        }
        resolve({ statusCode: res.statusCode, data: parsedData });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Get API key from .env
const fs = require('fs');
const envContent = fs.readFileSync('./.env', 'utf8');
const apiKeyLine = envContent.split('\n').find(line => line.startsWith('GEMINI_KEY='));
const API_KEY = apiKeyLine ? apiKeyLine.split('=')[1].trim() : '';

console.log('Using API key:', API_KEY.substring(0, 10) + '...');

// Try different API versions and endpoints
const testEndpoints = [
  { version: 'v1', path: '/models' },
  { version: 'v1beta', path: '/models' }
];

testEndpoints.forEach(endpoint => {
  makeRequest('generativelanguage.googleapis.com', endpoint.path, 'GET', null, API_KEY)
    .then(result => {
      console.log(`\n${endpoint.version} /models:`);
      console.log(`Status: ${result.statusCode}`);
      if (result.statusCode === 200 && result.data && result.data.models) {
        console.log('Available models:');
        result.data.models.forEach(model => {
          console.log(`- ${model.name}`);
          if (model.supportedGenerationMethods) {
            console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
          }
        });
      } else {
        console.log('Error or no models:', result.data);
      }
    })
    .catch(err => {
      console.log(`\n${endpoint.version} /models failed:`, err.message);
    });
});

// Try to get a specific model that might work
const testModels = [
  'gemini-1.5-flash',
  'gemini-1.5-pro', 
  'gemini-1.0-pro',
  'gemini-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro'
];

console.log('\n=== Testing specific models ===');
testModels.forEach(modelName => {
  makeRequest('generativelanguage.googleapis.com', `/v1beta/models/${modelName}:generateContent`, 'POST', {
    contents: [{
      role: 'user',
      parts: [{ text: 'Hello' }]
    }]
  }, API_KEY)
    .then(result => {
      console.log(`\n${modelName} (v1beta):`);
      console.log(`Status: ${result.statusCode}`);
      if (result.statusCode === 200) {
        console.log('✅ SUCCESS');
      } else {
        console.log('❌ Failed:', result.data?.error?.message || result.data);
      }
    })
    .catch(err => {
      console.log(`\n${modelName} (v1beta) failed:`, err.message);
    });
});