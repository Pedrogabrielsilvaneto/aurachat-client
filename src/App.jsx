import React, { useState, useEffect } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Settings, Users, BarChart3, Zap, 
  Search, Filter, Plus, ChevronRight, MoreVertical, Phone, Video, Info, 
  Paperclip, Smile, Clock, CheckCircle2, AlertCircle, Kanban, DollarSign, 
  Tag, Calendar, FileText, History, Bell, UserPlus, LogOut, Sun, Moon
} from 'lucide-react';

// ==========================================
// CONSTANTES DE DESIGN & ESTILO
// ==========================================
const PRIMARY_GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";
const GLASS_BG = "rgba(30, 41, 59, 0.7)";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');
  
  // ==========================================
  // ESTADOS DO CRM & CHAT
  // ==========================================
  const [leads, setLeads] = useState([
    { id: 101, name: "João Porcelanato", lastMsg: "Quero ver o piso 90x90", time: "10:30", type: "Ativo", tag: "Comercial", stage: "Interesse" },
    { id: 102, name: "Arquiteta Cláudia", lastMsg: "O acabamento é brilhante?", time: "09:45", type: "Pendentes", tag: "Projeto", stage: "Orçamento" },
    { id: 103, name: "Construtora Silva", lastMsg: "Preciso de 500m2", time: "Ontem", type: "Potenciais", tag: "Atacado", stage: "Negociação" },
  ]);

  const [kanbanData, setKanbanData] = useState({
    'Atendimento': [101],
    'Follow-up': [102],
    'Negociação': [103],
    'Vendido': [],
    'Pós-Venda': []
  });

  // ==========================================
  // LÓGICA DE INTERFACE
  // ==========================================
  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-root ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ display: 'flex', height: '100vh', background: '#0f172a', color: 'white' }}>
      
      {/* SIDEBAR SaaS */}
      <nav className="glass-panel" style={{ width: '80px', margin: '12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: '24px' }}>
        <div style={{ background: PRIMARY_GRADIENT, padding: '12px', borderRadius: '14px', boxShadow: '0 0 15px var(--primary-glow)' }}>
          <Zap size={24} color="white" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <NavIcon icon={<LayoutDashboard size={22}/>} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} tooltip="Painel Global" />
          <NavIcon icon={<MessageSquare size={22}/>} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} tooltip="Omnichannel" />
          <NavIcon icon={<Kanban size={22}/>} active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} tooltip="Funil de Vendas" />
          <NavIcon icon={<Users size={22}/>} active={activeTab === 'team'} onClick={() => setActiveTab('team')} tooltip="Equipe" />
          <NavIcon icon={<BarChart3 size={22}/>} active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} tooltip="Relatórios" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <NavIcon icon={isDarkMode ? <Sun size={20}/> : <Moon size={20}/>} onClick={() => setIsDarkMode(!isDarkMode)} />
          <NavIcon icon={<Settings size={20}/>} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <div onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} style={{ cursor: 'pointer', opacity: 0.6 }}><LogOut size={20}/></div>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 12px 12px 0' }}>
        
        {/* VIEW: DASHBOARD GLOBAL */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
               <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Dashboard AuraChat</h1>
               <div style={{ display: 'flex', gap: '12px' }}>
                  <select className="glass-input" style={{ padding: '8px' }}>
                     <option>Todos os Departamentos</option>
                     <option>Comercial</option>
                     <option>Financeiro</option>
                  </select>
               </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <MetricCard label="Mensagens Novas" value="48" icon={<Bell color="#6366f1"/>} />
              <MetricCard label="Atendimentos Ativos" value="12" icon={<Clock color="#22d3ee"/>} />
              <MetricCard label="Aguardando Retorno" value="07" icon={<AlertCircle color="#f59e0b"/>} />
              <MetricCard label="Vendas (Ticket Médio)" value="R$ 4.2k" icon={<DollarSign color="#10b981"/>} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <div className="glass-panel" style={{ padding: '24px', minHeight: '300px' }}>
                 <h3>Status da Equipe (Em Tempo Real)</h3>
                 <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <AgentRow name="Pedro Neto" role="Supervisor" status="Online" color="#10b981" />
                    <AgentRow name="Mariana Vendas" role="Atendente" status="Em Atendimento" color="#3b82f6" />
                    <AgentRow name="Aura AI" role="Agente Autônomo" status="24/7 Ativa" color="#8b5cf6" />
                 </div>
               </div>
               <div className="glass-panel" style={{ padding: '24px' }}>
                 <h3>IA - Análise de Sentimento</h3>
                 {/* Mock Chart Area */}
                 <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    [ Gráfico de Satisfação do Cliente ]
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* VIEW: PAINEL TRIPLO (CHAT OMNICHANNEL) */}
        {activeTab === 'chat' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: '12px' }}>
            
            {/* COLUNA ESQUERDA: FILAS */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '20px' }}>
                  <input type="text" className="glass-input" placeholder="Buscar lead..." style={{ width: '100%', marginBottom: '16px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: '#4f46e5' }}>Ativos</span>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>Potenciais</span>
                  </div>
               </div>
               <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
                  {leads.map(lead => (
                    <LeadRow key={lead.id} lead={lead} selected={selectedChat?.id === lead.id} onClick={() => setSelectedChat(lead)} />
                  ))}
               </div>
            </div>

            {/* COLUNA CENTRAL: CONVERSA */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
               {selectedChat ? (
                 <>
                   <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: PRIMARY_GRADIENT }} />
                         <div>
                            <p style={{ fontWeight: '600' }}>{selectedChat.name}</p>
                            <p style={{ fontSize: '11px', color: '#10b981' }}>Digitando...</p>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                         <button className="glass-btn"><Phone size={18}/></button>
                         <button className="glass-btn"><Video size={18}/></button>
                         <button className="glass-btn"><Plus size={18}/></button>
                      </div>
                   </div>
                   <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Msg type="recv" text="Olá, gostaria de saber se vocês entregam o porcelanato Portobello 90x90 no centro?" />
                      <Msg type="ai" text="Olá! Sim, entregamos em toda a região central com frete grátis para compras acima de 50m2. Gostaria de uma cotação para qual metragem?" />
                      <Msg type="internal" text="DICA IA: Este cliente tem perfil de compra rápida. Tente fechar a visita." />
                   </div>
                   <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '0 8px' }}>
                         <Paperclip size={20} color="var(--text-muted)" />
                         <Smile size={20} color="var(--text-muted)" />
                      </div>
                      <input type="text" className="glass-input" placeholder="Mensagem Omnichannel..." style={{ flex: 1 }} />
                      <button className="btn-primary" style={{ padding: '10px 24px' }}><Send size={18}/></button>
                   </div>
                 </>
               ) : (
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                    <MessageSquare size={64} style={{ marginBottom: '20px' }} />
                    <p>Selecione uma conversa para iniciar o atendimento</p>
                 </div>
               )}
            </div>

            {/* COLUNA DIREITA: CONTEXTO & IA */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
               <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} /> Contexto do Lead
               </h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <DataField label="Nome Completo" value={selectedChat?.name || "---"} />
                  <DataField label="CPF / CNPJ" value="44.223.112/0001-90" />
                  <DataField label="Protocolo" value="#AUR4592" />
                  
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Funil de Vendas</p>
                    <div className="btn-primary" style={{ display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
                       Prosseguir: Orçamento
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                     <h4 style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '8px' }}>Tarefas (Alarme)</h4>
                     <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} /> Retornar cotação às 15:00
                     </div>
                  </div>
               </div>
            </div>

          </div>
        )}

        {/* VIEW: CRM KANBAN */}
        {activeTab === 'crm' && (
           <div className="animate-fade" style={{ flex: 1, display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px' }}>
              {Object.keys(kanbanData).map(column => (
                <div key={column} style={{ minWidth: '280px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{column}</span>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{kanbanData[column].length}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {kanbanData[column].map(id => {
                      const lead = leads.find(l => l.id === id);
                      return <KanbanCard key={id} lead={lead} />;
                    })}
                    <div style={{ border: '1px dashed var(--border-glass)', padding: '12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', opacity: 0.5 }}>
                      + Novo Negócio
                    </div>
                  </div>
                </div>
              ))}
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE UI
// ==========================================

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
       <div className="glass-panel" style={{ padding: '40px', width: '380px', textAlign: 'center' }}>
          <Zap size={48} color="#6366f1" style={{ marginBottom: '20px' }} />
          <h2>Bem-vindo ao AuraChat</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Acesso Restrito ao CRM</p>
          <input type="text" className="glass-input" placeholder="Usuário" style={{ width: '100%', marginBottom: '12px' }} />
          <input type="password" className="glass-input" placeholder="Senha" style={{ width: '100%', marginBottom: '24px' }} />
          <button className="btn-primary" style={{ width: '100%' }} onClick={onLogin}>Entrar no Sistema</button>
       </div>
    </div>
  );
}

function NavIcon({ icon, active, onClick, tooltip }) {
  return (
    <div 
      onClick={onClick}
      title={tooltip}
      style={{ 
        cursor: 'pointer', padding: '12px', borderRadius: '12px',
        transition: 'all 0.3s',
        background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: active ? '#6366f1' : 'var(--text-muted)'
      }}
    >
      {icon}
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
         <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>{icon}</div>
         <MoreVertical size={16} color="var(--text-muted)" />
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</p>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginTop: '4px' }}>{value}</h2>
    </div>
  );
}

