// Exemplo de Rota Vercel para Contatos
// Isso rodará de forma nativa e rápida na Vercel
import { contacts as mockContacts } from './_data.js';

export default function handler(req, res) {
  res.status(200).json(mockContacts);
}
