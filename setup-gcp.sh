#!/bin/bash
# ==========================================================================
# Script ÚNICO de Configuração AURA para Google Cloud (Ubuntu)
# Executa a Instalação e Roda o Sistema!
# ==========================================================================

echo "🚀 Iniciando configuração completa AURA no Google Cloud (GCP)..."

# 1. Atualizar e instalar utilitários
echo "📦 Atualizando pacotes e instalando utilitários (unzip)..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y unzip

# 2. Abrir a porta 3001 no firewall interno do Ubuntu e 22 para SSH
echo "🛡️ Configurando UFW (Firewall Interno)..."
sudo ufw allow ssh
sudo ufw allow 3001/tcp
sudo ufw --force enable

# 3. Instalar Node.js 20
if ! command -v node >/dev/null 2>&1; then
    echo "🟢 Instalando Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 4. Instalar PM2 globalmente
if ! command -v pm2 >/dev/null 2>&1; then
    echo "🌕 Instalando PM2..."
    sudo npm install -g pm2
fi

# 5. Criar diretório do app
echo "📁 Preparando diretório /home/aura/backend ..."
mkdir -p ~/aura-system/backend
cd ~/aura-system

echo "=========================================================================="
echo "✅ Ambiente Base Preparado e Atualizado com Sucesso!"
echo "📡 A porta 3001 está liberada internamente."
echo ""
echo "PRÓXIMO PASSO:"
echo "Faça o upload da pasta 'backend' para o diretório ~/aura-system/backend"
echo "Usando o script deploy-gcp.ps1 da sua máquina."
echo "=========================================================================="
