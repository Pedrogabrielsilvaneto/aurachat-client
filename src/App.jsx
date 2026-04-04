import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, Search, Plus, Key, Power, UserPlus, 
  LayoutDashboard, Settings, LogOut, DollarSign, Zap, 
  Clock, CheckCircle, Package, Send, Bell, Sun, Moon,
  MoreVertical, ChevronRight, User, Ghost, ShieldAlert,
  ArrowLeft, Paperclip, Smile, Star, MessageSquare as MessageSquareIcon
} from 'lucide-react';

// ==========================================
// MOCK DATA - VISÃO COMERCIAL ESTRATÉGICA
// ==========================================
const STRATEGIC_CHATS = [
  { id: 1, customer: "Manoel Gomes", topic: "Porcelanato Premium - $5k", risk: "Alto Valor", color: "#fef2f2" },
  { id: 2, customer: "Inês Lima", topic: "Reclamação de Atraso", risk: "Risco Churn", color: "#fefce8" },
  { id: 3, customer: "Maria Silva", topic: "Dúvida Pagamento PIX", risk: "Apoio Venda", color: "#f0fdf4" },
];

const TEAM_RANKING = [
  { id: 1, name: "Manoel Gomes", sector: "WhatsApp", billing: "R$ 598,37", conv: "28.5%", tmr: "1.2", csat: "4.7" },
  { id: 2, name: "Inês Lima", sector: "WhatsApp", billing: "R$ 330,00", conv: "18.5%", tmr: "1.0", csat: "4.1" },
  { id: 3, name: "Maria Lima", sector: "Atendente", billing: "R$ 991,53", conv: "28.5%", tmr: "1.2", csat: "4.9" },
  { id: 4, name: "Urania Wanhez", sector: "Setor", billing: "R$ 237,70", conv: "15.2%", tmr: "1.5", csat: "3.8" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSpyChat, setSelectedSpyChat] = useState(STRATEGIC_CHATS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      
      {/* HEADER UNIFICADO (Padrão) */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '12px' }}>
            <Zap size={22} color="white" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '22px' }}>AuraChat</span>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input type="text" className="search-bar" placeholder="Buscancar..." style={{ paddingLeft: '44px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
              <Bell size={20} />
              <HelpCircle size={20} />
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#f1f5f9', borderRadius: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>G</div>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Gestor</span>
              <ChevronDown size={14} />
           </div>
        </div>
      </header>

      {/* SIDEBAR COMERCIAL */}
      <aside className="sidebar">
        <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarLink icon={<MessageCircle size={20}/>} label="WhatsApp" active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
        <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
        <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras" />
        <SidebarLink icon={<Settings size={20}/>} label="Configurações" />
        <div style={{ margin: '12px 0', height: '1px', background: '#f1f5f9' }} />
        <SidebarLink icon={<MessageSquareIcon size={20}/>} label="Internal Chat" active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} color="#2563eb" />
      </aside>

      {/* MAIN DASHBOARD ESTRATÉGICO */}
      <main className="main-content" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {activeTab === 'dashboard' && (
           <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Dashboard</h1>
                 <div style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={14} /> Modo de Espionagem: Invisível
                 </div>
              </div>

              {/* NOVOS CARDS DE KPI */}
              <div className="kpi-grid">
                <KPICardComplex label="Faturamento Mês (R$)" value="R$ 333,44" meta="95%" trend="up" />
                <KPICardComplex label="Taxa de Conversão da Loja" value="28.5%" meta="+3.1% vs prev" trend="chart" />
                <KPICardComplex label="Eficiência da Equipe (Média)" value="88%" meta="TMR - 1.2 min" trend="text" />
                <KPICardComplex label="Satisfação do Cliente (CSAT)" value="4.7/5" stars={true} meta="User: 'Seus usar a lorscon...'" />
              </div>

              {/* RANKING DE EQUIPE */}
              <div className="card" style={{ padding: 0 }}>
                 <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Ranking de Desempenho da Equipe</h3>
                 </div>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                       <tr>
                         <th style={{ padding: '12px 24px', textAlign: 'left' }}>Atendente</th>
                         <th style={{ padding: '12px 24px', textAlign: 'left' }}>Setor</th>
                         <th style={{ padding: '12px 24px', textAlign: 'left' }}>Faturamento Gerado</th>
                         <th style={{ padding: '12px 24px', textAlign: 'left' }}>Conversão</th>
                         <th style={{ padding: '12px 24px', textAlign: 'left' }}>TMR (min)</th>
                         <th style={{ padding: '12px 24px', textAlign: 'left' }}>CSAT</th>
                       </tr>
                    </thead>
                    <tbody>
                       {TEAM_RANKING.map(u => (
                         <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                            <td style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                               <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} />
                               <b>{u.name}</b>
                            </td>
                            <td style={{ padding: '12px 24px', color: '#64748b' }}>{u.sector}</td>
                            <td style={{ padding: '12px 24px', fontWeight: '600' }}>{u.billing}</td>
                            <td style={{ padding: '12px 24px' }}>{u.conv}</td>
                            <td style={{ padding: '12px 24px' }}>{u.tmr}</td>
                            <td style={{ padding: '12px 24px', color: '#10b981', fontWeight: 'bold' }}>{u.csat}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* GRÁFICOS INFERIORES */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card" style={{ height: '140px', background: '#fcfcfc' }}>
                   {/* Placeholder Gráfico Barras */}
                   <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '100%', padding: '20px' }}>
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => <div key={i} style={{ flex: 1, background: '#2563eb', height: `${h}%`, borderRadius: '4px' }} />)}
                   </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <p style={{ color: '#94a3b8', fontSize: '12px' }}>Análise de Fluxo Mensal</p>
                </div>
              </div>
           </div>
        )}

        {/* PAINEL DIREITO: INTERVENÇÕES ESTRATÉGICAS */}
        <aside className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Chat Espião</h3>
           
           <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>Intervenções Estratégicas: Chats em Risco</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {STRATEGIC_CHATS.map(c => (
                  <div key={c.id} style={{ background: c.color, border: '1px solid #fee2e2', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <div>
                          <b style={{ fontSize: '13px' }}>{c.customer}</b>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 8px' }}>{c.topic}</p>
                          <span style={{ fontSize: '9px', background: '#ffffff', border: '1px solid #ef4444', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>⚠️ Risco: {c.risk}</span>
                       </div>
                       <button className="btn-primary" style={{ background: '#111b21', fontSize: '10px', padding: '4px 10px' }} onClick={() => setSelectedSpyChat(c)}>Intervir</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* JANELA DE CHAT ABAIXO */}
           {selectedSpyChat && (
             <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#cbd5e1' }} />
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: '600' }}>{selectedSpyChat.customer}</p>
                        <p style={{ fontSize: '10px', color: '#64748b' }}>{selectedSpyChat.topic}</p>
                      </div>
                   </div>
                   <MoreVertical size={14} color="#94a3b8" />
                </div>
                
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#ffffff', overflowY: 'auto' }}>
                   <div style={{ alignSelf: 'flex-end', background: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 0 12px', fontSize: '12px' }}>
                      Eia com o alto consetrado por preço preço?
                   </div>
                   <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '8px 12px', borderRadius: '0 12px 12px 12px', fontSize: '12px' }}>
                      Anmos juna contiou o preço objection e porr preco?
                   </div>
                   <div style={{ alignSelf: 'flex-end', background: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 0 12px', fontSize: '12px' }}>
                      Prico é lonto que são não sm um no preço confesa?
                   </div>
                </div>

                <div style={{ padding: '12px', borderTop: '1px solid #f1f5f9' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <button className="btn-ghost" style={{ border: '1px solid #e2e8f0', fontSize: '11px', padding: '6px' }}>Sussurrar</button>
                      <button className="btn-primary" style={{ background: '#3b211a', fontSize: '11px', padding: '6px' }}>Assumir Conversa</button>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                      <Smile size={16} color="#94a3b8" />
                      <Paperclip size={16} color="#94a3b8" />
                      <input type="text" placeholder="Escreva..." style={{ flex: 1, background: 'none', border: 'none', fontSize: '12px', outline: 'none' }} />
                      <Send size={16} color="#2563eb" />
                   </div>
                </div>
             </div>
           )}
        </aside>

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES COMERCIAIS REFORMULADOS
// ==========================================

function KPICardComplex({ label, value, meta, trend, stars }) {
  return (
    <div className="card" style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
       <div>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
             {trend === 'up' && <ChevronUp size={20} color="#10b981" />}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Meta Mensal: <span style={{ color: '#0f172a', fontWeight: '600' }}>{meta}</span></p>
       </div>
       
       {/* Visual Indicators */}
       {stars && (
          <div style={{ display: 'flex', gap: '2px', marginTop: '12px' }}>
             {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i < 5 ? "#f59e0b" : "none"} color="#f59e0b" />)}
          </div>
       )}

       {trend === 'up' && (
          <svg width="100%" height="40" style={{ marginTop: '10px' }}>
             <path d="M0 40 Q50 10 100 30 T200 10" fill="none" stroke="#10b981" strokeWidth="2" />
             <path d="M0 40 Q50 10 100 30 T200 10 L200 40 L0 40" fill="url(#grad1)" opacity="0.2" />
             <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" style={{stopColor:'#10b981', stopOpacity:1}} />
                   <stop offset="100%" style={{stopColor:'#10b981', stopOpacity:0}} />
                </linearGradient>
             </defs>
          </svg>
       )}

       {trend === 'chart' && (
          <div style={{ position: 'absolute', right: '20px', top: '40px', width: '48px', height: '48px' }}>
             <svg viewBox="0 0 36 36" width="48">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="28, 100" />
             </svg>
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

function ChevronUp(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>; }
function HelpCircle(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>; }

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center', padding: '48px' }}>
         <Zap size={48} color="#2563eb" style={{ margin: '0 auto 24px' }} />
         <h2 style={{ marginBottom: '32px' }}>AuraChat Manager</h2>
         <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Acessar Dashboard</button>
      </div>
    </div>
  );
}

export default App;
