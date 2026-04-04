import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Zap, Search, MessageSquare, Users, BarChart3, Settings, 
  Send, Bot, Monitor, ChevronDown, User, LogOut, RefreshCw,
  Bell, Calendar, TrendingUp, MoreHorizontal, Clock, ArrowRight, CheckCircle2,
  Phone, Video, Info, Paperclip, Smile, AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://147.15.40.68:3000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') !== null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState([]);
  const [team, setTeam] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('aura_user') || 'null'));
  const [stats, setStats] = useState({ todayLeads: 0, activeBots: 0, humanQueue: 0, conversionRate: 0, sources: {}, waitingQueue: 0 });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('aura_token')}` } });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleTyping = (data) => {
      if (selectedContactId === data.jid) {
        setIsBotTyping(data.status);
      }
    };
    // In a real app we'd use socket.io client, but for simplicity we assume data is refreshed
  }, [selectedContactId]);

  const fetchData = async () => {
    try {
      const [cRes, mRes, sRes, tRes] = await Promise.all([
        axios.get(`${API_URL}/contacts`, getAuthHeader()),
        axios.get(`${API_URL}/messages`, getAuthHeader()),
        axios.get(`${API_URL}/stats`, getAuthHeader()),
        axios.get(`${API_URL}/team`, getAuthHeader())
      ]);
      setContacts(cRes.data);
      setMessages(mRes.data.filter(m => m.remoteJid === selectedContactId));
      setStats(sRes.data);
      setTeam(tRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout();
      }
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, loginForm);
      if (res.data.success) {
        localStorage.setItem('aura_token', res.data.token);
        localStorage.setItem('aura_user', JSON.stringify(res.data.user));
        setIsAuthenticated(true);
        setCurrentUser(res.data.user);
      }
    } catch (err) {
      alert('Credenciais Inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleTransfer = async (jid, userId = null) => {
    try {
      const targetId = userId || currentUser.id;
      await axios.post(`${API_URL}/transfer`, { jid, userId: targetId }, getAuthHeader());
      setShowTransferModal(false);
      fetchData();
    } catch (err) {
      alert('Erro ao transferir lead');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContactId) return;
    try {
      setIsBotTyping(true); // Optimistic update
      await axios.post(`${API_URL}/send`, { jid: selectedContactId, message: newMessage }, getAuthHeader());
      setNewMessage('');
      fetchData();
      setIsBotTyping(false);
    } catch (err) { 
      alert('Erro ao enviar'); 
      setIsBotTyping(false);
    }
  };

  const toggleBot = async (jid, status) => {
    try {
      await axios.post(`${API_URL}/toggle-bot`, { jid, status: !status }, getAuthHeader());
      fetchData();
    } catch (err) { alert('Erro ao alterar robô'); }
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const clean = phone.split('@')[0];
    return `+${clean}`;
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  if (!isAuthenticated) {
    return (
      <div style={{height: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: 'white', padding: '50px', borderRadius: '24px', width: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign:'center'}}>
          <div style={{background:'linear-gradient(135deg, #2563eb, #1d4ed8)', width:'60px', height:'60px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 30px', boxShadow:'0 10px 20px rgba(37,99,235,0.3)'}}><Zap color="white" fill="white" size={28}/></div>
          <h1 style={{color:'#0f172a', fontWeight:900, marginBottom:'5px', fontSize:'24px', letterSpacing:'-1px'}}>PEREIRA ACABAMENTOS</h1>
          <p style={{color:'#64748b', fontSize:'14px', marginBottom:'35px', fontWeight: 500}}>Insira suas credenciais para acessar o portal.</p>
          <input type="text" placeholder="Usuário" className="aura-mini-input" style={{marginBottom: '15px'}} value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}/>
          <input type="password" placeholder="Senha" className="aura-mini-input" style={{marginBottom: '30px'}} value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}/>
          <button onClick={handleLogin} className="aura-btn-primary" style={{width: '100%', padding:'18px', background:'#2563eb', color:'white', border:'none', borderRadius:'12px', fontWeight:800, cursor:'pointer'}}>ENTRAR NO PORTAL</button>
        </div>
      </div>
    );
  }

  return (
    <div className="aura-app-container">
      <header className="aura-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '25px'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             <div style={{background:'#2563eb', padding:'6px', borderRadius:'8px'}}><Zap size={18} color="white" fill="white"/></div>
             <h3 style={{color: '#0f172a', fontWeight: 900, fontSize: '15px', letterSpacing:'-0.5px'}}>PEREIRA ACABAMENTOS</h3>
           </div>
           <div style={{width:'1px', height:'24px', background:'#e2e8f0'}}></div>
           <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: '#f1f5f9', padding: '8px 16px', borderRadius: '10px', border:'1px solid #e2e8f0'}}>
             <Search size={16} color="#64748b"/>
             <input type="text" placeholder="Buscar no sistema..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{background: 'transparent', border: 'none', color: '#1e293b', fontSize: '13px', outline: 'none', width: '220px', fontWeight:500}}/>
           </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
           <div style={{display:'flex', alignItems:'center', gap:'10px', background:'#eff6ff', border:'1px solid #dbeafe', padding:'6px 14px', borderRadius:'10px'}}>
              <span style={{fontSize:'10px', fontWeight:900, color:'#2563eb', letterSpacing:'1px'}}>MODO:</span>
              <span style={{fontSize:'13px', fontWeight:800, color:'#1e293b'}}>{currentUser?.role?.toUpperCase()} ({currentUser?.name?.split(' ')[0].toUpperCase()})</span>
           </div>
           <div style={{width:'40px', height:'40px', background:'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, border:'2px solid white', boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}}>{currentUser?.avatar}</div>
        </div>
      </header>

      <div className="aura-main-layout">
        <aside className="aura-sidebar">
          <div className={`aura-nav-icon ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><BarChart3 size={20}/><span style={{marginLeft:'5px'}}>Painel de Controle</span></div>
          <div className={`aura-nav-icon ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}><MessageSquare size={20}/><span style={{marginLeft:'5px'}}>Chat em Massa</span></div>
          <div className="aura-nav-icon"><Users size={20}/><span style={{marginLeft:'5px'}}>Time Atendimento</span></div>
          <div className="aura-nav-icon"><TrendingUp size={20}/><span style={{marginLeft:'5px'}}>Relatórios Fluxo</span></div>
          <div style={{marginTop: 'auto'}} className="aura-nav-icon"><Settings size={20}/><span style={{marginLeft:'5px'}}>Configurações</span></div>
          <div className="aura-nav-icon" onClick={handleLogout}><LogOut size={20}/><span style={{marginLeft:'5px'}}>Sair</span></div>
        </aside>

        <main style={{flex: 1, overflowY: 'auto', padding: activeTab === 'chat' ? '0' : '40px', background: '#f8fafc'}}>
          {activeTab === 'dashboard' && (
            <div style={{width: '100%', margin: '0 auto', padding: '0 20px'}}>
               <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'30px', marginBottom:'40px'}}>
                  <div className="aura-stats-card" style={{borderLeft:'5px solid #2563eb'}}>
                     <div className="stats-label">Atendimentos Ativos</div>
                     <div className="stats-val">{stats.humanQueue}</div>
                     <div className="stats-sub">Total Geral: <span style={{color:'#1e293b'}}>{stats.totalLeads}</span></div>
                  </div>
                  <div className="aura-stats-card" style={{borderLeft:'5px solid #10b981'}}>
                     <div className="stats-label">Sonia em Ação</div>
                     <div className="stats-val">{stats.activeBots}</div>
                     <div className="stats-sub">Motor: <span style={{color:'#1e293b'}}>Gemini 1.5 Flash</span></div>
                  </div>
                  <div className="aura-stats-card" style={{borderLeft:'5px solid #f59e0b'}}>
                     <div className="stats-label">Leads no Dia</div>
                     <div className="stats-val">{stats.todayLeads}</div>
                     <div className="stats-sub">Aguardando: <span style={{color:'#1e293b'}}>{stats.waitingQueue}</span></div>
                  </div>
               </div>

               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px', marginBottom:'40px'}}>
                  <div className="aura-section-card" style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                     <div className="column-title" style={{background:'#f8fafc'}}><Bot size={18} color="#2563eb"/> <span>AGUARDANDO I.A. OU TRIAGEM</span></div>
                     <table className="mz-table">
                        <thead><tr><th>CLIENTE</th><th>WHATSAPP</th><th>AÇÕES</th></tr></thead>
                        <tbody>{contacts.filter(c=>c.status==='new').map(c => (<tr key={c.id}><td style={{fontWeight:800}}>{c.name}</td><td style={{fontFamily:'monospace', color:'#2563eb', fontWeight:700, fontSize:'13px'}}>{formatPhone(c.phone)}</td><td><button onClick={() => { setSelectedContactId(c.id); setShowTransferModal(true); }} className="aura-btn-transfer">Transferir</button></td></tr>))}</tbody>
                     </table>
                  </div>
                  <div className="aura-section-card" style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                     <div className="column-title" style={{background:'#f8fafc'}}><Users size={18} color="#10b981"/> <span>EM ATENDIMENTO HUMANO</span></div>
                     <table className="mz-table">
                        <thead><tr><th>CLIENTE</th><th>WHATSAPP</th><th>STATUS</th></tr></thead>
                        <tbody>{contacts.filter(c=>c.status==='active').map(c => (<tr key={c.id}><td style={{fontWeight:800}}>{c.name}</td><td style={{fontFamily:'monospace', color:'#22c55e', fontWeight:700, fontSize:'13px'}}>{formatPhone(c.phone)}</td><td style={{fontWeight:800, fontSize:'11px', color:'#1e293b'}}><span style={{background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:'6px'}}>COM VENDEDOR</span></td></tr>))}</tbody>
                     </table>
                  </div>
                  <div className="aura-section-card" style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                     <div className="column-title" style={{background:'#1e293b', color:'white'}}><Calendar size={18} /> <span>PERFORMANCE DA BASE</span></div>
                     <table className="mz-table">
                        <thead><tr><th>KPI</th><th>VALOR</th><th>STATUS</th></tr></thead>
                        <tbody>
                          <tr><td style={{fontWeight:800}}>Taxa de Conversão Leads</td><td style={{fontWeight:900, color:'#2563eb'}}>{stats.conversionRate}%</td><td><span style={{background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:900}}>EXCELENTE</span></td></tr>
                          <tr><td style={{fontWeight:800}}>Tempo Médio Sonia</td><td style={{fontWeight:900, color:'#2563eb'}}>4s</td><td><span style={{background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:900}}>IDEAL</span></td></tr>
                        </tbody>
                     </table>
                  </div>
                  <div className="aura-section-card" style={{background:'white', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                     <div className="column-title" style={{background:'#f59e0b', color:'white'}}><TrendingUp size={18} /> <span>ORIGEM DOS LEADS (TOP 3)</span></div>
                     <table className="mz-table">
                        <thead><tr><th>ORIGEM</th><th>TOTAL</th><th>RETORNO</th></tr></thead>
                        <tbody>
                          <tr><td style={{fontWeight:800, fontSize:'12px'}}>WhatsApp Direto</td><td style={{fontWeight:900, color:'#2563eb'}}>{stats.sources?.direct || 0}</td><td><span style={{background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:900}}>Alta</span></td></tr>
                          <tr><td style={{fontWeight:800, fontSize:'12px'}}>Instagram</td><td style={{fontWeight:900, color:'#2563eb'}}>{stats.sources?.instagram || 0}</td><td><span style={{background:'#fef9c3', color:'#854d0e', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:900}}>Média</span></td></tr>
                          <tr><td style={{fontWeight:800, fontSize:'12px'}}>Google/Outros</td><td style={{fontWeight:900, color:'#2563eb'}}>{(stats.sources?.google || 0) + (stats.sources?.other || 0)}</td><td><span style={{background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:900}}>Baixa</span></td></tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'chat' && (
             <div style={{height: '100%', display: 'flex', background: 'white'}}>
                <div style={{width: '380px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc'}}>
                   <div style={{padding: '30px'}}><h2 style={{fontWeight: 900, color:'#0f172a', marginBottom:'20px', letterSpacing:'-1px'}}>CONVERSAS</h2><div style={{background:'white', padding:'12px 20px', borderRadius:'12px', display:'flex', alignItems:'center', gap:'12px', border:'1px solid #e2e8f0'}}><Search size={16} color="#64748b"/><input type="text" placeholder="Pesquisar contatos..." style={{background:'transparent', border:'none', outline:'none', fontSize:'13px', width:'100%', color:'#1e293b'}}/></div></div>
                   <div style={{flex:1, overflowY:'auto', padding:'0 20px 20px'}}>
                      {contacts.map(c => (
                         <div key={c.id} onClick={()=>setSelectedContactId(c.id)} style={{padding:'15px', borderRadius:'12px', marginBottom:'8px', cursor:'pointer', transition:'all 0.2s', background: selectedContactId===c.id ? '#eff6ff' : 'white', border: selectedContactId===c.id ? '1px solid #2563eb' : '1px solid transparent', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
                            <div style={{display:'flex', gap:'12px'}}>
                               <div style={{width:'45px', height:'45px', background:'#f1f5f9', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#2563eb', fontSize:'14px'}}>{c.name.substring(0,2).toUpperCase()}</div>
                               <div style={{flex:1, minWidth:0}}>
                                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}><span style={{fontWeight:800, fontSize:'14px', color:'#0f172a'}}>{c.name}</span><span style={{fontSize:'10px', color:'#94a3b8', fontWeight:700}}>HOJE</span></div>
                                  <div style={{fontSize:'12px', color:'#64748b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.bot_active ? '🤖' : '👤'} {c.msg}</div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div style={{flex:1, display:'flex', flexDirection:'column', background:'white'}}>
                   {selectedContact ? (
                      <>
                        <div style={{height:'75px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 30px', background:'white'}}>
                           <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                              <div style={{width:'40px', height:'40px', background:'linear-gradient(135deg, #2563eb, #1d4ed8)', color:'white', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>C</div>
                              <div>
                                <div style={{fontWeight:900, fontSize:'15px', color:'#0f172a'}}>{selectedContact.name}</div>
                                <div style={{fontSize:'11px', color: selectedContact.bot_active ? '#10b981' : '#64748b', fontWeight:800}}>
                                  {selectedContact.bot_active ? '🤖 Sonia Respondendo' : '👤 Atendimento Humano'}
                                </div>
                              </div>
                           </div>
                           <div style={{display:'flex', gap:'10px'}}>
                             <button onClick={() => setShowTransferModal(true)} className="aura-btn-primary" style={{padding:'8px 15px', borderRadius:'8px', fontSize:'12px', background:'#10b981'}}>TRANSFERIR</button>
                             <button onClick={()=>toggleBot(selectedContact.id, selectedContact.bot_active)} className={`aura-btn-transfer`} style={{padding:'8px 20px', background: selectedContact.bot_active ? '#eff6ff' : '#64748b', color: selectedContact.bot_active ? '#2563eb' : 'white', border: 'none'}}>
                                <Bot size={16} style={{marginRight:'8px'}}/> {selectedContact.bot_active ? 'SONIA ATIVA' : 'SISTEMA MANUAL'}
                             </button>
                           </div>
                        </div>
                        <div style={{flex:1, overflowY:'auto', padding:'40px', display:'flex', flexDirection:'column', gap:'15px', background:'#f8fafc'}}>
                           {messages.map((m, i) => (
                             <div key={i} className={`chat-bubble ${m.type === 'out' ? 'aura' : 'client'}`} style={{alignSelf: m.type === 'out' ? 'flex-end' : 'flex-start'}}>
                               {m.text}
                             </div>
                           ))}
                           {isBotTyping && (
                             <div style={{alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '20px', background: '#f1f5f9', color: '#64748b', fontStyle: 'italic', fontSize: '12px'}}>
                               Sonia está digitando...
                             </div>
                           )}
                           <div ref={chatEndRef} />
                        </div>
                        <div style={{padding:'25px 35px', background:'white', borderTop:'1px solid #e2e8f0', display:'flex', gap:'15px', alignItems:'center'}}>
                           <Paperclip size={20} color="#94a3b8" style={{cursor:'pointer'}}/>
                           <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyPress={e=>e.key==='Enter' && sendMessage()} placeholder="Escreva sua mensagem profissional..." style={{flex:1, background:'#f1f5f9', border:'none', padding:'15px 25px', borderRadius:'12px', outline:'none', fontSize:'14px', fontWeight:500, color:'#1e293b'}}/>
                           <Smile size={20} color="#94a3b8" style={{cursor:'pointer'}}/>
                           <button onClick={sendMessage} style={{background:'#2563eb', color:'white', border:'none', width:'50px', height:'50px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,0.3)'}}><Send size={20}/></button>
                        </div>
                      </>
                   ) : (
                      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'#94a3b8', gap:'20px'}}>
                         <div style={{background:'#f1f5f9', padding:'30px', borderRadius:'30px'}}><MessageSquare size={80} strokeWidth={1} style={{opacity:0.3}}/></div>
                         <p style={{fontWeight:800, letterSpacing:'1px', fontSize:'13px'}}>SELECIONE UM LEAD PARA INICIAR</p>
                      </div>
                   )}
                </div>
             </div>
          )}
        </main>
      </div>

      {showTransferModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'white', padding:'30px', borderRadius:'16px', width:'400px', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <h3 style={{fontSize:'18px', fontWeight:900, marginBottom:'20px', color:'#0f172a'}}>Transferir Lead</h3>
            <p style={{fontSize:'14px', color:'#64748b', marginBottom:'20px'}}>Selecione o vendedor para quem deseja transferir este lead:</p>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {team.map(t => (
                <div key={t.id} onClick={() => handleTransfer(selectedContactId, t.id)} style={{padding:'15px', border:'1px solid #e2e8f0', borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'15px'}}>
                  <div style={{width:'40px', height:'40px', background:'#f1f5f9', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#2563eb'}}>{t.avatar}</div>
                  <div>
                    <div style={{fontWeight:800, fontSize:'14px'}}>{t.name}</div>
                    <div style={{fontSize:'12px', color:'#64748b', textTransform:'capitalize'}}>{t.role}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => handleTransfer(selectedContactId)} style={{marginTop:'10px', padding:'15px', background:'#2563eb', color:'white', border:'none', borderRadius:'12px', fontWeight:800}}>TRANSFERIR PARA MIM</button>
              <button onClick={() => setShowTransferModal(false)} style={{padding:'10px', background:'transparent', color:'#64748b', border:'none', fontWeight:600}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
