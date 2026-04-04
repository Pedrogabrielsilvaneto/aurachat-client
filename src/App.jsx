import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  MessageCircle, Eye, HandPointing as Hand, ArrowRight, 
  Plus, Key, RefreshCcw, Power, UserPlus, Search, 
  ChevronDown, LayoutDashboard, Settings, LogOut, DollarSign,
  BarChart, Zap, Clock, CheckCircle, Package, Send,
  MapPin, ClipboardList, CheckCircle2, MoreHorizontal, Camera,
  ShieldAlert, UserCheck, MessageSquare, ArrowLeft, Ghost
} from 'lucide-react';

// ==========================================
// MOCK DATA - COM HIERARQUIA DE ATENDIMENTO
// ==========================================
const INITIAL_TEAM = [
  { 
    id: 1, name: "Maria Vendas", role: "Vendedora", status: "Online", sector: "Vendas", img: "MV",
    activeChats: [
      { id: 101, customer: "João Silva", lastMsg: "Qual o prazo do 90x90?", category: "Porcelanato" },
      { id: 102, customer: "Ana Revest", lastMsg: "Manda o link do boleto.", category: "Financeiro" },
      { id: 103, customer: "Carlos Engenharia", lastMsg: "Preciso de 300m².", category: "Obra" }
    ]
  },
  { 
    id: 2, name: "Roberto Log", role: "Logística", status: "Online", sector: "Entrega", img: "RL",
    activeChats: [
      { id: 104, customer: "Entrega #559", lastMsg: "Já estou no local.", category: "Logística" }
    ]
  },
  { id: 3, name: "Aura IA", role: "Inteligência Autônoma", status: "Ativa 24/7", sector: "IA", img: "AI", activeChats: [] },
];

