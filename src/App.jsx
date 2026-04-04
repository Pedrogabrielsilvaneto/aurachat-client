import React, { useState, useEffect } from 'react';
import { 
  Send, Bot, Monitor, ChevronDown, User, LogOut, RefreshCw,
  Bell, Calendar, TrendingUp, MoreHorizontal, Clock, ArrowRight, CheckCircle2,
  Phone, Video, Info, Paperclip, Smile, AlertCircle, LayoutDashboard, MessageSquare, 
  Settings, Users, BarChart3, Zap
} from 'lucide-react';

// Design Constants
const PRIMARY_GRADIENT = "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "Novo lead vindo do WhatsApp", time: "2 min atrás" },
    { id: 2, text: "Gemini atualizou a resposta do Lead #44", time: "10 min atrás" }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulação de Login Ultra Rápido na Vercel
    setTimeout(() => {
      if (loginForm.user === 'admin' && loginForm.pass === '1234') {
        localStorage.setItem('aura_token', 'verified');
        setIsAuthenticated(true);
      } else {
        alert('Acesso Negado! Verifique suas credenciais.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container" style={{ 
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
      }}>
        <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              background: PRIMARY_GRADIENT, width: '64px', height: '64px', 
              borderRadius: '16px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 16px' 
            }}>
              <Zap color="white" size={32} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em' }}>AuraChat <span style={{ color: '#6366f1' }}>CRM</span></h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Poderosa I.A. de Atendimento</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>Usuário</label>
              <input 
                type="text" className="glass-input" placeholder="admin"
                value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>Senha</label>
              <input 
                type="password" className="glass-input" placeholder="••••"
                value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '12px' }}>
              {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            &copy; 2026 AuraChat Technologies • Vercel Cloud Edition
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar - Pro Look */}
      <aside className="glass-panel" style={{ 
        width: '280px', margin: '16px', marginRight: '8px', 
        display: 'flex', flexDirection: 'column', padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: PRIMARY_GRADIENT, padding: '8px', borderRadius: '10px' }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '20px' }}>AuraChat</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20}/>} label="Chats WhatsApp" active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
          <NavItem icon={<Users size={20}/>} label="Leads & CRM" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
          <NavItem icon={<BarChart3 size={20}/>} label="Relatórios" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <div style={{ height: '1px', background: 'var(--border-glass)', margin: '16px 0' }} />
          <NavItem icon={<Settings size={20}/>} label="Configurações" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div style={{ 
          background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
        }} onClick={handleLogout}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--text-muted)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '600' }}>Administrador</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Online</p>
          </div>
          <LogOut size={18} color="#ef4444" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Header */}
        <header className="glass-panel" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bem-vindo de volta, Pedro!</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-muted)" />
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', width: '8px', height: '8px', borderRadius: '50%' }} />
            </div>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Nova Campanha
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <StatCard title="Total de Leads" value="1,284" icon={<Users color="#6366f1"/>} trend="+12.5%" />
              <StatCard title="Mensagens I.A." value="8,492" icon={<MessageSquare color="#22d3ee"/>} trend="+5.2%" />
              <StatCard title="Taxa Conversão" value="22.4%" icon={<TrendingUp color="#c084fc"/>} trend="+2.1%" />
              <StatCard title="Status Bot" value="Ativo" icon={<Bot color="#10b981"/>} trend="Sincronizado" color="#10b981" />
            </div>

            {/* Main Visual Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', height: '400px' }}>
                <h3 style={{ marginBottom: '20px' }}>Fluxo de Atendimento Mensal</h3>
                <div style={{ 
                  height: '280px', display: 'flex', alignItems: 'flex-end', 
                  justifyContent: 'space-between', padding: '0 20px', gap: '20px' 
                }}>
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                    <div key={i} style={{ 
                      flex: 1, height: `${h}%`, background: PRIMARY_GRADIENT, 
                      borderRadius: '4px', opacity: 0.8, cursor: 'pointer', transition: '0.3s'
                    }} title={`Mês ${i+1}: ${h}%`} onMouseEnter={e => e.target.style.opacity = '1'} onMouseLeave={e => e.target.style.opacity = '0.8'} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Set</span><span>Dez</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Atividades Recentes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <Clock size={16} color="var(--primary)" />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px' }}>{n.text}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="glass-panel animate-fade" style={{ flex: 1, display: 'flex', padding: 0 }}>
             <div style={{ width: '320px', borderRight: '1px solid var(--border-glass)', padding: '20px' }}>
                <input type="text" className="glass-input" placeholder="Buscar conversas..." style={{ width: '100%', marginBottom: '20px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <ChatItem name="Alice Silva" msg="Gostaria de saber mais sobre o plano..." time="12:45" active />
                  <ChatItem name="Roberto Lima" msg="O boleto já foi pago agora?" time="11:20" />
                  <ChatItem name="Mariana Costa" msg="A I.A. respondeu errado?" time="09:15" />
                </div>
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: PRIMARY_GRADIENT }} />
                    <span style={{ fontWeight: '600' }}>Alice Silva</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Phone size={18} color="var(--text-muted)" />
                    <Video size={18} color="var(--text-muted)" />
                    <MoreHorizontal size={18} color="var(--text-muted)" />
                  </div>
                </div>
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                  <Msg type="recv" text="Olá! Vi o anúncio de vocês no Facebook." />
                  <Msg type="send" text="Olá Alice! Sou a Aura, assistente virtual da AuraChat. Como posso te ajudar hoje?" aura />
                  <Msg type="recv" text="Gostaria de saber o valor do plano premium." />
                </div>
                <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
                   <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Paperclip size={20} color="var(--text-muted)" />
                      <Smile size={20} color="var(--text-muted)" />
                   </div>
                   <input type="text" className="glass-input" placeholder="Digite sua mensagem (I.A. Ativa)..." style={{ flex: 1 }} />
                   <button className="btn-primary" style={{ padding: '10px 20px' }}><Send size={18}/></button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components for cleaner structure
function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
        background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-muted)'
      }}
    >
      {icon}
      <span style={{ fontWeight: active ? '600' : '400' }}>{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }) {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', color: color || '#10b981', fontWeight: 'bold' }}>{trend}</span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
      <h3 style={{ fontSize: '24px', fontWeight: '700' }}>{value}</h3>
    </div>
  );
}

function ChatItem({ name, msg, time, active }) {
  return (
    <div style={{ 
      padding: '12px', borderRadius: '10px', cursor: 'pointer',
      background: active ? 'rgba(255,255,255,0.05)' : 'transparent'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{name}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{time}</span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg}</p>
    </div>
  );
}

function Msg({ type, text, aura }) {
  const isSend = type === 'send';
  return (
    <div style={{ 
      display: 'flex', justifyContent: isSend ? 'flex-end' : 'flex-start',
      marginBottom: '8px'
    }}>
      <div style={{ 
        maxWidth: '80%', padding: '12px 16px', borderRadius: '14px',
        fontSize: '14px', position: 'relative',
        background: isSend ? (aura ? PRIMARY_GRADIENT : '#334155') : 'rgba(255,255,255,0.05)',
        border: isSend ? 'none' : '1px solid var(--border-glass)',
        boxShadow: isSend ? '0 4px 15px rgba(99, 102, 241, 0.2)' : 'none'
      }}>
        {aura && <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.8 }}>⚡ AURA I.A.</div>}
        {text}
      </div>
    </div>
  );
}

export default App;
