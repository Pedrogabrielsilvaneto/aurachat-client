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

# 1. Instalar pacotes NPM locais
echo "📦 Instalando as bibliotecas Node.js..."
npm install --force

# 2. Criando o .env baseado no template ou padrão necessário
echo "🔑 Verificando variáveis de ambiente..."
if [ ! -f .env ]; then
    cat > .env << 'EOF'
GEMINI_KEY=AIzaSyBrJoggMLjThJGyPWO8WZXdaGA4lwCnMa4
SESSION_SECRET=aura-premium-secret-2024
VERCEL_API_URL=https://aurachat-client-coral.vercel.app
EOF
    echo "📄 Arquivo .env criado com as credenciais padrão salvadoras."
fi

# 3. Parar instâncias perdidas
pm2 stop aura-backend 2>/dev/null || true
pm2 delete aura-backend 2>/dev/null || true

# 4. Iniciar via PM2
echo "🔥 Dando boot via PM2..."
pm2 start index.js --name "aura-backend"

# 5. Salvar na inicialização do sistema do Google
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $(whoami) --hp /home/$(whoami) 2>/dev/null || true

echo "=========================================================================="
echo "✅ Backend em execução! O WhatsApp (Sônia) iniciou o processo de ligar."
echo "Para ler o QR CODE ou ver os Logs do Backend cole este comando abaixo:"
echo ""
echo "pm2 logs aura-backend"
echo "=========================================================================="
