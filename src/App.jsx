import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile, Star, MessageSquare as MessageSquareIcon,
  ChevronDown, HelpCircle, ChevronUp, MapPin, Edit3, Save, X, Filter
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
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000 - Apto 42", items: "120m² Porcelanato Polido 90x90", status: 'todo', notes: "Apenas após as 14h." },
  { id: 'PED-502', customer: "Clínica Odonto", address: "Rua das Flores, 45", items: "45m² Revestimento Slim White", status: 'doing', notes: "Entregar nos fundos conforme solicitado." },
  { id: 'PED-498', customer: "Residencial Gramado", address: "Rod. Raposo Tavares, Km 22", items: "310m² Piso Cerâmico Curva A", status: 'done', notes: "Recebido por Porteiro José em 01/04." },
  { id: 'PED-505', customer: "Ana Revest", address: "Al. Rio Negro, 150 - Barueri", items: "80m² Piso Cimentício 60x60", status: 'todo', notes: "" },
  { id: 'PED-506', customer: "Roberto Log", address: "Rua Vergueiro, 2500 - SP", items: "12m² Rodapé Slim Wood", status: 'todo', notes: "" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const saveNotes = (id) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, notes: tempNotes } : d));
    setEditingNotesId(null);
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      
      {/* HEADER UNIFICADO */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px' }}>
             <Zap size={22} color="white" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '22px' }}>AuraChat</span>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input type="text" className="search-bar" placeholder="Pesquisar pedidos ou clientes..." style={{ paddingLeft: '44px' }} />
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

      {/* SIDEBAR COMERCIAL */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} color="#2563eb" />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
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
        
        {/* VIEW: LOGÍSTICA (GRADE EXCEL) */}
        {activeTab === 'logistics' && (
           <div className="animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Grade de Entregas Logísticas</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Visão consolidada estilo planilha para operação rápida.</p>
                 </div>
                 <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Filter size={16} /> Filtrar Status
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Plus size={18} /> Novo Pedido
                    </button>
                 </div>
              </div>

              {/* TABELA ESTILO EXCEL */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                       <tr>
                         <th style={{ padding: '14px 20px', width: '100px' }}>Pedido</th>
                         <th style={{ padding: '14px 20px', width: '180px' }}>Cliente</th>
                         <th style={{ padding: '14px 20px' }}>Endereço de Entrega</th>
                         <th style={{ padding: '14px 20px', width: '220px' }}>Itens Vendidos</th>
                         <th style={{ padding: '14px 20px', width: '160px' }}>Status</th>
                         <th style={{ padding: '14px 20px' }}>Observações Técnicas (Interno)</th>
                       </tr>
                    </thead>
                    <tbody style={{ fontSize: '13px' }}>
                       {deliveries.map(item => (
                         <tr key={item.id} style={{ 
                            borderBottom: '1px solid #f1f5f9', 
                            background: item.status === 'done' ? '#f0fdf4' : (item.status === 'doing' ? '#fffbeb' : '#ffffff'),
                            transition: '0.2s'
                         }}>
                            <td style={{ padding: '14px 20px' }}>
                               <span style={{ fontWeight: '800', color: '#2563eb' }}>{item.id}</span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                               <b style={{ color: '#0f172a' }}>{item.customer}</b>
                            </td>
                            <td style={{ padding: '14px 20px', color: '#64748b' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <MapPin size={12} /> {item.address}
                               </div>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                               <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{item.items}</span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                               <select 
                                 value={item.status} 
                                 onChange={(e) => updateDeliveryStatus(item.id, e.target.value)}
                                 style={{ 
                                    padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', 
                                    background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                    color: item.status === 'done' ? '#10b981' : (item.status === 'doing' ? '#f59e0b' : '#64748b')
                                 }}
                               >
                                  <option value="todo">A Realizar</option>
                                  <option value="doing">Sendo Realizada</option>
                                  <option value="done">Realizada</option>
                               </select>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                               {editingNotesId === item.id ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                     <input 
                                       autoFocus
                                       value={tempNotes} 
                                       onChange={(e) => setTempNotes(e.target.value)}
                                       style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #2563eb', fontSize: '12px' }}
                                     />
                                     <Save size={16} color="#10b981" style={{ cursor: 'pointer' }} onClick={() => saveNotes(item.id)} />
                                     <X size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => setEditingNotesId(null)} />
                                  </div>
                               ) : (
                                  <div 
                                    onClick={() => { setEditingNotesId(item.id); setTempNotes(item.notes); }} 
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: item.notes ? '#334155' : '#94a3b8' }}
                                  >
                                     <span style={{ fontStyle: item.notes ? 'normal' : 'italic' }}>{item.notes || "Clique para adicionar nota..."}</span>
                                     <Edit3 size={12} color="#2563eb" opacity={0.5} />
                                  </div>
                                )}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* VIEW: DASHBOARD ESTRATÉGICO */}
        {activeTab === 'dashboard' && (
           <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Dashboard Executivo</h1>
                 </div>
                 <div className="kpi-grid">
                   <KPICardComplex label="Faturamento Mês" value="R$ 333.447" meta="95% da Meta" trend="up" />
                   <KPICardComplex label="Conversão Loja" value="28.5%" meta="+3.1% vs prev" trend="chart" />
                   <KPICardComplex label="Eficiência Média" value="88%" meta="TMR - 1.2 min" trend="text" />
                   <KPICardComplex label="Satisfação (CSAT)" value="4.7/5" stars={true} meta="Vendas Qualificadas" />
                 </div>
                 <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                       <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ranking de Desempenho</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                       <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8' }}>
                          <tr><th style={{ padding: '12px 24px', textAlign: 'left' }}>Atendente</th><th style={{ padding: '12px 24px', textAlign: 'left' }}>Faturamento</th><th style={{ padding: '12px 24px', textAlign: 'left' }}>Conversão</th></tr>
                       </thead>
                       <tbody>
                          {TEAM_RANKING.slice(0,3).map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                               <td style={{ padding: '12px 24px' }}><b>{u.name}</b></td>
                               <td style={{ padding: '12px 24px' }}>{u.billing}</td>
                               <td style={{ padding: '12px 24px' }}>{u.conv}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
              <aside style={{ background: '#fcfcfc', borderRadius: '12px', padding: '20px', border: '1px solid #f1f5f9' }}>
                 <p style={{ fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>ALERTA COMERCIAL</p>
                 {STRATEGIC_CHATS.map(c => (
                    <div key={c.id} style={{ background: c.color, padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #fee2e2', fontSize: '12px' }}>
                       <b>{c.customer}</b><br/>{c.topic}
                    </div>
                 ))}
              </aside>
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
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
         <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Canal Marcos</button>
      </div>
    </div>
  );
}

export default App;
