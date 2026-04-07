import { kv } from '@vercel/kv';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Porcelanato', color: '#2563eb' },
  { id: '2', name: 'Pastilhas', color: '#d946ef' }
];

export default async function handler(req, res) {
  try {
    let currentCategories = await kv.get('aura_categories');

    if (!currentCategories) {
        currentCategories = DEFAULT_CATEGORIES;
        await kv.set('aura_categories', currentCategories);
    }

    if (req.method === 'GET') {
       return res.status(200).json(currentCategories);
    }

    if (req.method === 'POST') {
       const newCat = req.body;
       const cat = { ...newCat, id: Date.now().toString() };
       const updated = [...currentCategories, cat];
       await kv.set('aura_categories', updated);
       return res.status(200).json({ success: true, category: cat });
    }

    if (req.method === 'PUT') {
       const u = req.body;
       const updated = currentCategories.map(c => c.id === u.id ? { ...c, ...u } : c);
       await kv.set('aura_categories', updated);
       return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
       const { id } = req.query;
       const updated = currentCategories.filter(c => c.id !== id);
       await kv.set('aura_categories', updated);
       return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
