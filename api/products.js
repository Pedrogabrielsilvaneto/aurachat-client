// Rota de Produtos com Persistência em Vercel KV (Redis)
import { kv } from '@vercel/kv';
import { products as mockProducts } from './_data.js';

export default async function handler(req, res) {
  try {
    let currentProducts = await kv.get('aura_products');

    if (!currentProducts) {
      currentProducts = mockProducts;
      await kv.set('aura_products', currentProducts);
    }

    if (req.method === 'GET') {
      return res.status(200).json(currentProducts);
    }

    if (req.method === 'POST') {
      const newProduct = req.body;
      const existingIdx = currentProducts.findIndex(p => p.id === newProduct.id);
      let updatedProducts;
      if (existingIdx > -1) {
        currentProducts[existingIdx] = { ...currentProducts[existingIdx], ...newProduct };
        updatedProducts = [...currentProducts];
      } else {
        updatedProducts = [{ ...newProduct, active: true }, ...currentProducts];
      }
      await kv.set('aura_products', updatedProducts);
      return res.status(200).json({ success: true, product: newProduct });
    }

    if (req.method === 'PUT') {
      const { id, updates } = req.body;
      const updated = currentProducts.map(p => p.id === id ? { ...p, ...updates } : p);
      await kv.set('aura_products', updated);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const updated = currentProducts.filter(p => p.id !== id);
      await kv.set('aura_products', updated);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
