// Rota Serverless para Upload de Mídia no Vercel Blob
// IMPORTANTE: Adicione a variável de ambiente BLOB_READ_WRITE_TOKEN na Vercel
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const filename = req.query.filename || 'item-' + Date.now();
    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // Necessário para processar o stream binário
  },
};
