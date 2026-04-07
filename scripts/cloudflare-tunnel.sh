#!/bin/bash
# Configurar Cloudflare Tunnel para AuraChat
# Execute este script no servidor Oracle via SSH

echo "🚀 Configurando Cloudflare Tunnel..."

# 1. Baixar cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# 2. Autenticar (você precisará do token do túnel)
echo ""
echo "📋 Depois de criar o túnel no Cloudflare Dashboard:"
echo "1. Acesse: https://dash.cloudflare.com"
echo "2. Vá em Networks > Tunnels"
echo "3. Crie um túnel e copie o TOKEN"
echo "4. Cole o TOKEN aqui:"
read -p "TOKEN: " TUNNEL_TOKEN

# 5. Criar serviço systemd
cat > /etc/systemd/system/cloudflared.service << 'EOF'
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloudflared tunnel --no-autoupdate run --token=PASTE_TOKEN_HERE
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
EOF

# Substituir TOKEN no serviço
sed -i "s/PASTE_TOKEN_HERE/$TUNNEL_TOKEN/" /etc/systemd/system/cloudflared.service

# 6. Iniciar
systemctl enable cloudflared
systemctl start cloudflared
systemctl status cloudflared

echo ""
echo "✅ Cloudflare Tunnel iniciado!"
echo "📡 URL do túnel: https://SEU_SUBDOMINIO.cloudflarepubsub.com"
