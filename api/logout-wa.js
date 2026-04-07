import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Registrar comando de logout no KV para o Oracle ler
      await kv.set('wa_command', { action: 'logout', timestamp: Date.now() });
      
      // Imediatamente marcar como desconectado no frontend
      await kv.set('wa_status', { status: 'disconnected', qr: null, updatedAt: Date.now() });
      
      return res.status(200).json({ success: true, message: 'Logout solicitado com sucesso.' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
