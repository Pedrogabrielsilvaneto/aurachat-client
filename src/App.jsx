import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile, Star, MessageSquare as MessageSquareIcon,
  ChevronDown, HelpCircle, ChevronUp, MapPin, Edit3, Save, X, Filter,
  Image as ImageIcon, Video, Tag, Upload, PlayCircle, Paperclip as AttachmentIcon
} from 'lucide-react';

// ==========================================
// MOCK DATA - SISTEMA UNIFICADO
// ==========================================
const INITIAL_PRODUCTS = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400", type: 'image' },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400", type: 'image' },
];

const INITIAL_DELIVERIES = [
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000", items: "120m² 90x90", status: 'todo', notes: "Após 14h." },
  { id: 'PED-502', customer: "Clínica Odonto", address: "Rua das Flores, 45", items: "45m² Slim White", status: 'doing', notes: "Entregar fundos." },
];

const TEAM_RANKING = [
  { id: 1, name: "Maria Silva", sector: "Vendas", billing: "R$ 15.420", conv: "32%", tmr: "0.8", csat: "4.9" },
  { id: 2, name: "João Atendente", sector: "Vendas", billing: "R$ 12.100", conv: "28%", tmr: "1.2", csat: "4.7" },
];

const STRATEGIC_CHATS = [
  { id: 1, customer: "Manoel Gomes", topic: "Porcelanato Premium - $5k", risk: "Alto Valor", color: "#fef2f2" },
  { id: 2, customer: "Inês Lima", topic: "Reclamação de Atraso", risk: "Risco Churn", color: "#fefce8" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');
  
  // States Auxiliares
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', code: '', media: '', type: 'image' });
  const fileInputRef = useRef(null);

  // Handlers Logística
  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };
  const saveDeliveryNotes = (id) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, notes: tempNotes } : d));
    setEditingNotesId(null);
  };

  // Handlers Produtos
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewProduct({ ...newProduct, media: ev.target.result, type: file.type.startsWith('video') ? 'video' : 'image' });
    reader.readAsDataURL(file);
  };
  const addProduct = () => {
    if (!newProduct.name || !newProduct.code || !newProduct.media) return;
    setProducts([{ ...newProduct, id: Date.now().toString() }, ...products]);
    setShowProductModal(false);
    setNewProduct({ name: '', code: '', media: '', type: 'image' });
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-container`}>
      
      {/* HEADER MESTRE */}
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

      {/* SIDEBAR MESTRE */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} color="#2563eb" />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => setIsAuthenticated(false)} /></div>
      </aside>

      {/* ÁREA MESTRE DE CONTEÚDO */}
      <main className="main-content">
        
        {/* TELA: DASHBOARD COMERCIAL */}
        {activeTab === 'dashboard' && (
           <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Raio-X Pereira Acabamentos</h1>
                 <div className="kpi-grid">
                    <KPICardComplex label="Faturamento Mês" value="R$ 333.447" meta="95% da Meta" trend="up" />
                    <KPICardComplex label="Leads Ativos" value="142" meta="88 c/ IA | 54 c/ Humano" trend="chart" />
                    <KPICardComplex label="Conversão Loja" value="28.5%" meta="+3.1% vs prev" trend="chart" />
                    <KPICardComplex label="TMR Equipe" value="1.2 min" meta="Excelente" trend="text" />
                 </div>
                 <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}><h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ranking de Vendedores</h3></div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                       <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8' }}>
                          <tr><th style={{ padding: '12px 24px', textAlign: 'left' }}>Nome</th><th style={{ padding: '12px 24px', textAlign: 'left' }}>Faturamento</th><th style={{ padding: '12px 24px', textAlign: 'left' }}>Conversão</th><th style={{ padding: '12px 24px', textAlign: 'left' }}>CSAT</th></tr>
                       </thead>
                       <tbody>
                          {TEAM_RANKING.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                               <td style={{ padding: '12px 24px' }}><b>{u.name}</b></td>
                               <td style={{ padding: '12px 24px' }}>{u.billing}</td>
                               <td style={{ padding: '12px 24px' }}>{u.conv}</td>
                               <td style={{ padding: '12px 24px', color: '#10b981', fontWeight: 'bold' }}>{u.csat}/5</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div className="card" style={{ padding: '20px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#ef4444', marginBottom: '16px' }}>CHATS EM RISCO / MONITORAMENTO</p>
                    {STRATEGIC_CHATS.map(c => (
                       <div key={c.id} style={{ background: c.color, padding: '12px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #fee2e2' }}>
                          <b style={{ fontSize: '13px' }}>{c.customer}</b><br/>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{c.topic}</span>
                       </div>
                    ))}
                 </div>
              </aside>
           </div>
        )}

        {/* TELA: WHATSAPP (RADAR) */}
        {activeTab === 'whatsapp' && (
           <div className="animate-in" style={{ textAlign: 'center', padding: '100px' }}>
              <MessageCircle size={64} color="#2563eb" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Radar de Atendimentos</h2>
              <p style={{ color: '#64748b' }}>Conectando aos disparadores do WhatsApp via Oracle VPS...</p>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                 <button className="btn-primary">Ver Fila Geral</button>
                 <button className="btn-primary" style={{ background: '#f1f5f9', color: '#0f172a' }}>Configurar Auto-Resposta</button>
              </div>
           </div>
        )}

        {/* TELA: LOGÍSTICA (HIBRIDA 3 COLUNAS) */}
        {activeTab === 'logistics' && (
           <div className="animate-in">
              <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Fluxo de Entregas</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                 <LogisticsColumn title="A Realizar" color="#64748b" count={deliveries.filter(d => d.status === 'todo').length} items={deliveries.filter(d => d.status === 'todo')} onStatusChange={updateDeliveryStatus} onNotesChange={(id, n) => { setEditingNotesId(id); setTempNotes(n); }} editingId={editingNotesId} tempNotes={tempNotes} onSetTempNotes={setTempNotes} onSaveNotes={saveDeliveryNotes} onCancelNotes={() => setEditingNotesId(null)} />
                 <LogisticsColumn title="Sendo Realizada" color="#f59e0b" count={deliveries.filter(d => d.status === 'doing').length} items={deliveries.filter(d => d.status === 'doing')} onStatusChange={updateDeliveryStatus} onNotesChange={(id, n) => { setEditingNotesId(id); setTempNotes(n); }} editingId={editingNotesId} tempNotes={tempNotes} onSetTempNotes={setTempNotes} onSaveNotes={saveDeliveryNotes} onCancelNotes={() => setEditingNotesId(null)} />
                 <LogisticsColumn title="Finalizada" color="#10b981" count={deliveries.filter(d => d.status === 'done').length} items={deliveries.filter(d => d.status === 'done')} onStatusChange={updateDeliveryStatus} onNotesChange={(id, n) => { setEditingNotesId(id); setTempNotes(n); }} editingId={editingNotesId} tempNotes={tempNotes} onSetTempNotes={setTempNotes} onSaveNotes={saveDeliveryNotes} onCancelNotes={() => setEditingNotesId(null)} />
              </div>
           </div>
        )}

        {/* TELA: PRODUTOS (COM UPLOAD) */}
        {activeTab === 'products' && (
           <div className="animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                 <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Catálogo Técnico</h1>
                 <button className="btn-primary" onClick={() => setShowProductModal(true)}><Plus size={18} /> Novo Produto</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                 {products.map(p => (
                    <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                       <div style={{ height: '200px', background: '#000' }}>
                          {p.type === 'image' ? <img src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <video src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />}
                       </div>
                       <div style={{ padding: '20px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>{p.code}</span>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0' }}>{p.name}</h3>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* TELA: CHAT INTERNO */}
        {activeTab === 'internal' && (
           <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', height: 'calc(100vh - 140px)' }}>
              <div className="card" style={{ padding: '20px' }}>
                 <h3 style={{ marginBottom: '20px' }}>Pereira Corporate</h3>
                 <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }} /> <b>Marcos (Você)</b>
                 </div>
                 <div style={{ marginTop: '20px', color: '#64748b', fontSize: '13px' }}>Canais: #Vendas, #Logística, #Geral</div>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                 <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}><b># Vendas</b></div>
                 <div style={{ flex: 1, padding: '20px', background: '#f8fafc' }}>
                    <p style={{ textAlign: 'center', color: '#a3a3a3', marginTop: '100px' }}>Inicie uma conversa interna com sua equipe...</p>
                 </div>
                 <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                    <input style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} placeholder="Mensagem interna..." />
                    <button className="btn-primary"><Send size={18}/></button>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* MODAL PRODUTOS */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
           <div className="card" style={{ width: '450px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}><h2>Novo Registro</h2><X style={{ cursor: 'pointer' }} onClick={() => setShowProductModal(false)} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div onClick={() => fileInputRef.current.click()} style={{ height: '160px', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                    {newProduct.media ? <img src={newProduct.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload size={32} />}
                    <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleFileUpload} />
                 </div>
                 <input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Nome do Produto" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                 <input value={newProduct.code} onChange={(e) => setNewProduct({...newProduct, code: e.target.value})} placeholder="Código SKU" style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                 <button className="btn-primary" onClick={addProduct}>Salvar na Vitrine</button>
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

function LogisticsColumn({ title, color, count, items, onStatusChange, onNotesChange, editingId, tempNotes, onSetTempNotes, onSaveNotes, onCancelNotes }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', borderTop: `4px solid ${color}` }}>
       <div style={{ padding: '16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
          <b>{title}</b> <span style={{ fontSize: '10px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px' }}>{count}</span>
       </div>
       <div style={{ minHeight: '400px' }}>
          {items.map(item => (
             <div key={item.id} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>{item.id}</span>
                   <select value={item.status} onChange={(e) => onStatusChange(item.id, e.target.value)} style={{ fontSize: '10px' }}>
                      <option value="todo">Pendente</option><option value="doing">Em Carga</option><option value="done">Finalizado</option>
                   </select>
                </div>
                <b style={{ fontSize: '14px' }}>{item.customer}</b>
                <p style={{ fontSize: '11px', color: '#64748b' }}>{item.address}</p>
                <div style={{ marginTop: '10px', background: '#fcfcfc', padding: '8px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => onNotesChange(item.id, item.notes)}>
                   {editingId === item.id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <input value={tempNotes} onChange={(e) => onSetTempNotes(e.target.value)} style={{ width: '80%', fontSize: '10px' }} />
                        <Save size={12} onClick={(e) => { e.stopPropagation(); onSaveNotes(item.id); }} />
                      </div>
                   ) : (
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{item.notes || "Nota técnica..."}</span>
                   )}
                </div>
             </div>
          ))}
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
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Contexto: <span style={{ color: '#0f172a', fontWeight: '600' }}>{meta}</span></p>
       </div>
       {stars && <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i < 5 ? "#f59e0b" : "none"} color="#f59e0b" />)}</div>}
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
