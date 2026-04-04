import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, Truck, MessageCircle, Search, Plus, Zap, LogOut, LayoutDashboard,
  ChevronDown, MessageSquare as MessageSquareIcon, Edit3, Save, X, Trash2, Maximize2, Upload, CheckCircle,
  Megaphone, ExternalLink, Activity, Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import axios from 'axios'; 
import { upload } from '@vercel/blob/client';

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

const API_URL = '/api'; 

const DEFAULT_PRODUCTS = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", type: 'image', desc: "Acabamento de alto brilho, ideal para áreas nobres." },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", type: 'image', desc: "Paredes internas. Textura acetinada." }
];

const DEFAULT_CAMPAIGNS = [
  { id: '1', name: 'Promoção Verão', platform: 'Instagram', link: 'ig/verao24', status: 'active', clicks: 1240, leads: 156, conversion: '12.5%' },
  { id: '2', name: 'Black Friday', platform: 'Facebook', link: 'fb/prime', status: 'inactive', clicks: 850, leads: 42, conversion: '4.9%' }
];

const DEFAULT_CONTACTS = [
  { id: '1', name: 'Pedro Neto', phone: '5511988887777', status: 'new', msg: 'Gostaria de saber o preço.', time: '14:20', role: 'campanha' },
  { id: '2', name: 'Maria Silva', phone: '5511977776666', status: 'active', msg: 'Pode me enviar o catálogo?', time: '13:45', role: 'cliente' },
  { id: '3', name: 'Jorge Oliveira', phone: '5511966665555', status: 'completed', msg: 'Pedido confirmado!', time: 'Ontem', role: 'cliente' },
];

