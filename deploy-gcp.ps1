# =========================================================================
# SCRIPT DE PREPARAÇÃO PARA DEPLOY NO GOOGLE CLOUD (GCP)
# Este script automatiza a criação do pacote backend.zip para upload.
# =========================================================================

$BackendPath = "./backend"
$ZipName = "backend.zip"

Write-Host "🚀 Iniciando preparação do pacote para Google Cloud..." -ForegroundColor Cyan

# 1. Verificar se a pasta backend existe
if (-not (Test-Path $BackendPath)) {
    Write-Host "❌ Erro: Pasta 'backend' não encontrada no diretório atual!" -ForegroundColor Red
    exit
}

# 2. Remover zip antigo se existir
if (Test-Path $ZipName) {
    Write-Host "🧹 Removendo arquivo $ZipName antigo..." -ForegroundColor Yellow
    Remove-Item $ZipName
}

# 3. Criar ZIP ignorando node_modules
Write-Host "📦 Compactando backend - ignorando node_modules para ser mais rápido..." -ForegroundColor Green

# Criar um diretório temporário para o zip (sem node_modules)
$TempDir = "temp_backend_deploy"
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
New-Item -ItemType Directory -Path $TempDir | Out-Null

Copy-Item -Path "$BackendPath\*" -Destination $TempDir -Recurse -Exclude "node_modules", "baileys_auth_info" -Force

# Adicionar scripts de automação ao ZIP também para facilitar
Copy-Item -Path "./setup-gcp.sh" -Destination $TempDir
Copy-Item -Path "./start-gcp.sh" -Destination $TempDir

Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipName -Force

# Limpar temp
Remove-Item -Recurse -Force $TempDir

Write-Host "✅ SUCESSO! O arquivo '$ZipName' está pronto para decolar." -ForegroundColor Green
Write-Host "---------------------------------------------------------"
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Abra o Terminal SSH no Google Cloud (no seu navegador)."
Write-Host "2. Clique no ícone de 'Seta para Cima' (Upload) no canto superior direito."
Write-Host "3. Selecione o arquivo '$ZipName' que acabamos de criar."
Write-Host "4. No terminal SSH do Google, rode o comando:"
Write-Host "   unzip backend.zip -d ~/ && bash setup-gcp.sh && bash start-gcp.sh" -ForegroundColor Cyan
Write-Host "5. MIRE O QR CODE PELO WHATSAPP!"
Write-Host "---------------------------------------------------------"
