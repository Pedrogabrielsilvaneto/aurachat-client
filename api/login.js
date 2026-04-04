import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { kv } from '@vercel/kv';

const SECRET_KEY = process.env.SESSION_SECRET || 'aura-premium-secret-2024-change-me';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let employees = await kv.get('aura_employees');
    if (!employees || employees.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('1234', salt);
      employees = [
        { id: '1', name: 'Administrador', user: 'admin', pass: hash, role: 'DIRETOR' },
        { id: '2', name: 'Taine Neto', user: 'taine', pass: hash, role: 'DIRETORIA' }
      ];
      await kv.set('aura_employees', employees);
    }

    const { user, pass } = req.body;
    const found = employees.find(e => e.user && e.user.toLowerCase() === user.toLowerCase());

    if (!found) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const validPass = found.pass.startsWith('$2') 
      ? await bcrypt.compare(pass, found.pass) 
      : pass === found.pass;
    if (!validPass) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: found.id, user: found.user, role: found.role }, SECRET_KEY, { expiresIn: '24h' });
    return res.status(200).json({ success: true, token, user: { id: found.id, name: found.name, role: found.role, avatar: found.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
