import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const API = 'http://34.19.0.191:3001';
const SOCKET_URL = 'http://34.19.0.191:3001';

// ─── Utilitários ──────────────────────────────────────
const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const statusLabel = { waiting: 'Aguardando', active: 'Atendimento', done: 'Finalizado' };

let globalSocket = null;
let globalToken = null;

function api(path, opts = {}) {
  return fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(globalToken ? { Authorization: `Bearer ${globalToken}` } : {})
    },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  }).then(r => r.json());
}

// ─── Componentes de UI ───────────────────────────────

function Toast({ msg }) {
  return msg ? <div className="toast">🔔 {msg}</div> : null;
}

function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass })
      }).then(r => r.json());

      if (res.token) {
        localStorage.setItem('aura_token', res.token);
        localStorage.setItem('aura_user', JSON.stringify(res.user));
        globalToken = res.token;
        onLogin(res.user, res.token);
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch {
      setError('Falha na conexão com o servidor');
    }
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="Pereira Acabamentos" />
        </div>
        <p>Acesse o painel administrativo</p>
        <input
          className="login-input"
          placeholder="Usuário"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}

// ─── Views ───────────────────────────────────────────

function GestaoView({ subTab, setSubTab }) {
  const tabs = [
    { id: 'funcionarios', label: 'Cadastro de Funcionários' },
    { id: 'clientes', label: 'Cadastro de Clientes' },
    { id: 'produtos', label: 'Cadastro de Produtos' },
    { id: 'config_ia', label: 'Configuração da IA' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div className="sub-navbar">
        {tabs.map(t => (
          <div 
            key={t.id} 
            className={`sub-nav-item ${subTab === t.id ? 'active' : ''}`}
            onClick={() => setSubTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div className="content-page">
        {subTab === 'funcionarios' && (
          <div className="card">
            <h2>👥 Cadastro de Funcionários</h2>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Gerencie atendentes e gestores do sistema.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input className="form-input" placeholder="Ex: João Silva" />
              </div>
              <div className="form-group">
                <label className="form-label">Cargo</label>
                <select className="form-input">
                  <option>Atendente</option>
                  <option>Gestor</option>
                </select>
              </div>
            </div>
            <button className="btn-primary">Salvar Novo Funcionário</button>
          </div>
        )}
        {subTab === 'config_ia' && (
          <div className="card">
            <h2>⚙️ Configuração da Sônia (IA)</h2>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Ajuste o comportamento e as diretrizes da assistente virtual.</p>
            <div className="form-group">
              <label className="form-label">Prompt Principal (Personalidade)</label>
              <textarea className="form-input" rows={6} defaultValue="Você é a Sônia, assistente virtual da Pereira Acabamentos. Seja amigável, prestativa e foque em ajudar os clientes com dúvidas sobre pisos, revestimentos e acabamentos gerais." />
            </div>
            <button className="btn-accent">Atualizar IA</button>
          </div>
        )}
        {(subTab === 'clientes' || subTab === 'produtos') && (
          <div className="card" style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: 40 }}>🏗️</div>
            <h3>Página em Construção</h3>
            <p>Este módulo será implementado na próxima etapa.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aura_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('aura_token'));
  
  // Navegação
  const [mainTab, setMainTab] = useState('atendimento');
  const [subTab, setSubTab] = useState('funcionarios'); // Para aba Gestão

  // WA & Socket
  const [waStatus, setWaStatus] = useState('disconnected');
  const [waQR, setWaQR] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedJid, setSelectedJid] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');
  const messagesEndRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }, []);

  useEffect(() => { if (token) globalToken = token; }, [token]);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { transports: ['websocket'], auth: { token } });
    globalSocket = socket;
    socket.on('wa:status', ({ status }) => {
      setWaStatus(status);
      if (status === 'qr') setShowQR(true);
      if (status === 'connected') { setShowQR(false); showToast('✅ WhatsApp conectado!'); }
    });
    socket.on('wa:qr', (qr) => { setWaQR(qr); setShowQR(true); });
    socket.on('contacts:list', (list) => setContacts(list.sort((a, b) => (b.ts || 0) - (a.ts || 0))));
    socket.on('contact:update', (updated) => {
      setContacts(prev => [updated, ...prev.filter(c => c.id !== updated.id)]);
    });
    api('/api/wa-status').then(d => { setWaStatus(d.status); if (d.qr) setWaQR(d.qr); });
    return () => socket.disconnect();
  }, [token, showToast]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [contacts, selectedJid]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const sendMessage = async () => {
    if (!msgInput.trim() || !selectedJid || sending) return;
    setSending(true);
    try {
      await api('/api/send', { method: 'POST', body: { jid: selectedJid, text: msgInput.trim() } });
      setMsgInput('');
    } catch { showToast('Erro ao enviar'); }
    setSending(false);
  };

  if (!token || !user) return <Login onLogin={(u, t) => { setUser(u); setToken(t); }} />;

  const filteredContacts = contacts.filter(c => {
    const mF = filter === 'all' || c.status === filter;
    const mS = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

  const selectedContact = contacts.find(c => c.id === selectedJid);

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <img src="/logo.png" alt="Pereira Acabamentos" />
        </div>
        
        <nav className="main-nav">
          {[
            { id: 'gestao', label: 'Gestão' },
            { id: 'atendimento', label: 'Atendimento' },
            { id: 'produtos', label: 'Produtos' },
            { id: 'campanhas', label: 'Campanhas' }
          ].map(tab => (
            <div 
              key={tab.id} 
              className={`nav-tab ${mainTab === tab.id ? 'active' : ''}`}
              onClick={() => setMainTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </nav>

        <div className="topbar-right">
          <div className={`wa-badge ${waStatus}`} onClick={() => waStatus === 'qr' && setShowQR(true)}>
            {waStatus === 'connected' ? '✅ Online' : waStatus === 'qr' ? '📱 Escanear' : '❌ Offline'}
          </div>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{user.name}</div>
          <button className="logout-btn" onClick={handleLogout} style={{ color: '#fff', opacity: 0.7 }}>Sair</button>
        </div>
      </div>

      <div className="main-area">
        {mainTab === 'atendimento' ? (
          <>
            <div className="contacts-sidebar">
              <div className="sidebar-header">
                <h2>Mensagens</h2>
                <div className="filter-tabs">
                  {['all', 'waiting', 'active', 'done'].map(f => (
                    <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                      {f === 'all' ? 'Ver Todos' : statusLabel[f]}
                    </button>
                  ))}
                </div>
                <input className="contacts-search" placeholder="Buscar cliente..." onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="contacts-list">
                {filteredContacts.map(c => (
                  <div key={c.id} className={`contact-item ${c.id === selectedJid ? 'active' : ''}`} onClick={() => setSelectedJid(c.id)}>
                    <div className="contact-avatar">{getInitials(c.name)}</div>
                    <div className="contact-info">
                      <div className="contact-name">{c.name}</div>
                      <div className="contact-preview">{c.lastMsg || '...'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chat-area">
              {!selectedContact ? (
                <div className="chat-placeholder"><h3>Selecione uma conversa</h3></div>
              ) : (
                <>
                  <div className="chat-header">
                    <h3>{selectedContact.name}</h3>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn-accent" onClick={() => api('/api/toggle-bot', { method: 'POST', body: { jid: selectedJid, active: !selectedContact.bot_active } })}>
                        {selectedContact.bot_active ? '🤖 IA Ativa' : '⏸ IA Pausada'}
                      </button>
                      <button className="btn-primary" onClick={() => api('/api/contact-status', { method: 'POST', body: { jid: selectedJid, status: 'done' } })}>Finalizar</button>
                    </div>
                  </div>
                  <div className="messages-container">
                    {(selectedContact.msgs || []).map(m => (
                      <div key={m.id} className={`msg-row ${m.type === 'out' ? 'out' : 'in'}`}>
                        <div className="msg-bubble">{m.text}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="chat-input-area">
                    <textarea className="chat-textarea" value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Digite sua resposta..." />
                    <button className="send-btn" onClick={sendMessage}>➤</button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : mainTab === 'gestao' ? (
          <GestaoView subTab={subTab} setSubTab={setSubTab} />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#cbd5e1' }}>
            MÓDULO DE {mainTab.toUpperCase()} EM DESENVOLVIMENTO
          </div>
        )}
      </div>

      {showQR && (
        <div className="qr-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <h2>Conectar WhatsApp</h2>
            <img src={`${API}/api/wa-qr-image?t=${Date.now()}`} alt="QR" />
            <br/><button className="qr-close-btn" onClick={() => setShowQR(false)}>Fechar</button>
          </div>
        </div>
      )}
      <Toast msg={toast} />
    </div>
  );
}
