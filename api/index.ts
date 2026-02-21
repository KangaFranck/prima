/**
 * Point d'entrée unique API pour Vercel.
 * vercel.json réécrit /api/* vers /api/index?path=... ; ce handler délègue à routes.ts.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from './routes.js';

export default handler;
