require('dotenv').config();
const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, isJidGroup, fetchLatestBaileysVersion, extractMessageContent, messageType } = require('@whiskeysockets/baileys');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configurações
const PORT = 3001;
const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret';
const VERCEL_API_URL = process.env.VERCEL_API_URL || 'https://aurachat-client-coral.vercel.app/api';
const axios = require('axios');

// Configurar CORS para aceitar requisições da Vercel
fastify.register(require('@fastify/cors'), {
  origin: true, // Permitir todas as origens para facilitar o teste (depois podemos fixar o domínio da Vercel)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
// ============ DATABASE ============
const DB_FILE = path.join(__dirname, 'database.json');
let db = { 
  contacts: {}, 
  config: { 
    botName: 'Sonia', 
    aiPrompt: 'Você é a Sonia, assistente virtual ultra-rápida da Pereira Acabamentos. Seu objetivo é qualificar o lead e agendar visitas ou passar para um consultor humano.', 
    geminiKey: process.env.GEMINI_KEY || '' 
  },
  users: [],
  team: [
    { id: '1', name: 'Taine Neto', role: 'gestor', avatar: 'TN', active: true },
    { id: '3', name: 'Consultor 01', role: 'vendedor', avatar: 'V1', active: true }
  ],
  departments: [{ id: '1', name: 'Vendas', color: '#2563eb' }],
  campaigns: [
    { id: '1', name: 'Promoção Verão - Pisos', platform: 'Instagram', link: 'ig/verao24', status: 'active', clicks: 1240, leads: 156, conversion: '12.5%' },
    { id: '2', name: 'Black Friday Antecipada', platform: 'Facebook', link: 'fb/prime', status: 'inactive', clicks: 850, leads: 42, conversion: '4.9%' }
  ],
  products: [
    { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", type: 'image', desc: "Acabamento de alto brilho, ideal para áreas nobres.", categoriaId: '1', tamanho: '90x90', cor: 'Gold', precoNormal: '129.90', precoPromocao: '99.90' },
    { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", type: 'image', desc: "Paredes internas. Textura acetinada.", categoriaId: '1', tamanho: '30x60', cor: 'White', precoNormal: '79.90', precoPromocao: '' }
  ],
  categories: [
    { id: '1', name: 'Porcelanato', color: '#2563eb' },
    { id: '2', name: 'Pastilhas', color: '#d946ef' }
  ]
};

// Aguarda o servidor estar pronto para o Socket.io
let io;
fastify.ready(err => {
  if (err) throw err;
  io = require('socket.io')(fastify.server, { cors: { origin: '*' } });
  console.log('✅ Socket.io acoplado ao servidor');
});

async function initDB() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('1234', salt);
  
  db.users = [
    { id: '1', user: 'admin', pass: hash, name: 'Administrador', role: 'gestor', avatar: 'AD' },
    { id: '2', user: 'toine', pass: hash, name: 'Taine Neto', role: 'gestor', avatar: 'TN' },
    { id: '3', user: 'vendedor1', pass: hash, name: 'Consultor Vendas 01', role: 'vendedor', avatar: 'V1' }
  ];
  return db;
}

(async () => {
  if (fs.existsSync(DB_FILE)) { 
    try { 
      const savedData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); 
      if (!savedData.users || savedData.users.length === 0) {
        db = await initDB();
        db = { ...db, ...savedData }; 
      } else {
        db = { ...db, ...savedData }; 
      }
    } catch (err) { 
      console.error("Erro ao ler DB:", err); 
      db = await initDB();
    } 
  } else {
    db = await initDB();
  }
  saveDB();
})();

const saveDB = () => { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8'); };

// ============ AUTH MIDDLEWARE ============
async function authenticateToken(req, reply) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return reply.code(401).send({ success: false, message: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return reply.code(403).send({ success: false, message: 'Token inválido ou expirado' });
  }
}

let aiQueue = [];
let isProcessingQueue = false;
let lastQR = null;
let whatsAppStatus = 'disconnected';

async function syncWAStatus() {
  try {
    await axios.post(`${VERCEL_API_URL}/wa-status`, { status: whatsAppStatus, qr: lastQR });
    console.log(`📡 [SYNC] Status WA atualizado na Vercel: ${whatsAppStatus}`);
  } catch (err) {
    console.error(`❌ [SYNC-ERROR] Falha ao sincronizar status:`, err.message);
  }
}

let lastCommandTime = Date.now();
async function pollVercelCommands() {
    try {
        const res = await axios.get(`${VERCEL_API_URL}/wa-command`); 
        const cmd = res.data;
        if (cmd && cmd.timestamp > lastCommandTime) {
            lastCommandTime = cmd.timestamp;
            if (cmd.action === 'logout') {
                console.log("🛑 [COMMAND] Recebido comando de LOGOUT da Vercel");
                if (auraSocket) {
                    auraSocket.end(undefined);
                    auraSocket = null;
                }
                lastQR = null;
                whatsAppStatus = 'disconnected';
                if (fs.existsSync('baileys_auth_info')) {
                   fs.rmSync('baileys_auth_info', { recursive: true, force: true });
                }
                syncWAStatus();
            } else if (cmd.action === 'connect') {
                console.log("🔄 [COMMAND] Recebido comando de CONNECT da Vercel");
                if (auraSocket) {
                    auraSocket.end(undefined);
                    auraSocket = null;
                }
                lastQR = null;
                whatsAppStatus = 'disconnected';
                if (fs.existsSync('baileys_auth_info')) {
                    fs.rmSync('baileys_auth_info', { recursive: true, force: true });
                }
                syncWAStatus();
                connectToWhatsApp();
            }
        }
    } catch (err) {
        // Ignora erro de 404 se não houver comando
    }
}
 setInterval(pollVercelCommands, 10000); // Poll a cada 10s

function enqueueAIRequest(jid, socket) {
  if (!aiQueue.includes(jid)) aiQueue.push(jid);
  processAIQueue(socket);
}

async function processAIQueue(socket) {
  if (isProcessingQueue || aiQueue.length === 0) return;
  isProcessingQueue = true;
  while (aiQueue.length > 0) {
    const jid = aiQueue.shift();
    await new Promise(r => setTimeout(r, 4000)); // Delay para parecer humano
    try { await executeAICall(jid, socket); } catch (err) { console.error("Erro Fluxo Sonia:", err.message); }
  }
  isProcessingQueue = false;
}

async function executeAICall(jid, socket) {
  const c = db.contacts[jid];
  if (!c || !c.bot_active || !db.config.geminiKey) return;
  
  await socket.sendPresenceUpdate('composing', jid);
  
  const h = c.msgs.slice(-12).map(m => ({
    role: m.type === 'in' ? 'user' : 'model',
    parts: [{ text: m.text.trim() }]
  }));
  
  if (h.length === 0 || h[h.length-1].role !== 'user') return;

  try {
    const genAI = new GoogleGenerativeAI(db.config.geminiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Corrigido para modelo estável

    const result = await model.generateContent({ 
        contents: h, 
        systemInstruction: db.config.aiPrompt.replace(/\r/g, '').trim()
    });
    const reply = result.response.text();
    
    if (reply) {
      await socket.sendPresenceUpdate('paused', jid);
      await socket.sendMessage(jid, { text: reply });
      c.msgs.push({ id: Date.now().toString(), type: 'out', text: reply, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), bot: true });
      c.msg = reply;
      saveDB();
      io.emit('crm_update', Object.values(db.contacts));
    }
  } catch (err) {
    console.error("❌ ERRO GEMINI:", err.message);
    await socket.sendPresenceUpdate('paused', jid);
  }
}

// ============ API ROUTES ============
fastify.register(require('@fastify/cors'), { origin: '*' });

// Auth
fastify.post('/login', async (req, reply) => {
  const { user, pass } = req.body;
  const found = db.users.find(u => u.user === user.toLowerCase());
  
  if (found && await bcrypt.compare(pass, found.pass)) {
    const token = jwt.sign({ id: found.id, user: found.user, role: found.role }, SECRET_KEY, { expiresIn: '24h' });
    return { success: true, token, user: { id: found.id, name: found.name, role: found.role, avatar: found.avatar } };
  }
  reply.code(401).send({ success: false, message: 'Credenciais inválidas' });
});

// Protected Routes
fastify.get('/contacts', { preHandler: [authenticateToken] }, async () => Object.values(db.contacts));
fastify.get('/messages', { preHandler: [authenticateToken] }, async () => {
  return Object.values(db.contacts).flatMap(c => c.msgs.map(m => ({ ...m, remoteJid: c.id })));
});

fastify.get('/team', { preHandler: [authenticateToken] }, async () => db.team);

fastify.get('/stats', { preHandler: [authenticateToken] }, async () => {
  const all = Object.values(db.contacts);
  const today = new Date().toISOString().split('T')[0];
  const newLeadsToday = all.filter(c => c.createdAt?.startsWith(today)).length;
  const activeBots = all.filter(c => c.bot_active).length;
  const humanLeads = all.filter(c => c.status === 'active').length;
  const waitingLeads = all.filter(c => c.status === 'new').length;
  
  // Calculate sources based on first message (simple heuristic)
  const sources = { direct: 0, instagram: 0, google: 0, other: 0 };
  all.forEach(c => {
    if (c.msgs && c.msgs.length > 0) {
      const firstMsg = c.msgs[0].text.toLowerCase();
      if (firstMsg.includes('instagram') || firstMsg.includes('insta')) sources.instagram++;
      else if (firstMsg.includes('google') || firstMsg.includes('pesquisa')) sources.google++;
      else if (firstMsg.includes('Indicacao') || firstMsg.includes('indicação')) sources.other++;
      else sources.direct++;
    } else {
      sources.direct++;
    }
  });

  return {
    totalLeads: all.length,
    todayLeads: newLeadsToday,
    activeBots: activeBots,
    humanQueue: humanLeads,
    waitingQueue: waitingLeads,
    conversionRate: all.length > 0 ? Math.round((humanLeads / all.length) * 100) : 0,
    sources
  };
});

// Campanhas
fastify.get('/campaigns', { preHandler: [authenticateToken] }, async () => db.campaigns);
fastify.post('/campaigns', { preHandler: [authenticateToken] }, async (req) => {
  const cp = { ...req.body, id: Date.now().toString(), clicks: 0, leads: 0 };
  db.campaigns.push(cp);
  saveDB();
  return { success: true, campaign: cp };
});

// Produtos
fastify.get('/products', async () => db.products); // Público para IA
fastify.post('/products', { preHandler: [authenticateToken] }, async (req) => {
  const p = { ...req.body, id: Date.now().toString() };
  const idx = db.products.findIndex(x => x.id === p.id);
  if (idx >= 0) {
    db.products[idx] = p;
  } else {
    db.products.push(p);
  }
  saveDB();
  return { success: true, product: p };
});
fastify.delete('/products/:id', { preHandler: [authenticateToken] }, async (req) => {
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  saveDB();
  return { success: true };
});

// Categorias
fastify.get('/categories', async () => db.categories);
fastify.post('/categories', { preHandler: [authenticateToken] }, async (req) => {
  const c = { ...req.body, id: Date.now().toString() };
  db.categories.push(c);
  saveDB();
  return { success: true, category: c };
});
fastify.put('/categories/:id', { preHandler: [authenticateToken] }, async (req) => {
  const { id } = req.params;
  const idx = db.categories.findIndex(c => c.id === id);
  if (idx >= 0) {
    db.categories[idx] = { ...db.categories[idx], ...req.body };
    saveDB();
    return { success: true, category: db.categories[idx] };
  }
  return { success: false, error: 'Categoria não encontrada' };
});
fastify.delete('/categories/:id', { preHandler: [authenticateToken] }, async (req) => {
  const { id } = req.params;
  db.categories = db.categories.filter(c => c.id !== id);
  db.products.forEach(p => { if (p.categoriaId === id) p.categoriaId = ''; });
  saveDB();
  return { success: true };
});

// Atualizar Contato (Logística)
fastify.put('/contacts/:jid', { preHandler: [authenticateToken] }, async (req) => {
  const { jid } = req.params;
  const updates = req.body;
  if (db.contacts[jid]) {
    db.contacts[jid] = { ...db.contacts[jid], ...updates };
    saveDB();
    io.emit('crm_update', Object.values(db.contacts));
    return { success: true };
  }
  return { success: false };
});

// ENVIO EM MASSA (BROADCAST)
let isBroadcasting = false;
fastify.post('/broadcast', { preHandler: [authenticateToken] }, async (req, reply) => {
  const { jids, message } = req.body;
  
  if (!auraSocket || !jids || !message || isBroadcasting) {
    return reply.code(400).send({ success: false, message: 'Parâmetros inválidos ou envio em curso' });
  }

  isBroadcasting = true;
  console.log(`📣 [MASSA] Iniciando envio para ${jids.length} contatos...`);

  (async () => {
    for (let i = 0; i < jids.length; i++) {
      const jid = jids[i];
      try {
        await auraSocket.sendMessage(jid, { text: message });
        
        if (db.contacts[jid]) {
          db.contacts[jid].msgs.push({ 
            id: Date.now().toString(), 
            type: 'out', 
            text: `[MASSA] ${message}`, 
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
          });
          db.contacts[jid].msg = message;
        }

        const delay = Math.floor(Math.random() * 5000) + 3000;
        await new Promise(r => setTimeout(r, delay));
        
        io.emit('broadcast_progress', { current: i + 1, total: jids.length, jid });
      } catch (err) {
        console.error(`❌ Erro no broadcast para ${jid}:`, err.message);
      }
    }
    isBroadcasting = false;
    saveDB();
    io.emit('crm_update', Object.values(db.contacts));
    io.emit('broadcast_finished', { total: jids.length });
  })();

  return { success: true, message: 'Broadcast iniciado' };
});

// Transferência Real
fastify.post('/transfer', { preHandler: [authenticateToken] }, async (req) => {
  const { jid, userId } = req.body;
  if (db.contacts[jid]) {
    db.contacts[jid].status = 'active'; 
    db.contacts[jid].bot_active = false; 
    db.contacts[jid].assignedTo = userId;
    saveDB();
    io.emit('crm_update', Object.values(db.contacts));
    return { success: true };
  }
  return { success: false };
});

fastify.post('/send', { preHandler: [authenticateToken] }, async (req) => {
  const { jid, message } = req.body;
  if (!auraSocket || !jid || !message) return { success: false };
  
  // Emit typing status
  io.emit('typing', { jid, status: true });
  
  await auraSocket.sendMessage(jid, { text: message });
  
  if (db.contacts[jid]) {
    db.contacts[jid].msgs.push({ id: Date.now().toString(), type: 'out', text: message, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
    db.contacts[jid].msg = message;
    saveDB();
    io.emit('crm_update', Object.values(db.contacts));
  }
  
  io.emit('typing', { jid, status: false });
  return { success: true };
});

fastify.post('/toggle-bot', { preHandler: [authenticateToken] }, async (req) => {
  const { jid, status } = req.body;
  if (db.contacts[jid]) {
    db.contacts[jid].bot_active = status;
    saveDB();
    io.emit('crm_update', Object.values(db.contacts));
    return { success: true };
  }
  return { success: false };
});

fastify.post('/logout-wa', { preHandler: [authenticateToken] }, async (req, reply) => {
  if (auraSocket) {
    auraSocket.end(undefined);
    auraSocket = null;
    lastQR = null;
    whatsAppStatus = 'disconnected';
    if (fs.existsSync('baileys_auth_info')) {
       fs.rmSync('baileys_auth_info', { recursive: true, force: true });
    }
    return { success: true, message: 'WhatsApp desconectado com sucesso.' };
  }
  return { success: false, message: 'Nenhuma conexão ativa' };
});

fastify.get('/wa-status', { preHandler: [authenticateToken] }, async () => {
    return { status: whatsAppStatus, qr: lastQR };
});

// ============ WHATSAPP SERVICE ============
let auraSocket = null;
async function connectToWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    const { version } = await fetchLatestBaileysVersion();
    const socket = makeWASocket({ 
      version, 
      auth: state, 
      printQRInTerminal: true,
      browser: Browsers.macOS('Aura CRM'),
      msgRetryCounterCache: true
    });

    auraSocket = socket;
    socket.ev.on('creds.update', saveCreds);
    socket.ev.on('connection.update', (u) => { 
      const { connection, lastDisconnect, qr } = u;
      if (qr) {
        lastQR = qr;
        if (io) io.emit('wa_qr', qr);
        whatsAppStatus = 'qr';
        syncWAStatus();
      }
      if (connection === 'open') {
        lastQR = null;
        whatsAppStatus = 'connected';
        if (io) io.emit('wa_status', 'connected');
        syncWAStatus();
      }
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (!shouldReconnect) {
           whatsAppStatus = 'disconnected';
           lastQR = null;
           if (io) io.emit('wa_status', 'disconnected');
           syncWAStatus();
        } else {
           connectToWhatsApp();
        }
      }
    });

    socket.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;
      
      const jid = msg.key.remoteJid;
      if (isJidGroup(jid)) return;

      let msgText = "";
      let msgType = "text";

      // Extract text
      if (msg.message.conversation) msgText = msg.message.conversation;
      else if (msg.message.extendedTextMessage) msgText = msg.message.extendedTextMessage.text;
      
      // Check for media
      if (!msgText) {
        if (msg.message.imageMessage) {
          msgText = "[Imagem]";
          msgType = "image";
        } else if (msg.message.audioMessage) {
          msgText = "[Áudio]";
          msgType = "audio";
        } else if (msg.message.videoMessage) {
          msgText = "[Vídeo]";
          msgType = "video";
        } else if (msg.message.stickerMessage) {
          msgText = "[Sticker]";
          msgType = "sticker";
        } else {
          return; // Ignore other message types
        }
      }

      if (!db.contacts[jid]) {
        db.contacts[jid] = { 
          id: jid, 
          name: msg.pushName || 'Cliente Novo', 
          phone: jid.split('@')[0], 
          createdAt: new Date().toISOString(), 
          msg: msgText, 
          status: 'new', 
          msgs: [], 
          bot_active: true,
          campaignId: null // Adicionado para rastreamento
        };

        // RASTREAMENTO DE CAMPANHA
        const campaign = db.campaigns.find(cp => msgText.toLowerCase().includes(cp.link.toLowerCase()));
        if (campaign) {
          db.contacts[jid].campaignId = campaign.id;
          campaign.leads = (campaign.leads || 0) + 1;
          
          const statusMsg = `🚩 [CAMPANHA] Lead vindo de: ${campaign.name} (${campaign.platform}). Link: ${campaign.link}. Status: ${campaign.status.toUpperCase()}`;
          console.log(statusMsg);
          
          db.contacts[jid].msgs.push({ 
            id: 'sys_' + Date.now(), 
            type: 'system', 
            text: statusMsg, 
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
          });

          if (campaign.status !== 'active') {
             console.warn(`⚠️ [AVISO] O cliente veio de uma campanha PAUSADA: ${campaign.name}`);
          }
        }

        // --- SINCRONIZAÇÃO AUTOMÁTICA COM A VERCEL (DATABASE CENTRAL) ---
        (async () => {
          try {
            await axios.post(`${VERCEL_API_URL}/contacts`, db.contacts[jid]);
            console.log(`✅ [CADASTRO] Novo cliente (${db.contacts[jid].phone}) registrado na Vercel.`);
          } catch (err) {
            console.error(`❌ [VERCEL-SYNC] Erro ao cadastrar na nuvem:`, err.message);
          }
        })();
      }

      db.contacts[jid].msgs.push({ id: msg.key.id, type: 'in', text: msgText, msgType, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
      db.contacts[jid].msg = msgText;
      saveDB();
      
      // ATUALIZAÇÃO CONTÍNUA NA VERCEL (Manter Dashboard Vivo)
      (async () => {
        try {
          await axios.post(`${VERCEL_API_URL}/contacts`, db.contacts[jid]);
          io.emit('crm_update', Object.values(db.contacts));
        } catch (err) {
          console.error(`❌ [VERCEL-SYNC] Erro na atualização contínua:`, err.message);
        }
      })();
      
      if (db.contacts[jid].bot_active && db.config.geminiKey && msgType === 'text') enqueueAIRequest(jid, socket);
    });
  } catch (err) {
    console.error("Erro Conexão WhatsApp:", err);
  }
}

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) { 
        console.error('❌ Erro ao iniciar servidor:', err); 
        process.exit(1); 
    }
    console.log(`🚀 [BACKEND] Aura CRM Ativo: ${address} (PORTA ${PORT})`);
    connectToWhatsApp();
});
