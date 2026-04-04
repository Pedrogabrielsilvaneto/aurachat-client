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
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000", items: "120m² 90x90", status: 'todo', notes: "Após 14h." },
  { id: 'PED-502', customer: "Clínica Odonto", address: "Rua das Flores, 45", items: "45m² Slim White", status: 'doing', notes: "Entregar fundos." },
  { id: 'PED-498', customer: "Res. Gramado", address: "Rod. Raposo Tavares", items: "310m² Cerâmico", status: 'done', notes: "Porteiro José." },
  { id: 'PED-505', customer: "Ana Revest", address: "Al. Rio Negro, 150", items: "80m² 60x60", status: 'todo', notes: "" },
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
      
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px' }}><Zap size={22} color="white" /></div>
          <span style={{ fontWeight: '800', fontSize: '22px' }}>AuraChat</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input type="text" className="search-bar" placeholder="Buscar no sistema..." style={{ paddingLeft: '44px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff5722', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>M</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}><b style={{ fontSize: '13px', lineHeight: '1' }}>Marcos</b><span style={{ fontSize: '10px', color: '#64748b' }}>Gestor Geral</span></div>
              <ChevronDown size={14} />
           </div>
        </div>
      </header>

      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} color="#2563eb" />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras" />
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => setIsAuthenticated(false)} /></div>
      </aside>

      <main className="main-content">
        
        {activeTab === 'logistics' && (
           <div className="animate-in">
              <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>Gestão de Fluxo Logístico</h1>

              {/* 3 GRADES LADO A LADO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'flex-start' }}>
                 
                 <LogisticsMiniGrid 
                   title="A Realizar" color="#64748b" icon={<Package size={16}/>}
                   items={deliveries.filter(d => d.status === 'todo')}
                   onStatusChange={updateDeliveryStatus}
                   onEditNotes={(id, n) => { setEditingNotesId(id); setTempNotes(n); }}
                   editingId={editingNotesId} tempNotes={tempNotes} onSetTempNotes={setTempNotes} onSaveNotes={saveNotes} onCancelNotes={() => setEditingNotesId(null)}
                 />

                 <LogisticsMiniGrid 
                   title="Sendo Realizada" color="#f59e0b" icon={<Truck size={16}/>}
                   items={deliveries.filter(d => d.status === 'doing')}
                   onStatusChange={updateDeliveryStatus}
                   onEditNotes={(id, n) => { setEditingNotesId(id); setTempNotes(n); }}
                   editingId={editingNotesId} tempNotes={tempNotes} onSetTempNotes={setTempNotes} onSaveNotes={saveNotes} onCancelNotes={() => setEditingNotesId(null)}
                 />

                 <LogisticsMiniGrid 
                   title="Realizada" color="#10b981" icon={<CheckCircle size={16}/>}
                   items={deliveries.filter(d => d.status === 'done')}
                   onStatusChange={updateDeliveryStatus}
                   onEditNotes={(id, n) => { setEditingNotesId(id); setTempNotes(n); }}
                   editingId={editingNotesId} tempNotes={tempNotes} onSetTempNotes={setTempNotes} onSaveNotes={saveNotes} onCancelNotes={() => setEditingNotesId(null)}
                 />

              </div>
           </div>
        )}

        {activeTab === 'dashboard' && (
           <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Painel Executivo Marcos</h1>
                 <div className="kpi-grid">
                   <KPICardComplex label="Faturamento Mês" value="R$ 333.447" meta="95% da Meta" trend="up" />
                   <KPICardComplex label="Conversão Loja" value="28.5%" meta="+3.1% vs prev" trend="chart" />
                   <KPICardComplex label="Eficiência Média" value="88%" meta="TMR - 1.2 min" trend="text" />
                   <KPICardComplex label="Satisfação (CSAT)" value="4.7/5" stars={true} meta="Vendas Qualificadas" />
                 </div>
                 <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}><h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ranking de Vendas</h3></div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                       <tbody>
                          {TEAM_RANKING.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                               <td style={{ padding: '12px 24px' }}><b>{u.name}</b></td>
                               <td style={{ padding: '12px 24px' }}>{u.billing}</td>
                               <td style={{ padding: '12px 24px', color: '#10b981', fontWeight: 'bold' }}>{u.csat}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
              <aside className="card" style={{ padding: '20px' }}>
                 <p style={{ fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>INTERVENÇÕES ESTRATÉGICAS</p>
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
// COMPONENTES MINI-GRADE
// ==========================================

function LogisticsMiniGrid({ title, color, icon, items, onStatusChange, onEditNotes, editingId, tempNotes, onSetTempNotes, onSaveNotes, onCancelNotes }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', borderTop: `4px solid ${color}` }}>
       <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon} <b style={{ fontSize: '13px', textTransform: 'uppercase' }}>{title}</b>
          <span style={{ marginLeft: 'auto', background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px', fontSize: '10px' }}>{items.length}</span>
       </div>
       <div style={{ minHeight: '400px' }}>
          {items.map(item => (
             <div key={item.id} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>{item.id}</span>
                   <select 
                     value={item.status} 
                     onChange={(e) => onStatusChange(item.id, e.target.value)}
                     style={{ fontSize: '10px', border: 'none', background: '#f1f5f9', borderRadius: '4px', cursor: 'pointer' }}
                   >
                     <option value="todo">Mover...</option>
                     <option value="doing">Em Carga</option>
                     <option value="done">Finalizar</option>
                   </select>
                </div>
                <h5 style={{ fontSize: '14px', fontWeight: '700' }}>{item.customer}</h5>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.address}</p>

                {/* NOTA INTERNA COMPACTA */}
                <div style={{ marginTop: '12px', background: '#fcfcfc', border: '1px dashed #e2e8f0', padding: '8px', borderRadius: '6px' }}>
                   {editingId === item.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <input autoFocus value={tempNotes} onChange={(e) => onSetTempNotes(e.target.value)} style={{ flex: 1, fontSize: '11px', padding: '4px' }} />
                         <Save size={14} color="#10b981" style={{ cursor: 'pointer' }} onClick={() => onSaveNotes(item.id)} />
                         <X size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={onCancelNotes} />
                      </div>
                   ) : (
                      <div onClick={() => onEditNotes(item.id, item.notes)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                         <span style={{ fontSize: '11px', color: item.notes ? '#475569' : '#94a3b8', fontStyle: item.notes ? 'normal' : 'italic' }}>
                            {item.notes || "Add nota técnica..."}
                         </span>
                         <Edit3 size={11} color="#2563eb" opacity={0.5} />
                      </div>
                   )}
                </div>
             </div>
          ))}
          {items.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '12px' }}>Sem pedidos aqui.</p>}
       </div>
    </div>
  );
}

function KPICardComplex({ label, value, meta, trend, stars }) {
  return (
    <div className="card" style={{ minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
       <div>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
             {trend === 'up' && <ChevronUp size={18} color="#10b981" />}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Meta: <span style={{ color: '#0f172a', fontWeight: '600' }}>{meta}</span></p>
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
         <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar como Marcos</button>
      </div>
    </div>
  );
}

export default App;
