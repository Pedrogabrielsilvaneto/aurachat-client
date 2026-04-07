#!/bin/bash

echo "🚀 Deploy AURA Backend na Oracle VPS..."

# Ir para diretório do backend
cd backend

# Instalar dependências
npm install

# Parar processo antigo se existir
pm2 stop aura-backend 2>/dev/null || true
pm2 delete aura-backend 2>/dev/null || true

# Iniciar com PM2
pm2 start index.js --name "aura-backend"

# Salvar para reiniciar automaticamente
pm2 save

# Status
pm2 status

echo "✅ Backend iniciado!"
echo "📡 Acesse: http://SEU_IP_ORACLE:3001"
