#!/bin/bash
# Deploy AuraChat Backend na Oracle Cloud
# Execute no servidor Oracle via SSH

set -e

echo "🚀 Deploy AuraChat Backend..."

# Ir para diretório do projeto
cd /root/aurachat  # ou onde estiver o projeto

# Atualizar código
git pull origin main 2>/dev/null || echo "Sem git, usando código atual"

# Entrar no backend
cd backend

# Instalar dependências
npm install

# Parar processos antigos
pm2 stop aura-backend 2>/dev/null || true
pm2 delete aura-backend 2>/dev/null || true

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
GEMINI_KEY=AIzaSyBrJoggMLjThJGyPWO8WZXdaGA4lwCnMa4
SESSION_SECRET=aura-premium-secret-2024
VERCEL_API_URL=https://aurachat-client-coral.vercel.app
EOF
fi

# Iniciar com PM2
pm2 start index.js --name "aura-backend"

# Salvar configuração PM2
pm2 save
pm2 startup

echo ""
echo "✅ Backend iniciado!"
echo "📡 Status: pm2 status"
echo "📋 Logs: pm2 logs aura-backend"
echo "🌐 Acesse: http://$(curl -s ifconfig.me):3001"
