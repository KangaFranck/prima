/**
 * GET /api/health — Format officiel Vercel (doc).
 * https://vercel.com/docs/functions/serverless-functions
 */
export function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: 'API Vercel OK' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
