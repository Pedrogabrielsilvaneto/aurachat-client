// Rota de Funcionários com Persistência em Vercel KV
import { kv } from '@vercel/kv';

const DEFAULT_EMPLOYEES = [
    { id: '1', name: 'Marcos Neto', user: 'marcos.diretoria', pass: '********', role: 'DIRETOR' },
    { id: '2', name: 'Sônia IA', user: 'sonia.bot', pass: 'TOKEN_JWT', role: 'VENDEDORA' }
];

export default async function handler(req, res) {
  try {
    let currentEmployees = await kv.get('aura_employees');

    if (!currentEmployees) {
        currentEmployees = DEFAULT_EMPLOYEES;
        await kv.set('aura_employees', currentEmployees);
    }

    if (req.method === 'GET') {
       return res.status(200).json(currentEmployees);
    }

    if (req.method === 'POST') {
       const newEmployee = req.body;
       const updated = [...currentEmployees, { ...newEmployee, id: Date.now().toString() }];
       await kv.set('aura_employees', updated);
       return res.status(200).json({ success: true, employee: newEmployee });
    }

    if (req.method === 'PUT') {
       const u = req.body;
       const updated = currentEmployees.map(e => e.id === u.id ? { ...u } : e);
       await kv.set('aura_employees', updated);
       return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
       const { id } = req.query;
       const updated = currentEmployees.filter(e => e.id !== id);
       await kv.set('aura_employees', updated);
       return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
