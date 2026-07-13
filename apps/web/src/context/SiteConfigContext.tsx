'use client';
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import {
  doc, onSnapshot, setDoc, serverTimestamp,
} from 'firebase/firestore';

export type PricingMode = 'LIMITED_OFFER' | 'PAID';

// Per-tier pricing override — `price: null` keeps the tier label "Custom"
// (used for Enterprise). Anything else is rendered as a dollar amount. Devs
// can set 0 to make a plan free for everyone.
export interface PricingTier {
  name: string;
  price: number | null;
  unit: string;
  pitch: string;
  feats: string[];
  cta: string;
  highlight?: boolean;
}

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
  pricingTiers: PricingTier[];        // dev-editable; empty = use built-in defaults
  geofencingEnabled: boolean;
  deviceBindingEnabled: boolean;
  attestationEnabled: boolean;
  mockLocationDetection: boolean;
  qrRotationEnabled: boolean;
  maintenanceMode: boolean;
  defaultQrRotationSec: number;
  loginRateLimitMax: number;
  scanRateLimitMax: number;
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
  pricingTiers: [],
  geofencingEnabled: true,
  deviceBindingEnabled: true,
  attestationEnabled: false,
  mockLocationDetection: true,
  qrRotationEnabled: true,
  maintenanceMode: false,
  defaultQrRotationSec: 2,
  loginRateLimitMax: 5,
  scanRateLimitMax: 10,
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
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeLocalStorage(cfg: SiteConfig) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch { /* quota full */ }
}

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  // Always start with DEFAULT_CONFIG so the server-rendered HTML matches the
  // first client render — reading localStorage at initial state would cause a
  // React 18 hydration mismatch on any consumer (e.g. <Pricing/>) that renders
  // conditionally based on config.
  const configRef = useRef<SiteConfig>(DEFAULT_CONFIG);
  const [config, setConfigState] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(!!db);

  const setConfig = (next: SiteConfig) => {
    configRef.current = next;
    setConfigState(next);
  };

  // Hydrate from localStorage after mount (client only)
  useEffect(() => {
    const stored = readLocalStorage();
    if (Object.keys(stored).length > 0) {
      const next = { ...DEFAULT_CONFIG, ...stored };
      setConfig(next);
    }
  }, []);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    let unsub: (() => void) | undefined;
    try {
      const ref = doc(db, 'config', 'site');
      unsub = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const next = { ...DEFAULT_CONFIG, ...snap.data() } as SiteConfig;
            setConfig(next);
            writeLocalStorage(next);
          }
          setLoading(false);
        },
        (_err) => {
          // Firestore read failed — use localStorage fallback silently
          setLoading(false);
        },
      );
    } catch (e) {
      // Firestore failed to initialise — site still works on local config
      // eslint-disable-next-line no-console
      console.warn('[Attendly] SiteConfig Firestore subscribe failed:', e);
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
