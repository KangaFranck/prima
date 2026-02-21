/**
 * Route de test minimale (aucune dépendance).
 * GET /api/health → si 200, les fonctions API sont déployées.
 */
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ ok: true, message: 'API Vercel OK' });
};
