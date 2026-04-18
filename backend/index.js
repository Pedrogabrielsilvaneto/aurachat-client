require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, isJidGroup } = require('@whiskeysockets/baileys');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ═══════════════════════════════════════
//  BANCO DE DADOS (JSON em memória + disco)
// ═══════════════════════════════════════
const DB_PATH = path.join(__dirname, 'db.json');

const DEFAULT_DB = {
  contacts: {},   // { [jid]: { id, name, phone, msgs[], status, bot_active, createdAt } }
  config: {
    name: 'Sônia',
    prompt: 'Você é a Sônia, assistente virtual da Pereira Acabamentos. Seja amigável, prestativa e foque em ajudar os clientes com dúvidas sobre pisos, revestimentos e acabamentos gerais. Responda de forma curta e natural.',
    geminiKey: process.env.GEMINI_KEY || ''
  }
};

let db = loadDB();

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) { console.error('Erro ao ler DB:', e.message); }
  return structuredClone(DEFAULT_DB);
}

function saveDB() {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }
  catch (e) { console.error('Erro ao salvar DB:', e.message); }
}

// ═══════════════════════════════════════
//  USUÁRIOS E AUTH
// ═══════════════════════════════════════
const SECRET = process.env.SESSION_SECRET;

// Usuários em memória (senha padrão: 1234)
let USERS = [];
async function initUsers() {
  const hash = await bcrypt.hash('1234', 10);
  USERS = [
    { id: '1', user: 'admin',     pass: hash, name: 'Administrador',    role: 'gestor'   },
    { id: '2', user: 'toine',     pass: hash, name: 'Taine Neto',       role: 'gestor'   },
    { id: '3', user: 'vendedor1', pass: hash, name: 'Consultor 01',     role: 'vendedor' },
  ];
}
initUsers();

function authMiddleware(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
}

// ═══════════════════════════════════════
//  WHATSAPP (Baileys)
// ═══════════════════════════════════════
let waSocket = null;
let waStatus = 'disconnected';
let waQR = null;
const AUTH_DIR = path.join(__dirname, 'auth_info');

async function connectWA() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ['Pereira Acabamentos', 'Chrome', '2.0'],
  });

  waSocket = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      waQR = qr;
      waStatus = 'qr';
      io.emit('wa:qr', qr);
      io.emit('wa:status', { status: 'qr' });
      console.log('📱 QR Code gerado — escaneie pelo WhatsApp');
    }

    if (connection === 'open') {
      waStatus = 'connected';
      waQR = null;
      io.emit('wa:status', { status: 'connected' });
      console.log('✅ WhatsApp conectado!');
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      waStatus = shouldReconnect ? 'reconnecting' : 'disconnected';
      waQR = null;
      io.emit('wa:status', { status: waStatus });
      if (shouldReconnect) {
        console.log('🔄 Reconectando WhatsApp...');
        setTimeout(connectWA, 3000);
      } else {
        console.log('📴 WhatsApp deslogado.');
        waSocket = null;
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      const jid = msg.key.remoteJid;
      if (isJidGroup(jid)) continue;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        (msg.message.imageMessage ? '[Imagem]' : '') ||
        (msg.message.audioMessage ? '[Áudio]' : '') ||
        (msg.message.videoMessage ? '[Vídeo]' : '') ||
        '[Mensagem]';

      // Cria contato se não existir
      if (!db.contacts[jid]) {
        db.contacts[jid] = {
          id: jid,
          name: msg.pushName || 'Cliente',
          phone: jid.replace('@s.whatsapp.net', ''),
          msgs: [],
          status: 'waiting',   // waiting | active | done
          bot_active: true,
          createdAt: new Date().toISOString()
        };
      }

      const contact = db.contacts[jid];
      const msgObj = {
        id: msg.key.id || Date.now().toString(),
        type: 'in',
        text,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        ts: Date.now()
      };
      contact.msgs.push(msgObj);
      contact.lastMsg = text;
      contact.lastTime = msgObj.time;
      saveDB();

      // Emite atualização em tempo real
      io.emit('contact:update', contact);
      io.emit('contacts:list', Object.values(db.contacts));

      // Processa IA se bot ativo e texto
      if (contact.bot_active && text && !text.startsWith('[')) {
        processAI(jid, sock);
      }
    }
  });
}

// ═══════════════════════════════════════
//  IA (Gemini)
// ═══════════════════════════════════════
const aiQueue = new Set();

async function processAI(jid, sock) {
  if (aiQueue.has(jid)) return;
  aiQueue.add(jid);

  // Delay humanizado
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));

  const contact = db.contacts[jid];
  if (!contact || !contact.bot_active) { aiQueue.delete(jid); return; }

  const key = db.config.geminiKey || process.env.GEMINI_KEY;
  if (!key) { aiQueue.delete(jid); return; }

  try {
    await sock.sendPresenceUpdate('composing', jid);

    // Monta histórico (últimas 10 msgs)
    const history = contact.msgs.slice(-10).map(m => ({
      role: m.type === 'in' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    if (!history.length || history[history.length - 1].role !== 'user') {
      aiQueue.delete(jid);
      return;
    }

    const genAI = new GoogleGenerativeAI(key.trim());
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: db.config.prompt
    });

    const result = await model.generateContent({ contents: history });
    const reply = result.response.text().trim();

    if (reply) {
      await sock.sendPresenceUpdate('paused', jid);
      await sock.sendMessage(jid, { text: reply });

      const outMsg = {
        id: Date.now().toString(),
        type: 'out',
        text: reply,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        ts: Date.now(),
        bot: true
      };
      contact.msgs.push(outMsg);
      contact.lastMsg = reply;
      contact.lastTime = outMsg.time;
      saveDB();

      io.emit('contact:update', contact);
      io.emit('contacts:list', Object.values(db.contacts));
    }
  } catch (err) {
    console.error('❌ Erro Gemini:', err.message);
    await sock.sendPresenceUpdate('paused', jid).catch(() => {});
  }

  aiQueue.delete(jid);
}

