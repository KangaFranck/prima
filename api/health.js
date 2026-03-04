/**
 * GET /api/health — Handler Node pour @vercel/node (builds explicites).
 */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ ok: true, message: 'API Vercel OK' });
}
