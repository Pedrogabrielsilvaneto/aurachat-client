import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, HandPointing as Hand, ArrowRight, 
  Plus, Key, RefreshCcw, Power, UserPlus, Search, 
  ChevronDown, LayoutDashboard, Settings, LogOut, DollarSign,
  BarChart, Zap, Clock, CheckCircle, Package, Send
} from 'lucide-react';

// ==========================================
// MOCK DATA - PEREIRA ACABAMENTOS
// ==========================================
const INITIAL_TEAM = [
  { id: 1, name: "Maria Vendas", role: "Vendedora", status: "Em Chat", sector: "Vendas", img: "MV" },
  { id: 2, name: "Roberto Log", role: "Logística", status: "Online", sector: "Entrega", img: "RL" },
  { id: 3, name: "Cláudia Compras", role: "Compradora", status: "Pausa", sector: "Compras", img: "CC" },
  { id: 4, name: "Aura IA", role: "Autônomo", status: "Ativo 24/7", sector: "IA", img: "AI" },
];

const ONGOING_CHATS = [
  { id: 10, agent: "Maria Vendas", customer: "João Silva", topic: "Porcelanato 90x90", time: "3m atrás" },
  { id: 11, agent: "Aura IA", customer: "Construtora Alfa", topic: "Cotação 200m²", time: "1m atrás" },
  { id: 12, agent: "Roberto Log", customer: "Entrega #4592", topic: "Status Rota", time: "10m atrás" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [radar, setRadar] = useState(ONGOING_CHATS);
  const [isSpying, setIsSpying] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  // ==========================================
  // FUNÇÕES DE GESTÃO (2 CLIQUES)
  // ==========================================
  const changeSector = (userId, newSector) => {
    setTeam(team.map(u => u.id === userId ? { ...u, sector: newSector, role: newSector === 'Entrega' ? 'Logística' : newSector === 'Vendas' ? 'Vendedor' : u.role } : u));
  };

  const toggleUser = (userId) => {
    setTeam(team.map(u => u.id === userId ? { ...u, status: u.status === 'Inativo' ? 'Online' : 'Inativo' } : u));
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden" style={{ display: 'flex' }}>
      
      {/* SIDEBAR MINIMALISTA */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: '#2563eb', padding: '8px', borderRadius: '10px' }}>
             <Zap size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '20px', letterSpacing: '-0.5px' }}>Pereira <span style={{ color: '#2563eb' }}>CRM</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<Users size={20}/>} label="Equipe" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
          <SidebarLink icon={<MessageCircle size={20}/>} label="Radar de Chats" active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
          <div style={{ margin: '20px 0', height: '1px', background: '#f1f5f9' }} />
          <SidebarLink icon={<Settings size={20}/>} label="Configurações" />
        </nav>

        <div onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', color: '#ef4444', fontWeight: '500' }}>
           <LogOut size={18} /> Sair do Painel
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        {/* CABEÇALHO KPI */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Centro de Comando</h1>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Pedro, veja o que está acontecendo na sua loja agora.</p>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-action" style={{ background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <AlertTriangle size={18} /> 3 Alertas Críticos
                </button>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
             <KPICard label="Faturamento Dia" value="R$ 12.450" trend="+15%" icon={<DollarSign color="#2563eb"/>} />
             <KPICard label="Metragem Vendida" value="840 m²" trend="+8%" icon={<Package color="#8b5cf6"/>} />
             <KPICard label="Leads IA vs Humano" value="24 / 12" trend="IA: 66%" icon={<Bot color="#10b981"/>} />
             <KPICard label="Taxa de Conversão" value="18.4%" trend="-2%" icon={<TrendingUp color="#3b82f6"/>} />
          </div>
        </header>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="animate-view" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
             
             {/* RADAR DE ATENDIMENTOS (MODO ESPIÃO) */}
             <div className="manager-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                   <h3 style={{ fontSize: '18px' }}>Radar de Atendimentos</h3>
                   <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>• AO VIVO</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {radar.map(chat => (
                     <div key={chat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>{chat.agent[0]}</div>
                           <div>
                              <p style={{ fontSize: '14px', fontWeight: '600' }}>{chat.agent} ↔ {chat.customer}</p>
                              <p style={{ fontSize: '12px', color: '#64748b' }}>Assunto: {chat.topic}</p>
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                           <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setIsSpying(chat)}>
                              <Eye size={16} /> Espionar
                           </button>
                           <button className="btn-action" style={{ padding: '6px 12px', borderRadius: '6px', background: '#2563eb', color: 'white', fontSize: '12px' }}>Assumir</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* RESUMO MULTISSETORIAL */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="manager-card" style={{ borderLeft: '4px solid #ef4444' }}>
                   <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                      <AlertTriangle size={18} /> Gargalos & Alertas
                   </h4>
                   <ul style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Entrega Carga Norte atrasada</span> <strong style={{ color: '#ef4444' }}>+2h</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estoque Porcelanato 120x60</span> <strong style={{ color: '#ef4444' }}>Crítico</strong></li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>5 Orçamentos parados </span> <strong style={{ color: '#f59e0b' }}>Vendas</strong></li>
                   </ul>
                </div>

                <div className="manager-card">
                   <h4 style={{ marginBottom: '16px' }}>Ranking Vendas (Semana)</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <SalesRow name="Maria" value="R$ 45.200" pos="1" />
                      <SalesRow name="João" value="R$ 38.900" pos="2" />
                      <SalesRow name="Aura AI" value="R$ 15.600" pos="3" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TEAM MANAGEMENT VIEW */}
        {activeTab === 'team' && (
          <div className="animate-view">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Gestão de Equipe e Permissões</h2>
                <button className="btn-action btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <UserPlus size={18} /> Novo Usuário
                </button>
             </div>

             <div className="manager-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead style={{ background: '#f8fafc', fontSize: '12px', textTransform: 'uppercase', color: '#64748b' }}>
                      <tr>
                        <th style={{ padding: '16px' }}>Nome/Foto</th>
                        <th style={{ padding: '16px' }}>Setor Atual</th>
                        <th style={{ padding: '16px' }}>Status</th>
                        <th style={{ padding: '16px' }}>Ações Rápidas</th>
                      </tr>
                   </thead>
                   <tbody style={{ fontSize: '14px' }}>
                      {team.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                           <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{user.img}</div>
                              <b>{user.name}</b>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <select className="input-field" style={{ padding: '4px 8px', fontSize: '12px' }} value={user.sector} onChange={(e) => changeSector(user.id, e.target.value)}>
                                 <option value="Vendas">Vendas</option>
                                 <option value="Entrega">Logística</option>
                                 <option value="Compras">Compras</option>
                                 <option value="IA">Inteligência Artif.</option>
                              </select>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <div className="status-badge" style={{ color: user.status === 'Inativo' ? '#94a3b8' : '#10b981' }}>
                                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.status === 'Inativo' ? '#94a3b8' : '#10b981' }} />
                                 {user.status}
                              </div>
                           </td>
                           <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                 <button title="Resetar Senha" style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}><Key size={18}/></button>
                                 <button title="Desativar" onClick={() => toggleUser(user.id)} style={{ color: user.status === 'Inativo' ? '#10b981' : '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Power size={18}/>
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

      </main>

      {/* MODO ESPIÃO - OVERLAY */}
      {isSpying && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
           <div className="animate-view" style={{ background: 'white', width: '600px', borderRadius: '16px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                 <h3>Modo Espião: {isSpying.customer}</h3>
                 <button onClick={() => setIsSpying(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Fechar</button>
              </div>
              <div style={{ background: '#f8fafc', height: '300px', borderRadius: '12px', padding: '20px', marginBottom: '24px', overflowY: 'auto', fontSize: '14px' }}>
                 <p style={{ marginBottom: '10px' }}><b>Cliente:</b> Olá Maria, quanto fica o frete para o Morumbi?</p>
                 <p style={{ marginBottom: '10px', color: '#2563eb' }}><b>Maria:</b> Oi João! Deixa eu verificar aqui para você...</p>
                 <p style={{ padding: '8px', background: '#fef3c7', borderRadius: '8px', color: '#92400e', fontSize: '11px', fontStyle: 'italic' }}>🛡️ IA AURA SUGERE: "Oferece frete grátis se ele adicionar 5 sacos de argamassa premium."</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <input type="text" className="input-field" placeholder="Mandar 'Sussurro' para o vendedor..." style={{ flex: 1 }} />
                 <button className="btn-action" style={{ background: '#f59e0b', color: 'white' }}>Sussurrar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', background: active ? '#eff6ff' : 'transparent', color: active ? '#2563eb' : '#64748b', fontWeight: active ? '600' : '500', transition: '0.2s' }}>
      {icon} {label}
    </div>
  );
}

function KPICard({ label, value, trend, icon }) {
  const isUp = !trend.startsWith('-');
  return (
    <div className="manager-card">
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ color: '#2563eb', background: '#eff6ff', padding: '8px', borderRadius: '8px' }}>{icon}</div>
          <span style={{ fontSize: '12px', color: isUp ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{trend}</span>
       </div>
       <p style={{ color: '#64748b', fontSize: '13px' }}>{label}</p>
       <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{value}</h3>
    </div>
  );
}

function SalesRow({ name, value, pos }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px' }}>
       <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ opacity: 0.3, fontWeight: 'bold' }}>#{pos}</span>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{name}</span>
       </div>
       <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="manager-card animate-view" style={{ width: '400px', textAlign: 'center', padding: '48px' }}>
         <div style={{ background: '#2563eb', width: '60px', height: '60px', borderRadius: '14px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={32} color="white" />
         </div>
         <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>AuraChat <span style={{ color: '#2563eb' }}>Manager</span></h2>
         <p style={{ color: '#64748b', marginBottom: '32px' }}>Pereira Acabamentos • Acesso Restrito</p>
         <input type="text" className="input-field" defaultValue="admin" style={{ marginBottom: '16px' }} />
         <input type="password" className="input-field" defaultValue="1234" style={{ marginBottom: '32px' }} />
         <button className="btn-action btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Painel de Controle</button>
      </div>
    </div>
  );
}

function Bot({ color }) { return <Zap size={20} color={color} />; }

export default App;
