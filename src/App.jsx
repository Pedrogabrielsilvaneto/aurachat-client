import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile
} from 'lucide-react';

// ==========================================
// MOCK DATA - PADRÃO VISUAL ABSOLUTO
// ==========================================
const INITIAL_TEAM = [
  { id: 1, name: "Maria Vendas", role: "Vendedora", status: "Online", sector: "Vendas", activeChats: [
    { id: 201, customer: "João Silva", lastMsg: "Qual o prazo do 90x90?" },
    { id: 202, customer: "Ana Revest", lastMsg: "Manda o link do boleto." }
  ], waiting: 2 },
  { id: 2, name: "Roberto Log", role: "Logística", status: "Online", sector: "Entrega", activeChats: [
    { id: 203, customer: "Entrega #559", lastMsg: "Já estou no local." }
  ], waiting: 0 },
  { id: 3, name: "Aura IA", role: "Autônomo", status: "Ativa 24/7", sector: "IA", activeChats: [], waiting: 5 },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedAttendant, setSelectedAttendant] = useState(null);
  const [selectedSpyChat, setSelectedSpyChat] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      
      {/* HEADER UNIFICADO (image_0.png Standard) */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px' }}>
            <Zap size={22} color="white" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '22px', color: '#0f172a' }}>AuraChat</span>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input type="text" className="search-bar" placeholder="Pesquisar..." style={{ paddingLeft: '44px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div onClick={() => setIsDarkMode(!isDarkMode)} style={{ cursor: 'pointer', color: '#64748b' }}>
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>G</div>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Gestor</span>
           </div>
        </div>
      </header>

      {/* SIDEBAR COMPLETA */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras" />
        
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        
        <SidebarLink icon={<MessageSquare size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} variant="highlight" />
        
        <div style={{ marginTop: 'auto' }}>
           <SidebarLink icon={<Settings size={20}/>} label="Configurações" />
           <SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {activeTab === 'dashboard' && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             
             {/* CARDS DE KPI ALINHADOS */}
             <div className="kpi-grid">
                <KPICard label="Faturamento Mês" value="R$ 142.500" trend="+12%" icon={<DollarSign size={20}/>} color="#2563eb" />
                <KPICard label="Volume Vendido" value="1.840 m²" trend="+8%" icon={<Package size={20}/>} color="#8b5cf6" />
                <KPICard label="Leads Ativos (IA/Hum)" value="48 / 12" trend="80% IA" icon={<Zap size={20}/>} color="#10b981" />
                <KPICard label="Gargalos (Atrasos)" value="03" trend="Urgente" icon={<AlertTriangle size={20}/>} color="#ef4444" />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: selectedAttendant ? '1fr 400px' : '1fr', gap: '24px', flex: 1 }}>
                
                {/* TABELA DE SUPERVISÃO CENTRAL */}
                <div className="table-container card" style={{ padding: 0 }}>
                   <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Supervisão de Atendimentos de Equipe</h3>
                      <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>Filtros Avançados</button>
                   </div>
                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#f8fafc', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                         <tr>
                           <th style={{ padding: '16px', textAlign: 'left' }}>Atendente</th>
                           <th style={{ padding: '16px', textAlign: 'left' }}>Setor</th>
                           <th style={{ padding: '16px', textAlign: 'center' }}>Chats Ativos</th>
                           <th style={{ padding: '16px', textAlign: 'center' }}>Chats Espera</th>
                           <th style={{ padding: '16px', textAlign: 'right' }}>Ação Espião</th>
                         </tr>
                      </thead>
                      <tbody>
                         {INITIAL_TEAM.map(u => (
                           <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', background: selectedAttendant?.id === u.id ? '#eff6ff' : 'transparent' }}>
                              <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '10px' }}>{u.name[0]}</div>
                                 <b style={{ fontSize: '14px' }}>{u.name}</b>
                              </td>
                              <td style={{ padding: '16px', fontSize: '14px' }}>{u.sector}</td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                 <span style={{ color: '#10b981', fontWeight: 'bold' }}>{u.activeChats.length}</span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                 <span style={{ color: u.waiting > 0 ? '#ef4444' : '#64748b' }}>{u.waiting}</span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'right' }}>
                                 <button onClick={() => setSelectedAttendant(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}>
                                    <Eye size={18} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* PAINEL DIREITO: MODO ESPIÃO (Hierarquia Standard) */}
                {selectedAttendant && (
                   <div className="card animate-in" style={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#fcfcfc' }}>
                      <div style={{ padding: '20px', background: '#fef2f2', borderBottom: '1px solid #fee2e2', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between' }}>
                         <div>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444' }}>MODO ESPIÃO ATIVO</h3>
                            <p style={{ fontSize: '12px', color: '#ef4444' }}>Monitorando: {selectedAttendant.name}</p>
                         </div>
                         <button onClick={() => { setSelectedAttendant(null); setSelectedSpyChat(null); }} style={{ height: '24px', opacity: 0.5 }}>×</button>
                      </div>

                      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                         <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase' }}>Clientes Ativos no WhatsApp</p>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {selectedAttendant.activeChats.map(chat => (
                              <div 
                                key={chat.id} 
                                onClick={() => setSelectedSpyChat(chat)}
                                style={{ 
                                   padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer',
                                   background: selectedSpyChat?.id === chat.id ? '#eff6ff' : 'white',
                                   borderColor: selectedSpyChat?.id === chat.id ? '#2563eb' : '#e2e8f0'
                                }}
                              >
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <b style={{ fontSize: '13px' }}>{chat.customer}</b>
                                    <ChevronRight size={14} color="#94a3b8" />
                                 </div>
                                 <p style={{ fontSize: '11px', color: '#64748b' }}>"{chat.lastMsg}"</p>
                              </div>
                            ))}
                         </div>

                         {selectedSpyChat && (
                           <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                              <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '800', marginBottom: '12px', textAlign: 'center' }}>🛰️ MONITORAMENTO REAL-TIME: INVISÍVEL</p>
                              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '12px', marginBottom: '20px' }}>
                                 <div style={{ marginBottom: '8px' }}><b>Cliente:</b> {selectedSpyChat.lastMsg}</div>
                                 <div style={{ color: '#2563eb' }}><b>{selectedAttendant.name}:</b> Vou verificar agora...</div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                 <button className="btn-primary" style={{ background: '#f59e0b', width: '100%' }}>Sussurrar p/ Vendedor</button>
                                 <button className="btn-primary" style={{ background: '#ef4444', width: '100%' }}>Assumir Conversa</button>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                )}

             </div>
          </div>
        )}

        {/* CÓDIGO DO CHAT INTERNO (WHATSAPP STYLE) */}
        {activeTab === 'internal' && (
           <div className="card animate-in" style={{ flex: 1, padding: 0, display: 'grid', gridTemplateColumns: '320px 1fr' }}>
              <div style={{ borderRight: '1px solid #e2e8f0', padding: '20px' }}>
                 <input type="text" className="search-bar" placeholder="Buscar Equipe..." style={{ width: '100%', marginBottom: '20px' }} />
                 {/* ... Lista de contatos ... */}
                 <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '40px' }}>
                    <Users size={48} style={{ margin: '0 auto 12px' }} />
                    <p>Módulo Interno Estilo WhatsApp pronto para comunicação isolada.</p>
                 </div>
              </div>
              <div style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                 Selecione um membro da equipe para conversar
              </div>
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES DE UI COMPACTOS
// ==========================================

