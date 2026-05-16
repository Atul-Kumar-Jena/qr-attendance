import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth, requireDeveloper } from '../../middleware/auth.js';
import { recordAudit } from '../audit/audit.service.js';

export const siteConfigRouter = Router();

const updateSchema = z.object({
  siteTitle:             z.string().min(1).max(80).optional(),
  tagline:               z.string().max(200).optional(),
  logoUrl:               z.string().url().nullable().optional(),
  faviconUrl:            z.string().url().nullable().optional(),
  primaryColor:          z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor:           z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  geofencingEnabled:     z.boolean().optional(),
  deviceBindingEnabled:  z.boolean().optional(),
  attestationEnabled:    z.boolean().optional(),
  mockLocationDetection: z.boolean().optional(),
  qrRotationEnabled:     z.boolean().optional(),
  maintenanceMode:       z.boolean().optional(),
  defaultQrRotationSec:  z.number().int().min(3).max(60).optional(),
  loginRateLimitMax:     z.number().int().min(1).max(100).optional(),
  scanRateLimitMax:      z.number().int().min(1).max(200).optional(),
});

async function getOrCreate() {
  const existing = await prisma.siteConfig.findFirst();
  if (existing) return existing;
  return prisma.siteConfig.create({ data: {} });
}

// Public — web reads this to hydrate branding & feature flags
siteConfigRouter.get('/', async (_req, res, next) => {
  try {
    res.json(await getOrCreate());
  } catch (e) { next(e); }
});

// DEVELOPER only — update any field
siteConfigRouter.put('/', requireAuth, requireDeveloper, async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const current = await getOrCreate();
    const updated = await prisma.siteConfig.update({
      where: { id: current.id },
      data: { ...data, updatedById: req.user!.sub },
    });
    // Audit using first institution found (global action)
    const inst = await prisma.institution.findFirst();
    if (inst) {
      await recordAudit({
        institutionId: inst.id,
        actorUserId: req.user!.sub,
        actorRole: req.user!.role,
        action: 'SITE_CONFIG_UPDATED',
        metadata: data,
        ip: req.ip,
        userAgent: req.header('user-agent') ?? undefined,
      });
    }
    res.json(updated);
  } catch (e) { next(e); }
});
