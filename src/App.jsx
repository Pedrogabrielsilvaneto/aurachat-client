import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, HandPointing as Hand, ArrowRight, 
  Plus, Key, RefreshCcw, Power, UserPlus, Search, 
  ChevronDown, LayoutDashboard, Settings, LogOut, DollarSign,
  BarChart, Zap, Clock, CheckCircle, Package, Send,
  MapPin, ClipboardList, CheckCircle2, MoreHorizontal, Camera,
  ShieldAlert, UserCheck, MessageSquare, ArrowLeft, Ghost,
  Hash, User, Bell, Share2, Paperclip, Smile, Mic, Check, CheckCheck
} from 'lucide-react';

// ==========================================
// MOCK DATA - WHATSAPP STYLE INTERNAL
// ==========================================
const TEAM_CONTACTS = [
  { id: 1, name: "Maria Vendas", sector: "Comercial", status: "Online", img: "MV", lastSeen: "10:30" },
  { id: 2, name: "Roberto Log", sector: "Logística", status: "Ausente", img: "RL", lastSeen: "Ontem" },
  { id: 3, name: "Cláudia Compras", sector: "Suprimentos", status: "Offline", img: "CC", lastSeen: "15:45" },
  { id: 4, name: "Pedro Gestor", sector: "Diretoria", status: "Online", img: "PG", lastSeen: "agora" },
];

