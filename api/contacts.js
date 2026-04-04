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

    // LISTAR CONTATOS
    if (req.method === 'GET') {
       return res.status(200).json(currentContacts);
    }

    // CRIAR OU ATUALIZAR CONTATO (Chamado pelo Robô ou Dashboard)
    if (req.method === 'POST') {
      const contactData = req.body;
      const existingIdx = currentContacts.findIndex(c => c.phone === contactData.phone || c.id === contactData.id);
      
      let updatedContacts;
      if (existingIdx > -1) {
        // Atualiza campos existentes (não sobrescreve tudo para não perder histórico se vier parcial)
        const existing = currentContacts[existingIdx];
        currentContacts[existingIdx] = { ...existing, ...contactData };
        updatedContacts = [...currentContacts];
      } else {
        // Novo cadastro
        const newContact = {
          id: contactData.id || Date.now().toString(),
          name: contactData.name || 'Cliente Novo',
          phone: contactData.phone,
          status: contactData.status || 'new',
          role: contactData.role || 'cliente',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          msg: contactData.msg || '',
          interests: [],
          ...contactData
        };
        updatedContacts = [newContact, ...currentContacts];
      }

      await kv.set('aura_contacts', updatedContacts);
      return res.status(200).json({ success: true, contact: contactData });
    }

    // ATUALIZAÇÃO ESPECÍFICA (Ex: Mover card)
    if (req.method === 'PUT') {
      const { id, updates } = req.body;
      const updated = currentContacts.map(c => c.id === id ? { ...c, ...updates } : c);
      await kv.set('aura_contacts', updated);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
