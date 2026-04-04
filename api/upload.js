// Rota para Geração de Token de Upload do Vercel Blob (Direto via Cliente)
// Isso contorna o limite de 4.5MB das funções serverless da Vercel
import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  const body = req.body;

  try {
    const jsonResponse = await handleUpload({
      body: body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Aqui você pode adicionar lógica de autenticação se necessário
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'],
          tokenPayload: JSON.stringify({
            // Informações extras
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Lógica de pós-upload (ex: salvar no banco de dados)
        console.log('Blob upload completed', blob, tokenPayload);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
