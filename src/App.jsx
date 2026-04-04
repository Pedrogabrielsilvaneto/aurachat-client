import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, Truck, MessageCircle, Search, Plus, Zap, LogOut, LayoutDashboard,
  ChevronDown, MessageSquare as MessageSquareIcon, Edit3, Save, X, Trash2, Maximize2, Upload, CheckCircle,
  Megaphone, ExternalLink, Activity
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

import axios from 'axios';

const DASHBOARD_CHART_DATA = [
  { name: 'Seg', leads: 24, conversion: 18 },
  { name: 'Ter', leads: 31, conversion: 22 },
  { name: 'Qua', leads: 28, conversion: 20 },
  { name: 'Qui', leads: 39, conversion: 28 },
  { name: 'Sex', leads: 45, conversion: 32 },
  { name: 'Sab', leads: 52, conversion: 38 },
  { name: 'Dom', leads: 18, conversion: 12 },
];

const SOURCE_DATA = [
  { name: 'Instagram', value: 45, color: '#d946ef' },
  { name: 'Google Ads', value: 30, color: '#2563eb' },
  { name: 'Direto/WA', value: 15, color: '#10b981' },
  { name: 'Indicação', value: 10, color: '#f59e0b' },
];

const API_URL = 'http://localhost:3000'; // Ajuste conforme porta real do backend

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ total: 0, inService: 0, conversion: '0%', responseTime: '0s' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', media: '', type: 'image', desc: '' });
  const fileInputRef = useRef(null);
  const [logisticsFilter, setLogisticsFilter] = useState('all');

  // CARREGAR DADOS DO BACKEND
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes, cpRes, sRes] = await Promise.all([
          axios.get(`${API_URL}/contacts`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/campaigns`),
          axios.get(`${API_URL}/stats`)
        ]);
        setContacts(cRes.data);
        setProducts(pRes.data);
        setCampaigns(cpRes.data);
        setStats(sRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    fetchData();

    // Atualização em tempo real (Mockup simplificado do Socket.io)
    const interval = setInterval(fetchData, 10000); // 10s para não sobrecarregar sem socket configurado
    return () => clearInterval(interval);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData({ ...formData, media: ev.target.result, type: file.type.startsWith('video') ? 'video' : 'image' });
    reader.readAsDataURL(file);
  };

  const saveProduct = async () => {
    try {
      if (editing) {
        // Lógica de edição real aqui
      } else {
        await axios.post(`${API_URL}/products`, formData);
      }
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
      setShowModal(false);
      setEditing(null);
      setFormData({ name: '', code: '', media: '', type: 'image', desc: '' });
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const startEdit = (p) => {
    setEditing(p);
    setFormData(p);
    setShowModal(true);
  };

  const removeProduct = (id) => {
    if (window.confirm("Excluir este produto?")) setProducts(products.filter(p => p.id !== id));
  };

  const moveContact = async (id, newStatus) => {
    try {
      const contact = contacts.find(c => c.id === id);
      await axios.put(`${API_URL}/contacts/${id}`, { status: newStatus });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error("Erro ao mover contato:", err);
    }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: '#f0fdf4', padding: '6px 12px', borderRadius: '20px', color: '#16a34a', fontWeight: '700' }}>
            <div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }} /> WhatsApp Conectado
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '10px' }}>
            <b style={{ fontSize: '13px' }}>Marcos</b> <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <SidebarLink icon={<Megaphone size={20}/>} label="Campanhas" active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" /></div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Painel do Proprietário</h1>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Exportar Relatório</button>
                  <button className="btn-primary">Visualizar Metas</button>
               </div>
            </div>
            
            <div className="kpi-grid">
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>LEADS TOTAIS</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.total}</h2>
                <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>+12% vs mês anterior</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CONVERSÃO MÉDIA</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.conversion}</h2>
                <div style={{ color: '#2563eb', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Acima da meta (20%)</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TEMPO DE RESPOSTA</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.responseTime}</h2>
                <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Eficiência Ultra</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CUSTO POR LEAD (CPL)</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>R$ 4,20</h2>
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Tendência de alta</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginTop: '24px' }}>
              <div className="card" style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Engajamento de Leads (7 dias)</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DASHBOARD_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card" style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Distribuição por Canal</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={SOURCE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {SOURCE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" align="center" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' }}>
               <div className="card" style={{ background: '#0f172a', color: 'white' }}>
                  <h4 style={{ fontSize: '14px', opacity: 0.8 }}>Sonia IA Status</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' }} />
                    <b style={{ fontSize: '18px' }}>Ativa & Aprendendo</b>
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.6 }}>92% de assertividade nas respostas</p>
               </div>
               <div className="card">
                  <h4 style={{ fontSize: '14px', color: '#64748b' }}>Ações Rápidas</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    <button style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Broadcast</button>
                    <button style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Pausar Sonia</button>
                    <button style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Transferência</button>
                  </div>
               </div>
               <div className="card">
                  <h4 style={{ fontSize: '14px', color: '#64748b' }}>Meta de Vendas</h4>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <b>Progresso Mês</b>
                      <span>72%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '72%', height: '100%', background: '#2563eb' }} />
                    </div>
                  </div>
               </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Logística de Atendimento</h1>
              <div style={{ display: 'flex', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
                {['all', 'gestao', 'clt', 'terceiros', 'auditoria'].map(role => (
                  <button 
                    key={role} 
                    onClick={() => setLogisticsFilter(role)}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      border: 'none', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      cursor: 'pointer',
                      background: logisticsFilter === role ? 'white' : 'transparent',
                      boxShadow: logisticsFilter === role ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                    }}>
                    {role.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

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
                      {contacts.filter(c => (logisticsFilter === 'all' || c.role === logisticsFilter) && c.status === col.key).length}
                    </span>
                  </div>
                  <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {contacts.filter(c => (logisticsFilter === 'all' || c.role === logisticsFilter) && c.status === col.key).map(c => (
                      <div key={c.id} className="card" style={{ padding: '16px', cursor: 'grab', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{c.role.toUpperCase()}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{c.time}</span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{c.phone}</div>
                        
                        <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                           {col.key !== 'new' && <button onClick={() => moveContact(c.id, col.key === 'completed' ? 'active' : 'new')} style={{ flex: 1, padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>VOLTAR</button>}
                           {col.key !== 'completed' && <button onClick={() => moveContact(c.id, col.key === 'new' ? 'active' : 'completed')} style={{ flex: 1, padding: '6px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>AVANÇAR</button>}
                        </div>
                      </div>
                    ))}
                    {contacts.filter(c => (logisticsFilter === 'all' || c.role === logisticsFilter) && c.status === col.key).length === 0 && (
                      <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        Vazio
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

        {activeTab === 'campaigns' && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Gestão de Campanhas</h1>
               <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Plus size={18} /> Nova Campanha
               </button>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ROI ESTIMADO</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px' }}>4.8x</h2>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CLIQUES TOTAIS</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px' }}>2.090</h2>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>LEADS GERADOS</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px' }}>198</h2>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CONVERSÃO GERAL</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px' }}>9.47%</h2>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Campanha</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Plataforma</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Link Rastreável</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Status</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Métricas</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(cp => (
                    <tr key={cp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{cp.name}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: cp.platform === 'Instagram' ? '#fdf2f8' : '#eff6ff', color: cp.platform === 'Instagram' ? '#db2777' : '#2563eb' }}>
                          {cp.platform}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#475569' }}>wa.me/p={cp.link}</code>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cp.status === 'active' ? '#22c55e' : '#cbd5e1' }} />
                          <span style={{ fontSize: '12px', fontWeight: '600', color: cp.status === 'active' ? '#16a34a' : '#64748b' }}>{cp.status === 'active' ? 'Ativa' : 'Pausada'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>CLIQUES</div>
                            <div style={{ fontSize: '13px', fontWeight: '800' }}>{cp.clicks}</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>CONV.</div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#16a34a' }}>{cp.conversion}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><ExternalLink size={14} /></button>
                          <button style={{ padding: '6px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Edit3 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ marginTop: '24px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569' }}>
                  <Activity size={20} />
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>Sistema de Rastreamento Ativo: A Sônia identificará automaticamente leads vindos desses links.</p>
               </div>
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
