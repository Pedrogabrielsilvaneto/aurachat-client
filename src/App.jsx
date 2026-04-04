import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile, Star, MessageSquare as MessageSquareIcon,
  ChevronDown, HelpCircle, ChevronUp, MapPin, Edit3, Save, X
} from 'lucide-react';

// ==========================================
// MOCK DATA - CENTRO DE COMANDO DO MARCOS
// ==========================================
const STRATEGIC_CHATS = [
  { id: 1, customer: "Manoel Gomes", topic: "Porcelanato Premium - $5k", risk: "Alto Valor", color: "#fef2f2" },
  { id: 2, customer: "Inês Lima", topic: "Reclamação de Atraso", risk: "Risco Churn", color: "#fefce8" },
  { id: 3, customer: "Maria Silva", topic: "Dúvida Pagamento PIX", risk: "Apoio Venda", color: "#f0fdf4" },
];

const TEAM_RANKING = [
  { id: 1, name: "Manoel Gomes", sector: "WhatsApp", billing: "R$ 598,37", conv: "28.5%", tmr: "1.2", csat: "4.7" },
  { id: 2, name: "Inês Lima", sector: "WhatsApp", billing: "R$ 330,00", conv: "18.5%", tmr: "1.0", csat: "4.1" },
  { id: 3, name: "Mara Domir", sector: "Atendente", billing: "R$ 991,53", conv: "28.5%", tmr: "1.2", csat: "4.9" },
  { id: 4, name: "Urania Wanhez", sector: "Setor", billing: "R$ 237,70", conv: "15.2%", tmr: "1.5", csat: "3.8" },
];

