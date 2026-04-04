// Rota de Campanhas com Persistência em Vercel KV
import { kv } from '@vercel/kv';

const DEFAULT_CAMPAIGNS = [
  { id: '1', name: 'Promoção Verão 2024', link: 'promo-verao', platform: 'Instagram', status: 'Ativa', leads: 42 },
  { id: '2', name: 'Queima de Estoque Porcelanatos', link: 'queima-estoque', platform: 'Facebook', status: 'Ativa', leads: 15 }
];

export default async function handler(req, res) {
  try {
    let currentCampaigns = await kv.get('aura_campaigns');

    if (!currentCampaigns) {
        currentCampaigns = DEFAULT_CAMPAIGNS;
        await kv.set('aura_campaigns', currentCampaigns);
    }

    if (req.method === 'GET') {
       return res.status(200).json(currentCampaigns);
    }

    if (req.method === 'POST') {
       const newCp = req.body;
       const updated = [...currentCampaigns, { ...newCp, id: Date.now().toString(), leads: 0 }];
       await kv.set('aura_campaigns', updated);
       return res.status(200).json({ success: true, campaign: newCp });
    }

    if (req.method === 'PUT') {
       const u = req.body;
       const updated = currentCampaigns.map(cp => cp.id === u.id ? { ...u } : cp);
       await kv.set('aura_campaigns', updated);
       return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
       const { id } = req.query;
       const updated = currentCampaigns.filter(cp => cp.id !== id);
       await kv.set('aura_campaigns', updated);
       return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
