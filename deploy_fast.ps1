# deploy_fast.ps1 - Deploy Instantâneo para Pereira Acabamentos
# Este script faz tudo: Commit, Push e Deploy via SSH manual.

$IP = "34.19.0.191"
$USER = "pedrogabrielsilvaneto"
$KEY = "./gcp_key"

Write-Host "🚀 Iniciando Push & Deploy Automático..." -ForegroundColor Cyan

# 1. Git Push
Write-Host "📤 Enviando código para o GitHub..." -ForegroundColor Green
git add .
git commit -m "Deploy automático: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin master

# 2. Comando Remoto
Write-Host "⚡ Executando comandos no servidor GCP ($IP)..." -ForegroundColor Yellow
$RemoteCmd = @"
  cd ~/aura-system
  git pull origin master
  cd frontend && npm install && npm run build
  cd ../backend && npm install --production
  pm2 restart aura-backend --update-env
  echo '✅ DEPLOY FINALIZADO NO SERVIDOR!'
"@

# Tenta executar SCP/SSH. Nota: Requer que o OpenSSH esteja instalado no Windows.
ssh -i $KEY -o StrictHostKeyChecking=no "$USER@$IP" $RemoteCmd

Write-Host "✨ Tudo pronto! Sistema Pereira Acabamentos atualizado." -ForegroundColor Cyan