const INITIAL_DELIVERIES = [
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000 - Apto 42", items: "120m² Porcelanato Polido 90x90", status: 'todo', notes: "" },
  { id: 'PED-502', customer: "Clínica Odonto", address: "Rua das Flores, 45", items: "45m² Revestimento Slim White", status: 'doing', notes: "Entregar nos fundos." },
  { id: 'PED-498', customer: "Residencial Gramado", address: "Rod. Raposo Tavares, Km 22", items: "310m² Piso Cerâmico Curva A", status: 'done', notes: "Recebido por Porteiro José." },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [selectedSpyChat, setSelectedSpyChat] = useState(STRATEGIC_CHATS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const updateDeliveryNotes = (id, newNotes) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, notes: newNotes } : d));
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      
      {/* HEADER UNIFICADO - MARCOS PROPRIETÁRIO */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px' }}>
             <Zap size={22} color="white" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '22px' }}>AuraChat</span>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input type="text" className="search-bar" placeholder="Buscar no sistema..." style={{ paddingLeft: '44px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
              <Bell size={20} />
              <HelpCircle size={20} />
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff5722', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>M</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <b style={{ fontSize: '13px', lineHeight: '1' }}>Marcos</b>
                 <span style={{ fontSize: '10px', color: '#64748b' }}>Gestor Geral</span>
              </div>
              <ChevronDown size={14} />
           </div>
        </div>
      </header>

      {/* SIDEBAR ADMINISTRATIVA */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras" />
        <SidebarLink icon={<Settings size={20}/>} label="Configurações" />
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} color="#2563eb" />
        <div style={{ marginTop: 'auto' }}>
           <SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => setIsAuthenticated(false)} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* VIEW: DASHBOARD ESTRATÉGICO (VISÃO DO MARCOS) */}
        {activeTab === 'dashboard' && (
           <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Painel Comercial Executivo</h1>
                    <div style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Eye size={14} /> Modo Radar de Equipe: Ativo
                    </div>
                 </div>

                 {/* CARDS DE KPI REATIVADOS */}
                 <div className="kpi-grid">
                   <KPICardComplex label="Faturamento Mês" value="R$ 333.447" meta="95% da Meta" trend="up" />
                   <KPICardComplex label="Conversão Loja" value="28.5%" meta="+3.1% vs prev" trend="chart" />
                   <KPICardComplex label="Eficiência Média" value="88%" meta="TMR - 1.2 min" trend="text" />
                   <KPICardComplex label="Satisfação (CSAT)" value="4.7/5" stars={true} meta="Vendas Qualificadas" />
                 </div>

                 {/* RANKING DE PERFORMANCE */}
                 <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                       <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ranking de Desempenho da Equipe</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                       <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                          <tr>
                            <th style={{ padding: '12px 24px', textAlign: 'left' }}>Atendente</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left' }}>Faturamento</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left' }}>Conversão</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left' }}>TMR</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left' }}>CSAT</th>
                          </tr>
                       </thead>
                       <tbody>
                          {TEAM_RANKING.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                               <td style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{u.name[0]}</div>
                                  <b>{u.name}</b>
                               </td>
                               <td style={{ padding: '12px 24px', fontWeight: '600' }}>{u.billing}</td>
                               <td style={{ padding: '12px 24px' }}>{u.conv}</td>
                               <td style={{ padding: '12px 24px' }}>{u.tmr}m</td>
                               <td style={{ padding: '12px 24px', color: '#10b981', fontWeight: 'bold' }}>{u.csat}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* PAINEL DIREITO: INTERVENÇÕES */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div className="card" style={{ padding: '20px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>ALERTA DE CHATS EM RISCO</p>
                    {STRATEGIC_CHATS.map(c => (
                      <div key={c.id} style={{ background: c.color, border: '1px solid #fee2e2', borderRadius: '12px', padding: '12px', marginBottom: '8px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <b style={{ fontSize: '13px' }}>{c.customer}</b>
                            <span style={{ fontSize: '9px', background: '#fff', color: '#ef4444', padding: '2px 4px', border: '1px solid #ef4444', borderRadius: '4px' }}>⚠️ Risco</span>
                         </div>
                         <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{c.topic}</p>
                      </div>
                    ))}
                 </div>
              </aside>
           </div>
        )}

        {/* VIEW: LOGÍSTICA (VISÃO DO MARCOS SOBRE A EXPEDIÇÃO) */}
        {activeTab === 'logistics' && (
           <div className="animate-in">
              <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Operação de Entregas</h1>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>Gestão de fluxos e observações técnicas (Sem chat com cliente)</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                 <LogisticsColumn title="A Realizar" count={deliveries.filter(d => d.status === 'todo').length} color="#64748b">
                    {deliveries.filter(d => d.status === 'todo').map(item => (
                       <LogisticsCard key={item.id} item={item} onStatusChange={updateDeliveryStatus} onNotesChange={updateDeliveryNotes} />
                    ))}
                 </LogisticsColumn>
                 <LogisticsColumn title="Sendo Realizada" count={deliveries.filter(d => d.status === 'doing').length} color="#f59e0b">
                    {deliveries.filter(d => d.status === 'doing').map(item => (
                       <LogisticsCard key={item.id} item={item} onStatusChange={updateDeliveryStatus} onNotesChange={updateDeliveryNotes} />
                    ))}
                 </LogisticsColumn>
                 <LogisticsColumn title="Realizada" count={deliveries.filter(d => d.status === 'done').length} color="#10b981">
                    {deliveries.filter(d => d.status === 'done').map(item => (
                       <LogisticsCard key={item.id} item={item} onStatusChange={updateDeliveryStatus} onNotesChange={updateDeliveryNotes} />
                    ))}
                 </LogisticsColumn>
              </div>
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

function KPICardComplex({ label, value, meta, trend, stars }) {
  return (
    <div className="card" style={{ minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
       <div>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
             {trend === 'up' && <ChevronUp size={18} color="#10b981" />}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Metra: <span style={{ color: '#0f172a', fontWeight: '600' }}>{meta}</span></p>
       </div>
       {stars && (
          <div style={{ display: 'flex', gap: '2px' }}>
             {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i < 5 ? "#f59e0b" : "none"} color="#f59e0b" />)}
          </div>
       )}
    </div>
  );
}

function LogisticsColumn({ title, count, color, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: color, borderRadius: '2px' }} />
          <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>{title}</h3>
          <span style={{ marginLeft: 'auto', background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px', fontSize: '10px' }}>{count}</span>
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  );
}

function LogisticsCard({ item, onStatusChange, onNotesChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNotes, setTempNotes] = useState(item.notes);
  return (
    <div className="card" style={{ padding: '16px', borderLeft: `4px solid ${item.status === 'todo' ? '#cbd5e1' : (item.status === 'doing' ? '#f59e0b' : '#10b981')}` }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>{item.id}</span>
          <select value={item.status} onChange={(e) => onStatusChange(item.id, e.target.value)} style={{ fontSize: '10px', border: 'none', background: '#f1f5f9', borderRadius: '4px' }}>
             <option value="todo">A Realizar</option>
             <option value="doing">Sendo...</option>
             <option value="done">Realizada</option>
          </select>
       </div>
       <b style={{ fontSize: '14px' }}>{item.customer}</b>
       <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 12px' }}>{item.address}</p>
       <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>NOTAS INTERNAS</span>
             <Edit3 size={12} color="#2563eb" style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />
          </div>
          {isEditing ? (
             <div style={{ marginTop: '8px' }}>
                <textarea value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} style={{ width: '100%', height: '50px', fontSize: '11px' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                   <Save size={14} color="#10b981" onClick={() => { onNotesChange(item.id, tempNotes); setIsEditing(false); }} />
                   <X size={14} color="#ef4444" onClick={() => setIsEditing(false)} />
                </div>
             </div>
          ) : <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{item.notes || "..."}</p>}
       </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, color }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', background: active ? '#f1f5f9' : 'transparent', color: active ? (color || '#111b21') : '#64748b', fontWeight: active ? '700' : '500', transition: '0.2s' }}>
      {icon} <span style={{ fontSize: '14px' }}>{label}</span>
      {active && <div style={{ marginLeft: 'auto', width: '4px', height: '14px', background: '#2563eb', borderRadius: '2px' }} />}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center', padding: '48px' }}>
         <Zap size={48} color="#2563eb" style={{ margin: '0 auto 24px' }} />
         <h2 style={{ marginBottom: '32px' }}>AuraChat Manager</h2>
         <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar como Marcos</button>
      </div>
    </div>
  );
}

export default App;
