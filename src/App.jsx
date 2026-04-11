import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, Truck, MessageCircle, Search, Plus, Zap, LogOut, LayoutDashboard,
  ChevronDown, MessageSquare as MessageSquareIcon, Edit3, Save, X, Trash2, Maximize2, Upload, CheckCircle,
  Megaphone, ExternalLink, Activity, Filter, Grid, List, ChevronLeft, ChevronRight,
  Instagram, Facebook
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import axios from 'axios'; 
import { upload } from '@vercel/blob/client';

// Configuração Global de Segurança (Fix 401)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('aura_token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de Resposta para deslogar em caso de 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.warn("Sessão expirada ou não autorizada. Deslogando...");
      localStorage.removeItem('aura_token');
      localStorage.removeItem('aura_user');
      if (window.location.pathname !== '/') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);


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

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Porcelanato', color: '#2563eb' },
  { id: '2', name: 'Pastilhas', color: '#d946ef' }
];

const API_URL = '/api-proxy'; 

const DEFAULT_PRODUCTS = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", type: 'image', desc: "Acabamento de alto brilho, ideal para áreas nobres.", categoriaId: '1', tamanho: '90x90', cor: 'Gold', precoNormal: '129.90', precoPromocao: '99.90' },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", type: 'image', desc: "Paredes internas. Textura acetinada.", categoriaId: '1', tamanho: '30x60', cor: 'White', precoNormal: '79.90', precoPromocao: '' }
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('aura_token'));
  const [loggedUser, setLoggedUser] = useState(() => {
    try {
      // Sempre decodifica o JWT token (fonte mais confiável)
      const token = localStorage.getItem('aura_token');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          return { id: payload.id, name: payload.name || payload.user, role: payload.role, avatar: payload.avatar };
        }
      }
      // Fallback: localStorage
      const u = localStorage.getItem('aura_user');
      if (u) return JSON.parse(u);
    } catch { /* ignore */ }
    return null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS.map(c => ({
    ...c,
    protocolo: `#${Math.floor(100000 + Math.random() * 900000)}`,
    notas: '',
    historico: [
      { tipo: 'ia_inicio', texto: 'Atendimento iniciado pela IA Sônia', hora: c.time, autor: 'IA Sônia' },
      { tipo: 'transferencia', texto: 'Transferido para agente humano', hora: c.time, autor: 'Sistema' }
    ],
    orderInfo: null,
    proximoContato: ''
  })));
  const [stats, setStats] = useState({ total: 128, inService: 42, conversion: '24%', responseTime: '1.2s' });
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', media: '', mediaGallery: [], type: 'image', desc: '', videoUrl: '', campaignId: '', categoriaId: '', tamanho: '', cor: '', precoNormal: '', precoPromocao: '' });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [carouselIndex, setCarouselIndex] = useState({});
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
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignProductSearch, setCampaignProductSearch] = useState('');
  const [productViewMode, setProductViewMode] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [detailCarouselIdx, setDetailCarouselIdx] = useState(0);
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductForm, setIsProductForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', color: '#2563eb' });
  const [chatInput, setChatInput] = useState('');
  const userRole = loggedUser?.role?.toLowerCase() || '';
  const isVendedor = userRole === 'vendedor' || userRole === 'vendas';
  const [orderFormData, setOrderFormData] = useState({ numeroPedido: '', prazoEntrega: '', valorFinal: '' });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [aiConfigStep, setAiConfigStep] = useState(0);
  const [aiTab, setAiTab] = useState('config'); // config | whatsapp
  const [waStatus, setWaStatus] = useState({ status: 'disconnected', qr: null });
  const [aiConfig, setAiConfig] = useState({
    name: 'Sônia',
    greeting: 'Olá! Sou a {name}, assistente virtual da Pereira Acabamentos. Como posso ajudar?',
    voiceTone: 'humanized',
    canDo: 'Qualificar leads, passar preços e condições, agendar visitas, transferir para vendedor humano, enviar catálogo técnico, informar estoque e prazo de entrega',
    cantDo: 'Dar descontos sem autorização, prometer prazos que não foram confirmados, inventar informações sobre produtos, atender reclamações complexas, fechar vendas acima de R$ 10.000 sem aprovação',
    maxRetries: 3,
    transferAfterFailed: true,
    workingHours: 'Seg-Sex 08:00-18:00, Sab 08:00-12:00',
    fallbackMessage: 'Entendi! Vou transferir você para um de nossos consultores que poderá ajudar melhor.',
    knowledgeBase: 'A Pereira Acabamentos é especialista em porcelanatos de grande formato e acabamentos premium. Trabalhamos com marcas como Portobello, Villagres e Roca. Entregamos em um raio de 50km sem custo. Garantia de 5 anos em defeitos de fabricação.'
  });

  const [gestionSubTab, setGestionSubTab] = useState('users');
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeFormData, setEmployeeFormData] = useState({ name: '', user: '', pass: '', role: 'VENDAS' });
  
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClientFull, setViewingClientFull] = useState(null);

  const [campaigns, setCampaigns] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignFormData, setCampaignFormData] = useState({ name: '', link: '', platform: 'Instagram', status: 'Ativa' });

  const saveEmployee = async () => {
    if (editingEmployee) {
       const payload = { ...employeeFormData, id: editingEmployee.id };
       if (!employeeFormData.pass || employeeFormData.pass === '********') {
         delete payload.pass;
       }
       await axios.put(`${API_URL}/employees`, payload);
       setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...employeeFormData } : e));
    } else {
       const res = await axios.post(`${API_URL}/employees`, employeeFormData);
       setEmployees([...employees, { ...employeeFormData, id: res.data.employee.id, pass: '********' }]);
    }
    setShowEmployeeModal(false);
    setEditingEmployee(null);
  };

  const saveCampaign = async () => {
    if (editingCampaign) {
       await axios.put(`${API_URL}/campaigns`, { ...campaignFormData, id: editingCampaign.id });
       setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...campaignFormData, id: c.id } : c));
    } else {
       const res = await axios.post(`${API_URL}/campaigns`, campaignFormData);
       setCampaigns([...campaigns, { ...campaignFormData, id: res.data.campaign.id, leads: 0 }]);
    }
    setShowCampaignModal(false);
    setEditingCampaign(null);
  };

  const toggleCampaignStatus = async (cp) => {
    const newStatus = (cp.status === 'Ativa' || cp.status === 'active') ? 'Pausada' : 'Ativa';
    try {
      await axios.put(`${API_URL}/campaigns`, { id: cp.id, status: newStatus });
      setCampaigns(campaigns.map(c => c.id === cp.id ? { ...c, status: newStatus } : c));
      if (selectedCampaign?.id === cp.id) {
        setSelectedCampaign({ ...selectedCampaign, status: newStatus });
      }
      if (newStatus === 'Pausada') {
        const linkedProducts = products.filter(p => p.campaignId === cp.id);
        const updated = products.map(p => p.campaignId === cp.id ? { ...p, active: false } : p);
        for (const prod of linkedProducts) {
          await axios.post(`${API_URL}/products`, { ...prod, active: false });
        }
        setProducts(updated);
      } else {
        const updated = products.map(p => p.campaignId === cp.id ? { ...p, active: true } : p);
        for (const prod of updated.filter(p => p.campaignId === cp.id)) {
          await axios.post(`${API_URL}/products`, { ...prod, active: true });
        }
        setProducts(updated);
      }
    } catch (err) {
      console.error("Erro ao alternar status da campanha:", err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { user: loginUser, pass: loginPass });
      if (res.data.success) {
        localStorage.setItem('aura_token', res.data.token);
        localStorage.setItem('aura_user', JSON.stringify(res.data.user));
        
        // Atualiza o header do axios IMEDIATAMENTE após o login para evitar 401 na primeira carga
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setLoggedUser(res.data.user);
        setIsAuthenticated(true);
        window.location.reload(); // Recarrega para garantir que todos os useEffects rodem com o novo token
      }
    } catch (err) {
      alert('Credenciais inválidas ou erro no servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    setLoggedUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setSelectedChat(null);
  };

  useEffect(() => {
    let interval;
    if (activeTab === 'ai-config' && aiTab === 'whatsapp') {
      const fetchStatus = () => {
        axios.get(`${API_URL}/wa-status?t=${Date.now()}`).then(res => {
          setWaStatus(res.data);
        }).catch(() => {});
      };
      fetchStatus();
      interval = setInterval(fetchStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab, aiTab]);

  const removeCampaign = async (id) => { 
    if(window.confirm("Excluir campanha?")) {
       await axios.delete(`${API_URL}/campaigns?id=${id}`);
       setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const removeEmployee = async (id) => { 
    if(window.confirm("Excluir funcionário?")) {
       await axios.delete(`${API_URL}/employees?id=${id}`);
       setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const startEditEmployee = (e) => { setEditingEmployee(e); setEmployeeFormData({ ...e, pass: '********' }); setShowEmployeeModal(true); };

  const removeClient = async (id) => { 
    if(window.confirm("Excluir cliente permanentemente?")) {
       await axios.delete(`${API_URL}/contacts?id=${id}`);
       setContacts(contacts.filter(c => c.id !== id));
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('aura_token');
      if (!token) return;

      try {
        const [cRes, pRes, eRes, cpRes, catRes, aiRes] = await Promise.all([
          axios.get(`${API_URL}/contacts`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/employees`),
          axios.get(`${API_URL}/campaigns`),
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/ai-config`)
        ]);
        if (cRes.data.length > 0) {
          const mapped = cRes.data.map(c => ({
            ...c,
            isAiPaused: c.bot_active === false
          }));
          setContacts(mapped);
        }
        if (pRes.data.length > 0) setProducts(pRes.data);
        if (eRes.data.length > 0) setEmployees(eRes.data);
        if (cpRes.data.length > 0) setCampaigns(cpRes.data);
        if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);
        if (aiRes.data && aiRes.data.name) setAiConfig(aiRes.data);
      } catch (err) {
        if (err.response && err.response.status !== 401) {
           console.warn("KV Sync Error:", err.message);
        }
      }
    };
    fetchData();
  }, [isAuthenticated]);


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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const currentGallery = formData.mediaGallery && formData.mediaGallery.length > 0 ? formData.mediaGallery : (formData.media ? [formData.media] : []);
    if (currentGallery.length >= 10) {
      alert("⚠️ Limite de 10 fotos atingido. Remova uma foto antes de adicionar outra.");
      e.target.value = '';
      return;
    }
    const availableSlots = 10 - currentGallery.length;
    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      alert(`⚠️ Apenas ${availableSlots} foto(s) restante(s). Enviando as primeiras ${availableSlots}.`);
    }
    setIsUploading(true);
    try {
      const newUrls = [];
      for (const file of filesToUpload) {
        if (file.type.startsWith('video')) {
          alert(`⚠️ Vídeo ignorado: ${file.name}`);
          continue;
        }
        try {
          const blob = await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
          newUrls.push(blob.url);
        } catch (uploadErr) {
          console.error("Erro no upload de", file.name, uploadErr);
          const reader = new FileReader();
          const base64Url = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          newUrls.push(base64Url);
        }
      }
      const updatedGallery = [...currentGallery, ...newUrls];
      setFormData({ ...formData, mediaGallery: updatedGallery, media: updatedGallery[0] || formData.media });
    } catch (err) {
      console.error("Erro no upload da galeria:", err);
      alert("Erro ao enviar fotos. Tente novamente.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const saveProduct = async () => {
    if (!formData.categoriaId) { alert("Selecione uma categoria."); return; }
    if (!formData.name || !formData.code) { alert("Preencha nome e SKU."); return; }
    const newProduct = { ...formData, id: editing ? editing.id : Date.now().toString() };
    try {
      await axios.post(`${API_URL}/products`, newProduct);
      if (editing) setProducts(products.map(p => p.id === editing.id ? newProduct : p));
      else setProducts([newProduct, ...products]);
      setIsProductForm(false);
      setEditing(null);
      setFormData({ name: '', code: '', media: '', mediaGallery: [], type: 'image', desc: '', videoUrl: '', campaignId: '', categoriaId: '', tamanho: '', cor: '', precoNormal: '', precoPromocao: '' });
    } catch (err) {
      console.error("Erro ao persistir na Vercel:", err);
      setIsProductForm(false);
    }
  };

  const startEdit = (p) => { setEditing(p); setFormData(p); setIsProductForm(true); setDetailCarouselIdx(0); };
  const removeProduct = async (id) => { if (window.confirm("Excluir este produto?")) { try { await axios.delete(`${API_URL}/products?id=${id}`); } catch(e) {} setProducts(products.filter(p => p.id !== id)); if (selectedProduct?.id === id) setSelectedProduct(null); } };

  const saveCategory = async () => {
    if (!categoryFormData.name.trim()) { alert("Informe o nome da categoria."); return; }
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/categories/${editingCategory.id}`, categoryFormData);
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryFormData } : c));
      } else {
        const res = await axios.post(`${API_URL}/categories`, categoryFormData);
        const newCat = res.data.category;
        setCategories([...categories, newCat]);
        if (isProductForm && !formData.categoriaId) {
          setFormData({...formData, categoriaId: newCat.id});
        }
      }
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
    }
    setEditingCategory(null);
    setCategoryFormData({ name: '', color: '#2563eb' });
  };

  const removeCategory = async (id) => {
    const linkedProducts = products.filter(p => p.categoriaId === id);
    if (linkedProducts.length > 0) {
      if (!window.confirm(`Esta categoria possui ${linkedProducts.length} produto(s) vinculado(s). Deseja remover a categoria e desvincular os produtos?`)) return;
    }
    try {
      await axios.delete(`${API_URL}/categories?id=${id}`);
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
    }
    setCategories(categories.filter(c => c.id !== id));
    if (linkedProducts.length > 0) {
      setProducts(products.map(p => p.categoriaId === id ? { ...p, categoriaId: '' } : p));
    }
  };

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
    <>
      {!isAuthenticated && (
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="card" style={{ width: '380px', padding: '40px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
              <Zap size={28} color="#2563eb" /> <span style={{ fontWeight: '800', fontSize: '24px' }}>AuraChat</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Bem-vindo</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Faça login para acessar o painel</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Usuário" style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
              <input value={loginPass} onChange={e => setLoginPass(e.target.value)} type="password" placeholder="Senha" style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px' }} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
              <button className="btn-primary" onClick={handleLogin} style={{ padding: '14px', marginTop: '8px', fontSize: '14px' }}>Entrar</button>
            </div>
          </div>
        </div>
      )}
      {isAuthenticated && (
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
            <div>
              <b style={{ fontSize: '13px', display: 'block' }}>{loggedUser?.name || 'Usuário'}</b>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{loggedUser?.role === 'gestor' ? 'Diretoria' : loggedUser?.role === 'vendedor' ? 'Vendedor' : loggedUser?.role || ''}</span>
            </div>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <SidebarLink icon={<Megaphone size={20}/>} label="Campanhas" active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="Atendimento" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        {!isVendedor && <SidebarLink icon={<Zap size={20}/>} label="IA Sônia" active={activeTab === 'ai-config'} onClick={() => setActiveTab('ai-config')} />}
        {!isVendedor && <SidebarLink icon={<Activity size={20}/>} label="Gestão" active={activeTab === 'gestion'} onClick={() => setActiveTab('gestion')} />}
        <div style={{ marginTop: 'auto' }}><SidebarLink icon={<LogOut size={20}/>} label="Sair" color="#ef4444" onClick={handleLogout} /></div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && loggedUser && !isVendedor && (
          <div className="animate-in">
            <div className="dashboard-header">
              <div>
                <h1>Painel da Diretoria</h1>
                <p>Monitoramento de equipe, atendimentos e performance da IA</p>
              </div>
              <div className="dashboard-date-badge">
                <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="dashboard-kpi-grid">
              <div className="dash-kpi-card primary">
                <div className="dash-kpi-icon"><MessageCircle size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Leads Hoje</span>
                  <span className="dash-kpi-value">{contacts.length}</span>
                  <span className="dash-kpi-trend up">+{Math.floor(Math.random() * 5 + 2)} vs ontem</span>
                </div>
              </div>
              <div className="dash-kpi-card success">
                <div className="dash-kpi-icon"><CheckCircle size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Vendas Fechadas</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.status === 'completed').length}</span>
                  <span className="dash-kpi-trend up">+{Math.floor(Math.random() * 3 + 1)} vs ontem</span>
                </div>
              </div>
              <div className="dash-kpi-card warning">
                <div className="dash-kpi-icon"><Zap size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Em Atendimento</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.status === 'active').length}</span>
                  <span className="dash-kpi-trend neutral">{contacts.filter(c => c.status === 'new').length} aguardando</span>
                </div>
              </div>
              <div className="dash-kpi-card info">
                <div className="dash-kpi-icon"><Activity size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">IA Qualificou</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.historico && c.historico.some(h => h.tipo === 'ia_inicio')).length}</span>
                  <span className="dash-kpi-trend up">{Math.floor(Math.random() * 20 + 70)}% taxa de qualificação</span>
                </div>
              </div>
              <div className="dash-kpi-card accent">
                <div className="dash-kpi-icon"><ExternalLink size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Transferências IA</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.historico && c.historico.some(h => h.tipo === 'transferencia')).length}</span>
                  <span className="dash-kpi-trend neutral">Para vendedores</span>
                </div>
              </div>
              <div className="dash-kpi-card revenue">
                <div className="dash-kpi-icon"><ShoppingCart size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Pedidos Registrados</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.orderInfo).length}</span>
                  <span className="dash-kpi-trend up">R$ {contacts.filter(c => c.orderInfo).reduce((acc, c) => acc + (parseFloat(c.orderInfo?.valorFinal) || 0), 0).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-charts-row">
              <div className="dash-chart-card full-width">
                <h3>Ranking de Vendedores — Quem Está Fechando Mais</h3>
                <div className="seller-ranking">
                  {employees.filter(e => e.active !== false).map((emp, idx) => {
                    const empContacts = contacts.filter(c => c.role === emp.name);
                    const empSales = empContacts.filter(c => c.status === 'completed').length;
                    const empActive = empContacts.filter(c => c.status === 'active').length;
                    const empOrders = empContacts.filter(c => c.orderInfo).length;
                    const totalRevenue = empContacts.filter(c => c.orderInfo).reduce((acc, c) => acc + (parseFloat(c.orderInfo?.valorFinal) || 0), 0);
                    const convRate = empContacts.length > 0 ? Math.round((empSales / empContacts.length) * 100) : 0;
                    return (
                      <div key={emp.id} className={`seller-rank-item rank-${idx + 1}`}>
                        <div className="seller-rank-position">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>
                        <div className="seller-rank-avatar">{emp.name[0]}</div>
                        <div className="seller-rank-info">
                          <strong>{emp.name}</strong>
                          <span>{empActive} em atendimento • {empOrders} pedidos</span>
                        </div>
                        <div className="seller-rank-stats">
                          <div className="seller-stat">
                            <span className="seller-stat-value">{empSales}</span>
                            <span className="seller-stat-label">Vendas</span>
                          </div>
                          <div className="seller-stat">
                            <span className="seller-stat-value">{convRate}%</span>
                            <span className="seller-stat-label">Conversão</span>
                          </div>
                          <div className="seller-stat revenue">
                            <span className="seller-stat-value">R$ {totalRevenue.toFixed(0)}</span>
                            <span className="seller-stat-label">Receita</span>
                          </div>
                        </div>
                        <div className="seller-rank-bar">
                          <div className="seller-rank-fill" style={{ width: `${Math.min(convRate * 3, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="dashboard-bottom-row">
              <div className="dash-ai-card">
                <h3><Zap size={16} /> Performance da IA Sônia</h3>
                <div className="ai-metrics">
                  <div className="ai-metric">
                    <div className="ai-metric-icon green"><CheckCircle size={16} /></div>
                    <div className="ai-metric-info">
                      <span className="ai-metric-value">{Math.floor(Math.random() * 15 + 75)}%</span>
                      <span className="ai-metric-label">Taxa de Qualificação</span>
                    </div>
                  </div>
                  <div className="ai-metric">
                    <div className="ai-metric-icon blue"><ExternalLink size={16} /></div>
                    <div className="ai-metric-info">
                      <span className="ai-metric-value">{contacts.filter(c => c.historico && c.historico.some(h => h.tipo === 'transferencia')).length}</span>
                      <span className="ai-metric-label">Transferências Corretas</span>
                    </div>
                  </div>
                  <div className="ai-metric">
                    <div className="ai-metric-icon yellow"><MessageCircle size={16} /></div>
                    <div className="ai-metric-info">
                      <span className="ai-metric-value">{Math.floor(Math.random() * 5 + 2)}</span>
                      <span className="ai-metric-label">Leads Retidos (sem resposta)</span>
                    </div>
                  </div>
                  <div className="ai-metric">
                    <div className="ai-metric-icon purple"><Activity size={16} /></div>
                    <div className="ai-metric-info">
                      <span className="ai-metric-value">{Math.floor(Math.random() * 30 + 60)}%</span>
                      <span className="ai-metric-label">IA Resolvendo Sozinha</span>
                    </div>
                  </div>
                </div>
                <div className="ai-status-bar">
                  <div className="ai-status-indicator active" />
                  <span>IA Sônia está <strong>operando normalmente</strong></span>
                </div>
              </div>

              <div className="dash-activity-card">
                <h3>Atividade Recente</h3>
                <div className="dash-activity-list">
                  {contacts.slice(0, 6).map((c, i) => {
                    const colors = ['green', 'blue', 'yellow', 'purple', 'green', 'blue'];
                    const actions = [
                      `${c.name} — atendimento ${c.status === 'completed' ? 'finalizado' : c.status === 'active' ? 'em andamento' : 'novo'}`,
                      c.orderInfo ? `Pedido ${c.orderInfo.numeroPedido} registrado` : '',
                      c.historico && c.historico.some(h => h.tipo === 'ia_inicio') ? 'Iniciado pela IA Sônia' : ''
                    ].filter(Boolean).join(' • ');
                    return (
                      <div key={i} className="dash-activity-item">
                        <div className={`dash-activity-dot ${colors[i % colors.length]}`} />
                        <div>
                          <p><strong>{c.name}</strong> — {actions}</p>
                          <span>{c.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="dashboard-live-row">
              <div className="dash-live-card">
                <h3><div className="live-pulse" /> Quem Está Atendendo Agora</h3>
                <div className="live-agents">
                  {employees.filter(e => e.active !== false).map(emp => {
                    const empActive = contacts.filter(c => c.status === 'active' && c.role === emp.name);
                    const isAttending = empActive.length > 0;
                    return (
                      <div key={emp.id} className={`live-agent-card ${isAttending ? 'attending' : 'idle'}`}>
                        <div className="live-agent-avatar">{emp.name[0]}</div>
                        <div className="live-agent-info">
                          <strong>{emp.name}</strong>
                          <span className={`live-agent-status ${isAttending ? 'attending' : 'idle'}`}>
                            {isAttending ? `Atendendo ${empActive.length} lead${empActive.length > 1 ? 's' : ''}` : 'Aguardando'}
                          </span>
                        </div>
                        {isAttending && (
                          <div className="live-agent-leads">
                            {empActive.slice(0, 3).map(c => (
                              <span key={c.id} className="live-lead-tag">{c.name.split(' ')[0]}</span>
                            ))}
                            {empActive.length > 3 && <span className="live-lead-more">+{empActive.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && loggedUser && (loggedUser.role || '').toLowerCase() !== 'gestor' && (
          <div className="animate-in">
            <div className="dashboard-header">
              <div>
                <h1>Meu Painel</h1>
                <p>Seus atendimentos e desempenho individual</p>
              </div>
              <div className="dashboard-date-badge">
                <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="dashboard-kpi-grid seller-grid">
              <div className="dash-kpi-card primary">
                <div className="dash-kpi-icon"><MessageCircle size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Meus Atendimentos</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.role === loggedUser?.name).length}</span>
                  <span className="dash-kpi-trend neutral">Total acumulado</span>
                </div>
              </div>
              <div className="dash-kpi-card success">
                <div className="dash-kpi-icon"><CheckCircle size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Vendas Fechadas</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.status === 'completed' && c.role === loggedUser?.name).length}</span>
                  <span className="dash-kpi-trend up">Continue assim!</span>
                </div>
              </div>
              <div className="dash-kpi-card warning">
                <div className="dash-kpi-icon"><Zap size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Em Andamento</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.status === 'active' && c.role === loggedUser?.name).length}</span>
                  <span className="dash-kpi-trend neutral">Aguardando retorno</span>
                </div>
              </div>
              <div className="dash-kpi-card revenue">
                <div className="dash-kpi-icon"><ShoppingCart size={20} /></div>
                <div className="dash-kpi-info">
                  <span className="dash-kpi-label">Pedidos Registrados</span>
                  <span className="dash-kpi-value">{contacts.filter(c => c.orderInfo && c.role === loggedUser?.name).length}</span>
                  <span className="dash-kpi-trend neutral">Este mês</span>
                </div>
              </div>
            </div>

            <div className="dashboard-charts-row">
              <div className="dash-chart-card full-width">
                <h3>Meus Atendimentos Recentes</h3>
                {contacts.filter(c => c.role === loggedUser?.name || c.status === 'new').length === 0 ? (
                  <div className="dash-empty-state">
                    <MessageCircle size={32} color="#cbd5e1" />
                    <p>Nenhum atendimento atribuído ainda</p>
                    <span>Novos leads aparecerão aqui quando forem transferidos para você</span>
                  </div>
                ) : (
                  <div className="dash-my-contacts">
                    {contacts.filter(c => c.role === loggedUser?.name).map(c => (
                      <div key={c.id} className="dash-my-contact-card" onClick={() => { setActiveTab('whatsapp'); setSelectedChat(c); }}>
                        <div className="dash-my-contact-avatar">{c.name[0]}</div>
                        <div className="dash-my-contact-info">
                          <strong>{c.name}</strong>
                          <span>{c.msg}</span>
                        </div>
                        <div className="dash-my-contact-meta">
                          <span className={`dash-contact-status ${c.status === 'active' ? 'active' : c.status === 'completed' ? 'completed' : 'new'}`}>
                            {c.status === 'active' ? 'Em andamento' : c.status === 'completed' ? 'Finalizado' : 'Novo'}
                          </span>
                          <span className="dash-contact-time">{c.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-bottom-row">
              <div className="dash-tips-card">
                <h3>Dicas de Vendas</h3>
                <div className="dash-tip-item">
                  <div className="dash-tip-icon">1</div>
                  <p>Responda leads em até 5 minutos para aumentar a conversão em 40%</p>
                </div>
                <div className="dash-tip-item">
                  <div className="dash-tip-icon">2</div>
                  <p>Use o catálogo técnico para mostrar qualidade dos produtos</p>
                </div>
                <div className="dash-tip-item">
                  <div className="dash-tip-icon">3</div>
                  <p>Registre todos os pedidos com prazo de entrega para evitar reclamações</p>
                </div>
                <div className="dash-tip-item">
                  <div className="dash-tip-icon">4</div>
                  <p>Faça follow-up em 48h com clientes que não fecharam</p>
                </div>
              </div>

              <div className="dash-quick-actions">
                <h3>Ações Rápidas</h3>
                <button className="dash-quick-btn" onClick={() => setActiveTab('whatsapp')}>
                  <MessageCircle size={18} /> Ver Fila de Atendimento
                </button>
                <button className="dash-quick-btn" onClick={() => setActiveTab('products')}>
                  <ShoppingCart size={18} /> Consultar Produtos
                </button>
                <button className="dash-quick-btn" onClick={() => setActiveTab('campaigns')}>
                  <Megaphone size={18} /> Ver Campanhas Ativas
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-config' && (
          <div className="ai-config-page animate-in">
            <div className="ai-config-header">
              <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
                <button 
                  onClick={() => setAiTab('config')}
                  style={{ 
                    padding: '12px 24px', 
                    background: 'transparent', 
                    border: 'none', 
                    borderBottom: aiTab === 'config' ? '3px solid #2563eb' : '3px solid transparent',
                    color: aiTab === 'config' ? '#2563eb' : '#64748b',
                    fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                  }}>⚡ CONFIGURAÇÃO DA SONIA</button>
                <button 
                  onClick={() => {
                    setAiTab('whatsapp');
                    axios.get(`${API_URL}/wa-status`).then(res => setWaStatus(res.data)).catch(() => {});
                  }}
                  style={{ 
                    padding: '12px 24px', 
                    background: 'transparent', 
                    border: 'none', 
                    borderBottom: aiTab === 'whatsapp' ? '3px solid #2563eb' : '3px solid transparent',
                    color: aiTab === 'whatsapp' ? '#2563eb' : '#64748b',
                    fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                  }}>📱 CONECTAR WHATSAPP (GCP)</button>
              </div>
              
              {aiTab === 'config' ? (
                <>
                  <h1>IA Sônia</h1>
                  <p>Personalize o comportamento e a personalidade da assistente virtual</p>
                  <div className="ai-config-steps">
                    {['Identidade', 'Tom de Voz', 'Regras', 'Conhecimento', 'Avançado'].map((step, i) => (
                      <div key={i} className={`ai-step-indicator ${i === aiConfigStep ? 'active' : i < aiConfigStep ? 'completed' : ''}`} onClick={() => setAiConfigStep(i)}>
                        <div className="ai-step-number">{i < aiConfigStep ? '✓' : i + 1}</div>
                        <span className="ai-step-label">{step}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h1>Conexão WhatsApp</h1>
                  <p>Integre seu número oficial para a Sônia responder em tempo real</p>
                </>
              )}
            </div>

            {aiTab === 'config' ? (
              <>
                <div className="ai-config-body">
                  {aiConfigStep === 0 && (
                    <div className="ai-config-section">
                      <h2>Identidade da IA</h2>
                      <p className="ai-config-desc">Defina o nome e a personalidade da sua assistente virtual</p>
                      <div className="ai-form-group">
                        <label>Nome da Assistente</label>
                        <input className="ai-input" value={aiConfig.name} onChange={e => setAiConfig({...aiConfig, name: e.target.value})} placeholder="Ex: Sônia" />
                        <span className="ai-hint">Este nome será usado nas conversas com os clientes</span>
                      </div>
                      <div className="ai-form-group">
                        <label>Mensagem de Saudação</label>
                        <textarea className="ai-textarea" value={aiConfig.greeting} onChange={e => setAiConfig({...aiConfig, greeting: e.target.value})} rows={3} placeholder="Use {name} para inserir o nome automaticamente" />
                        <span className="ai-hint">Use {'{name}'} para inserir o nome da IA automaticamente</span>
                      </div>
                      <div className="ai-form-group">
                        <label>Mensagem de Fallback (quando transferir)</label>
                        <textarea className="ai-textarea" value={aiConfig.fallbackMessage} onChange={e => setAiConfig({...aiConfig, fallbackMessage: e.target.value})} rows={2} />
                      </div>
                    </div>
                  )}

                  {aiConfigStep === 1 && (
                    <div className="ai-config-section">
                      <h2>Tom de Voz</h2>
                      <p className="ai-config-desc">Defina como a IA se comunica com os clientes</p>
                      <div className="ai-tone-options">
                        <div className={`ai-tone-card ${aiConfig.voiceTone === 'ultra-human' ? 'selected' : ''}`} onClick={() => setAiConfig({...aiConfig, voiceTone: 'ultra-human'})}>
                          <div className="ai-tone-icon">🤝</div>
                          <h3>Ultra Humanizado</h3>
                          <p>Praticamente imperceptível que é uma IA. Usa gírias leves, emojis sutis e variação natural de frases.</p>
                          <div className="ai-tone-badge selected-indicator">Recomendado</div>
                        </div>
                        <div className={`ai-tone-card ${aiConfig.voiceTone === 'humanized' ? 'selected' : ''}`} onClick={() => setAiConfig({...aiConfig, voiceTone: 'humanized'})}>
                          <div className="ai-tone-icon">😊</div>
                          <h3>Humanizado</h3>
                          <p>Amigável e natural, mas o cliente pode perceber que é automatizado. Bom equilíbrio.</p>
                        </div>
                        <div className={`ai-tone-card ${aiConfig.voiceTone === 'professional' ? 'selected' : ''}`} onClick={() => setAiConfig({...aiConfig, voiceTone: 'professional'})}>
                          <div className="ai-tone-icon">💼</div>
                          <h3>Profissional</h3>
                          <p>Formal e direto. Ideal para clientes corporativos e B2B.</p>
                        </div>
                      </div>
                      <div className="ai-form-group">
                        <label>Horário de Funcionamento</label>
                        <input className="ai-input" value={aiConfig.workingHours} onChange={e => setAiConfig({...aiConfig, workingHours: e.target.value})} placeholder="Ex: Seg-Sex 8h-18h, Sáb 8h-12h" />
                        <span className="ai-hint">Fora deste horário, a IA pode usar mensagem diferente</span>
                      </div>
                    </div>
                  )}

                  {aiConfigStep === 2 && (
                    <div className="ai-config-section">
                      <h2>Regras de Comportamento</h2>
                      <p className="ai-config-desc">Defina o que a IA pode e não pode fazer</p>
                      <div className="ai-form-group">
                        <label style={{ color: '#10b981' }}>✅ O que a IA PODE fazer</label>
                        <textarea className="ai-textarea ai-rules-positive" value={aiConfig.canDo} onChange={e => setAiConfig({...aiConfig, canDo: e.target.value})} rows={5} />
                        <span className="ai-hint">Separe as permissões por vírgula</span>
                      </div>
                      <div className="ai-form-group">
                        <label style={{ color: '#ef4444' }}>🚫 O que a IA NÃO PODE fazer</label>
                        <textarea className="ai-textarea ai-rules-negative" value={aiConfig.cantDo} onChange={e => setAiConfig({...aiConfig, cantDo: e.target.value})} rows={5} />
                        <span className="ai-hint">Regras críticas que a IA nunca deve violar</span>
                      </div>
                    </div>
                  )}

                  {aiConfigStep === 3 && (
                    <div className="ai-config-section">
                      <h2>Base de Conhecimento (RAG)</h2>
                      <p className="ai-config-desc">Adicione manuais, FAQs e informações detalhadas para a Sônia estudar</p>
                      <div className="ai-form-group">
                        <label>Informações da Empresa e FAQs</label>
                        <textarea className="ai-textarea" value={aiConfig.knowledgeBase} onChange={e => setAiConfig({...aiConfig, knowledgeBase: e.target.value})} rows={8} placeholder="Cole aqui textos, manuais ou perguntas frequentes..." />
                        <span className="ai-hint">Quanto mais detalhes você adicionar, mais precisa a Sônia será</span>
                      </div>
                    </div>
                  )}

                  {aiConfigStep === 4 && (
                    <div className="ai-config-section">
                      <h2>Configurações Avançadas</h2>
                      <p className="ai-config-desc">Ajustes finos do comportamento da IA</p>
                      <div className="ai-advanced-grid">
                        <div className="ai-form-group">
                          <label>Tentativas Máximas antes de Transferir</label>
                          <input className="ai-input" type="number" value={aiConfig.maxRetries} onChange={e => setAiConfig({...aiConfig, maxRetries: parseInt(e.target.value) || 3})} min={1} max={10} />
                          <span className="ai-hint">Após X tentativas sem sucesso, transfere para humano</span>
                        </div>
                        <div className="ai-form-group">
                          <label>Transferir Automaticamente?</label>
                          <div className="ai-toggle-group">
                            <button className={`ai-toggle-btn ${aiConfig.transferAfterFailed ? 'on' : 'off'}`} onClick={() => setAiConfig({...aiConfig, transferAfterFailed: true})}>Sim</button>
                            <button className={`ai-toggle-btn ${!aiConfig.transferAfterFailed ? 'on' : 'off'}`} onClick={() => setAiConfig({...aiConfig, transferAfterFailed: false})}>Não</button>
                          </div>
                        </div>
                      </div>
                      <div className="ai-preview-card">
                        <h3>Pré-visualização da Saudação</h3>
                        <div className="ai-preview-bubble">
                          <p>{aiConfig.greeting.replace('{name}', aiConfig.name)}</p>
                          <span className="ai-preview-time">agora</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ai-config-footer">
                  <div className="ai-config-nav">
                    {aiConfigStep > 0 ? (
                      <button className="ai-nav-btn secondary" onClick={() => setAiConfigStep(aiConfigStep - 1)}>
                        ← Anterior
                      </button>
                    ) : (
                      <div />
                    )}
                    {aiConfigStep < 4 ? (
                      <button className="ai-nav-btn primary" onClick={() => setAiConfigStep(aiConfigStep + 1)}>
                        Próximo →
                      </button>
                    ) : (
                      <button className="ai-nav-btn primary" onClick={async () => {
                        try {
                          await axios.post(`${API_URL}/ai-config`, aiConfig);
                          alert('Configurações da Sônia salvas com sucesso (Nuvem)!');
                        } catch (err) {
                          alert('Erro ao salvar no servidor. Verifique sua conexão.');
                        }
                      }}>
                        Salvar e Ativar ⚡
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="ai-config-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="wa-connection-card">
                  {waStatus.status === 'connected' ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <CheckCircle size={40} />
                      </div>
                      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>WhatsApp Conectado!</h2>
                      <p style={{ color: '#64748b', marginBottom: '32px' }}>O sistema está rodando no Google Cloud e a Sônia está online.</p>
                      <button className="wa-disconnect-btn" onClick={async () => {
                         if(confirm("Deseja realmente desconectar o WhatsApp?")) {
                            await axios.post(`${API_URL}/logout-wa`);
                            setWaStatus({ status: 'disconnected', qr: null });
                         }
                      }}>DESCONECTAR NÚMERO</button>
                    </div>
                  ) : waStatus.qr ? (
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Escaneie o QR Code</h2>
                      <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '13px' }}>Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar um aparelho</p>
                      
                      <div className="qr-container">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(waStatus.qr)}&size=250x250&color=0f172a`} alt="QR Code WhatsApp" />
                      </div>
                      
                      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2563eb', fontWeight: '700', fontSize: '12px' }}>
                         <div className="pulse-dot" /> AGUARDANDO CONEXÃO...
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                       <div style={{ width: '80px', height: '80px', background: '#f1f5f9', color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Zap size={40} />
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Servidor Offline ou Desconectado</h2>
                      <p style={{ color: '#64748b', marginBottom: '24px' }}>Iniciando serviço de conexão com o Google Cloud...</p>
                      <button className="ai-nav-btn primary" onClick={async () => {
                         try {
                           await axios.post(`${API_URL}/wa-command`, { action: 'connect' });
                           alert('Comando enviado ao servidor! Aguarde a geração do QR Code (isso pode demorar até 15 segundos).');
                         } catch (err) {
                           console.error(err);
                           alert('Erro ao enviar comando.');
                         }
                      }}>CONECTAR WHATSAPP (GERAR QR)</button>
                      <button className="ai-nav-btn secondary" onClick={() => {
                         axios.get(`${API_URL}/wa-status`).then(res => setWaStatus(res.data));
                      }} style={{ marginLeft: '10px' }}>ATUALIZAR STATUS</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && !isProductForm && (
          <div className="animate-in">
            <div className="product-center">
              {/* LEFT PANEL */}
              <div className="product-list-panel">
                <div className="product-list-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h1>Produtos</h1>
                      <p>Centro de Cadastros</p>
                    </div>
                    <div className="product-count-badge">
                      {products.length} {products.length === 1 ? 'item' : 'itens'}
                    </div>
                  </div>
                </div>

                <div className="product-toolbar">
                  <div className="product-search-box">
                    <Search size={16} className="search-icon" />
                    <input 
                      value={productSearch} 
                      onChange={e => setProductSearch(e.target.value)} 
                      placeholder="Buscar por nome, SKU ou campanha..." 
                    />
                  </div>
                  <div className="product-filters" style={{ marginBottom: '8px' }}>
                    <button className={`product-filter-btn ${productFilter === 'all' ? 'active' : ''}`} onClick={() => setProductFilter('all')}>Todos</button>
                    <button className={`product-filter-btn ${productFilter === 'active' ? 'active' : ''}`} onClick={() => setProductFilter('active')}>Ativos</button>
                    <button className={`product-filter-btn ${productFilter === 'inactive' ? 'active' : ''}`} onClick={() => setProductFilter('inactive')}>Inativos</button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      value={productCategoryFilter} 
                      onChange={e => setProductCategoryFilter(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '10px', fontSize: '11px', fontWeight: '700', color: '#64748b', background: 'rgba(248, 250, 252, 0.5)', cursor: 'pointer', outline: 'none' }}>
                      <option value="all">Todas Categorias</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => { setShowCategoryModal(true); setEditingCategory(null); setCategoryFormData({ name: '', color: '#2563eb' }); }}
                      style={{ width: '32px', height: '32px', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.05)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      title="Gerenciar Categorias">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="product-view-toggle">
                    <button className={productViewMode === 'list' ? 'active' : ''} onClick={() => setProductViewMode('list')}><List size={14} /> Lista</button>
                    <button className={productViewMode === 'grid' ? 'active' : ''} onClick={() => setProductViewMode('grid')}><Grid size={14} /> Grid</button>
                  </div>
                </div>

                <div className="product-list-actions">
                  <button className="product-add-btn" onClick={() => { setEditing(null); setFormData({name:'',code:'',media:'',mediaGallery:[],type:'image',desc:'',videoUrl:'',campaignId:'',categoriaId:'',tamanho:'',cor:'',precoNormal:'',precoPromocao:''}); setIsProductForm(true); setDetailCarouselIdx(0); }}>
                    <Plus size={16} /> Novo Produto
                  </button>
                </div>

                <div className="product-list-scroll">
                  {productViewMode === 'list' ? (
                    products
                      .filter(p => {
                        const q = productSearch.toLowerCase();
                        const linkedCampaign = campaigns.find(cp => cp.id === p.campaignId);
                        const isActive = p.active !== false && (!linkedCampaign || linkedCampaign.status === 'Ativa' || linkedCampaign.status === 'active');
                        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || (linkedCampaign && linkedCampaign.name.toLowerCase().includes(q));
                        const matchFilter = productFilter === 'all' || (productFilter === 'active' && isActive) || (productFilter === 'inactive' && !isActive);
                        const matchCategory = productCategoryFilter === 'all' || p.categoriaId === productCategoryFilter;
                        return matchSearch && matchFilter && matchCategory;
                      })
                      .map(p => {
                        const linkedCampaign = campaigns.find(cp => cp.id === p.campaignId);
                        const isActive = p.active !== false && (!linkedCampaign || linkedCampaign.status === 'Ativa' || linkedCampaign.status === 'active');
                        const gallery = p.mediaGallery && p.mediaGallery.length > 0 ? p.mediaGallery : (p.media ? [p.media] : []);
                        const cat = categories.find(c => c.id === p.categoriaId);
                        return (
                          <div key={p.id} className={`product-list-item ${selectedProduct?.id === p.id ? 'selected' : ''}`} onClick={() => { setSelectedProduct(p); setDetailCarouselIdx(0); }}>
                            <div className="item-image">
                              {gallery.length > 0 && <img src={gallery[0]} alt={p.name} />}
                              {gallery.length > 1 && <span className="gallery-count">{gallery.length}</span>}
                            </div>
                            <div className="item-info">
                              <div className="item-sku">{p.code}</div>
                              <div className="item-name">{p.name}</div>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                                {cat && (
                                  <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: `${cat.color}15`, color: cat.color }}>{cat.name}</span>
                                )}
                                {p.precoPromocao ? (
                                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#16a34a' }}>R$ {p.precoPromocao}</span>
                                ) : p.precoNormal ? (
                                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>R$ {p.precoNormal}</span>
                                ) : null}
                              </div>
                              {linkedCampaign && (
                                <div className="item-campaign" style={{ cursor: 'pointer', marginTop: '2px' }} onClick={(e) => { e.stopPropagation(); setActiveTab('campaigns'); setSelectedCampaign(linkedCampaign); }}>
                                  <Megaphone size={10} /> {linkedCampaign.name} <ExternalLink size={8} style={{ marginLeft: '2px' }} />
                                </div>
                              )}
                            </div>
                            <div className="item-status">
                              <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>{isActive ? 'Ativo' : 'Inativo'}</span>
                              <div className="item-actions">
                                <button className="item-action-btn edit" onClick={(e) => { e.stopPropagation(); startEdit(p); }}><Edit3 size={12} /></button>
                                <button className="item-action-btn delete" onClick={(e) => { e.stopPropagation(); removeProduct(p.id); }}><Trash2 size={12} /></button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="product-grid-view">
                      {products
                        .filter(p => {
                          const q = productSearch.toLowerCase();
                          const linkedCampaign = campaigns.find(cp => cp.id === p.campaignId);
                          const isActive = p.active !== false && (!linkedCampaign || linkedCampaign.status === 'Ativa' || linkedCampaign.status === 'active');
                          const matchSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || (linkedCampaign && linkedCampaign.name.toLowerCase().includes(q));
                          const matchFilter = productFilter === 'all' || (productFilter === 'active' && isActive) || (productFilter === 'inactive' && !isActive);
                          const matchCategory = productCategoryFilter === 'all' || p.categoriaId === productCategoryFilter;
                          return matchSearch && matchFilter && matchCategory;
                        })
                        .map(p => {
                          const linkedCampaign = campaigns.find(cp => cp.id === p.campaignId);
                          const isActive = p.active !== false && (!linkedCampaign || linkedCampaign.status === 'Ativa' || linkedCampaign.status === 'active');
                          const gallery = p.mediaGallery && p.mediaGallery.length > 0 ? p.mediaGallery : (p.media ? [p.media] : []);
                          return (
                            <div key={p.id} className={`product-grid-item ${selectedProduct?.id === p.id ? 'selected' : ''}`} onClick={() => { setSelectedProduct(p); setDetailCarouselIdx(0); }}>
                              <div className="grid-image">
                                {gallery.length > 0 && <img src={gallery[0]} alt={p.name} />}
                                {!isActive && <div className="inactive-overlay">INATIVO</div>}
                              </div>
                              <div className="grid-info">
                                <div className="grid-sku">{p.code}</div>
                                <div className="grid-name">{p.name}</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL - DETAIL */}
              <div className="product-detail-panel">
                {selectedProduct ? (() => {
                  const linkedCampaign = campaigns.find(cp => cp.id === selectedProduct.campaignId);
                  const isActive = selectedProduct.active !== false && (!linkedCampaign || linkedCampaign.status === 'Ativa' || linkedCampaign.status === 'active');
                  const gallery = selectedProduct.mediaGallery && selectedProduct.mediaGallery.length > 0 ? selectedProduct.mediaGallery : (selectedProduct.media ? [selectedProduct.media] : []);
                  const cIdx = detailCarouselIdx % Math.max(gallery.length, 1);
                  const cat = categories.find(c => c.id === selectedProduct.categoriaId);
                  return (
                    <div className="product-detail-content">
                      <div className="detail-header">
                        <div className="detail-title-section">
                          <h2>{selectedProduct.name}</h2>
                          <span className="detail-sku">{selectedProduct.code}</span>
                        </div>
                        <div className="detail-actions">
                          <button className="detail-action-btn edit" onClick={() => startEdit(selectedProduct)}><Edit3 size={14} /> Editar</button>
                          <button className="detail-action-btn delete" onClick={() => removeProduct(selectedProduct.id)}><Trash2 size={14} /> Excluir</button>
                        </div>
                      </div>

                      {gallery.length > 0 && (
                        <div className="detail-gallery">
                          <div className="detail-gallery-main">
                            <img src={gallery[cIdx]} alt={selectedProduct.name} />
                            {gallery.length > 1 && (
                              <>
                                <button className="detail-gallery-nav prev" onClick={() => setDetailCarouselIdx(cIdx > 0 ? cIdx - 1 : gallery.length - 1)}>‹</button>
                                <button className="detail-gallery-nav next" onClick={() => setDetailCarouselIdx(cIdx < gallery.length - 1 ? cIdx + 1 : 0)}>›</button>
                                <div className="detail-gallery-dots">
                                  {gallery.map((_, i) => (
                                    <div key={i} className={`dot ${i === cIdx ? 'active' : ''}`} onClick={() => setDetailCarouselIdx(i)} />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          {gallery.length > 1 && (
                            <div className="detail-gallery-thumbs">
                              {gallery.map((url, i) => (
                                <div key={i} className={`detail-gallery-thumb ${i === cIdx ? 'active' : ''}`} onClick={() => setDetailCarouselIdx(i)}>
                                  <img src={url} alt={`Foto ${i + 1}`} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="detail-info-grid">
                        {cat && (
                          <div className="detail-info-card">
                            <h4><ShoppingCart size={14} /> Categoria</h4>
                            <span style={{ fontSize: '12px', fontWeight: '800', padding: '6px 14px', borderRadius: '10px', background: `${cat.color}15`, color: cat.color, display: 'inline-block' }}>{cat.name}</span>
                          </div>
                        )}

                        <div className="detail-info-card">
                          <h4><Zap size={14} /> Status</h4>
                          <div className={`status-indicator-detail ${isActive ? 'active' : 'inactive'}`}>
                            <div className="status-dot" />
                            {isActive ? 'Produto Ativo' : 'Produto Inativo'}
                          </div>
                        </div>

                        {selectedProduct.tamanho && (
                          <div className="detail-info-card">
                            <h4><Activity size={14} /> Tamanho</h4>
                            <p style={{ fontSize: '16px', fontWeight: '700' }}>{selectedProduct.tamanho}</p>
                          </div>
                        )}

                        {selectedProduct.cor && (
                          <div className="detail-info-card">
                            <h4><ExternalLink size={14} /> Cor</h4>
                            <p style={{ fontSize: '16px', fontWeight: '700' }}>{selectedProduct.cor}</p>
                          </div>
                        )}

                        {selectedProduct.precoNormal && (
                          <div className="detail-info-card">
                            <h4><ShoppingCart size={14} /> Preço Normal</h4>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>R$ {selectedProduct.precoNormal}</p>
                          </div>
                        )}

                        {selectedProduct.precoPromocao && (
                          <div className="detail-info-card">
                            <h4><Zap size={14} /> Preço Promoção</h4>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>R$ {selectedProduct.precoPromocao}</p>
                            {selectedProduct.precoNormal && (
                              <p style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', marginTop: '4px' }}>De: R$ {selectedProduct.precoNormal}</p>
                            )}
                          </div>
                        )}

                        <div className="detail-info-card full-width">
                          <h4><ShoppingCart size={14} /> Descrição Técnica</h4>
                          <p>{selectedProduct.desc || 'Sem descrição cadastrada.'}</p>
                        </div>

                        {selectedProduct.videoUrl && (
                          <div className="detail-info-card">
                            <h4><ExternalLink size={14} /> Vídeo</h4>
                            <a href={selectedProduct.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                              Assistir vídeo →
                            </a>
                          </div>
                        )}

                        {linkedCampaign && (
                          <div className="detail-info-card" style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('campaigns'); setSelectedCampaign(linkedCampaign); }}>
                            <h4><Megaphone size={14} /> Campanha Vinculada</h4>
                            <div className="campaign-link" style={{ border: '1px solid rgba(37, 99, 235, 0.3)' }}>
                              <Megaphone size={12} /> {linkedCampaign.name}
                              <span style={{ fontSize: 10, opacity: 0.7 }}>({linkedCampaign.status === 'Ativa' || linkedCampaign.status === 'active' ? 'Ativa' : 'Pausada'})</span>
                              <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
                            </div>
                          </div>
                        )}

                        <div className="detail-info-card">
                          <h4><Upload size={14} /> Mídia</h4>
                          <p>{gallery.length} {gallery.length === 1 ? 'foto' : 'fotos'} {gallery.length > 0 ? 'cadastrada' + (gallery.length > 1 ? 's' : '') : 'cadastrada'}</p>
                        </div>

                        <div className="detail-info-card">
                          <h4><Activity size={14} /> ID do Produto</h4>
                          <p style={{ fontFamily: 'monospace', fontSize: 12 }}>{selectedProduct.id}</p>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="product-detail-empty">
                    <div className="empty-icon">
                      <ShoppingCart size={32} color="#94a3b8" />
                    </div>
                    <p>Selecione um produto</p>
                    <span>ou cadastre um novo para começar</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && isProductForm && (
          <div className="animate-in product-form-page">
            <div className="product-form-header">
              <button className="product-form-back-btn" onClick={() => { setIsProductForm(false); setEditing(null); setFormData({ name: '', code: '', media: '', mediaGallery: [], type: 'image', desc: '', videoUrl: '', campaignId: '', categoriaId: '', tamanho: '', cor: '', precoNormal: '', precoPromocao: '' }); }}>
                <ChevronLeft size={18} /> Voltar
              </button>
              <h1>{editing ? 'Editar Produto' : 'Novo Produto'}</h1>
              <p>{editing ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto'}</p>
            </div>

            <div className="product-form-body">
              <div className="product-form-left">
                <div className="form-section">
                  <h3>Informações Básicas</h3>
                  <div className="modern-input-group">
                    <label>Nome do Produto *</label>
                    <input className="modern-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Porcelanato Polido 60x120" />
                  </div>
                  <div className="modern-input-group">
                    <label>SKU *</label>
                    <input className="modern-input" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Ex: PRC-6012-PLD" />
                  </div>
                  <div className="modern-input-group">
                    <label>Categoria *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select className="modern-select" value={formData.categoriaId || ''} onChange={e => setFormData({...formData, categoriaId: e.target.value})} style={{ flex: 1 }}>
                        <option value="">Selecione...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => setShowCategoryModal(true)}
                        style={{ width: '48px', height: '48px', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.05)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                        title="Criar nova categoria">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Especificações</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="modern-input-group">
                      <label>Tamanho</label>
                      <input className="modern-input" value={formData.tamanho || ''} onChange={e => setFormData({...formData, tamanho: e.target.value})} placeholder="Ex: 60x120" />
                    </div>
                    <div className="modern-input-group">
                      <label>Cor</label>
                      <input className="modern-input" value={formData.cor || ''} onChange={e => setFormData({...formData, cor: e.target.value})} placeholder="Ex: Branco" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Preços</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="modern-input-group">
                      <label>Preço Normal (R$)</label>
                      <input className="modern-input" value={formData.precoNormal || ''} onChange={e => setFormData({...formData, precoNormal: e.target.value})} placeholder="0.00" type="number" step="0.01" />
                    </div>
                    <div className="modern-input-group">
                      <label>Preço Promoção (R$)</label>
                      <input className="modern-input" value={formData.precoPromocao || ''} onChange={e => setFormData({...formData, precoPromocao: e.target.value})} placeholder="0.00 (opcional)" type="number" step="0.01" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Descrição</h3>
                  <div className="modern-input-group">
                    <textarea className="modern-textarea" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Descreva as especificações técnicas do produto..." rows={4} />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Vídeo (opcional)</h3>
                  <div className="modern-input-group">
                    <input className="modern-input" value={formData.videoUrl || ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Campanha (opcional)</h3>
                  <div className="modern-input-group">
                    <select className="modern-select" value={formData.campaignId || ''} onChange={e => setFormData({...formData, campaignId: e.target.value})}>
                      <option value="">Nenhuma (Produto Geral)</option>
                      {campaigns.map(cp => (
                        <option key={cp.id} value={cp.id}>{cp.name} ({cp.status === 'Ativa' || cp.status === 'active' ? 'Ativa' : 'Pausada'})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="product-form-right">
                <div className="form-section">
                  <h3>Fotos do Produto</h3>
                  <div className="modern-input-group">
                    <label>Galeria <span style={{ color: formData.mediaGallery && formData.mediaGallery.length > 0 ? formData.mediaGallery.length : (formData.media ? 1 : 0) >= 10 ? '#ef4444' : '#94a3b8' }}>({formData.mediaGallery && formData.mediaGallery.length > 0 ? formData.mediaGallery.length : (formData.media ? 1 : 0)}/10)</span></label>
                    <button className="modern-upload-btn" onClick={() => document.getElementById('galleryFileInput').click()} disabled={isUploading || (formData.mediaGallery && formData.mediaGallery.length > 0 ? formData.mediaGallery.length : (formData.media ? 1 : 0)) >= 10}>
                      <Upload size={16} /> {isUploading ? 'Enviando...' : 'Enviar fotos do computador'}
                    </button>
                    <input id="galleryFileInput" type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
                    {(formData.mediaGallery && formData.mediaGallery.length > 0 ? formData.mediaGallery : [formData.media]).filter(Boolean).map((url, i) => (
                      <div key={i} className="gallery-preview-item">
                        <img src={url} alt={`Foto ${i + 1}`} />
                        <span>{url}</span>
                        {i === 0 && <span className="cover-badge">CAPA</span>}
                        <button className="remove-btn" onClick={() => {
                          const gallery = formData.mediaGallery && formData.mediaGallery.length > 0 ? formData.mediaGallery : [formData.media];
                          const updated = gallery.filter((_, idx) => idx !== i);
                          setFormData({...formData, mediaGallery: updated, media: updated[0] || ''});
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="product-form-actions">
                  <button className="modern-btn secondary" onClick={() => { setIsProductForm(false); setEditing(null); setFormData({ name: '', code: '', media: '', mediaGallery: [], type: 'image', desc: '', videoUrl: '', campaignId: '', categoriaId: '', tamanho: '', cor: '', precoNormal: '', precoPromocao: '' }); }}>Cancelar</button>
                  <button className="modern-btn primary" onClick={saveProduct}>{editing ? 'Salvar Alterações' : 'Criar Produto'}</button>
                </div>
              </div>
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
          <div className="animate-in">
            <div className="service-center">
              {/* LEFT PANEL - CONTACT QUEUE */}
              <div className="sc-left-panel">
                <div className="sc-header">
                  <h1>Atendimento</h1>
                  <p>Central de atendimento</p>
                </div>

                <div className="sc-search-box">
                  <Search size={16} className="sc-search-icon" />
                  <input placeholder="Buscar contato..." />
                </div>

                <div className="sc-status-tabs">
                  <button className="sc-status-tab active">Todos</button>
                  <button className="sc-status-tab">Novos</button>
                  <button className="sc-status-tab">Em andamento</button>
                  <button className="sc-status-tab">Finalizados</button>
                </div>

                <div className="sc-contact-list">
                  {contacts.map(c => (
                    <div key={c.id} className={`sc-contact-item ${selectedChat?.id === c.id ? 'active' : ''}`} onClick={() => setSelectedChat(c)}>
                      <div className="sc-contact-avatar">{c.name[0]}</div>
                      <div className="sc-contact-info">
                        <div className="sc-contact-top">
                          <span className="sc-contact-name">{c.name}</span>
                          <span className="sc-contact-time">{c.time}</span>
                        </div>
                        <div className="sc-contact-bottom">
                          <span className="sc-contact-msg">{c.msg}</span>
                          {c.historico && c.historico.some(h => h.tipo === 'ia_inicio') && (
                            <span className="sc-ia-badge"><Zap size={8} /> IA</span>
                          )}
                        </div>
                      </div>
                      <div className={`sc-contact-status-dot ${c.status === 'new' ? 'new' : c.status === 'active' ? 'active' : 'completed'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTER PANEL - CHAT */}
              <div className="sc-center-panel">
                {selectedChat ? (
                  <>
                    <div className="sc-chat-header">
                      <div className="sc-chat-contact">
                        <div className="sc-chat-avatar">{selectedChat.name[0]}</div>
                        <div>
                          <h3>{selectedChat.name}</h3>
                          <span className="sc-chat-phone">{selectedChat.phone}</span>
                        </div>
                      </div>
                      <div className="sc-chat-header-actions">
                        <div className="sc-protocol-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          Protocolo: {selectedChat.protocolo}
                          <div style={{ width: '1px', height: '12px', background: '#cbd5e1' }} />
                          <button 
                            onClick={async () => {
                              const isPaused = !selectedChat.isAiPaused;
                              try {
                                await axios.post(`${API_URL}/toggle-bot`, { jid: selectedChat.id, status: !isPaused });
                                // O status no backend é 'bot_active', então 'status: true' significa 'isAiPaused: false'
                                setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, isAiPaused: isPaused } : c));
                                setSelectedChat({ ...selectedChat, isAiPaused: isPaused });
                              } catch (err) {
                                alert("Erro ao alternar status da IA");
                              }
                            }}
                            className={`ai-toggle-badge ${selectedChat.isAiPaused ? 'paused' : 'active'}`}
                            title={selectedChat.isAiPaused ? "IA Pausada para este contato" : "IA Ativa para este contato"}
                          >
                            <Zap size={10} /> {selectedChat.isAiPaused ? 'IA PAUSADA' : 'IA ATIVA'}
                          </button>
                        </div>
                        {selectedChat.isAiPaused && (
                          <div className="sc-ia-active-badge paused"><Activity size={12} /> Assumido por humano</div>
                        )}
                        {!selectedChat.isAiPaused && selectedChat.historico && selectedChat.historico.some(h => h.tipo === 'ia_inicio') && (
                          <div className="sc-ia-active-badge"><Zap size={12} /> Iniciado por IA</div>
                        )}
                      </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="sc-timeline">
                      {selectedChat.historico && selectedChat.historico.map((h, i) => (
                        <div key={i} className={`timeline-event ${h.tipo}`}>
                          <div className="timeline-dot" />
                          <div className="timeline-content">
                            <span className="timeline-text">{h.texto}</span>
                            <span className="timeline-meta">{h.autor} • {h.hora}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* MESSAGES */}
                    <div className="sc-chat-messages">
                      {messages.map(m => (
                        <div key={m.id} className={`sc-message ${m.from === 'client' ? 'client' : m.from === 'bot' ? 'bot' : 'agent'}`}>
                          <div className="sc-msg-bubble">
                            <p>{m.text}</p>
                            <span className="sc-msg-time">{m.time} {m.bot && <span className="sc-msg-bot-tag">IA Sônia</span>}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CHAT INPUT */}
                    <div className="sc-chat-input">
                      <input 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)} 
                        placeholder="Digite sua mensagem..." 
                        className="sc-input"
                        onKeyPress={e => {
                          if (e.key === 'Enter' && chatInput) {
                            const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            setMessages([...messages, { id: Date.now(), from: 'human', text: chatInput, time: now }]);
                            setChatInput('');
                          }
                        }}
                      />
                      <button className="sc-send-btn" onClick={() => {
                        if (chatInput) {
                          const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                          setMessages([...messages, { id: Date.now(), from: 'human', text: chatInput, time: now }]);
                          setChatInput('');
                        }
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="sc-empty-chat">
                    <div className="sc-empty-icon"><MessageCircle size={40} color="#94a3b8" /></div>
                    <p>Selecione um atendimento</p>
                    <span>Escolha um contato na lista para iniciar</span>
                  </div>
                )}
              </div>

              {/* RIGHT PANEL - DETAILS */}
              <div className="sc-right-panel">
                {selectedChat ? (
                  <>
                    <div className="sc-detail-header">
                      <div className="sc-detail-avatar">{selectedChat.name[0]}</div>
                      <h3>{selectedChat.name}</h3>
                      <p>{selectedChat.phone}</p>
                    </div>

                    <div className="sc-detail-section">
                      <h4><Edit3 size={14} /> Anotações</h4>
                      <textarea 
                        className="sc-notes-input" 
                        value={selectedChat.notas || ''} 
                        onChange={e => {
                          const notas = e.target.value;
                          setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, notas } : c));
                          setSelectedChat({ ...selectedChat, notas });
                        }}
                        placeholder="Anotações sobre o atendimento..."
                      />
                    </div>

                    <div className="sc-detail-section">
                      <h4><ShoppingCart size={14} /> Pedido</h4>
                      {!selectedChat.orderInfo && !showOrderForm ? (
                        <button className="sc-order-toggle-btn" onClick={() => setShowOrderForm(true)}>
                          <Plus size={14} /> Registrar Pedido
                        </button>
                      ) : showOrderForm ? (
                        <div className="sc-order-form">
                          <div className="sc-order-field">
                            <label>Número do Pedido</label>
                            <input className="sc-order-input" value={orderFormData.numeroPedido} onChange={e => setOrderFormData({...orderFormData, numeroPedido: e.target.value})} placeholder="Ex: PED-2024-001" />
                          </div>
                          <div className="sc-order-field">
                            <label>Prazo de Entrega</label>
                            <input className="sc-order-input" value={orderFormData.prazoEntrega} onChange={e => setOrderFormData({...orderFormData, prazoEntrega: e.target.value})} placeholder="Ex: 5 dias úteis" />
                          </div>
                          <div className="sc-order-field">
                            <label>Valor Final (R$)</label>
                            <input className="sc-order-input" value={orderFormData.valorFinal} onChange={e => setOrderFormData({...orderFormData, valorFinal: e.target.value})} placeholder="0.00" type="number" step="0.01" />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="sc-order-cancel" onClick={() => setShowOrderForm(false)}>Cancelar</button>
                            <button className="sc-order-save" onClick={() => {
                              const orderInfo = { ...orderFormData, dataRegistro: new Date().toLocaleDateString('pt-BR') };
                              setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, orderInfo } : c));
                              setSelectedChat({ ...selectedChat, orderInfo });
                              setShowOrderForm(false);
                              setOrderFormData({ numeroPedido: '', prazoEntrega: '', valorFinal: '' });
                            }}>Salvar Pedido</button>
                          </div>
                        </div>
                      ) : (
                        <div className="sc-order-display">
                          <div className="sc-order-row">
                            <span>Pedido</span>
                            <strong>{selectedChat.orderInfo.numeroPedido}</strong>
                          </div>
                          <div className="sc-order-row">
                            <span>Entrega</span>
                            <strong>{selectedChat.orderInfo.prazoEntrega}</strong>
                          </div>
                          <div className="sc-order-row total">
                            <span>Valor Final</span>
                            <strong>R$ {selectedChat.orderInfo.valorFinal}</strong>
                          </div>
                          <div className="sc-order-row">
                            <span>Registrado em</span>
                            <span>{selectedChat.orderInfo.dataRegistro}</span>
                          </div>
                          <button className="sc-order-edit-btn" onClick={() => { setOrderFormData({ numeroPedido: selectedChat.orderInfo.numeroPedido, prazoEntrega: selectedChat.orderInfo.prazoEntrega, valorFinal: selectedChat.orderInfo.valorFinal }); setShowOrderForm(true); }}>Editar Pedido</button>
                        </div>
                      )}
                    </div>

                    <div className="sc-detail-section">
                      <h4><MessageSquareIcon size={14} /> Próximos Passos</h4>
                      <input 
                        className="sc-next-step-input" 
                        value={selectedChat.proximoContato || ''} 
                        onChange={e => {
                          const proximoContato = e.target.value;
                          setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, proximoContato } : c));
                          setSelectedChat({ ...selectedChat, proximoContato });
                        }}
                        placeholder="Ex: Retornar dia 15/01"
                      />
                    </div>

                    <div className="sc-detail-section">
                      <h4><ExternalLink size={14} /> Transferir para</h4>
                      <select className="sc-transfer-select" onChange={e => {
                        const r = e.target.value;
                        if (r && selectedChat) {
                          const agent = employees.find(emp => emp.id === r);
                          const agentName = agent ? agent.name : r;
                          const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                          const newHist = [...(selectedChat.historico || []), { tipo: 'transferencia', texto: `Transferido para ${agentName}`, hora: now, autor: 'Agente' }];
                          setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, role: agentName, historico: newHist } : c));
                          setSelectedChat({ ...selectedChat, role: agentName, historico: newHist });
                        }
                      }}>
                        <option value="">Selecionar atendente...</option>
                        {employees.filter(e => e.active !== false).map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                      </select>
                    </div>

                    <div className="sc-detail-actions">
                      <button className="sc-btn-complete" onClick={() => {
                        const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        const newHist = [...(selectedChat.historico || []), { tipo: 'finalizado', texto: 'Atendimento finalizado com sucesso', hora: now, autor: 'Agente' }];
                        setContacts(contacts.map(c => c.id === selectedChat.id ? { ...c, status: 'completed', historico: newHist } : c));
                        setSelectedChat(null);
                      }}>
                        <CheckCircle size={16} /> Finalizar Atendimento
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="sc-empty-detail">
                    <div className="sc-empty-detail-icon"><Edit3 size={32} color="#94a3b8" /></div>
                    <p>Detalhes do atendimento</p>
                    <span>Selecione um contato para ver informações</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="animate-in">
            <div className="campaigns-split">
              {/* LEFT - CAMPAIGNS LIST */}
              <div className="campaigns-left-panel">
                <div className="campaigns-left-header">
                  <div>
                    <h1>Campanhas</h1>
                    <p>Selecione para gerenciar</p>
                  </div>
                  <button className="campaign-add-main-btn" onClick={() => { setEditingCampaign(null); setCampaignFormData({name:'',link:'',platform:'Instagram',status:'Ativa'}); setShowCampaignModal(true); }}>
                    <Plus size={16} />
                  </button>
                </div>

                <div className="campaigns-left-toolbar">
                  <div className="campaigns-filter-tabs">
                    <button className={`campaign-filter-tab ${(!selectedCampaign) ? 'active' : ''}`} onClick={() => setSelectedCampaign(null)}>Todas</button>
                    <button className={`campaign-filter-tab ${selectedCampaign?.platform === 'Instagram' ? 'active' : ''}`} onClick={() => { const ig = campaigns.find(c => c.platform === 'Instagram'); if(ig) setSelectedCampaign(ig); }}>
                      <Instagram size={12} /> IG
                    </button>
                    <button className={`campaign-filter-tab ${selectedCampaign?.platform === 'Facebook' ? 'active' : ''}`} onClick={() => { const fb = campaigns.find(c => c.platform === 'Facebook'); if(fb) setSelectedCampaign(fb); }}>
                      <Facebook size={12} /> FB
                    </button>
                  </div>
                </div>

                <div className="campaigns-left-list">
                  {campaigns.length === 0 ? (
                    <div className="campaign-empty">
                      <div className="campaign-empty-icon"><Megaphone size={24} color="#94a3b8" /></div>
                      <p>Nenhuma campanha</p>
                      <span>Crie sua primeira campanha</span>
                    </div>
                  ) : (
                    campaigns.map(cp => {
                      const isActive = cp.status === 'Ativa' || cp.status === 'active';
                      const linkedCount = products.filter(p => p.campaignId === cp.id).length;
                      return (
                        <div key={cp.id} className={`campaign-list-item ${selectedCampaign?.id === cp.id ? 'selected' : ''}`} onClick={() => setSelectedCampaign(cp)}>
                          <div className={`campaign-item-platform-icon ${cp.platform === 'Instagram' ? 'instagram' : 'facebook'}`}>
                            {cp.platform === 'Instagram' ? <Instagram size={14} /> : <Facebook size={14} />}
                          </div>
                          <div className="campaign-item-info">
                            <div className="campaign-item-name">{cp.name}</div>
                            <div className="campaign-item-meta">
                              <span className={`campaign-item-status-dot ${isActive ? 'active' : 'inactive'}`} />
                              <span>{isActive ? 'Ativa' : 'Pausada'}</span>
                              <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>{linkedCount} {linkedCount === 1 ? 'produto' : 'produtos'}</span>
                            </div>
                          </div>
                          <div className="campaign-item-actions" onClick={(e) => e.stopPropagation()}>
                            <button className="item-action-btn edit" onClick={() => { setEditingCampaign(cp); setCampaignFormData({ name: cp.name, link: cp.link, platform: cp.platform, status: cp.status }); setShowCampaignModal(true); }}><Edit3 size={12} /></button>
                            <button className="item-action-btn delete" onClick={() => removeCampaign(cp.id)}><Trash2 size={12} /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT - CAMPAIGN DETAIL */}
              <div className="campaign-detail-panel">
                {selectedCampaign ? (() => {
                  const isActive = selectedCampaign.status === 'Ativa' || selectedCampaign.status === 'active';
                  const linkedProducts = products.filter(p => p.campaignId === selectedCampaign.id);
                  const unlinkedProducts = products.filter(p => !p.campaignId || p.campaignId === '');
                  const filteredUnlinked = unlinkedProducts.filter(p => !campaignProductSearch || p.name.toLowerCase().includes(campaignProductSearch.toLowerCase()) || p.code.toLowerCase().includes(campaignProductSearch.toLowerCase()));
                  const filteredLinked = linkedProducts.filter(p => !campaignProductSearch || p.name.toLowerCase().includes(campaignProductSearch.toLowerCase()) || p.code.toLowerCase().includes(campaignProductSearch.toLowerCase()));

                  const linkProductToCampaign = async (product) => {
                    const updated = { ...product, campaignId: selectedCampaign.id, active: isActive };
                    await axios.post(`${API_URL}/products`, updated);
                    setProducts(products.map(p => p.id === product.id ? updated : p));
                  };

                  const unlinkProductFromCampaign = async (product) => {
                    const updated = { ...product, campaignId: '', active: true };
                    await axios.post(`${API_URL}/products`, updated);
                    setProducts(products.map(p => p.id === product.id ? updated : p));
                  };

                  return (
                    <>
                      <div className="campaign-detail-header">
                        <div className="campaign-detail-top">
                          <div className={`campaign-detail-platform-icon ${selectedCampaign.platform === 'Instagram' ? 'instagram' : 'facebook'}`}>
                            {selectedCampaign.platform === 'Instagram' ? <Instagram size={22} /> : <Facebook size={22} />}
                          </div>
                          <div className="campaign-detail-info">
                            <h2>{selectedCampaign.name}</h2>
                            <div className="campaign-detail-meta">
                              <code>{selectedCampaign.link}</code>
                              <span className={`campaign-detail-status-badge ${isActive ? 'active' : 'inactive'}`}>
                                <span className="status-pulse" />
                                {isActive ? 'Ativa' : 'Pausada'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="campaign-detail-actions">
                          <button className="campaign-toggle-btn" onClick={() => toggleCampaignStatus(selectedCampaign)}>
                            {isActive ? 'Pausar Campanha' : 'Ativar Campanha'}
                          </button>
                          <button className="campaign-edit-btn" onClick={() => { setEditingCampaign(selectedCampaign); setCampaignFormData({ name: selectedCampaign.name, link: selectedCampaign.link, platform: selectedCampaign.platform, status: selectedCampaign.status }); setShowCampaignModal(true); }}>
                            <Edit3 size={14} /> Editar
                          </button>
                        </div>
                      </div>

                      <div className="campaign-detail-stats">
                        <div className="campaign-detail-stat">
                          <span className="stat-number">{linkedProducts.length}</span>
                          <span className="stat-text">Produtos Vinculados</span>
                        </div>
                        <div className="campaign-detail-stat">
                          <span className="stat-number">{unlinkedProducts.length}</span>
                          <span className="stat-text">Produtos Disponíveis</span>
                        </div>
                      </div>

                      <div className="campaign-detail-search">
                        <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                          value={campaignProductSearch} 
                          onChange={e => setCampaignProductSearch(e.target.value)} 
                          placeholder="Buscar produtos..." 
                          style={{ paddingLeft: '40px' }}
                        />
                      </div>

                      <div className="campaign-products-section">
                        <div className="campaign-products-header">
                          <h3>Produtos Vinculados</h3>
                          <span className="linked-count">{filteredLinked.length}</span>
                        </div>
                        <div className="campaign-products-list">
                          {filteredLinked.length === 0 ? (
                            <div className="campaign-products-empty">
                              <ShoppingCart size={24} color="#cbd5e1" />
                              <p>{campaignProductSearch ? 'Nenhum produto encontrado' : 'Nenhum produto vinculado'}</p>
                            </div>
                          ) : (
                            filteredLinked.map(p => (
                              <div key={p.id} className="campaign-product-item linked">
                                <div className="cp-item-image">
                                  {p.media && <img src={p.media} alt={p.name} />}
                                </div>
                                <div className="cp-item-info">
                                  <div className="cp-item-sku">{p.code}</div>
                                  <div className="cp-item-name">{p.name}</div>
                                </div>
                                <button className="cp-unlink-btn" onClick={() => unlinkProductFromCampaign(p)}>
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="campaign-products-section">
                        <div className="campaign-products-header">
                          <h3>Disponíveis para Vincular</h3>
                          <span className="available-count">{filteredUnlinked.length}</span>
                        </div>
                        <div className="campaign-products-list">
                          {filteredUnlinked.length === 0 ? (
                            <div className="campaign-products-empty">
                              <CheckCircle size={24} color="#cbd5e1" />
                              <p>{campaignProductSearch ? 'Nenhum produto encontrado' : 'Todos os produtos já estão vinculados'}</p>
                            </div>
                          ) : (
                            filteredUnlinked.map(p => (
                              <div key={p.id} className="campaign-product-item available">
                                <div className="cp-item-image">
                                  {p.media && <img src={p.media} alt={p.name} />}
                                </div>
                                <div className="cp-item-info">
                                  <div className="cp-item-sku">{p.code}</div>
                                  <div className="cp-item-name">{p.name}</div>
                                </div>
                                <button className="cp-link-btn" onClick={() => linkProductToCampaign(p)}>
                                  <Plus size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="campaign-detail-empty">
                    <div className="campaign-detail-empty-icon">
                      <Megaphone size={32} color="#94a3b8" />
                    </div>
                    <p>Selecione uma campanha</p>
                    <span>para gerenciar produtos vinculados</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showCategoryModal && (
        <div className="modern-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modern-modal category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modern-modal-header">
              <h2>Gerenciar Categorias</h2>
              <p>{categories.length} {categories.length === 1 ? 'categoria' : 'categorias'} cadastrada{categories.length === 1 ? '' : 's'}</p>
            </div>
            <div className="modern-modal-body">
              <div className="modern-input-group">
                <label>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="modern-input" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} placeholder="Nome da categoria" style={{ flex: 1 }} />
                  <input type="color" value={categoryFormData.color} onChange={e => setCategoryFormData({...categoryFormData, color: e.target.value})} style={{ width: '48px', height: '48px', border: '2px solid rgba(226, 232, 240, 0.8)', borderRadius: '12px', cursor: 'pointer', background: 'transparent', padding: '2px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {editingCategory && (
                  <button className="modern-btn secondary" onClick={() => { setEditingCategory(null); setCategoryFormData({ name: '', color: '#2563eb' }); }} style={{ flex: '0.5' }}>Cancelar</button>
                )}
                <button className="modern-btn primary" onClick={saveCategory}>{editingCategory ? 'Salvar' : 'Criar'}</button>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map(cat => {
                  const linkedCount = products.filter(p => p.categoriaId === cat.id).length;
                  return (
                    <div key={cat.id} className={`category-card ${editingCategory?.id === cat.id ? 'editing' : ''}`} style={{ padding: '12px 14px' }}>
                      <div className="category-color-dot" style={{ background: cat.color }} />
                      <div className="category-card-info">
                        <div className="category-card-name" style={{ fontSize: '13px' }}>{cat.name}</div>
                        <div className="category-card-count">{linkedCount} {linkedCount === 1 ? 'produto' : 'produtos'}</div>
                      </div>
                      <div className="category-card-actions">
                        <button className="cat-action-btn edit" onClick={() => { setEditingCategory(cat); setCategoryFormData({ name: cat.name, color: cat.color }); }}><Edit3 size={13} /></button>
                        <button className="cat-action-btn delete" onClick={() => removeCategory(cat.id)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '500px' }}>
             <div style={{ position: 'relative', marginBottom: '15px' }}>
               {(() => {
                 const gallery = viewing.mediaGallery && viewing.mediaGallery.length > 0 ? viewing.mediaGallery : (viewing.media ? [viewing.media] : []);
                 const vIdx = (viewing._carouselIdx || 0);
                 return (
                   <>
                     <img src={viewing.mediaGallery && viewing.mediaGallery.length > 0 ? viewing.mediaGallery[vIdx] : (viewing.media ? viewing.media : '')} style={{ width: '100%', borderRadius: '10px', maxHeight: '300px', objectFit: 'cover' }} />
                     {gallery.length > 1 && (
                       <>
                         <div onClick={() => setViewing({...viewing, _carouselIdx: vIdx > 0 ? vIdx - 1 : gallery.length - 1})} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}>‹</div>
                         <div onClick={() => setViewing({...viewing, _carouselIdx: vIdx < gallery.length - 1 ? vIdx + 1 : 0})} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}>›</div>
                         <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                           {gallery.map((_, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === vIdx ? 'white' : 'rgba(255,255,255,0.4)' }} />)}
                         </div>
                       </>
                     )}
                   </>
                 );
               })()}
             </div>
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

      {showCampaignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div className="card animate-in" style={{ width: '400px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>{editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input value={campaignFormData.name} onChange={e => setCampaignFormData({...campaignFormData, name: e.target.value})} placeholder="Nome da Campanha" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <input value={campaignFormData.link} onChange={e => setCampaignFormData({...campaignFormData, link: e.target.value})} placeholder="Slug / Link (ex: promo-01)" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <select value={campaignFormData.platform} onChange={e => setCampaignFormData({...campaignFormData, platform: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                 <option value="Instagram">Instagram Ads</option>
                 <option value="Facebook">Facebook Ads</option>
                 <option value="Google">Google / Orgânico</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={saveCampaign} style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800' }}>Salvar</button>
                <button onClick={() => setShowCampaignModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px' }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
</>
  );
}

export default App;
