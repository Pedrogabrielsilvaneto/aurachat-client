#!/bin/bash
# ==========================================================================
# Inicialização PM2 para o AuraChat Backend
# Execute este arquivo DENTRO do Google Cloud após transferir a pasta backend
# ==========================================================================

echo "🚀 Iniciando o serviço do AuraChat Backend..."

# 0. Verificação de Arquivos Enviados
if [ -f ~/backend.zip ]; then
    echo "📦 ZIP detectado no diretório base. Descompactando..."
    mkdir -p ~/aura-system/backend
    unzip -o ~/backend.zip -d ~/aura-system/backend/
    # Opcional: remover o zip após unzipping para limpar
    # rm ~/backend.zip
fi

cd ~/aura-system/backend || { echo "❌ Erro: Pasta 'backend' não encontrada."; exit 1; }

# 2. Configurar Backend
echo "⚙️ Configurando Backend..."
cd ~/aura-system/backend
npm install --force
if [ ! -f .env ]; then
    cat > .env << 'EOF'
GEMINI_KEY=AIzaSyBrJoggMLjThJGyPWO8WZXdaGA4lwCnMa4
SESSION_SECRET=aura-premium-secret-2024
EOF
    echo "📄 Arquivo .env criado."
fi

# 3. Build do Frontend (Opcional se já estiver no /public)
if [ -d ~/aura-system/frontend/src ]; then
    echo "🏗️ Construindo Frontend no servidor..."
    cd ~/aura-system/frontend
    npm install --force
    npm run build
    rm -rf ../backend/public/*
    cp -r dist/* ../backend/public/
    echo "✅ Frontend compilado e movido para backend/public"
fi

# 4. Parar instâncias e reiniciar
echo "🔥 Reiniciando PM2..."
cd ~/aura-system/backend
pm2 stop aura-backend 2>/dev/null || true
pm2 delete aura-backend 2>/dev/null || true
pm2 start index.js --name "aura-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $(whoami) --hp /home/$(whoami) 2>/dev/null || true


echo "=========================================================================="
echo "✅ Backend em execução! O WhatsApp (Sônia) iniciou o processo de ligar."
echo "Para ler o QR CODE ou ver os Logs do Backend cole este comando abaixo:"
echo ""
echo "pm2 logs aura-backend"
echo "=========================================================================="
