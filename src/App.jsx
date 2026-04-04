import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, Truck, MessageCircle, Search, Plus, Zap, LogOut, LayoutDashboard,
  ChevronDown, MessageSquare as MessageSquareIcon, Edit3, Save, X, Trash2, Maximize2, Upload, CheckCircle
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", type: 'image', desc: "Acabamento de alto brilho, ideal para áreas nobres." },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", type: 'image', desc: "Paredes internas. Textura acetinada." },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Pedro Neto', phone: '5511988887777', status: 'new', msg: 'Gostaria de saber o preço do porcelanato polido.', time: '14:20' },
    { id: '2', name: 'Maria Silva', phone: '5511977776666', status: 'active', msg: 'Pode me enviar o catálogo completo?', time: '13:45' },
    { id: '3', name: 'Jorge Oliveira', phone: '5511966665555', status: 'completed', msg: 'Pedido confirmado, obrigado!', time: 'Ontem' },
  ]);
  const [stats, setStats] = useState({ total: 128, inService: 42, conversion: '24%', responseTime: '1.2s' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', media: '', type: 'image', desc: '' });
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData({ ...formData, media: ev.target.result, type: file.type.startsWith('video') ? 'video' : 'image' });
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (editing) {
      setProducts(products.map(p => p.id === editing.id ? { ...formData, id: p.id } : p));
    } else {
      setProducts([{ ...formData, id: Date.now().toString() }, ...products]);
    }
    setShowModal(false);
    setEditing(null);
    setFormData({ name: '', code: '', media: '', type: 'image', desc: '' });
  };

  const startEdit = (p) => {
    setEditing(p);
    setFormData(p);
    setShowModal(true);
  };

  const removeProduct = (id) => {
    if (window.confirm("Excluir este produto?")) setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={22} color="#2563eb" /> <span style={{ fontWeight: '800', fontSize: '20px' }}>AuraChat</span>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px' }} color="#64748b" />
          <input className="search-bar" placeholder="Pesquisar..." style={{ paddingLeft: '40px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '10px' }}>
          <b style={{ fontSize: '13px' }}>Marcos</b> <ChevronDown size={14} />
        </div>
      </header>

      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" /></div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="animate-in">
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Visão Geral</h1>
            <div className="kpi-grid">
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TOTAL DE LEADS</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.total}</h2>
                <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>+12% vs ontem</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>EM ATENDIMENTO</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.inService}</h2>
                <div style={{ color: '#2563eb', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>6 consultores ativos</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TAXA DE CONVERSÃO</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.conversion}</h2>
                <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Meta: 20%</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>RESPOSTA IA</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.responseTime}</h2>
                <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Status: Operacional</div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '24px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dotted', color: '#94a3b8' }}>
              Gráficos de Performance do Pereira Acabamentos em tempo real.
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Catálogo Técnico</h1>
              <button className="btn-primary" onClick={() => { setEditing(null); setFormData({name:'',code:'',media:'',type:'image',desc:''}); setShowModal(true); }}>
                <Plus size={18} /> Novo Produto
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {products.map(p => (
                <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '160px', background: '#000', position: 'relative' }}>
                    {p.type === 'image' ? <img src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <video src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <div onClick={() => removeProduct(p.id)} style={{ padding: '6px', background: 'rgba(239,68,68,0.9)', color: 'white', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></div>
                      <div onClick={() => startEdit(p)} style={{ padding: '6px', background: 'white', color: '#0f172a', borderRadius: '6px', cursor: 'pointer' }}><Edit3 size={14} /></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>{p.code}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '6px 0 12px' }}>{p.name}</h3>
                    <button onClick={() => setViewing(p)} style={{ width: '100%', padding: '8px', fontSize: '12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Ver Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="animate-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Logística de Atendimento</h1>
            <div style={{ display: 'flex', gap: '20px', flex: 1, overflowX: 'auto', paddingBottom: '20px' }}>
              {[
                { title: 'Novas Leads', key: 'new' },
                { title: 'Em Atendimento', key: 'active' },
                { title: 'Finalizados', key: 'completed' }
              ].map(col => (
                <div key={col.key} style={{ minWidth: '320px', flex: 1, background: '#f1f5f9', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#475569' }}>{col.title.toUpperCase()}</h3>
                    <span style={{ fontSize: '12px', background: '#cbd5e1', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                      {contacts.filter(c => c.status === col.key).length}
                    </span>
                  </div>
                  <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {contacts.filter(c => c.status === col.key).map(c => (
                      <div key={c.id} className="card" style={{ padding: '12px', cursor: 'grab' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.phone}</div>
                        <div style={{ fontSize: '12px', marginTop: '8px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.msg}</div>
                      </div>
                    ))}
                    {contacts.filter(c => c.status === col.key).length === 0 && (
                      <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        Nenhum card aqui
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="animate-in" style={{ height: 'calc(100vh - 120px)', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '350px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Conversas</h2>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {contacts.map(c => (
                  <div key={c.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: '14px' }}>{c.name}</b>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{c.msg}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '30px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <MessageCircle size={32} color="#2563eb" />
              </div>
              <h2 style={{ color: '#0f172a', fontWeight: '800', fontSize: '20px' }}>Pereira Acabamentos OmniChannel</h2>
              <p style={{ marginTop: '8px' }}>Selecione um cliente para assumir o atendimento humano.</p>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDIT/NEW */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div onClick={() => fileInputRef.current.click()} style={{ height: '140px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                {formData.media ? <img src={formData.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload size={24} color="#94a3b8" />}
                <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleUpload} />
              </div>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="SKU" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Descrição..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '60px' }} />
              <button className="btn-primary" onClick={saveProduct}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAILS */}
      {viewing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(10px)' }}>
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', width: '85vw', maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1fr 350px' }}>
            <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {viewing.type === 'image' ? <img src={viewing.media} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} /> : <video src={viewing.media} style={{ width: '100%' }} controls autoPlay />}
            </div>
            <div style={{ padding: '40px', position: 'relative' }}>
              <X size={24} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} onClick={() => setViewing(null)} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb' }}>{viewing.code}</span>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '10px 0 20px' }}>{viewing.name}</h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>{viewing.desc || "Sem descrição técnica."}</p>
              <div style={{ marginTop: '30px', padding: '15px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '700', fontSize: '13px' }}>
                <CheckCircle size={16}/> Disponível para IA e Vendas
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, color }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', background: active ? '#f1f5f9' : 'transparent', color: active ? '#111b21' : '#64748b', fontWeight: active ? '700' : '500' }}>
      {icon} <span style={{ fontSize: '14px' }}>{label}</span>
      {active && <div style={{ marginLeft: 'auto', width: '4px', height: '14px', background: '#2563eb', borderRadius: '2px' }} />}
    </div>
  );
}

export default App;
