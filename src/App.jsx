import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Settings, Users, BarChart3, Zap, 
  Search, Filter, Plus, ChevronRight, MoreVertical, Phone, Video, Info, 
  Paperclip, Smile, Clock, CheckCircle2, AlertCircle, Kanban, DollarSign, 
  Tag, Calendar, FileText, History, Bell, UserPlus, LogOut, Sun, Moon,
  TrendingDown, ArrowUpRight, MousePointer2
} from 'lucide-react';

// Design Constants
const PRIMARY_GRADIENT = "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');
  const [selectedLeadId, setSelectedLeadId] = useState(101);
  const [inputText, setInputText] = useState("");
  
  // ==========================================
  // DADOS DO SISTEMA (SIMULADO)
  // ==========================================
  const [leads, setLeads] = useState([
    { id: 101, name: "João Porcelanato", lastMsg: "Quero ver o piso 90x90", time: "10:30", type: "Ativo", tag: "Comercial", stage: "Interesse", value: 12500, phone: "+55 (11) 98877-6655", email: "joao@obra.com.br" },
    { id: 102, name: "Arquiteta Cláudia", lastMsg: "O acabamento é brilhante?", time: "09:45", type: "Pendentes", tag: "Projeto", stage: "Orçamento", value: 8700, phone: "+55 (11) 94433-2211", email: "claudia@interiores.com" },
    { id: 103, name: "Construtora Silva", lastMsg: "Preciso de 500m2", time: "Ontem", type: "Potenciais", tag: "Atacado", stage: "Negociação", value: 45000, phone: "+55 (21) 97766-5544", email: "compras@silvaconstrutora.com" },
  ]);

  const [messages, setMessages] = useState({
    101: [
      { id: 1, type: 'recv', text: "Olá, gostaria de saber se vocês entregam o porcelanato Portobello 90x90 no centro?", time: "10:28" },
      { id: 2, type: 'ai', text: "Olá João! Sou a Aura, assistente da AuraChat. Sim, entregamos no centro com frete grátis para compras acima de 50m². Quantos metros você precisa?", time: "10:29" },
      { id: 3, type: 'recv', text: "Quero ver o piso 90x90 pessoalmente.", time: "10:30" }
    ],
    102: [{ id: 1, type: 'recv', text: "O acabamento desse piso é brilhante?", time: "09:45" }],
    103: [{ id: 1, type: 'recv', text: "Preciso de 500m2 para uma obra...", time: "Ontem" }]
  });

  const selectedLead = leads.find(l => l.id === selectedLeadId);
  const chatEndRef = useRef(null);

  // ==========================================
  // AÇÕES DO SISTEMA
  // ==========================================
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, selectedLeadId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = { id: Date.now(), type: 'send', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    setMessages(prev => ({
      ...prev,
      [selectedLeadId]: [...(prev[selectedLeadId] || []), newMsg]
    }));
    setInputText("");

    // Resposta Automática da Aura IA após 1.5s
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: `Entendido sobre "${inputText.substring(0, 15)}...". Estou processando seu pedido baseado no nosso Playbook de Materiais. Um vendedor humano logo assumirá o controle final.`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => ({
        ...prev,
        [selectedLeadId]: [...(prev[selectedLeadId] || []), aiResponse]
      }));
    }, 1500);
  };

  const advanceStage = () => {
    const stages = ["Interesse", "Orçamento", "Negociação", "Vendido"];
    const currentIndex = stages.indexOf(selectedLead.stage);
    if (currentIndex < stages.length - 1) {
      setLeads(leads.map(l => l.id === selectedLeadId ? { ...l, stage: stages[currentIndex + 1] } : l));
    }
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-root ${isDarkMode ? 'dark-mode' : ''}`} style={{ display: 'flex', height: '100vh', background: '#0f172a', color: 'white' }}>
      
      {/* SIDEBAR SaaS */}
      <nav className="glass-panel" style={{ width: '80px', margin: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: '24px' }}>
        <div style={{ background: PRIMARY_GRADIENT, padding: '12px', borderRadius: '14px' }}>
          <Zap size={24} color="white" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <NavIcon icon={<LayoutDashboard size={22}/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} tooltip="Painel Global" />
          <NavIcon icon={<MessageSquare size={22}/>} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} tooltip="Omnichannel" />
          <NavIcon icon={<Kanban size={22}/>} active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} tooltip="Funil de Vendas" />
          <NavIcon icon={<BarChart3 size={22}/>} active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} tooltip="Relatórios" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <NavIcon icon={<Settings size={20}/>} />
          <div onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} style={{ cursor: 'pointer', opacity: 0.6 }}><LogOut size={20}/></div>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 12px 12px 0', overflow: 'hidden' }}>
        
        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Bom dia, Equipe AuraChat! ☕</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <MetricCard label="Tickets em Atendimento" value={leads.length} icon={<MessageSquare color="#6366f1"/>} />
              <MetricCard label="Vendas este Mês" value="R$ 142.500" icon={<DollarSign color="#10b981"/>} />
              <MetricCard label="Tempo Médio Resp." value="45 seg" icon={<Clock color="#22d3ee"/>} />
              <MetricCard label="Taxa Conversão I.A." value="24.8%" icon={<Zap color="#c084fc"/>} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
               <div className="glass-panel" style={{ padding: '24px' }}>
                 <h3 style={{ marginBottom: '20px' }}>Atividades da I.A. (Real-time)</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <ActivityResult text="Aura qualificou Lead João como 'Alta Intenção'" time="visto agora" />
                    <ActivityResult text="Novo orçamento gerado para Arquiteta Cláudia" time="5 min atrás" />
                    <ActivityResult text="IA contornou objeção de frete para Construtora Silva" time="15 min atrás" />
                 </div>
               </div>
               <div className="glass-panel" style={{ padding: '24px' }}>
                 <h3>Atendentes Online</h3>
                 <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <AgentRow name="Pedro Neto" role="Admin" status="Ativo" color="#10b981" />
                    <AgentRow name="Mariana Lima" role="Comercial" status="Em Chat" color="#3b82f6" />
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* VIEW: CHAT OMNICHANNEL (INTERATIVO) */}
        {activeTab === 'chat' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: '12px', height: '100%', overflow: 'hidden' }}>
            
            {/* Lista de Chats */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '10px' }}>
                     <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                     <input type="text" placeholder="Pesquisar..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
                  </div>
               </div>
               <div style={{ flex: 1, overflowY: 'auto' }}>
                  {leads.map(l => (
                    <LeadRow key={l.id} lead={l} selected={selectedLeadId === l.id} onClick={() => setSelectedLeadId(l.id)} />
                  ))}
               </div>
            </div>

            {/* Chat Central */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)' }}>
               <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar text={selectedLead.name.substring(0,2)} />
                    <div>
                       <p style={{ fontWeight: '600' }}>{selectedLead.name}</p>
                       <span style={{ fontSize: '11px', color: '#10b981' }}>Omnichannel Conectado</span>
                    </div>
                  </div>
               </div>
               <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(messages[selectedLeadId] || []).map(m => (
                    <Msg key={m.id} type={m.type} text={m.text} time={m.time} />
                  ))}
                  <div ref={chatEndRef} />
               </div>
               <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '12px' }}>
                  <button type="button" className="glass-btn"><Paperclip size={20}/></button>
                  <input 
                    type="text" className="glass-input" placeholder="Digite uma mensagem ou comando IA..." style={{ flex: 1 }} 
                    value={inputText} onChange={e => setInputText(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}><Send size={18}/></button>
               </form>
            </div>

            {/* Painel Contexto / CRM */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <section>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>PERFIL DO LEAD</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <DataField label="E-mail" value={selectedLead.email} />
                    <DataField label="WhatsApp" value={selectedLead.phone} />
                    <DataField label="Origem" value="Campanha Facebook Ads" />
                  </div>
               </section>

               <section style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>PIPELINE DE VENDAS</h4>
                  <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                     <p style={{ fontSize: '12px', color: '#6366f1', fontWeight: 'bold' }}>ESTÁGIO ATUAL</p>
                     <p style={{ fontSize: '20px', fontWeight: '700', margin: '4px 0 16px' }}>{selectedLead.stage}</p>
                     <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
                        <div style={{ width: `${(leads.find(l => l.id === selectedLeadId).stage === 'Vendido' ? 100 : 25 * (['Interesse', 'Orçamento', 'Negociação', 'Vendido'].indexOf(selectedLead.stage) + 1))}%`, height: '100%', background: PRIMARY_GRADIENT }} />
                     </div>
                     <button className="btn-primary" style={{ width: '100%', fontSize: '13px' }} onClick={advanceStage}>
                        Avançar para Próxima Etapa
                     </button>
                  </div>
               </section>

               <section>
                  <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>IA - NOTAS PRIVADAS</h4>
                  <div style={{ fontSize: '12px', background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '10px', color: '#f59e0b', border: '1px dashed #f59e0b' }}>
                     <p>🤖 "O cliente demonstrou sensibilidade ao preço do porcelanato polido. Recomendo enfatizar o desconto progressivo acima de 100m²."</p>
                  </div>
               </section>
            </div>
          </div>
        )}

        {/* VIEW: KANBAN CRM */}
        {activeTab === 'crm' && (
           <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h2>Gestão Portfólio de Obras</h2>
                 <button className="btn-primary" style={{ padding: '10px 20px' }}><Plus size={18}/> Novo Negócio</button>
              </div>
              <div style={{ display: 'flex', gap: '16px', flex: 1, overflowX: 'auto', paddingBottom: '20px' }}>
                {["Interesse", "Orçamento", "Negociação", "Vendido"].map(stage => (
                   <div key={stage} style={{ minWidth: '300px', flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontWeight: '700' }}>{stage}</span>
                        <span style={{ opacity: 0.5 }}>{leads.filter(l => l.stage === stage).length}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {leads.filter(l => l.stage === stage).map(l => (
                          <KanbanCard key={l.id} lead={l} />
                        ))}
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function MetricCard({ label, value, icon }) {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{icon}</div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</p>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>{value}</h2>
    </div>
  );
}

function NavIcon({ icon, active, onClick, tooltip }) {
  return (
    <div onClick={onClick} title={tooltip} style={{ cursor: 'pointer', padding: '12px', borderRadius: '14px', background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: active ? '#6366f1' : '#94a3b8', transition: '0.3s' }}>{icon}</div>
  );
}

function LeadRow({ lead, selected, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: '16px', borderRadius: '14px', cursor: 'pointer', marginBottom: '8px', background: selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: '1px solid', borderColor: selected ? 'rgba(99, 102, 241, 0.2)' : 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
         <span style={{ fontWeight: '600', fontSize: '14px' }}>{lead.name}</span>
         <span style={{ fontSize: '10px', opacity: 0.5 }}>{lead.time}</span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.lastMsg}</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
         <span style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>{lead.tag}</span>
         <span style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'white' }}>{lead.stage}</span>
      </div>
    </div>
  );
}

function KanbanCard({ lead }) {
  return (
    <div className="glass-panel animate-fade" style={{ padding: '20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
       <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>{lead.name}</p>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#10b981', fontWeight: '700', fontSize: '13px' }}>
             R$ {lead.value.toLocaleString('pt-BR')}
          </div>
          <Avatar size={24} text={lead.name[0]} />
       </div>
    </div>
  );
}

function Msg({ type, text, time }) {
  const isAI = type === 'ai';
  const isMe = type === 'send';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: (isMe || isAI) ? 'flex-end' : 'flex-start', gap: '4px' }}>
      <div style={{ 
        maxWidth: '75%', padding: '12px 16px', borderRadius: '16px', fontSize: '14px',
        background: isAI ? PRIMARY_GRADIENT : (isMe ? '#334155' : 'rgba(255,255,255,0.05)'),
        boxShadow: isAI ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
      }}>
        {isAI && <p style={{ fontSize: '10px', fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '6px', paddingBottom: '2px' }}>🤖 AURA IA</p>}
        {text}
      </div>
      <span style={{ fontSize: '10px', opacity: 0.4 }}>{time}</span>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
       <div className="glass-panel animate-fade" style={{ padding: '48px', width: '420px', textAlign: 'center' }}>
          <div style={{ background: PRIMARY_GRADIENT, width: '60px', height: '60px', borderRadius: '12px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>AuraChat <span style={{ color: '#6366f1' }}>CRM</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Workspaces & Intelligence</p>
          <input type="text" className="glass-input" defaultValue="admin" style={{ width: '100%', marginBottom: '16px' }} />
          <input type="password" className="glass-input" defaultValue="1234" style={{ width: '100%', marginBottom: '32px' }} />
          <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Plataforma</button>
       </div>
    </div>
  );
}

function AgentRow({ name, role, status, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
       <Avatar text={name[0]} size={32} />
       <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: '600' }}>{name}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{role}</p>
       </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
          {status}
       </div>
    </div>
  );
}

function DataField({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
      <input type="text" className="glass-input" defaultValue={value} style={{ width: '100%', padding: '10px', fontSize: '13px' }} />
    </div>
  );
}

function ActivityResult({ text, time }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
       <p style={{ fontSize: '12px', flex: 1 }}>{text}</p>
       <span style={{ fontSize: '10px', opacity: 0.4, marginLeft: '10px' }}>{time}</span>
    </div>
  );
}

function Avatar({ text, size = 40 }) {
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '50%', background: PRIMARY_GRADIENT, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      fontSize: size / 2.5, fontWeight: '700' 
    }}>
      {text}
    </div>
  );
}

export default App;
