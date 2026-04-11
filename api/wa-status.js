import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await kv.get('wa_status');
      return res.status(200).json(data || { status: 'disconnected', qr: null });
    }

    if (req.method === 'POST') {
      const { status, qr, updatedAt } = req.body;
      const existing = await kv.get('wa_status') || {};
      if (updatedAt && existing.updatedAt && updatedAt <= existing.updatedAt) {
        return res.status(200).json({ success: true, cached: true });
      }
      await kv.set('wa_status', { status, qr, updatedAt: updatedAt || Date.now() }, { ex: 300 });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
