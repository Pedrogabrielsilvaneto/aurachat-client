// Rota de Produtos com Persistência em Vercel KV (Redis)
import { kv } from '@vercel/kv';
import { products as mockProducts } from './_data.js';

export default async function handler(req, res) {
  try {
    // Busca do banco de dados real na Vercel (KV)
    let currentProducts = await kv.get('aura_products');

    // Se estiver vazio, inicializa com os dados mockados
    if (!currentProducts) {
      currentProducts = mockProducts;
      await kv.set('aura_products', currentProducts);
    }

    if (req.method === 'POST') {
      const newProduct = req.body;
      const updatedProducts = [newProduct, ...currentProducts];
      await kv.set('aura_products', updatedProducts);
      return res.status(200).json(newProduct);
    }

    return res.status(200).json(currentProducts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