const INITIAL_DELIVERIES = [
  { id: 501, client: "Condomínio Vila Verde", items: "85m² Porcelanato", status: "Pendente", pallets: 4, address: "Av. Tiradentes, 450" },
  { id: 503, client: "Sítio Primavera", items: "200m² Piso Cerâmico", status: "Saiu para Entrega", pallets: 10, address: "Rodovia BR-101" },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  
  // Estados de Supervisão
  const [inspectingAttendant, setInspectingAttendant] = useState(null); // Nível 2
  const [spyingChat, setSpyingChat] = useState(null); // Nível 3 (Espião)
  const [hasIntervened, setHasIntervened] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura_token') === 'verified');

  // ==========================================
  // LÓGICA DE SUPERVISÃO & GESTÃO
  // ==========================================
  const handleAssume = () => {
    setHasIntervened(true);
    // Simular mensagem automática pro cliente e alerta pro vendedor
  };

  const changeSector = (userId, newSector) => {
    setTeam(team.map(u => u.id === userId ? { ...u, sector: newSector } : u));
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden" style={{ display: 'flex' }}>
      
      {/* SIDEBAR EXECUTIVA */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: '#2563eb', padding: '8px', borderRadius: '10px' }}>
             <Zap size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '20px' }}>Pereira <span style={{ color: '#2563eb' }}>CRM</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<MessageCircle size={20}/>} label="Radar de Equipe" active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
          <SidebarLink icon={<Truck size={20}/>} label="Logística" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
          <SidebarLink icon={<Users size={20}/>} label="Gestão de Usuários" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
          <div style={{ margin: '20px 0', height: '1px', background: '#f1f5f9' }} />
          <SidebarLink icon={<ShoppingCart size={20}/>} label="Compras / Fábrica" />
        </nav>

        <div onClick={() => { localStorage.removeItem('aura_token'); setIsAuthenticated(false); }} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold', borderRadius: '10px' }}>
           <LogOut size={18} /> Sair do Painel
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#f8fafc' }}>
        
        {/* VIEW: DASHBOARD (VISÃO GLOBAL) */}
        {activeTab === 'dashboard' && (
           <div className="animate-view">
              <header style={{ marginBottom: '32px' }}>
                 <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Raio-X da Loja</h1>
                 <p style={{ color: '#64748b' }}>Visão geral em tempo real da Pereira Acabamentos.</p>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                 <KPICard label="Faturamento do Dia" value="R$ 18.540" trend="+15%" icon={<DollarSign color="#2563eb"/>} />
                 <KPICard label="Metragem Vendida" value="1.120 m²" trend="+5%" icon={<Package color="#8b5cf6"/>} />
                 <KPICard label="Leads IA vs Humano" value="32 / 14" trend="68% IA" icon={<Zap color="#10b981"/>} />
                 <KPICard label="Conversão" value="21.5%" trend="+2%" icon={<TrendingUp color="#3b82f6"/>} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                 <div className="manager-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '20px' }}>
                       <AlertTriangle size={18} /> Alerta de Gargalos
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <GargaloRow label="Orçamento s/ Resposta (Maria Vendas)" time="3h" />
                       <GargaloRow label="Pedido de Compra Aguardando Fábrica" time="1 dia" />
                       <GargaloRow label="Entrega Sítio Primavera Atrasada" time="45m" />
                    </div>
                 </div>

                 <div className="manager-card">
                    <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Top Vendedores (Semana)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <RankRow name="Maria" value="R$ 52.000" pos="1" />
                       <RankRow name="João" value="R$ 44.500" pos="2" />
                       <RankRow name="Roberto" value="R$ 12.000" pos="3" />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: RADAR DE COMANDO (3 NÍVEIS) */}
        {activeTab === 'radar' && (
           <div className="animate-view">
              
              {/* NÍVEL 1: SELEÇÃO DE ATENDENTE */}
              {!inspectingAttendant && (
                <>
                  <h2 style={{ marginBottom: '24px' }}>Radar de Equipe Online</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {team.map(u => (
                      <div key={u.id} className="manager-card" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => setInspectingAttendant(u)}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px', fontWeight: 'bold', border: '2px solid #2563eb' }}>{u.img}</div>
                        <h4 style={{ marginBottom: '4px' }}>{u.name}</h4>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{u.role}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} /> {u.activeChats.length} Chats Ativos
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* NÍVEL 2: FILA DO ATENDENTE */}
              {inspectingAttendant && !spyingChat && (
                <div className="animate-view">
                  <button onClick={() => setInspectingAttendant(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px' }}>
                    <ArrowLeft size={18} /> Voltar ao Radar
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{inspectingAttendant.img}</div>
                    <h2 style={{ fontSize: '20px' }}>Visão em Tempo Real: <span style={{ color: '#2563eb' }}>{inspectingAttendant.name}</span></h2>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {inspectingAttendant.activeChats.map(chat => (
                      <div key={chat.id} className="manager-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }} onClick={() => setSpyingChat({ ...chat, attendant: inspectingAttendant.name })}>
                        <div>
                          <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{chat.customer}</h4>
                          <p style={{ fontSize: '13px', color: '#64748b' }}>Última msg: "{chat.lastMsg}"</p>
                          <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', marginTop: '10px', display: 'inline-block' }}>{chat.category}</span>
                        </div>
                        <button className="btn-action" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Ghost size={16} color="#64748b" /> Espionar Silenciosamente
                        </button>
                      </div>
                    ))}
                    {inspectingAttendant.activeChats.length === 0 && <p style={{ color: '#64748b' }}>Nenhum atendimento ativo no momento.</p>}
                  </div>
                </div>
              )}

              {/* NÍVEL 3: MODO ESPIÃO / INTERVENÇÃO */}
              {spyingChat && (
                <div className="animate-view" style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
                   
                   {/* Header Espião */}
                   <div style={{ padding: '20px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff9f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => { setSpyingChat(null); setHasIntervened(false); }} className="btn-ghost" style={{ padding: '8px' }}><ArrowLeft size={20}/></button>
                        <div>
                           <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Monitorando Invisivelmente: {spyingChat.customer}</h3>
                           <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>📡 MODO ESPIÃO ATIVO • {spyingChat.attendant} não sabe que você está aqui</p>
                        </div>
                      </div>
                      {!hasIntervened && (
                        <button onClick={handleAssume} className="btn-action" style={{ background: '#ef4444', color: 'white', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <ShieldAlert size={18} /> Assumir Controle do Chat
                        </button>
                      )}
                   </div>

                   {/* Área de Mensagens */}
                   <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Msg origin="customer" name={spyingChat.customer} text="Olá, vocês tem o porcelanato Portobello 90x90 para pronta entrega?" />
                      <Msg origin="attendant" name={spyingChat.attendant} text="Oi João! Sim, temos 120 metros em estoque agora." />
                      <Msg origin="customer" name={spyingChat.customer} text="Consegue fazer um desconto se eu levar tudo no PIX?" />
                      
                      {/* Sussurro do Gestor */}
                      <div style={{ alignSelf: 'center', padding: '12px 24px', background: '#fef3c7', borderRadius: '12px', border: '1px dashed #d97706', color: '#92400e', fontSize: '13px', textAlign: 'center' }}>
                         💡 <b>SUSSURRO DO GESTOR:</b> Ofereça 5% no PIX e argamassa grátis se fechar hoje.
                      </div>

                      {hasIntervened && (
                        <div style={{ alignSelf: 'center', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', fontSize: '12px' }}>
                           🚩 <b>NOTIFICAÇÃO:</b> Você assumiu esta conversa. O cliente e o vendedor foram notificados.
                        </div>
                      )}
                   </div>

                   {/* Ações Especiais de Chat */}
                   <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                      <input type="text" className="input-field" placeholder="Escrever sussurro para o vendedor..." style={{ flex: 1, border: '2px solid #fef3c7' }} />
                      <button className="btn-action" style={{ background: '#f59e0b', color: 'white' }}>Sussurrar</button>
                   </div>
                </div>
              )}

           </div>
        )}

        {/* VIEW: LOGÍSTICA KANBAN */}
        {activeTab === 'logistics' && (
           <div className="animate-view">
              <h2 style={{ marginBottom: '24px' }}>Controle de Entregas</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <LogisticsCol title="Pendente" color="#f59e0b" count="8">
                   <MiniDeliveryCard client="Dra. Ana" pallets="2" />
                   <MiniDeliveryCard client="Construtora Beta" pallets="15" />
                </LogisticsCol>
                <LogisticsCol title="Saiu para Entrega" color="#2563eb" count="3">
                   <MiniDeliveryCard client="João Vila Verde" pallets="4" active />
                </LogisticsCol>
                <LogisticsCol title="Entregue" color="#10b981" count="24">
                   <MiniDeliveryCard client="Sítio Primavera" pallets="10" done />
                </LogisticsCol>
              </div>
           </div>
        )}

        {/* VIEW: EQUIPE & PERMISSÕES */}
        {activeTab === 'team' && (
           <div className="animate-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                 <h2>Gestão Portaria e Acessos</h2>
                 <button className="btn-action btn-primary"><Plus size={18} style={{marginRight: '8px'}}/> Criar Novo Usuário</button>
              </div>
              <div className="manager-card" style={{ padding: 0 }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                       <tr>
                         <th style={{ padding: '16px', textAlign: 'left' }}>Funcionário</th>
                         <th style={{ padding: '16px', textAlign: 'left' }}>Setor</th>
                         <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                         <th style={{ padding: '16px', textAlign: 'left' }}>Ações</th>
                       </tr>
                    </thead>
                    <tbody>
                       {team.map(u => (
                         <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                               <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{u.img}</div>
                               <b>{u.name}</b>
                            </td>
                            <td style={{ padding: '16px' }}>
                               <select className="input-field" style={{ padding: '4px', fontSize: '12px', width: '140px' }} value={u.sector} onChange={(e) => changeSector(u.id, e.target.value)}>
                                  <option>Vendas</option>
                                  <option>Entrega</option>
                                  <option>Compras</option>
                                  <option>IA</option>
                               </select>
                            </td>
                            <td style={{ padding: '16px' }}>
                               <span style={{ fontSize: '12px', fontWeight: '600', color: u.status.includes('Online') || u.status.includes('Ativa') ? '#10b981' : '#f59e0b' }}>● {u.status}</span>
                            </td>
                            <td style={{ padding: '16px' }}>
                               <div style={{ display: 'flex', gap: '12px' }}>
                                  <button title="Reset Senha" style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer' }}><Key size={18}/></button>
                                  <button title="Desativar" style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><Power size={18}/></button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES UI
// ==========================================

function KPICard({ label, value, trend, icon }) {
  return (
    <div className="manager-card">
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '12px' }}>{icon}</div>
          <span style={{ fontSize: '12px', color: trend.startsWith('+') || trend.includes('IA') ? '#10b981' : '#64748b', fontWeight: 'bold' }}>{trend}</span>
       </div>
       <p style={{ color: '#64748b', fontSize: '13px' }}>{label}</p>
       <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', background: active ? '#eff6ff' : 'transparent', color: active ? '#2563eb' : '#64748b', fontWeight: active ? '700' : '500', transition: '0.2s' }}>
      {icon} <span style={{ fontSize: '14px' }}>{label}</span>
    </div>
  );
}

function GargaloRow({ label, time }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fef2f2', borderRadius: '8px', fontSize: '13px' }}>
       <span>{label}</span>
       <b style={{ color: '#ef4444' }}>{time}</b>
    </div>
  );
}

function RankRow({ name, value, pos }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px' }}>
       <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ color: '#cbd5e1' }}>#{pos}</span>
          <b>{name}</b>
       </div>
       <span>{value}</span>
    </div>
  );
}

function LogisticsCol({ title, color, count, children }) {
  return (
    <div>
       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '8px', height: '8px', background: color, borderRadius: '50%' }} />
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase' }}>{title}</h4>
          <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{count}</span>
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  );
}

function MiniDeliveryCard({ client, pallets, active, done }) {
  return (
    <div className="manager-card" style={{ padding: '16px' }}>
       <p style={{ fontSize: '14px', fontWeight: '700' }}>{client}</p>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{pallets} Pallets</span>
          {active && <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 'bold' }}>EM ROTA</span>}
          {done && <CheckCircle size={14} color="#10b981" />}
       </div>
    </div>
  );
}

function Msg({ origin, name, text }) {
  const isMe = origin === 'attendant';
  return (
    <div style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
       <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textAlign: isMe ? 'right' : 'left' }}>{name}</p>
       <div style={{ padding: '12px 16px', borderRadius: '16px', fontSize: '14px', background: isMe ? '#2563eb' : '#f1f5f9', color: isMe ? 'white' : '#0f172a' }}>
          {text}
       </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="manager-card animate-view" style={{ width: '400px', textAlign: 'center', padding: '48px' }}>
         <div style={{ background: '#2563eb', width: '60px', height: '60px', borderRadius: '14px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={32} color="white" />
         </div>
         <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Pereira CRM</h2>
         <p style={{ color: '#64748b', marginBottom: '32px' }}>Painel Executivo v2.0</p>
         <button className="btn-action btn-primary" style={{ width: '100%', padding: '14px' }} onClick={onLogin}>Entrar no Sistema</button>
      </div>
    </div>
  );
}

export default App;
