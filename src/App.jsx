import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, HandPointing as Hand, ArrowRight, 
  Plus, Key, RefreshCcw, Power, UserPlus, Search, 
  ChevronDown, LayoutDashboard, Settings, LogOut, DollarSign,
  BarChart, Zap, Clock, CheckCircle, Package, Send,
  MapPin, ClipboardList, CheckCircle2, MoreHorizontal, Camera
} from 'lucide-react';

// ==========================================
// MOCK DATA - PEREIRA CRM & LOGÍSTICA
// ==========================================
const INITIAL_TEAM = [
  { id: 1, name: "Maria Vendas", role: "Vendedora", status: "Em Chat", sector: "Vendas", img: "MV" },
  { id: 2, name: "Roberto Log", role: "Logística", status: "Online", sector: "Entrega", img: "RL" },
  { id: 3, name: "Cláudia Compras", role: "Compradora", status: "Pausa", sector: "Compras", img: "CC" },
  { id: 4, name: "Aura IA", role: "Autônomo", status: "Ativo 24/7", sector: "IA", img: "AI" },
];

const INITIAL_DELIVERIES = [
  { id: 501, client: "Condomínio Vila Verde", items: "85m² Porcelanato Polido", status: "Pendente", pallets: 4, address: "Av. Tiradentes, 450", priority: "Alta" },
  { id: 502, client: "Reforma Dra. Ana", items: "12m² Azulejo Decorado", status: "Pendente", pallets: 1, address: "Rua Augusta, 1200", priority: "Normal" },
  { id: 503, client: "Sítio Primavera", items: "200m² Piso Cerâmico", status: "Saiu para Entrega", pallets: 10, address: "Rodovia BR-101, Km 45", priority: "Urgente" },
  { id: 504, client: "Escritório Central", items: "30m² Rodapé PVC", status: "Entregue", pallets: 1, address: "Rua Curitiba, 88", priority: "Normal", proof: true },
];

