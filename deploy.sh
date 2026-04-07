#!/bin/bash
# deploy.sh - Script para fazer deploy no Servidor (Oracle Cloud)

# 1. Envia os arquivos para o servidor
# 2. Instala as dependências
# 3. Inicia o backend

SERVER_USER="opc"
SERVER_HOST="147.15.40.68"
SERVER_PATH="/home/opc/aura"

echo "🚀 Preparando deploy para $SERVER_HOST..."

# Compactar arquivos (ignorando node_modules e dist)
tar --exclude='node_modules' --exclude='dist' -czvf aura-deploy.tar.gz ./

echo "📤 Enviando arquivos para o servidor..."
scp aura-deploy.tar.gz $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

echo "🔨 Executando remote commands..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
  cd $SERVER_PATH
  tar -xzvf aura-deploy.tar.gz
  cd backend
  npm install --production
  cd ../frontend
  npm install
  npm run build
  pm2 stop all || true
  pm2 start index.js --name aura-backend
EOF

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://147.15.40.68:3000"