const INITIAL_INTERNAL_MSGS = [
  { id: 10, from: 2, text: "Maria, o carregamento do 90x90 já está no caminhão 2.", time: "10:15", status: "read", me: false },
  { id: 11, from: 1, text: "Ótimo Roberto! O cliente João Silva estava perguntando.", time: "10:16", status: "read", me: true },
  { id: 12, from: 2, text: "Vou sinalizar aqui como Saiu para Entrega no painel.", time: "10:20", status: "delivered", me: false },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInternalUser, setSelectedInternalUser] = useState(TEAM_CONTACTS[0]);
  const [internalMessages, setInternalMessages] = useState(INITIAL_INTERNAL_MSGS);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  // Simular Envio de Mensagem (UX WhatsApp)
  const handleSendInternal = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      from: 4, // "Eu"
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      me: true
    };

    setInternalMessages([...internalMessages, newMsg]);
    setInputText("");

    // Simular "Digitando..." do outro
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: Date.now() + 1,
          from: selectedInternalUser.id,
          text: "Recebido! Vou verificar agora mesmo.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          me: false
        };
        setInternalMessages(prev => [...prev, reply]);
      }, 2000);
    }, 1000);
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-[#0f172a] overflow-hidden" style={{ display: 'flex' }}>
      
      {/* SIDEBAR PRINCIPAL (ÍCONES) */}
      <aside style={{ width: '68px', background: 'white', borderRight: '1px solid #d1d7db', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '24px' }}>
         <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px', marginBottom: '20px' }}>
            <Zap size={24} color="white" />
         </div>
         <SidebarIcon icon={<LayoutDashboard size={24}/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
         <SidebarIcon icon={<Truck size={24}/>} active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
         <SidebarIcon icon={<MessageSquare size={24}/>} active={activeTab === 'internal_chat'} onClick={() => setActiveTab('internal_chat')} badge={3} />
         <SidebarIcon icon={<Users size={24}/>} active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
         
         <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SidebarIcon icon={<Settings size={24}/>} />
            <div onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} style={{ cursor: 'pointer', color: '#ef4444' }}><LogOut size={24}/></div>
         </div>
      </aside>

      {/* ÁREA DE CONTEÚDO DINÂMICO */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {activeTab === 'dashboard' && <h1 className="p-8">Dashboard Global Em Breve</h1>}
        
        {/* MÓDULO INTERNO ESTILO WHATSAPP */}
        {activeTab === 'internal_chat' && (
           <div className="animate-view" style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', background: 'white' }}>
              
              {/* Coluna Esquerda: Contatos Internos */}
              <div style={{ borderRight: '1px solid #d1d7db', display: 'flex', flexDirection: 'column' }}>
                 <div style={{ padding: '16px', background: '#f0f2f5', borderBottom: '1px solid #d1d7db', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>PG</div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#54656f' }}>
                       <Users size={22} style={{ cursor: 'pointer' }} />
                       <Plus size={22} style={{ cursor: 'pointer' }} onClick={() => alert('Nova conversa interna')} />
                       <MoreHorizontal size={22} style={{ cursor: 'pointer' }} />
                    </div>
                 </div>

                 <div style={{ padding: '8px 16px', background: 'white' }}>
                    <div style={{ background: '#f0f2f5', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '8px 14px' }}>
                       <Search size={18} color="#54656f" style={{ marginRight: '14px' }} />
                       <input type="text" placeholder="Pesquisar funcionário ou setor..." style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
                    </div>
                 </div>

                 <div style={{ flex: 1, overflowY: 'auto' }}>
                    {TEAM_CONTACTS.map(contact => (
                       <ContactRow key={contact.id} contact={contact} active={selectedInternalUser.id === contact.id} onClick={() => setSelectedInternalUser(contact)} />
                    ))}
                 </div>
              </div>

              {/* Coluna Direita: Chat WhatsApp Style */}
              <div style={{ display: 'flex', flexDirection: 'column', background: '#efeae2', position: 'relative' }}>
                 
                 {/* Header Chat */}
                 <div style={{ padding: '10px 16px', background: '#f0f2f5', borderBottom: '1px solid #d1d7db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{selectedInternalUser.img}</div>
                       <div>
                          <p style={{ fontSize: '16px', color: '#111b21', fontWeight: '500' }}>{selectedInternalUser.name} <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '4px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{selectedInternalUser.sector}</span></p>
                          <p style={{ fontSize: '12px', color: '#667781' }}>{isTyping ? 'digitando...' : `visto por último: ${selectedInternalUser.lastSeen}`}</p>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', color: '#54656f' }}>
                       <Search size={20} style={{ cursor: 'pointer' }} />
                       <MoreHorizontal size={20} style={{ cursor: 'pointer' }} />
                    </div>
                 </div>

                 {/* Corpo do Chat (Bubbles) */}
                 <div className="whatsapp-bg" style={{ flex: 1, padding: '20px 60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {internalMessages.map(m => (
                       <div key={m.id} style={{ 
                          alignSelf: m.me ? 'flex-end' : 'flex-start',
                          background: m.me ? '#d9fdd3' : 'white',
                          padding: '6px 12px 6px 12px',
                          borderRadius: '8px',
                          maxWidth: '65%',
                          position: 'relative',
                          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                          fontSize: '14.2px',
                          display: 'flex',
                          flexDirection: 'column'
                       }}>
                          <p style={{ marginBottom: '4px', wordBreak: 'break-word', color: '#111b21' }}>{m.text}</p>
                          <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '4px' }}>
                             <span style={{ fontSize: '11px', color: '#667781' }}>{m.time}</span>
                             {m.me && (
                                <span style={{ color: m.status === 'read' ? '#53bdeb' : '#8696a0' }}>
                                   {m.status === 'sent' ? <Check size={14}/> : <CheckCheck size={14}/>}
                                </span>
                             )}
                          </div>
                       </div>
                    ))}
                    
                    {/* Exemplo de Card de Cliente Anexado */}
                    <div style={{ alignSelf: 'flex-start', background: 'white', padding: '4px', borderRadius: '8px', maxWidth: '300px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)' }}>
                       <div style={{ background: '#f0f2f5', borderRadius: '4px', padding: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#2563eb', fontWeight: '800', marginBottom: '8px' }}>🏢 CARD DO CLIENTE • SERVIÇO</p>
                          <h4 style={{ fontSize: '14px' }}>João Silva Porcelanato</h4>
                          <p style={{ fontSize: '12px', color: '#667781', margin: '4px 0 12px' }}>"Preciso saber o status da minha rota de entrega."</p>
                          <button style={{ width: '100%', padding: '8px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>Ver Chat WhatsApp</button>
                       </div>
                       <div style={{ padding: '4px 8px', display: 'flex', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '11px', color: '#667781' }}>10:45</span>
                       </div>
                    </div>
                 </div>

                 {/* Footer: Input Style WhatsApp */}
                 <footer style={{ padding: '10px 16px', background: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', color: '#54656f' }}>
                       <Smile size={26} style={{ cursor: 'pointer' }} />
                       <Paperclip size={26} style={{ cursor: 'pointer' }} onClick={() => setShowAttachModal(true)} />
                    </div>
                    <form onSubmit={handleSendInternal} style={{ flex: 1 }}>
                       <input 
                         type="text" className="input-field" placeholder="Mensagem interna..." 
                         style={{ width: '100%', background: 'white', border: 'none', height: '42px', fontSize: '15px' }}
                         value={inputText} onChange={e => setInputText(e.target.value)}
                       />
                    </form>
                    <div style={{ color: '#54656f' }}>
                       {inputText ? (
                         <button type="submit" onClick={handleSendInternal} style={{ background: 'none', border: 'none', color: '#00a884', cursor: 'pointer' }}><Send size={26}/></button>
                       ) : (
                         <Mic size={26} style={{ cursor: 'pointer' }} />
                       )}
                    </div>
                 </footer>

                 {/* Modal Simulado de "Anexar Cliente" */}
                 {showAttachModal && (
                   <div style={{ position: 'absolute', bottom: '70px', left: '16px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 20 }}>
                      <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Anexar Cliente ao Chat Interno</h4>
                      <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }} onClick={() => setShowAttachModal(false)}>
                         Selecionar João Silva...
                      </div>
                   </div>
                 )}

              </div>
           </div>
        )}

      </main>

      <style>{`
        .whatsapp-bg {
          background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
          background-repeat: repeat;
          background-size: 400px;
        }
      `}</style>
    </div>
  );
}

// ==========================================
// COMPONENTES DE UI AUXILIARES
// ==========================================

function SidebarIcon({ icon, active, onClick, badge }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', cursor: 'pointer', color: active ? '#2563eb' : '#54656f', padding: '8px', borderRadius: '12px', background: active ? '#eff6ff' : 'transparent', transition: '0.2s' }}>
       {icon}
       {badge > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', minWidth: '18px', height: '18px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{badge}</span>}
    </div>
  );
}

function ContactRow({ contact, active, onClick }) {
  return (
    <div onClick={onClick} style={{ 
       display: 'flex', alignItems: 'center', padding: '12px 16px', cursor: 'pointer',
       background: active ? '#f0f2f5' : 'white',
       borderBottom: '1px solid #f1f5f9'
    }}>
       <div style={{ position: 'relative', marginRight: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{contact.img}</div>
          <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', background: contact.status === 'Online' ? '#1fb381' : (contact.status === 'Ausente' ? '#f59e0b' : '#94a3b8'), border: '2px solid white' }} />
       </div>
       <div style={{ flex: 1, borderBottom: active ? 'none' : '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
             <span style={{ fontSize: '16px', color: '#111b21' }}>{contact.name}</span>
             <span style={{ fontSize: '12px', color: '#667781' }}>{contact.lastSeen}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#667781' }}>Setor: {contact.sector}</p>
       </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="manager-card animate-view" style={{ width: '400px', textAlign: 'center', padding: '48px' }}>
         <Zap size={48} color="#2563eb" style={{ margin: '0 auto 24px' }} />
         <h2 style={{ marginBottom: '8px' }}>AuraChat <span style={{ color: '#2563eb' }}>Corp</span></h2>
         <p style={{ color: '#64748b', marginBottom: '32px' }}>Rede Interna Pereira Acabamentos</p>
         <button className="btn-action btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Entrar no Chat da Equipe</button>
      </div>
    </div>
  );
}

export default App;
