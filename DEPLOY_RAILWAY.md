# Deploy Backend Railway (2 minutos)

## Passo 1: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

## Passo 2: Login
```bash
railway login
```

## Passo 3: Deploy
```bash
cd backend
railway init
railway up
```

## Passo 4: Configurar Variáveis de Ambiente
No dashboard do Railway, adicione:
- `GEMINI_KEY` = sua chave da API Gemini
- `SESSION_SECRET` = uma chave secreta aleatória
- `VERCEL_API_URL` = https://aurachat-client-coral.vercel.app

## Passo 5: Obter URL do Backend
Após deploy, o Railway fornecerá uma URL como:
`https://aurachat-backend.up.railway.app`

## Passo 6: Atualizar Frontend
No arquivo `frontend/src/App.jsx`, altere a linha:
```javascript
const API_URL = '/api'; 
```
para:
```javascript
const API_URL = 'https://aurachat-backend.up.railway.app'; 
```

## Passo 7: Redeploy Frontend
```bash
cd frontend
vercel --prod
```
