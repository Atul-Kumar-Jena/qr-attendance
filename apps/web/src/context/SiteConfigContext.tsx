'use client';
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { db } from '@/lib/firebase';

export type PricingMode = 'LIMITED_OFFER' | 'PAID' | 'FREE';
export const VALID_PRICING_MODES: PricingMode[] = ['LIMITED_OFFER', 'PAID', 'FREE'];

export interface StatItem { tag: string; value: string; sub: string; }

export interface SiteConfig {
  siteTitle: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  pricingMode: PricingMode;
  limitedOfferLabel: string;
  limitedOfferDiscountPct: number;
  customPrice: number | null;
  customPriceLabel: string;
  paymentUrl: string;
  geofencingEnabled: boolean;
  deviceBindingEnabled: boolean;
  attestationEnabled: boolean;
  mockLocationDetection: boolean;
  qrRotationEnabled: boolean;
  maintenanceMode: boolean;
  defaultQrRotationSec: number;
  defaultQrMaxScans: number;
  loginRateLimitMax: number;
  scanRateLimitMax: number;
  siteStats: StatItem[];
}

export const DEFAULT_CONFIG: SiteConfig = {
  siteTitle: 'Attendly',
  tagline: "Attendance that can't be fooled.",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#6366f1',
  accentColor: '#8b5cf6',
  pricingMode: 'LIMITED_OFFER',
  limitedOfferLabel: 'Early access — 60% off',
  limitedOfferDiscountPct: 60,
  customPrice: null,
  customPriceLabel: 'per month',
  paymentUrl: '',
  geofencingEnabled: true,
  deviceBindingEnabled: true,
  attestationEnabled: false,
  mockLocationDetection: true,
  qrRotationEnabled: true,
  maintenanceMode: false,
  defaultQrRotationSec: 1.5,
  defaultQrMaxScans: 0,
  loginRateLimitMax: 5,
  scanRateLimitMax: 10,
  siteStats: [],
};

interface SaveResult { ok: boolean; error?: string }

interface SiteConfigState {
  config: SiteConfig;
  loading: boolean;
  save: (patch: Partial<SiteConfig>) => Promise<SaveResult>;
}

const SiteConfigContext = createContext<SiteConfigState>({
  config: DEFAULT_CONFIG,
  loading: false,
  save: async () => ({ ok: true }),
});

const LS_KEY = 'attendly_site_config';

function readLocalStorage(): Partial<SiteConfig> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Validate critical fields to avoid rendering crashes
    if (parsed.pricingMode && !VALID_PRICING_MODES.includes(parsed.pricingMode)) {
      parsed.pricingMode = DEFAULT_CONFIG.pricingMode;
    }
    if (parsed.limitedOfferDiscountPct != null && (typeof parsed.limitedOfferDiscountPct !== 'number' || isNaN(parsed.limitedOfferDiscountPct))) {
      parsed.limitedOfferDiscountPct = DEFAULT_CONFIG.limitedOfferDiscountPct;
    }
    if (parsed.customPrice != null && typeof parsed.customPrice !== 'number') {
      parsed.customPrice = null;
    }
    return parsed;
  } catch { return {}; }
}

function writeLocalStorage(cfg: SiteConfig) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch { /* quota full */ }
}

function clearLocalStorage() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(LS_KEY); } catch {}
}

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  // Initialize with DEFAULT_CONFIG on both server and client to prevent hydration mismatch.
  // localStorage is read only after mount inside useEffect.
  const configRef = useRef<SiteConfig>(DEFAULT_CONFIG);
  const [config, setConfigState] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(!!db);

  const setConfig = (next: SiteConfig) => {
    configRef.current = next;
    setConfigState(next);
  };

  // Hydrate from localStorage after mount (safe — runs only client-side)
  // Also handle ?reset URL param to clear corrupted config
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('reset')) {
      clearLocalStorage();
      // Remove ?reset from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('reset');
      window.history.replaceState({}, '', url.toString());
      return; // Keep DEFAULT_CONFIG
    }
    const stored = readLocalStorage();
    if (Object.keys(stored).length > 0) {
      setConfig({ ...DEFAULT_CONFIG, ...stored } as SiteConfig);
    }
  }, []);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    let unsub: (() => void) | undefined;
    try {
      const { doc, onSnapshot } = require('firebase/firestore');
      const ref = doc(db, 'config', 'site');
      unsub = onSnapshot(
        ref,
        (snap: { exists: () => boolean; data: () => Record<string, unknown> }) => {
          try {
            if (snap.exists()) {
              const raw = snap.data() || {};
              // Validate Firestore data the same way as localStorage — never trust remote data
              const safe: Record<string, unknown> = {};
              for (const [k, v] of Object.entries(raw)) {
                if (k in DEFAULT_CONFIG) safe[k] = v;
              }
              if (safe.pricingMode && !(VALID_PRICING_MODES as string[]).includes(safe.pricingMode as string)) {
                delete safe.pricingMode;
              }
              if (safe.limitedOfferDiscountPct != null && (typeof safe.limitedOfferDiscountPct !== 'number' || isNaN(safe.limitedOfferDiscountPct as number))) {
                delete safe.limitedOfferDiscountPct;
              }
              if (safe.customPrice != null && typeof safe.customPrice !== 'number') {
                safe.customPrice = null;
              }
              const next = { ...DEFAULT_CONFIG, ...safe } as SiteConfig;
              setConfig(next);
              writeLocalStorage(next);
            }
          } catch {
            // Firestore data corrupt — keep current state, do not crash render
          }
          setLoading(false);
        },
        (_err: unknown) => {
          // Firestore read failed — use localStorage fallback silently
          setLoading(false);
        },
      );
    } catch {
      setLoading(false);
    }
    return () => { try { unsub?.(); } catch {} };
  }, []);

  // Apply CSS custom properties whenever colors change
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--color-primary', config.primaryColor);
    document.documentElement.style.setProperty('--color-accent', config.accentColor);
  }, [config.primaryColor, config.accentColor]);

  // Update document title dynamically
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = `${config.siteTitle} — secure QR attendance for modern institutions`;
  }, [config.siteTitle]);

  const save = async (patch: Partial<SiteConfig>): Promise<SaveResult> => {
    const next = { ...configRef.current, ...patch };

    // Optimistic update immediately
    setConfig(next);
    writeLocalStorage(next);

    if (!db) {
      // No Firebase — localStorage is the only store (dev mode)
      return { ok: true };
    }

    try {
      const { doc, setDoc, serverTimestamp } = require('firebase/firestore');
      await setDoc(
        doc(db, 'config', 'site'),
        { ...next, updatedAt: serverTimestamp() },
        { merge: true },
      );
      return { ok: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isPermission = msg.includes('permission') || msg.includes('Permission');
      // Keep the localStorage/state changes — only Firestore failed.
      // The change is live locally; user just needs to deploy rules to sync globally.
      return {
        ok: false,
        error: isPermission
          ? 'Saved locally ✓ — Firestore sync blocked (permission denied).\n\nTo sync globally, deploy this rule in Firebase Console → Firestore → Rules:\n\nmatch /config/{docId} {\n  allow read: if true;\n  allow write: if request.auth != null;\n}'
          : `Saved locally ✓ — Firestore sync failed: ${msg}`,
      };
    }
  };

  return (
    <SiteConfigContext.Provider value={{ config, loading, save }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
