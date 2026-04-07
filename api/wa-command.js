import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // GET: Oracle polls for new commands
    if (req.method === 'GET') {
      const command = await kv.get('wa_command');
      return res.status(200).json(command || { action: 'none' });
    }

    // POST: Dashboard sets a new command (usually via logout-wa.js, but could be direct)
    if (req.method === 'POST') {
       const { action } = req.body;
       await kv.set('wa_command', { action, timestamp: Date.now() });
       return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
