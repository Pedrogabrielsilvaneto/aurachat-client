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
// MOCK DATA - OPERAÇÃO LOGÍSTICA
// ==========================================
const INITIAL_DELIVERIES = [
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000 - Apto 42", items: "120m² Porcelanato Polido 90x90", status: 'todo', notes: "" },
  { id: 'PED-502', customer: "Clínica Odonto", address: "Rua das Flores, 45", items: "45m² Revestimento Slim White", status: 'doing', notes: "Entregar nos fundos." },
  { id: 'PED-498', customer: "Residencial Gramado", address: "Rod. Raposo Tavares, Km 22", items: "310m² Piso Cerâmico Curva A", status: 'done', notes: "Recebido por Porteiro José." },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  const updateStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const updateNotes = (id, newNotes) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, notes: newNotes } : d));
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
          <input type="text" className="search-bar" placeholder="Buscar pedidos..." style={{ paddingLeft: '44px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
              <Bell size={20} />
              <HelpCircle size={20} />
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>G</div>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Gestor Logística</span>
              <ChevronDown size={14} />
           </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<Truck size={24}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} color="#2563eb" />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras" />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} />
        <div style={{ marginTop: 'auto' }}>
           <SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => setIsAuthenticated(false)} />
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="main-content">
        
        {activeTab === 'logistics' && (
           <div className="animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Mapa de Entregas</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Gestão de fluxos e observações internas</p>
                 </div>
                 <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Novo Agendamento
                 </button>
              </div>

              {/* COLUNAS KANBAN LOGÍSTICA */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'flex-start' }}>
                 
                 {/* COLUNA: A REALIZAR */}
                 <LogisticsColumn title="A Realizar" count={deliveries.filter(d => d.status === 'todo').length} color="#64748b">
                    {deliveries.filter(d => d.status === 'todo').map(item => (
                       <LogisticsCard key={item.id} item={item} onStatusChange={updateStatus} onNotesChange={updateNotes} />
                    ))}
                 </LogisticsColumn>

                 {/* COLUNA: SENDO REALIZADA */}
                 <LogisticsColumn title="Sendo Realizada" count={deliveries.filter(d => d.status === 'doing').length} color="#f59e0b">
                    {deliveries.filter(d => d.status === 'doing').map(item => (
                       <LogisticsCard key={item.id} item={item} onStatusChange={updateStatus} onNotesChange={updateNotes} />
                    ))}
                 </LogisticsColumn>

                 {/* COLUNA: REALIZADA */}
                 <LogisticsColumn title="Realizada" count={deliveries.filter(d => d.status === 'done').length} color="#10b981">
                    {deliveries.filter(d => d.status === 'done').map(item => (
                       <LogisticsCard key={item.id} item={item} onStatusChange={updateStatus} onNotesChange={updateNotes} />
                    ))}
                 </LogisticsColumn>

              </div>
           </div>
        )}

        {activeTab === 'dashboard' && (
           <div style={{ opacity: 0.6, textAlign: 'center', padding: '100px' }}>
              <LayoutDashboard size={64} style={{ margin: '0 auto 20px' }} />
              <h2>Painel Gestor Carregando...</h2>
              <p>Mude para a aba de Logística no menu lateral.</p>
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES DE LOGÍSTICA
// ==========================================

function LogisticsColumn({ title, count, color, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: color, borderRadius: '50%' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
          <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>{count}</span>
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '500px' }}>
          {children}
       </div>
    </div>
  );
}

function LogisticsCard({ item, onStatusChange, onNotesChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNotes, setTempNotes] = useState(item.notes);

  return (
    <div className="card animate-in" style={{ padding: '20px', borderLeft: `6px solid ${item.status === 'todo' ? '#cbd5e1' : (item.status === 'doing' ? '#f59e0b' : '#10b981')}` }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb' }}>{item.id}</span>
          <select 
            value={item.status} 
            onChange={(e) => onStatusChange(item.id, e.target.value)}
            style={{ fontSize: '11px', border: 'none', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
          >
             <option value="todo">A Realizar</option>
             <option value="doing">Sendo Realizada</option>
             <option value="done">Realizada</option>
          </select>
       </div>

       <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{item.customer}</h4>
       <div style={{ display: 'flex', gap: '8px', color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>
          <MapPin size={14} /> {item.address}
       </div>

       <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
          <b style={{ color: '#0f172a' }}>Itens:</b> {item.items}
       </div>

       {/* ÁREA DE OBSERVAÇÃO INTERNA */}
       <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
             <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Observação Interna</span>
             {!isEditing ? (
                <Edit3 size={14} color="#2563eb" style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />
             ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                   <Save size={14} color="#10b981" style={{ cursor: 'pointer' }} onClick={() => { onNotesChange(item.id, tempNotes); setIsEditing(false); }} />
                   <X size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => { setTempNotes(item.notes); setIsEditing(false); }} />
                </div>
             )}
          </div>
          
          {isEditing ? (
             <textarea 
               value={tempNotes}
               onChange={(e) => setTempNotes(e.target.value)}
               placeholder="Adicionar nota técnica..."
               style={{ width: '100%', height: '60px', padding: '8px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
             />
          ) : (
             <p style={{ fontSize: '12px', color: '#64748b', fontStyle: item.notes ? 'normal' : 'italic' }}>
                {item.notes || "Nenhuma observação técnica adicionada."}
             </p>
          )}
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
         <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Dashboard</button>
      </div>
    </div>
  );
}

export default App;
