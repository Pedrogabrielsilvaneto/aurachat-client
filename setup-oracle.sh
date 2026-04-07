#!/bin/bash

# ==========================================================================
# Script de Configuração AURA para Oracle Cloud (Ubuntu & Oracle Linux)
# Portas: 3000 (Frontend) e 3001 (Backend)
# ==========================================================================

echo "🚀 Iniciando configuração AURA na Oracle VPS..."

# 1. Detectar o SO e abrir Portas no Firewall local
if command -v firewall-cmd >/dev/null 2>&1; then
    echo "🛡️ Detectado Oracle Linux (firewalld)..."
    sudo firewall-cmd --permanent --add-port=3000/tcp
    sudo firewall-cmd --permanent --add-port=3001/tcp
    sudo firewall-cmd --reload
elif command -v ufw >/dev/null 2>&1; then
    echo "🛡️ Detectado Ubuntu (ufw)..."
    sudo ufw allow 3000/tcp
    sudo ufw allow 3001/tcp
    sudo ufw --force enable
else
    echo "🛡️ Firewall local não encontrado ou gerenciado de outra forma."
fi

# 2. Instalar Node.js 20 (se não houver)
if ! command -v node >/dev/null 2>&1; then
    echo "🟢 Instalando Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs || sudo yum install -y nodejs
fi

# 3. Instalar PM2 para manter o processo vivo
if ! command -v pm2 >/dev/null 2>&1; then
    echo "🌕 Instalando PM2..."
    sudo npm install -g pm2
fi

echo "✅ Firewall Local configurado!"
echo "--------------------------------------------------------------------------"
echo "⚠️  IMPORTANTE: Agora você PRECISA abrir no Painel da Oracle Cloud:"
echo "1. Vá em Redes Virtuais (VCN) -> Listas de Segurança (Security Lists)"
echo "2. Adicione Regras de Entrada (Ingress Rules):"
echo "   - Porta 3000 (TCP) - Origem 0.0.0.0/0"
echo "   - Porta 3001 (TCP) - Origem 0.0.0.0/0"
echo "--------------------------------------------------------------------------"
echo "Para iniciar o Backend:"
echo "cd backend && npm install && pm2 start index.js --name 'aura-backend'"
echo "--------------------------------------------------------------------------"
echo "Para iniciar o Frontend:"
echo "cd frontend && npm install && pm2 start 'npm run dev' --name 'aura-frontend'"
