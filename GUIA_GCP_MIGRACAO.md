# 🚀 Missão Especial: Plano de Fuga para o Google Cloud (GCP)

Esta é a sua rota de migração para sairmos do Oracle Cloud caótico e transferirmos perfeitamente toda a operação pesada do seu WhatsApp para o Google de forma gratuita permanente.

Siga os passos e tudo funcionará automaticamente.

---

### Passo 1: Ligar a Máquina Virtual de Graça
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e faça login.
2. No menu esquerdo, vá em **Compute Engine > Instâncias de VM**.
3. Clique em **Criar Instância**.
4. Siga ESTRITAMENTE essas opções para que o servidor saia de graça (`Always Free`):
   - **Nome:** `aura-backend-v3`
   - **Região:** `us-west1` (Oregon).
   - **Série da Máquina:** Clique na Aba `E2`.
   - **Tipo de Máquina:** Selecione `e2-micro (2 vCPU, 1 GB de memória)`.
   - **SO / Disco de Inicialização:** Ubuntu 22.04 LTS.
   - **IP Externo:** `136.118.48.181` (Já detectado)
   - **Série da Máquina:** Mude para e clique na Aba `E2`.
   - **Tipo de Máquina:** Selecione `e2-micro (2 vCPU, 1 GB de memória)`.
   - **SO / Disco de Inicialização:** Clique em Alterar > Selecione **Ubuntu**, versão `20.04 LTS` ou `22.04 LTS`.
5. Selecione **Permitir tráfego HTTP** e **Permitir tráfego HTTPS**.
6. Clique em **Criar**. 

O Google já criou sua máquina. Ela está com o IP: `136.118.48.181`.
Ao lado da máquina, clique no botão **SSH** para abrir o terminal.

---

### Passo 2: O Desbloqueio da Porta Secreta (Firewall da Nuvem)
*Na Oracle fazer isso era um pesadelo, aqui é fácil.*
1. Vá na lupa de pesquisa superior do Google Cloud e pesquise: `Regras de Firewall` (Selecione a que estiver sob Rede VPC).
2. Clique em **Criar REGRA DE FIREWALL** no menu do topo.
   - **Nome:** `abrir-porta-aura`
   - **Direção do tráfego:** Entrada
   - **Ação:** Permitir
   - **Destinos:** Todas as instâncias na rede
   - **Intervalos IPv4 de origem:** Digite `0.0.0.0/0` e dê Enter (Liberar tráfego geral).
   - **Protocolos e portas:** Marque a caixa *TCP* e digite: `3001`
3. Clique em **Criar**. Pronto! O tubo blindado pro Vercel conectar está ativo.

---

### Passo 3: O Terminal do Google (Executando a Mestra)
1. Volte em **Compute Engine > Instâncias de VM**.
2. Na linha da sua máquina `aura-backend`, você vai ver um botão chamado **SSH**. Clique nele! Vai abrir uma tela preta no seu navegador.
3. Copie o script mestre abaixo, cole nesse terminal e dê Enter:

```bash
1. No terminal SSH, você pode simplesmente baixar os scripts que já preparei ou fazer o upload manual.
2. Como os arquivos já estão prontos na sua máquina, recomendo o **Upload** (Ícone da Seta pra Cima no SSH):
   - Upload `setup-gcp.sh`
   - Upload `start-gcp.sh`
3. Depois, rode os comandos de instalação:
```bash
bash setup-gcp.sh
```
```

---

### Passo 4: Upar seu Sistema pro Google Cloud (Modo Turbo)

Agora vamos usar o formato mais robusto para Linux:

1. No seu terminal (PowerShell ou CMD) aqui no computador, rode:
   ```powershell
   tar -czf aurachat.tar.gz --exclude=node_modules --exclude=baileys_auth_info backend setup-gcp.sh start-gcp.sh
   ```
   *Isso vai criar um arquivo `aurachat.tar.gz` leve e perfeito.*

2. Volte pra aba do Terminal do Google (tela preta do SSH). No canto SUPERIOR DIREITO, clique no **ícone de uma Seta pra Cima (Fazer upload do arquivo)**.
3. Selecione o seu **`aurachat.tar.gz`**.

4. Quando o upload terminar, rode este comando mestre no terminal do Google:
   ```bash
   tar -xzf aurachat.tar.gz && bash setup-gcp.sh && bash start-gcp.sh
   ```

### O Desfecho: Escanear o QR CODE
1. Após rodar o comando acima, o sistema vai instalar tudo e, no final, mostrará o QR CODE.
2. Se o QR code não aparecer de primeira ou você perder ele, digite:
   ```bash
   pm2 logs aura-backend
   ```
3. Mire a tela do WhatsApp do celular que usará a Sônia.
4. Pronto! O Whatsapp logou e a Sônia ligou.

*(PS: Lembre-se de atualizar o IP no Vercel se o Google te der um novo. O IP atual configurado é: `136.118.48.181`).*
