'use client';
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { db } from '@/lib/firebase';

export type PricingMode = 'LIMITED_OFFER' | 'PAID';

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
  geofencingEnabled: true,
  deviceBindingEnabled: true,
  attestationEnabled: false,
  mockLocationDetection: true,
  qrRotationEnabled: true,
  maintenanceMode: false,
  defaultQrRotationSec: 7,
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
  // Use ref so save() closure always reads latest config without stale state
  const configRef = useRef<SiteConfig>({ ...DEFAULT_CONFIG, ...readLocalStorage() });
  const [config, setConfigState] = useState<SiteConfig>(configRef.current);
  const [loading, setLoading] = useState(!!db);

  const setConfig = (next: SiteConfig) => {
    configRef.current = next;
    setConfigState(next);
  };

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const { doc, onSnapshot } = require('firebase/firestore');
    const ref = doc(db, 'config', 'site');
    const unsub = onSnapshot(
      ref,
      (snap: { exists: () => boolean; data: () => Record<string, unknown> }) => {
        if (snap.exists()) {
          const next = { ...DEFAULT_CONFIG, ...snap.data() } as SiteConfig;
          setConfig(next);
          writeLocalStorage(next);
        }
        setLoading(false);
      },
      (_err: unknown) => {
        // Firestore read failed — use localStorage fallback silently
        setLoading(false);
      },
    );
    return () => unsub();
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
      // Revert optimistic update on failure
      setConfig(configRef.current);
      writeLocalStorage(configRef.current);
      return {
        ok: false,
        error: msg.includes('permission') || msg.includes('Permission')
          ? 'Firestore permission denied. Add the rule below to Firebase Console → Firestore → Rules:\n\nmatch /config/{docId} {\n  allow read: if true;\n  allow write: if request.auth != null;\n}'
          : `Save failed: ${msg}`,
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
