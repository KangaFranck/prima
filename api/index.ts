/**
 * Point d'entrée API unique. vercel.json réécrit /api/* vers /api/index?path=...
 * Format Node (req, res) pour @vercel/node.
 * Import sans extension pour que le build Vercel inclue routes.ts (évite 404 sur /api/login).
 */
import handler from './routes';

export default handler;
