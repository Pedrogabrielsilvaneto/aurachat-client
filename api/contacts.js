// Rota de Leads/Contatos com Persistência em Vercel KV
import { kv } from '@vercel/kv';
import { contacts as mockContacts } from './_data.js';

export default async function handler(req, res) {
  try {
    let currentContacts = await kv.get('aura_contacts');

    if (!currentContacts) {
       currentContacts = mockContacts;
       await kv.set('aura_contacts', currentContacts);
    }

    if (req.method === 'PUT') {
      const { id, updates } = req.body;
      const updated = currentContacts.map(c => c.id === id ? { ...c, ...updates } : c);
      await kv.set('aura_contacts', updated);
      return res.status(200).json({ success: true });
    }

    return res.status(200).json(currentContacts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
