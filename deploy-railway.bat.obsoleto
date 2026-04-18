@echo off
echo 🚀 Deploy Backend no Railway
echo.

cd backend

echo 1. Instalando Railway CLI...
npm install -g @railway/cli

echo.
echo 2. Fazendo login (abra o navegador)...
railway login

echo.
echo 3. Iniciando projeto...
railway init

echo.
echo 4. Fazendo deploy...
railway up

echo.
echo ✅ Deploy concluído!
echo.
echo Agora configure as variáveis de ambiente no dashboard do Railway:
echo - GEMINI_KEY
echo - SESSION_SECRET  
echo - VERCEL_API_URL=https://aurachat-client-coral.vercel.app
