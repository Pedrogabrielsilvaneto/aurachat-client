import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // GET: Dashboard asks for QR/Status
    if (req.method === 'GET') {
      const data = await kv.get('wa_status');
      return res.status(200).json(data || { status: 'disconnected', qr: null });
    }

    // POST: Oracle Backend updates status
    if (req.method === 'POST') {
      const { status, qr } = req.body;
      await kv.set('wa_status', { status, qr, updatedAt: Date.now() });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
