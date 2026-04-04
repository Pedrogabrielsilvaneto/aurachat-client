import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { kv } from '@vercel/kv';

const SECRET_KEY = process.env.SESSION_SECRET || 'aura-premium-secret-2024-change-me';

const DEFAULT_USERS = [
  { id: '1', user: 'admin', pass: '$2a$10$X7o3o3o3o3o3o3o3o3o3o.X7o3o3o3o3o3o3o3o3o3o3o3o3o3o3o', name: 'Administrador', role: 'gestor', avatar: 'AD' },
  { id: '2', user: 'toine', pass: '$2a$10$X7o3o3o3o3o3o3o3o3o3o.X7o3o3o3o3o3o3o3o3o3o3o3o3o3o3o', name: 'Taine Neto', role: 'gestor', avatar: 'TN' }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let users = await kv.get('aura_users');
    if (!users) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('1234', salt);
      users = [
        { id: '1', user: 'admin', pass: hash, name: 'Administrador', role: 'gestor', avatar: 'AD' },
        { id: '2', user: 'toine', pass: hash, name: 'Taine Neto', role: 'gestor', avatar: 'TN' },
        { id: '3', user: 'vendedor1', pass: hash, name: 'Consultor Vendas 01', role: 'vendedor', avatar: 'V1' }
      ];
      await kv.set('aura_users', users);
    }

    const { user, pass } = req.body;
    const found = users.find(u => u.user === user.toLowerCase());

    if (!found) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const validPass = await bcrypt.compare(pass, found.pass);
    if (!validPass) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: found.id, user: found.user, role: found.role }, SECRET_KEY, { expiresIn: '24h' });
    return res.status(200).json({ success: true, token, user: { id: found.id, name: found.name, role: found.role, avatar: found.avatar } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
