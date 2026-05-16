'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '@/lib/firebase';

export interface SiteConfig {
  siteTitle: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
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

interface SiteConfigState {
  config: SiteConfig;
  loading: boolean;
  save: (patch: Partial<SiteConfig>) => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigState>({
  config: DEFAULT_CONFIG,
  loading: false,
  save: async () => {},
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const { doc, onSnapshot } = require('firebase/firestore');
    const ref = doc(db, 'config', 'site');
    const unsub = onSnapshot(ref, (snap: { exists: () => boolean; data: () => Record<string, unknown> }) => {
      if (snap.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...snap.data() } as SiteConfig);
      }
      setLoading(false);
    }, () => setLoading(false));
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

  const save = async (patch: Partial<SiteConfig>) => {
    if (!db) {
      setConfig(c => ({ ...c, ...patch }));
      return;
    }
    const { doc, setDoc, serverTimestamp } = require('firebase/firestore');
    const next = { ...config, ...patch };
    setConfig(next);
    await setDoc(doc(db, 'config', 'site'), { ...next, updatedAt: serverTimestamp() }, { merge: true });
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
