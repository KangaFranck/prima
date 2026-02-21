/**
 * Point d'entrée API unique. vercel.json réécrit /api/* vers /api/index?path=...
 * Format Node (req, res) pour @vercel/node.
 */
import handler from './routes.js';

export default handler;