const ONGOING_CHATS = [
  { id: 10, agent: "Maria Vendas", customer: "João Silva", topic: "90x90 Polido", time: "3m atrás" },
  { id: 11, agent: "Aura IA", customer: "Construtora Alfa", topic: "Metragem Obra", time: "1m atrás" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [isSpying, setIsSpying] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  // ==========================================
  // FUNÇÕES DE LOGÍSTICA & GESTÃO
  // ==========================================
  const moveDelivery = (id, newStatus) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus, proof: newStatus === 'Entregue' } : d));
  };

  const changeSector = (userId, newSector) => {
    setTeam(team.map(u => u.id === userId ? { ...u, sector: newSector } : u));
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden" style={{ display: 'flex' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: '#2563eb', padding: '8px', borderRadius: '10px' }}>
             <Zap size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '20px' }}>Pereira <span style={{ color: '#2563eb' }}>CRM</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<Truck size={20}/>} label="Logística / Entregas" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
          <SidebarLink icon={<Users size={20}/>} label="Equipe" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
          <SidebarLink icon={<MessageCircle size={20}/>} label="Radar Monitor" active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
        </nav>

        <div onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', color: '#ef4444', fontWeight: '500' }}>
           <LogOut size={18} /> Sair
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        {/* KPI HEADER */}
        <header style={{ marginBottom: '32px' }}>
           <h1 style={{ fontSize: '24px', fontWeight: '700' }}>{activeTab === 'logistics' ? 'Controle de Entregas' : 'Painel de Gestão'}</h1>
           <p style={{ color: '#64748b', fontSize: '14px' }}>Operação atual da Pereira Acabamentos</p>
        </header>

        {/* VIEW: DASHBOARD REFINADO */}
        {activeTab === 'dashboard' && (
           <div className="animate-view" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', gridColumn: 'span 2' }}>
                 <KPICard label="Faturamento Dia" value="R$ 15.200" trend="+12%" icon={<DollarSign color="#2563eb"/>} />
                 <KPICard label="Metragem Total" value="1.240 m²" trend="+4%" icon={<Package color="#8b5cf6"/>} />
                 <KPICard label="Entregas em Rota" value={deliveries.filter(d => d.status === 'Saiu para Entrega').length} trend="Ativo" icon={<Truck color="#10b981"/>} />
                 <KPICard label="Sucesso Entrega" value="98%" trend="+1%" icon={<CheckCircle2 color="#3b82f6"/>} />
              </div>

              <div className="manager-card" style={{ gridColumn: 'span 1' }}>
                 <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Radar de Atendimento</h3>
                 {ONGOING_CHATS.map(chat => (
                   <div key={chat.id} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px' }}><b>{chat.agent}</b> falando com <b>{chat.customer.split(' ')[0]}</b></div>
                      <button className="btn-ghost" onClick={() => setIsSpying(chat)}><Eye size={16}/></button>
                   </div>
                 ))}
              </div>

              <div className="manager-card" style={{ gridColumn: 'span 1', borderLeft: '4px solid #ef4444' }}>
                 <h4 style={{ color: '#ef4444', marginBottom: '12px' }}>Alertas de Gargalo</h4>
                 <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pendente Obra Vila Verde</span> <span style={{ fontWeight: 'bold' }}>Há 2 dias</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estoque Porcelanato curva A</span> <span style={{ color: '#ef4444' }}>Baixo</span></div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: LOGÍSTICA (NOVO KANBAN) */}
        {activeTab === 'logistics' && (
           <div className="animate-view" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', height: '100%' }}>
              
              {/* COLUNA: PENDENTE */}
              <LogisticsColumn title="Pendente" color="#f59e0b" count={deliveries.filter(d => d.status === 'Pendente').length}>
                 {deliveries.filter(d => d.status === 'Pendente').map(d => (
                    <DeliveryCard key={d.id} delivery={d} nextStatus="Saiu para Entrega" onMove={moveDelivery} />
                 ))}
              </LogisticsColumn>

              {/* COLUNA: SAIU PARA ENTREGA */}
              <LogisticsColumn title="Saiu para Entrega" color="#2563eb" count={deliveries.filter(d => d.status === 'Saiu para Entrega').length}>
                 {deliveries.filter(d => d.status === 'Saiu para Entrega').map(d => (
                    <DeliveryCard key={d.id} delivery={d} nextStatus="Entregue" onMove={moveDelivery} isMoving />
                 ))}
              </LogisticsColumn>

              {/* COLUNA: ENTREGUE */}
              <LogisticsColumn title="Entregue" color="#10b981" count={deliveries.filter(d => d.status === 'Entregue').length}>
                 {deliveries.filter(d => d.status === 'Entregue').map(d => (
                    <DeliveryCard key={d.id} delivery={d} isDone />
                 ))}
              </LogisticsColumn>

           </div>
        )}

        {/* VIEW: EQUIPE */}
        {activeTab === 'team' && (
           <div className="manager-card animate-view" style={{ padding: 0 }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                 <h3>Equipe e Permissões</h3>
                 <button className="btn-action btn-primary"><UserPlus size={16} style={{marginRight: '8px'}}/> Novo Acesso</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead style={{ background: '#f8fafc', fontSize: '11px', color: '#64748b' }}>
                    <tr>
                       <th style={{ padding: '16px', textAlign: 'left' }}>FUNCIONÁRIO</th>
                       <th style={{ padding: '16px', textAlign: 'left' }}>SETOR ATUAL</th>
                       <th style={{ padding: '16px', textAlign: 'left' }}>STATUS</th>
                       <th style={{ padding: '16px', textAlign: 'left' }}>AÇÕES</th>
                    </tr>
                 </thead>
                 <tbody>
                    {team.map(u => (
                       <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{u.img}</div>
                             <b>{u.name}</b>
                          </td>
                          <td style={{ padding: '16px' }}>
                             <select className="input-field" style={{ padding: '4px', fontSize: '12px' }} value={u.sector} onChange={(e) => changeSector(u.id, e.target.value)}>
                                <option>Vendas</option>
                                <option>Entrega</option>
                                <option>Compras</option>
                             </select>
                          </td>
                          <td style={{ padding: '16px' }}>
                             <span style={{ fontSize: '12px', color: u.status === 'Inativo' ? '#ef4444' : '#10b981' }}>● {u.status}</span>
                          </td>
                          <td style={{ padding: '16px' }}>
                             <button className="btn-ghost" title="Resetar Senha"><Key size={16}/></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

      </main>

      {/* MODAL MODO ESPIÃO */}
      {isSpying && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
           <div className="animate-view" style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                 <h3>Espionando: {isSpying.customer}</h3>
                 <button onClick={() => setIsSpying(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
              </div>
              <div style={{ background: '#f1f5f9', height: '240px', borderRadius: '12px', padding: '16px', overflowY: 'auto', marginBottom: '20px' }}>
                 <p style={{ fontSize: '14px', marginBottom: '10px' }}><b>{isSpying.customer}:</b> Preciso de desconto no frete...</p>
                 <p style={{ fontSize: '14px', color: '#2563eb' }}><b>{isSpying.agent}:</b> Vou falar com o meu gerente.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                 <input type="text" className="input-field" placeholder="Escreva um sussurro para o vendedor..." />
                 <button className="btn-action" style={{ background: '#f59e0b', color: 'white' }}>Enviar Sussurro</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTES DE UI
// ==========================================

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', background: active ? '#eff6ff' : 'transparent', color: active ? '#2563eb' : '#64748b', fontWeight: active ? '600' : '500', transition: '0.2s' }}>
      {icon} <span style={{ fontSize: '15px' }}>{label}</span>
    </div>
  );
}

function KPICard({ label, value, trend, icon }) {
  return (
    <div className="manager-card">
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '12px' }}>{icon}</div>
          <span style={{ fontSize: '12px', color: trend.startsWith('+') ? '#10b981' : '#64748b', fontWeight: 'bold' }}>{trend}</span>
       </div>
       <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>{label}</p>
       <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
    </div>
  );
}

function LogisticsColumn({ title, color, count, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
          <h3 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
          <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{count}</span>
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  );
}

function DeliveryCard({ delivery, nextStatus, onMove, isMoving, isDone }) {
  return (
    <div className="manager-card animate-view" style={{ padding: '16px', borderLeft: `3px solid ${delivery.priority === 'Urgente' ? '#ef4444' : '#e2e8f0'}` }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>ID #{delivery.id}</span>
          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>{delivery.pallets} PALLETS</span>
       </div>
       <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>{delivery.client}</h4>
       <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{delivery.items}</p>
       
       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>
          <MapPin size={12} /> {delivery.address}
       </div>

       {nextStatus && (
          <button className="btn-action btn-primary" style={{ width: '100%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => onMove(delivery.id, nextStatus)}>
             {isMoving ? 'Confirmar Chegada' : 'Despachar Carga'} <ArrowRight size={14} />
          </button>
       )}

       {isDone && (
          <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600' }}>
             <Camera size={16} /> Comprovante Assinado
          </div>
       )}
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
         <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>AuraChat <span style={{ color: '#2563eb' }}>Logistics</span></h2>
         <p style={{ color: '#64748b', marginBottom: '32px' }}>Módulo Pereira Acabamentos</p>
         <button className="btn-action btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Painel</button>
      </div>
    </div>
  );
}

export default App;