// ═══════════════════════════════════════
//  ROTAS HTTP
// ═══════════════════════════════════════

// Auth
app.post('/api/login', async (req, res) => {
  const { user, pass } = req.body;
  const found = USERS.find(u => u.user === user?.toLowerCase());
  if (!found || !(await bcrypt.compare(pass, found.pass))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: found.id, name: found.name, role: found.role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: found.id, name: found.name, role: found.role } });
});

// Contatos
app.get('/api/contacts', authMiddleware, (req, res) => {
  res.json(Object.values(db.contacts));
});

app.delete('/api/contacts/:jid', authMiddleware, (req, res) => {
  const jid = decodeURIComponent(req.params.jid);
  delete db.contacts[jid];
  saveDB();
  io.emit('contacts:list', Object.values(db.contacts));
  res.json({ ok: true });
});

// Enviar mensagem manual
app.post('/api/send', authMiddleware, async (req, res) => {
  const { jid, text } = req.body;
  if (!waSocket || !jid || !text) return res.status(400).json({ error: 'Parâmetros inválidos' });
  try {
    await waSocket.sendMessage(jid, { text });
    const outMsg = {
      id: Date.now().toString(),
      type: 'out',
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ts: Date.now(),
      bot: false
    };
    if (db.contacts[jid]) {
      db.contacts[jid].msgs.push(outMsg);
      db.contacts[jid].lastMsg = text;
      db.contacts[jid].lastTime = outMsg.time;
      saveDB();
      io.emit('contact:update', db.contacts[jid]);
      io.emit('contacts:list', Object.values(db.contacts));
    }
    res.json({ ok: true, msg: outMsg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle bot
app.post('/api/toggle-bot', authMiddleware, (req, res) => {
  const { jid, active } = req.body;
  if (!db.contacts[jid]) return res.status(404).json({ error: 'Contato não encontrado' });
  db.contacts[jid].bot_active = active;
  saveDB();
  io.emit('contact:update', db.contacts[jid]);
  res.json({ ok: true, bot_active: active });
});

// Atualizar status do contato
app.post('/api/contact-status', authMiddleware, (req, res) => {
  const { jid, status } = req.body;
  if (!db.contacts[jid]) return res.status(404).json({ error: 'Contato não encontrado' });
  db.contacts[jid].status = status;
  saveDB();
  io.emit('contact:update', db.contacts[jid]);
  io.emit('contacts:list', Object.values(db.contacts));
  res.json({ ok: true });
});

// Config da IA
app.get('/api/config', authMiddleware, (req, res) => res.json(db.config));
app.post('/api/config', authMiddleware, (req, res) => {
  db.config = { ...db.config, ...req.body };
  saveDB();
  res.json({ ok: true, config: db.config });
});

// QR Code como imagem PNG (para exibir no frontend)
app.get('/api/wa-qr-image', async (req, res) => {
  if (!waQR) return res.status(404).send('QR não disponível');
  try {
    const png = await QRCode.toBuffer(waQR, { type: 'png', width: 300, margin: 2 });
    res.set('Content-Type', 'image/png');
    res.send(png);
  } catch (e) {
    res.status(500).send('Erro ao gerar QR');
  }
});

// Status do WhatsApp
app.get('/api/wa-status', (req, res) => {
  res.json({ status: waStatus, qr: waQR });
});

// Conectar / desconectar WhatsApp
app.post('/api/wa-connect', authMiddleware, (req, res) => {
  if (waStatus !== 'disconnected' && waStatus !== 'reconnecting') {
    return res.json({ ok: false, message: 'Já conectado ou conectando' });
  }
  connectWA().catch(console.error);
  res.json({ ok: true, message: 'Iniciando conexão...' });
});

app.post('/api/wa-disconnect', authMiddleware, (req, res) => {
  if (waSocket) {
    waSocket.end(undefined);
    waSocket = null;
  }
  waStatus = 'disconnected';
  waQR = null;
  // Deleta sessão salva
  if (fs.existsSync(AUTH_DIR)) fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  io.emit('wa:status', { status: 'disconnected' });
  res.json({ ok: true });
});

// SPA fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not Found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ═══════════════════════════════════════
//  SOCKET.IO — eventos do cliente
// ═══════════════════════════════════════
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);
  // Envia estado atual para o cliente que acabou de conectar
  socket.emit('wa:status', { status: waStatus, qr: waQR });
  socket.emit('contacts:list', Object.values(db.contacts));

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});

// ═══════════════════════════════════════
//  INICIALIZAÇÃO
// ═══════════════════════════════════════
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pereira Acabamentos rodando na porta ${PORT}`);
  // Inicia WA automaticamente se já houver sessão salva
  if (fs.existsSync(AUTH_DIR)) {
    console.log('📲 Sessão anterior encontrada — reconectando...');
    connectWA().catch(console.error);
  } else {
    console.log('📲 Nenhuma sessão salva — aguardando comando de conexão.');
  }
});