function LeadRow({ lead, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '16px', borderRadius: '14px', cursor: 'pointer', marginBottom: '8px',
        background: selected ? 'rgba(255,255,255,0.05)' : 'transparent',
        border: selected ? '1px solid var(--border-glass)' : '1px solid transparent'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontWeight: '600', fontSize: '14px' }}>{lead.name}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lead.time}</span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.lastMsg}</p>
      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
         <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '4px' }}>{lead.tag}</span>
         <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', borderRadius: '4px' }}>{lead.stage}</span>
      </div>
    </div>
  );
}

function KanbanCard({ lead }) {
   return (
     <div className="glass-panel" style={{ padding: '16px', cursor: 'grab' }}>
        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>{lead.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>R$ 1.250,00</div>
           <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#334155', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>PG</div>
        </div>
     </div>
   );
}

function Msg({ type, text }) {
  const isAI = type === 'ai';
  const isInternal = type === 'internal';
  
  return (
    <div style={{ 
      display: 'flex', justifyContent: type === 'recv' ? 'flex-start' : 'flex-end', marginBottom: '8px'
    }}>
      <div style={{ 
        maxWidth: '85%', padding: '12px 16px', borderRadius: '16px', fontSize: '14px',
        background: isAI ? PRIMARY_GRADIENT : (isInternal ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)'),
        color: isInternal ? '#f59e0b' : 'white',
        border: isInternal ? '1px dashed #f59e0b' : 'none'
      }}>
        {isAI && <div style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>⚡ AURA IA AUTOMATA</div>}
        {isInternal && <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '4px' }}>🔒 NOTA INTERNA</div>}
        {text}
      </div>
    </div>
  );
}

function DataField({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: '500' }}>{value}</p>
    </div>
  );
}

function AgentRow({ name, role, status, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px' }}>
       <div style={{ position: 'relative' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#475569' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: color, border: '2px solid #0f172a' }} />
       </div>
       <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: '600' }}>{name}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{role}</p>
       </div>
       <span style={{ fontSize: '11px', color: color }}>{status}</span>
    </div>
  );
}

export default App;