function SidebarLink({ icon, label, active, onClick, color }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', 
        cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s',
        background: active ? '#eff6ff' : 'transparent',
        color: active ? '#2563eb' : (color || '#64748b'),
        fontWeight: active ? '700' : '500',
        marginBottom: '4px'
      }}>
      {icon} <span style={{ fontSize: '14px' }}>{label}</span>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [stats, setStats] = useState({ total: 128, inService: 42, conversion: '24%', responseTime: '1.2s' });
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', media: '', type: 'image', desc: '', videoUrl: '' });
  const [selectedChat, setSelectedChat] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, contactId: 1, from: 'client', text: 'Olá, gostaria de saber o preço do porcelanato polido 60x120', time: '10:30' },
    { id: 2, contactId: 1, from: 'bot', text: 'Olá! A Sônia aqui. O Porcelanato Polido 60x120 está R$ 89,90/m². Gostaria de ver o catálogo técnico?', time: '10:30', bot: true },
    { id: 3, contactId: 1, from: 'client', text: 'Sim, por favor', time: '10:31' },
    { id: 4, contactId: 1, from: 'bot', text: 'Aqui está: [Link do Catálogo]. Temos também em estoque para entrega imediata!', time: '10:31', bot: true },
  ]);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logisticsSubTab, setLogisticsSubTab] = useState('new');
  const [gestionSubTab, setGestionSubTab] = useState('users');
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeFormData, setEmployeeFormData] = useState({ name: '', user: '', pass: '', role: 'VENDAS' });
  
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClientFull, setViewingClientFull] = useState(null);

  const saveEmployee = async () => {
    if (editingEmployee) {
       await axios.put(`${API_URL}/employees`, { ...employeeFormData, id: editingEmployee.id });
       setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...employeeFormData, id: e.id } : e));
    } else {
       const res = await axios.post(`${API_URL}/employees`, employeeFormData);
       setEmployees([...employees, { ...employeeFormData, id: res.data.employee.id }]);
    }
    setShowEmployeeModal(false);
    setEditingEmployee(null);
  };

  const removeEmployee = async (id) => { 
    if(window.confirm("Excluir funcionário?")) {
       await axios.delete(`${API_URL}/employees?id=${id}`);
       setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const startEditEmployee = (e) => { setEditingEmployee(e); setEmployeeFormData(e); setShowEmployeeModal(true); };

  const removeClient = async (id) => { 
    if(window.confirm("Excluir cliente permanentemente?")) {
       await axios.delete(`${API_URL}/contacts?id=${id}`);
       setContacts(contacts.filter(c => c.id !== id));
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes, eRes] = await Promise.all([
          axios.get(`${API_URL}/contacts`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/employees`)
        ]);
        if (cRes.data.length > 0) setContacts(cRes.data);
        if (pRes.data.length > 0) setProducts(pRes.data);
        if (eRes.data.length > 0) setEmployees(eRes.data);
      } catch (err) {
        console.warn("KV Sync Error:", err.message);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('video')) {
      alert("⚠️ Padronização: Vídeos devem ser incluídos via LINK.");
      return;
    }
    setIsUploading(true);
    try {
      const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
      setFormData({ ...formData, media: blob.url, type: 'image' });
    } catch (err) {
      console.error("Erro no upload:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const saveProduct = async () => {
    const newProduct = { ...formData, id: editing ? editing.id : Date.now().toString() };
    try {
      await axios.post(`${API_URL}/products`, newProduct);
      if (editing) setProducts(products.map(p => p.id === editing.id ? newProduct : p));
      else setProducts([newProduct, ...products]);
      setShowModal(false);
      setEditing(null);
      setFormData({ name: '', code: '', media: '', type: 'image', desc: '', videoUrl: '' });
    } catch (err) {
      console.error("Erro ao persistir na Vercel:", err);
      setShowModal(false);
    }
  };

  const startEdit = (p) => { setEditing(p); setFormData(p); setShowModal(true); };
  const removeProduct = (id) => { if (window.confirm("Excluir este produto?")) setProducts(products.filter(p => p.id !== id)); };

  const moveContact = async (id, newStatus) => {
    try {
      const contact = contacts.find(c => c.id === id);
      if (newStatus === 'failed') {
        const existingObs = contact?.obs || "";
        if (!existingObs) {
          const reason = prompt("⚠️ OBRIGATÓRIO: Descreva o problema ocorrido para prosseguir:");
          if (!reason || reason.trim().length < 3) {
            alert("Operação cancelada. É necessário registrar o motivo do problema.");
            return;
          }
          await axios.put(`${API_URL}/contacts`, { id, updates: { obs: reason, status: newStatus } });
          setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus, obs: reason } : c));
          return;
        }
      }

      await axios.put(`${API_URL}/contacts`, { id, updates: { status: newStatus } });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
      if (selectedChat?.id === id) setSelectedChat({ ...selectedChat, status: newStatus });
    } catch (err) {
      console.error("Erro ao mover lead:", err);
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
            <div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }} /> Vercel Mode
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
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras" active={activeTab === 'compras'} onClick={() => setActiveTab('compras')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="Atendimento" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<Activity size={20}/>} label="Gestão" active={activeTab === 'gestion'} onClick={() => setActiveTab('gestion')} />
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" /></div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="animate-in">
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Painel do Proprietário</h1>
            <div className="kpi-grid">
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>LEADS TOTAIS</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.total}</h2>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CONVERSÃO</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.conversion}</h2>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>RESPOSTA</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stats.responseTime}</h2>
              </div>
              <div className="card">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>CPL</span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>R$ 4,20</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginTop: '24px' }}>
              <div className="card" style={{ height: '400px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Engajamento (7 dias)</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={DASHBOARD_CHART_DATA}>
                    <XAxis dataKey="name" hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="leads" stroke="#2563eb" fill="#eff6ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="card" style={{ height: '400px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px' }}>Canal de Origem</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={SOURCE_DATA} innerRadius={60} outerRadius={80} dataKey="value">
                      {SOURCE_DATA.map((e, index) => <Cell key={index} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Catálogo Técnico</h1>
              <button className="btn-primary" onClick={() => { setEditing(null); setFormData({name:'',code:'',media:'',type:'image',desc:''}); setShowModal(true); }}><Plus size={18} /> Novo Produto</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {products.map(p => (
                <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: '160px', background: '#000', position: 'relative' }}>
                    <img src={p.media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <div onClick={() => removeProduct(p.id)} style={{ padding: '6px', background: '#ef4444', color: 'white', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></div>
                      <div onClick={() => startEdit(p)} style={{ padding: '6px', background: 'white', color: '#0f172a', borderRadius: '6px', cursor: 'pointer' }}><Edit3 size={14} /></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: '#2563eb' }}>{p.code}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '4px 0 12px' }}>{p.name}</h3>
                    <button onClick={() => setViewing(p)} style={{ width: '100%', padding: '8px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Ver Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="animate-in">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                   <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Fluxo de Logística (Excel View)</h1>
                   <p style={{ color: '#64748b', fontSize: '13px' }}>Gestão fragmentada por status de entrega.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                   {[
                      { key: 'waiting_logistics', label: 'Aguardando', color: '#64748b' },
                      { key: 'shipped', label: 'Saiu para Entrega', color: '#3b82f6' },
                      { key: 'delivered', label: 'Entregue', color: '#10b981' },
                      { key: 'failed', label: 'Problema / Falta', color: '#ef4444' }
                   ].map(st => (
                      <button 
                        key={st.key}
                        onClick={() => setLogisticsSubTab(st.key)}
                        style={{ 
                          padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                          background: (logisticsSubTab || 'waiting_logistics') === st.key ? st.color : 'transparent',
                          color: (logisticsSubTab || 'waiting_logistics') === st.key ? 'white' : '#64748b',
                          transition: 'all 0.2s'
                        }}>
                        {st.label.toUpperCase()} ({contacts.filter(c => c.status === st.key).length})
                      </button>
                   ))}
                </div>
             </div>

             <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>PEDIDO / VENDEDOR</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>CLIENTE</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>PRAZO COMBINADO</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>OBSERVAÇÕES / REPORTES</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800', textAlign: 'right' }}>AÇÕES</th>
                      </tr>
                   </thead>
                   <tbody>
                      {contacts.filter(c => c.status === (logisticsSubTab || 'waiting_logistics')).length === 0 ? (
                         <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Logística vazia nesta fase.</td></tr>
                      ) : (
                         contacts.filter(c => c.status === (logisticsSubTab || 'waiting_logistics')).map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                               <td style={{ padding: '16px' }}>
                                  <div style={{ fontWeight: '900', color: '#2563eb' }}>#{c.orderNumber || '0000'}</div>
                                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>VEND: {c.sellerName?.toUpperCase() || 'SÔNIA IA'}</div>
                               </td>
                               <td style={{ padding: '16px' }}>
                                  <div style={{ fontWeight: '800', fontSize: '13px' }}>{c.name}</div>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>{c.phone}</div>
                               </td>
                               <td style={{ padding: '16px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>{c.deliveryDeadline || 'Não informado'}</div>
                                  {c.buyerDeadline && <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700', marginTop: '4px' }}>REPOSIÇÃO: {c.buyerDeadline}</div>}
                               </td>
                               <td style={{ padding: '16px' }}>
                                  <input 
                                    defaultValue={c.obs || ""}
                                    onBlur={(e) => axios.put(`${API_URL}/contacts`, { id: c.id, updates: { obs: e.target.value } })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }} 
                                  />
                               </td>
                               <td style={{ padding: '16px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                     <button 
                                       onClick={() => {
                                          const reason = prompt("Descreva o motivo do reporte ao Vendedor/Comprador:");
                                          if(reason) {
                                             axios.put(`${API_URL}/contacts`, { id: c.id, updates: { status: 'failed', obs: `🚩 FALTA ESTOQUE: ${reason}` } });
                                             setContacts(contacts.map(item => item.id === c.id ? { ...item, status: 'failed', obs: `🚩 FALTA ESTOQUE: ${reason}` } : item));
                                             alert("Reportado com Sucesso!");
                                          }
                                       }}
                                       style={{ padding: '8px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#ef4444', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}>
                                        REPORTAR FALTA
                                     </button>
                                     <select 
                                       value={c.status} 
                                       onChange={(e) => moveContact(c.id, e.target.value)}
                                       style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: '800' }}>
                                        <option value="waiting_logistics">AGUARDANDO</option>
                                        <option value="shipped">SAÍDA</option>
                                        <option value="delivered">ENTREGUE</option>
                                        <option value="failed">PROBLEMA</option>
                                     </select>
                                  </div>
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'compras' && (
          <div className="animate-in">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Painel de Suprimentos / Compras</h1>
                  <p style={{ color: '#64748b', fontSize: '13px' }}>Pedidos aguardando reposição de material no estoque.</p>
                </div>
                <div style={{ background: '#fff7ed', color: '#c2410c', padding: '10px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', border: '1px solid #ffedd5' }}>
                  FALTAS PARA RESOLVER: {contacts.filter(c => c.status === 'failed').length}
                </div>
             </div>

             <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead style={{ background: '#fff7ed', borderBottom: '2px solid #ffedd5' }}>
                      <tr>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800', color: '#9a3412' }}>PEDIDO / VENDEDOR</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800', color: '#9a3412' }}>REPORTE DA LOGÍSTICA</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800', color: '#9a3412' }}>PRAZO DE REPOSIÇÃO</th>
                         <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800', color: '#9a3412', textAlign: 'right' }}>AÇÕES</th>
                      </tr>
                   </thead>
                   <tbody>
                      {contacts.filter(c => c.status === 'failed').length === 0 ? (
                         <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Nenhum pedido com falta de estoque reportada. 🎉</td></tr>
                      ) : (
                         contacts.filter(c => c.status === 'failed').map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #ffedd5' }}>
                               <td style={{ padding: '16px' }}>
                                  <div style={{ fontWeight: '900', color: '#9a3412' }}>#{c.orderNumber || '0000'}</div>
                                  <div style={{ fontSize: '10px', color: '#c2410c', fontWeight: '700' }}>VEND: {c.sellerName?.toUpperCase() || 'SÔNIA IA'}</div>
                               </td>
                               <td style={{ padding: '16px' }}>
                                  <div style={{ fontSize: '12px', color: '#9a3412', fontWeight: '600' }}>{c.obs || "Sem descrição"}</div>
                               </td>
                               <td style={{ padding: '16px' }}>
                                  <input 
                                    defaultValue={c.buyerDeadline || ""}
                                    placeholder="Informe o prazo..."
                                    onBlur={(e) => {
                                       const d = e.target.value;
                                       axios.put(`${API_URL}/contacts`, { id: c.id, updates: { buyerDeadline: d } });
                                       setContacts(contacts.map(item => item.id === c.id ? { ...item, buyerDeadline: d } : item));
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #fed7aa', borderRadius: '6px', fontSize: '12px', background: '#fffcf9' }} 
                                  />
                               </td>
                               <td style={{ padding: '16px', textAlign: 'right' }}>
                                  <button 
                                    onClick={() => {
                                       moveContact(c.id, 'waiting_logistics');
                                       axios.put(`${API_URL}/contacts`, { id: c.id, updates: { obs: `✅ MATERIAL DISPONÍVEL - ${new Date().toLocaleDateString()}` } });
                                       setContacts(contacts.map(item => item.id === c.id ? { ...item, status: 'waiting_logistics', obs: '✅ MATERIAL DISPONÍVEL' } : item));
                                       alert("Estoque Notificado! Pedido retornou para a Logística.");
                                    }}
                                    style={{ padding: '10px 18px', background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                                     PRODUTO CHEGOU
                                  </button>
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'gestion' && (
          <div className="animate-in">
             <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setGestionSubTab('users')} 
                    style={{ 
                      padding: '10px 20px', borderRadius: '10px', border: 'none', background: (gestionSubTab || 'users') === 'users' ? '#2563eb' : '#f1f5f9', color: (gestionSubTab || 'users') === 'users' ? 'white' : '#64748b', fontSize: '13px', fontWeight: '800', cursor: 'pointer' 
                    }}>CADASTRO FUNCIONÁRIO</button>
                  <button 
                    onClick={() => setGestionSubTab('clients')} 
                    style={{ 
                      padding: '10px 20px', borderRadius: '10px', border: 'none', background: (gestionSubTab || 'users') === 'clients' ? '#2563eb' : '#f1f5f9', color: (gestionSubTab || 'users') === 'clients' ? 'white' : '#64748b', fontSize: '13px', fontWeight: '800', cursor: 'pointer' 
                    }}>CADASTRO DE CLIENTES</button>
                </div>
                {gestionSubTab === 'users' && (
                  <button className="btn-primary" onClick={() => { setEditingEmployee(null); setEmployeeFormData({name:'',user:'',pass:'',role:'VENDAS'}); setShowEmployeeModal(true); }}><Plus size={16} /> NOVO FUNCIONÁRIO</button>
                )}
             </div>

             {/* TABELA DE FUNCIONÁRIOS */}
             {gestionSubTab === 'users' && (
               <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <tr>
                           <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>NOME</th>
                           <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>USUÁRIO</th>
                           <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800' }}>PERMISSÃO</th>
                           <th style={{ padding: '16px', fontSize: '11px', fontWeight: '800', textAlign: 'right' }}>AÇÕES</th>
                        </tr>
                     </thead>
                     <tbody>
                        {employees.map((u) => (
                           <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '16px', fontWeight: '800', fontSize: '13px' }}>{u.name}</td>
                              <td style={{ padding: '16px', color: '#64748b' }}>{u.user}</td>
                              <td style={{ padding: '16px' }}>
                                 <span style={{ padding: '4px 8px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', fontSize: '10px', fontWeight: '800' }}>{u.role}</span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'right' }}>
                                 <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => startEditEmployee(u)} style={{ padding: '6px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px' }}><Edit3 size={14} /></button>
                                    <button onClick={() => removeEmployee(u.id)} style={{ padding: '6px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '6px' }}><Trash2 size={14} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             )}

             {/* TABELA DE CLIENTES */}
             {gestionSubTab === 'clients' && (
               <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                     <h2 style={{ fontSize: '15px', fontWeight: '800' }}>Base de Clientes Unificada</h2>
                     <span style={{ fontSize: '12px', color: '#64748b' }}>TOTAL: {contacts.length} REGISTROS</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead style={{ borderBottom: '1px solid #eee' }}>
                        <tr style={{ background: '#fafafa' }}>
                           <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800' }}>CLIENTE</th>
                           <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800' }}>TELEFONE</th>
                           <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800' }}>PERFIL</th>
                           <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', textAlign: 'right' }}>AÇÕES</th>
                        </tr>
                     </thead>
                     <tbody>
                        {contacts.map(c => (
                           <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                              <td style={{ padding: '12px 16px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', color: '#2563eb', textDecoration: 'underline' }} onClick={() => setViewingClientFull(c)}>
                                 {c.name}
                              </td>
                              <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.phone}</td>
                              <td style={{ padding: '12px 16px' }}>
                                 <span style={{ color: '#2563eb', fontSize: '11px', fontWeight: '700' }}>{c.role?.toUpperCase() || 'MKT LEAD'}</span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                 <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { setEditingClient(c); setShowClientModal(true); }} style={{ padding: '6px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px' }}><Edit3 size={14} /></button>
                                    <button onClick={() => removeClient(c.id)} style={{ padding: '6px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '6px' }}><Trash2 size={14} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             )}
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="animate-in" style={{ height: 'calc(100vh - 120px)', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px' }}>Fila de Atendimento</h2>
                <input placeholder="Buscar..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {contacts.map(c => (
                  <div key={c.id} onClick={() => setSelectedChat(c)} style={{ padding: '16px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: selectedChat?.id === c.id ? '#eff6ff' : 'transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <b style={{ fontSize: '14px' }}>{c.name}</b>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{c.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedChat ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                <div style={{ padding: '15px 25px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#2563eb', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{selectedChat.name[0]}</div>
                    <div><b style={{ fontSize: '14px' }}>{selectedChat.name}</b><br/><span style={{ fontSize: '11px', color: '#16a34a' }}>Ativo</span></div>
                  </div>
                  <div style={{ background: '#fef3c7', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: '#92400e', border: '1px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={12} fill="#f59e0b" /> SONIA IA ATIVA
                  </div>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ maxWidth: '70%', alignSelf: m.from === 'client' ? 'flex-start' : 'flex-end', background: m.from === 'client' ? 'white' : '#2563eb', color: m.from === 'client' ? 'black' : 'white', padding: '10px 15px', borderRadius: '12px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      {m.text}
                      <div style={{ fontSize: '9px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>{m.time} {m.bot && '(IA)'}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      value={msgInput} onChange={e => setMsgInput(e.target.value)}
                      placeholder="Sua mensagem..." 
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                      onKeyPress={e => e.key === 'Enter' && setMessages([...messages, { id: Date.now(), from: 'human', text: msgInput, time: '16:05' }])}
                    />
                    <button onClick={() => { if(msgInput) { setMessages([...messages, { id: Date.now(), from: 'human', text: msgInput, time: '16:05' }]); setMsgInput(''); } }} style={{ padding: '0 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700' }}>Enviar</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Selecione um chat</div>
            )}

            {selectedChat && (
              <div className="animate-in" style={{ width: '320px', borderLeft: '1px solid #e2e8f0', background: 'white', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#2563eb', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>{selectedChat.name[0]}</div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800' }}>{selectedChat.name}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{selectedChat.phone}</p>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                       <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><ShoppingCart size={12} /> Detalhes do Pedido</h4>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div>
                            <label style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>NÚMERO DO PEDIDO</label>
                            <input 
                              placeholder="Geração automática..." 
                              defaultValue={selectedChat.orderNumber || Math.floor(1000 + Math.random() * 9000)} 
                              onBlur={(e) => {
                                 const num = e.target.value;
                                 axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { orderNumber: num, sellerName: 'Marcos Neto' } });
                                 setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, orderNumber: num, sellerName: 'Marcos Neto' } : c));
                              }}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: '800', color: '#2563eb' }} 
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>PRAZO COMBINADO</label>
                            <input 
                              placeholder="Ex: 3 dias úteis" 
                              defaultValue={selectedChat.deliveryDeadline || ""} 
                              onBlur={(e) => {
                                 const p = e.target.value;
                                 axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { deliveryDeadline: p } });
                                 setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, deliveryDeadline: p } : c));
                              }}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }} 
                            />
                          </div>
                          <input 
                            placeholder="Valor Final R$" 
                            defaultValue={selectedChat.saleValue || ""} 
                            onBlur={(e) => axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { saleValue: e.target.value } })}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: '700' }} 
                          />
                       </div>
                    </div>

                    <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                       <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><ExternalLink size={12} /> Transferir</h4>
                       <select 
                         onChange={(e) => {
                            const r = e.target.value;
                            if(r) {
                               moveContact(selectedChat.id, 'active');
                               axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { role: r } });
                               setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, role: r } : c));
                               alert(`Transferido para ${r.toUpperCase()}`);
                            }
                         }}
                         style={{ width: '100%', padding: '8px', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '12px' }}>
                          <option value="">Setor...</option>
                          <option value="gestao">Gestão</option>
                          <option value="vendas">Vendas</option>
                          <option value="logistica">Logística</option>
                       </select>
                    </div>

                    <div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Interesses</h4>
                          <Plus size={14} style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => {
                             const search = prompt("Produto/SKU:");
                             const found = products.find(p => p.name.toLowerCase().includes(search?.toLowerCase()) || p.code.toLowerCase().includes(search?.toLowerCase()));
                             if(found) {
                                const up = [...(selectedChat.interests || []), found.name];
                                setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, interests: up } : c));
                                axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { interests: up } });
                                setSelectedChat({ ...selectedChat, interests: up });
                             }
                          }} />
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {(selectedChat.interests || []).map((it, i) => (
                             <div key={i} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                {it} <Trash2 size={12} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => {
                                   const up = selectedChat.interests.filter((_, idx) => idx !== i);
                                   setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, interests: up } : c));
                                   axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { interests: up } });
                                   setSelectedChat({ ...selectedChat, interests: up });
                                }} />
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        const reason = prompt("Descreva a falta de estoque para o COMPRADOR:");
                        if(reason) {
                           moveContact(selectedChat.id, 'failed');
                           axios.put(`${API_URL}/contacts`, { id: selectedChat.id, updates: { obs: `🚩 [VENDEDOR]: ${reason}`, status: 'failed' } });
                           setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, obs: `🚩 [VENDEDOR]: ${reason}`, status: 'failed' } : c));
                           setSelectedChat(null);
                           alert("Falta reportada com sucesso! O pedido foi para o setor de COMPRAS.");
                        }
                      }}
                      style={{ width: '100%', padding: '12px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                       <Activity size={14} /> REPORTAR FALTA (COMPRAS)
                    </button>
                    <button onClick={() => { moveContact(selectedChat.id, 'waiting_logistics'); setSelectedChat(null); }} style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                       <CheckCircle size={16} /> FINALIZAR VENDA
                    </button>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="animate-in">
             <h1>Gestão de Campanhas</h1>
             <div className="card" style={{ marginTop: '20px' }}>
                 <table style={{ width: '100%', textAlign: 'left' }}>
                    <thead><tr style={{ color: '#64748b' }}><th>NOME</th><th>LINK</th><th>STATUS</th><th>LEADS</th></tr></thead>
                    <tbody>
                       {campaigns.map(cp => (
                         <tr key={cp.id}>
                           <td style={{ padding: '12px 0' }}>{cp.name}</td>
                           <td><code style={{ fontSize: '11px' }}>{cp.link}</code></td>
                           <td>{cp.status}</td>
                           <td>{cp.leads}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
             </div>
          </div>
        )}
      </main>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '350px' }}>
            <h2 style={{ marginBottom: '15px' }}>Produto</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome" style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="SKU" style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              <button className="btn-primary" onClick={saveProduct}>Salvar</button>
              <button onClick={() => setShowModal(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '500px' }}>
             <img src={viewing.media} style={{ width: '100%', borderRadius: '10px' }} />
             <h2 style={{ marginTop: '15px' }}>{viewing.name}</h2>
             <p>{viewing.desc}</p>
             <button onClick={() => setViewing(null)} style={{ marginTop: '20px' }}>Fechar</button>
          </div>
        </div>
      )}
      {viewingClientFull && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}>
          <div className="card animate-in" style={{ width: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
               <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Prontuário do Cliente: {viewingClientFull.name}</h2>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Análise detalhada de comportamento e histórico.</p>
               </div>
               <button onClick={() => setViewingClientFull(null)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '800', cursor: 'pointer' }}>FECHAR</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', padding: '24px' }}>
               {/* LADO ESQUERDO: INFOS */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                     <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase', marginBottom: '15px' }}>Dados do Perfil</h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                        <div><b>WhatsApp:</b> {viewingClientFull.phone}</div>
                        <div><b>Tipo:</b> {viewingClientFull.role?.toUpperCase() || 'CLIENTE'}</div>
                        <div><b>Status atual:</b> {viewingClientFull.status?.toUpperCase() || 'NOVO'}</div>
                        <div style={{ marginTop: '10px' }}>
                           <b>Interesses Marcados:</b>
                           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                              {(viewingClientFull.interests || []).map((it, i) => <span key={i} style={{ background: '#2563eb', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>{it}</span>)}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                     <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '15px' }}>Histórico Financeiro</h4>
                     {viewingClientFull.orderNumber ? (
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Pedido Nº:</b> <span>#{viewingClientFull.orderNumber}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Valor:</b> <span>R$ {viewingClientFull.saleValue || "0,00"}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Prazo Venda:</b> <span>{viewingClientFull.deliveryDeadline || "N/A"}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Vendedor:</b> <span>{viewingClientFull.sellerName || "Direto"}</span></div>
                          <div style={{ background: '#16a34a', color: 'white', padding: '8px', borderRadius: '8px', marginTop: '10px', textAlign: 'center', fontWeight: '800' }}>VENDA CONFIRMADA</div>
                       </div>
                     ) : (
                       <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Nenhum pedido finalizado ainda.</p>
                     )}
                  </div>
               </div>

               {/* LADO DIREITO: CHAT LOG */}
               <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #eee', fontWeight: '800', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={14} /> TRANSCRIÇÃO DAS CONVERSAS</div>
                  <div style={{ flex: 1, padding: '20px', maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
                     {(viewingClientFull.msgs || []).length > 0 ? (
                        viewingClientFull.msgs.map((m, i) => (
                           <div key={i} style={{ alignSelf: m.type === 'in' ? 'flex-start' : 'flex-end', background: m.type === 'in' ? 'white' : '#2563eb', color: m.type === 'in' ? 'black' : 'white', padding: '10px 15px', borderRadius: '12px', fontSize: '13px', border: '1px solid #eee', maxWidth: '80%' }}>
                              {m.text}
                              <div style={{ fontSize: '9px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>{m.time} {m.bot && '(SÔNIA IA)'}</div>
                           </div>
                        ))
                     ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Nenhuma conversa registrada.</div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {showEmployeeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div className="card animate-in" style={{ width: '400px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>{editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input value={employeeFormData.name} onChange={e => setEmployeeFormData({...employeeFormData, name: e.target.value})} placeholder="Nome Completo" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <input value={employeeFormData.user} onChange={e => setEmployeeFormData({...employeeFormData, user: e.target.value})} placeholder="Usuário / Login" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <input value={employeeFormData.pass} onChange={e => setEmployeeFormData({...employeeFormData, pass: e.target.value})} type="password" placeholder="Senha" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <select value={employeeFormData.role} onChange={e => setEmployeeFormData({...employeeFormData, role: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                 <option value="VENDAS">VENDAS</option>
                 <option value="LOGÍSTICA">LOGÍSTICA</option>
                 <option value="COMPRAS">COMPRAS</option>
                 <option value="DIRETORIA">DIRETORIA</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={saveEmployee} style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800' }}>{editingEmployee ? 'Salvar' : 'Criar'}</button>
                <button onClick={() => setShowEmployeeModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px' }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClientModal && editingClient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div className="card animate-in" style={{ width: '400px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Editar Perfil Cliente</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input defaultValue={editingClient.name} onBlur={e => setContacts(contacts.map(c => c.id === editingClient.id ? {...c, name: e.target.value} : c))} placeholder="Nome" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <input defaultValue={editingClient.phone} onBlur={e => setContacts(contacts.map(c => c.id === editingClient.id ? {...c, phone: e.target.value} : c))} placeholder="WhatsApp" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <select defaultValue={editingClient.role} onChange={e => setContacts(contacts.map(c => c.id === editingClient.id ? {...c, role: e.target.value} : c))} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                 <option value="campanha">CAMPANHA (Ads FB/IG)</option>
                 <option value="cliente">CLIENTE DIRETO</option>
              </select>
              <button onClick={() => setShowClientModal(false)} style={{ background: '#2563eb', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '800' }}>Finalizar Edição</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
