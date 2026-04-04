import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile, Star, MessageSquare as MessageSquareIcon,
  ChevronDown, HelpCircle, ChevronUp, MapPin, Edit3, Save, X, Filter,
  Image as ImageIcon, Video, Tag, Info
} from 'lucide-react';

// ==========================================
// MOCK DATA - CENTRO DE COMANDO DO MARCOS
// ==========================================
const INITIAL_PRODUCTS = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=300&fit=crop", type: 'image' },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&h=300&fit=crop", type: 'image' },
  { id: '3', code: 'PIS-CEM-6060', name: "Piso Cimentício Cinza Urbano", media: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=400&h=300&fit=crop", type: 'image' },
];

const INITIAL_DELIVERIES = [
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000", items: "120m² 90x90", status: 'todo', notes: "Após 14h." },
  { id: 'PED-502', customer: "Clínica Odonto", address: "Rua das Flores, 45", items: "45m² Slim White", status: 'doing', notes: "Entregar fundos." },
];

const TEAM_RANKING = [
  { id: 1, name: "Manoel Gomes", sector: "WhatsApp", billing: "R$ 598.370", conv: "28.5%", tmr: "1.2", csat: "4.7" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  // Controle de Novo Produto
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', code: '', media: '', type: 'image' });

  const addProduct = () => {
    if (!newProduct.name || !newProduct.code) return;
    setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
    setShowProductModal(false);
    setNewProduct({ name: '', code: '', media: '', type: 'image' });
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      
      {/* HEADER UNIFICADO */}
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

      {/* SIDEBAR COMERCIAL */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} color="#2563eb" />
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => setIsAuthenticated(false)} /></div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* VIEW: CATÁLOGO DE PRODUTOS */}
        {activeTab === 'products' && (
           <div className="animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Catálogo de Produtos</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Base de dados para Atendentes e IA de Vendas.</p>
                 </div>
                 <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowProductModal(true)}>
                    <Plus size={18} /> Cadastrar Produto
                 </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                 {products.map(p => (
                    <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                       <div style={{ height: '200px', background: '#e2e8f0', position: 'relative' }}>
                          <img src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                             {p.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />} {p.type.toUpperCase()}
                          </div>
                       </div>
                       <div style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                             <Tag size={12} color="#2563eb" />
                             <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', letterSpacing: '0.5px' }}>{p.code}</span>
                          </div>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>{p.name}</h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <button style={{ flex: 1, padding: '8px', fontSize: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Ver Detalhes</button>
                             <button style={{ padding: '8px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><MessageCircle size={14} /></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* VIEW: DASHBOARD ESTRATÉGICO */}
        {activeTab === 'dashboard' && (
           <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Painel Executivo Marcos</h1>
                 <div className="kpi-grid">
                   <KPICardComplex label="Faturamento Mês" value="R$ 333.447" meta="95% da Meta" trend="up" />
                   <KPICardComplex label="Itens em Catálogo" value={products.length} meta="Base IA Ativa" trend="chart" />
                   <KPICardComplex label="Eficiência Média" value="88%" meta="TMR - 1.2 min" trend="text" />
                   <KPICardComplex label="Satisfação (CSAT)" value="4.7/5" stars={true} meta="Vendas Qualificadas" />
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: LOGÍSTICA (RESTAURADA CONFORME ÚLTIMO PEDIDO) */}
        {activeTab === 'logistics' && (
           <div className="animate-in">
              <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>Gestão de Fluxo Logístico</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                 <LogisticsMiniGrid title="A Realizar" color="#64748b" count={deliveries.length} items={deliveries} />
                 <LogisticsMiniGrid title="Em Carga" color="#f59e0b" count={0} items={[]} />
                 <LogisticsMiniGrid title="Entregue" color="#10b981" count={0} items={[]} />
              </div>
           </div>
        )}

      </main>

      {/* MODAL PARA CADASTRAR PRODUTO */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
           <div className="card" style={{ width: '450px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                 <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Novo Produto (IA/Vendas)</h2>
                 <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowProductModal(false)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Nome do Acabamento</label>
                    <input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Porcelanato Nero Antares" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Código SKU / Produto</label>
                    <input value={newProduct.code} onChange={(e) => setNewProduct({...newProduct, code: e.target.value})} placeholder="P-NER-9090" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>URL da Foto ou Vídeo</label>
                    <input value={newProduct.media} onChange={(e) => setNewProduct({...newProduct, media: e.target.value})} placeholder="https://..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                 </div>
                 <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={addProduct}>Salvar e Ativar para IA</button>
                 </div>
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
       {stars && (
          <div style={{ display: 'flex', gap: '2px' }}>
             {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i < 5 ? "#f59e0b" : "none"} color="#f59e0b" />)}
          </div>
       )}
    </div>
  );
}

function LogisticsMiniGrid({ title, count, color, items }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', borderTop: `4px solid ${color}` }}>
       <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: '12px' }}>{title}</b>
          <span style={{ fontSize: '10px', fontWeight: '800' }}>{count}</span>
       </div>
       <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
          {items.map(i => <div key={i.id} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}><b>{i.id}</b> | {i.customer}</div>)}
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
         <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Canal Marcos</button>
      </div>
    </div>
  );
}

export default App;