function SidebarLink({ icon, label, active, onClick, variant, color }) {
  return (
    <div 
      onClick={onClick} 
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', 
        cursor: 'pointer', background: active ? '#eff6ff' : (variant === 'highlight' ? '#eff6ff' : 'transparent'),
        color: active ? '#2563eb' : (color || '#64748b'),
        fontWeight: active ? '700' : '500',
        transition: '0.2s', border: variant === 'highlight' ? '1px dashed #2563eb' : 'none'
      }}
    >
      {icon} <span style={{ fontSize: '14px' }}>{label}</span>
      {variant === 'highlight' && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }} />}
    </div>
  );
}

function KPICard({ label, value, trend, icon, color }) {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ color, background: `${color}10`, padding: '8px', borderRadius: '10px' }}>{icon}</div>
          <span style={{ fontSize: '11px', color: trend === 'Urgente' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{trend}</span>
       </div>
       <p style={{ color: '#64748b', fontSize: '12px' }}>{label}</p>
       <h3 style={{ fontSize: '22px', fontWeight: '800', marginTop: '4px' }}>{value}</h3>
    </div>
  );
}

function MessageSquare(props) { return <MessageSquareIcon {...props} />; }
function MessageSquareIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center', padding: '48px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
         <Zap size={48} color="#2563eb" style={{ margin: '0 auto 24px' }} />
         <h2 style={{ marginBottom: '8px' }}>Logon de Segurança</h2>
         <button className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '24px' }} onClick={onLogin}>Acessar Padrão Pereira</button>
      </div>
    </div>
  );
}

export default App;
