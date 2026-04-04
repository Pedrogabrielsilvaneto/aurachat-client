// Rota de Funcionários com Persistência em Vercel KV
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

const DEFAULT_EMPLOYEES = [
    { id: '1', name: 'Administrador', user: 'admin', pass: '', role: 'DIRETOR' },
    { id: '2', name: 'Taine Neto', user: 'toine', pass: '', role: 'DIRETORIA' }
];

export default async function handler(req, res) {
  try {
    let currentEmployees = await kv.get('aura_employees');

    if (!currentEmployees) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('1234', salt);
        currentEmployees = DEFAULT_EMPLOYEES.map(e => ({ ...e, pass: hash }));
        await kv.set('aura_employees', currentEmployees);
    }

    if (req.method === 'GET') {
       return res.status(200).json(currentEmployees.map(e => ({ ...e, pass: undefined })));
    }

    if (req.method === 'POST') {
       const newEmployee = req.body;
       const salt = await bcrypt.genSalt(10);
       const hash = await bcrypt.hash(newEmployee.pass || '1234', salt);
       const updated = [...currentEmployees, { ...newEmployee, pass: hash, id: Date.now().toString() }];
       await kv.set('aura_employees', updated);
       return res.status(200).json({ success: true, employee: { ...newEmployee, id: Date.now().toString() } });
    }

    if (req.method === 'PUT') {
       const u = req.body;
       const updated = await Promise.all(currentEmployees.map(async (e) => {
         if (e.id === u.id) {
           if (u.pass && u.pass !== '********') {
             const salt = await bcrypt.genSalt(10);
             u.pass = await bcrypt.hash(u.pass, salt);
           } else {
             u.pass = e.pass;
           }
           return { ...e, ...u };
         }
         return e;
       }));
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
