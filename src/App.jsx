import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile, Star, MessageSquare as MessageSquareIcon,
  ChevronDown, HelpCircle, ChevronUp, MapPin, Edit3, Save, X, Filter,
  Image as ImageIcon, Video, Tag, Upload, PlayCircle
} from 'lucide-react';

// ==========================================
// MOCK DATA - CENTRO DE COMANDO DO MARCOS
// ==========================================
const INITIAL_PRODUCTS = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400", type: 'image' },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400", type: 'image' },
];

const INITIAL_DELIVERIES = [
  { id: 'PED-501', customer: "Julio Rocha", address: "Av. Paulista, 1000", items: "120m² 90x90", status: 'todo', notes: "Após 14h." },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  // Controle de Novo Produto
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', code: '', media: '', type: 'image' });
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewProduct({
        ...newProduct,
        media: event.target.result,
        type: file.type.startsWith('video') ? 'video' : 'image'
      });
    };
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
      
      {/* HEADER */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px' }}><Zap size={22} color="white" /></div>
          <span style={{ fontWeight: '800', fontSize: '22px' }}>AuraChat</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input type="text" className="search-bar" placeholder="Buscar no catálogo..." style={{ paddingLeft: '44px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff5722', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>M</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}><b style={{ fontSize: '13px', lineHeight: '1' }}>Marcos</b><span style={{ fontSize: '10px', color: '#64748b' }}>Gestor Geral</span></div>
              <ChevronDown size={14} />
           </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} color="#2563eb" />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={() => setIsAuthenticated(false)} /></div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {activeTab === 'products' && (
           <div className="animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Catálogo de Produtos</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Importe fotos e vídeos do seu computador para o Marcos.</p>
                 </div>
                 <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowProductModal(true)}>
                    <Plus size={18} /> Cadastrar Produto
                 </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                 {products.map(p => (
                    <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                       <div style={{ height: '200px', background: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {p.type === 'image' ? (
                            <img src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                          ) : (
                            <video src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                          )}
                          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>
                             {p.type.toUpperCase()}
                          </div>
                       </div>
                       <div style={{ padding: '20px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>{p.code}</span>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0 16px' }}>{p.name}</h3>
                          <button style={{ width: '100%', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Ver Detalhes</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'dashboard' && (
           <div className="animate-in">
              <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Dashboard Geral do Marcos</h1>
              <div className="kpi-grid">
                <KPICardComplex label="Itens em Catálogo" value={products.length} meta="Base Vendas Ativa" trend="up" />
                <KPICardComplex label="Faturamento Mês" value="R$ 333.447" meta="Vendas Confirmadas" trend="up" />
              </div>
           </div>
        )}

      </main>

      {/* MODAL PARA CADASTRAR PRODUTO COM UPLOAD */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
           <div className="card" style={{ width: '450px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                 <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Novo Produto do Marcos</h2>
                 <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowProductModal(false)} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {/* PREVIEW DA MÍDIA IMPORTADA */}
                 <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{ 
                       height: '180px', borderRadius: '12px', background: '#f8fafc', border: '2px dashed #cbd5e1', 
                       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                       cursor: 'pointer', overflow: 'hidden', position: 'relative' 
                    }}
                 >
                    {newProduct.media ? (
                       newProduct.type === 'image' ? (
                          <img src={newProduct.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       ) : (
                          <video src={newProduct.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       )
                    ) : (
                       <>
                          <Upload size={32} color="#64748b" style={{ marginBottom: '12px' }} />
                          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Importar do Computador</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Foto ou Vídeo do Acabamento</span>
                       </>
                    )}
                    <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleFileUpload} />
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>NOME DO PRODUTO</label>
                    <input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Porcelanato Polido Nero" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>CÓDIGO INTERNO (SKU)</label>
                    <input value={newProduct.code} onChange={(e) => setNewProduct({...newProduct, code: e.target.value})} placeholder="P-NER-9090" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                 </div>

                 <button className="btn-primary" style={{ padding: '14px', borderRadius: '10px' }} onClick={addProduct}>
                    Salvar e Ativar para Vendas
                 </button>
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

function KPICardComplex({ label, value, meta, trend }) {
  return (
    <div className="card" style={{ minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
       <div>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
             {trend === 'up' && <ChevronUp size={18} color="#10b981" />}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Status: <span style={{ color: '#0f172a', fontWeight: '600' }}>{meta}</span></p>
       </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, color }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', background: active ? '#f1f5f9' : 'transparent', color: active ? (color || '#111b21') : '#64748b', fontWeight: active ? '700' : '500', transition: '0.2s' }}>
      {icon} <span style={{ fontSize: '14px' }}>{label}</span>
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
