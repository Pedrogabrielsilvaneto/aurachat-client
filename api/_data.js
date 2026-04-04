// _data.js - Mock Database temporário para a Vercel
// No futuro, conectaremos este arquivo a um MongoDB
export const contacts = [
  { id: '1', name: 'Pedro Neto', phone: '5511988887777', status: 'new', msg: 'Interessado no porcelanato.', time: '14:20', role: 'clt' },
  { id: '2', name: 'Maria Silva', phone: '5511977776666', status: 'active', msg: 'Pode passar o preço?', time: '13:45', role: 'terceiros' },
  { id: '3', name: 'Jorge Oliveira', phone: '5511966665555', status: 'completed', msg: 'Obrigado!', time: 'Ontem', role: 'gestao' },
];

export const products = [
  { id: '1', code: 'PRC-9090-PLD', name: "Porcelanato Polido 90x90 Gold", media: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", type: 'image', desc: "Acabamento de alto brilho, ideal para áreas nobres." },
  { id: '2', code: 'REV-SLM-WHT', name: "Revestimento Slim White 30x60", media: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", type: 'image', desc: "Paredes internas. Textura acetinada." }
];

export const campaigns = [
  { id: '1', name: 'Promoção Verão', platform: 'Instagram', link: 'ig/verao24', status: 'active', clicks: 1240, leads: 156, conversion: '12.5%' },
  { id: '2', name: 'Black Friday', platform: 'Facebook', link: 'fb/prime', status: 'inactive', clicks: 850, leads: 42, conversion: '4.9%' }
];
