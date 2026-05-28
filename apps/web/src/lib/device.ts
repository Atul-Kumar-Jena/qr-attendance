/**
 * Stable device fingerprint + persistent device id.
 *
 * The fingerprint mixes:
 *   - userAgent
 *   - screen dimensions + colorDepth + pixelRatio
 *   - timezone offset
 *   - canvas pixel-hash (cheap rasterization fingerprint)
 *   - WebGL renderer (when available)
 *
 * A random salt persisted in IndexedDB is hashed in so the same browser
 * on the same hardware returns the same id, but different installs
 * (e.g. private windows) return different ids — exactly the property
 * we want for device-binding QR attendance.
 */

import { sha256Hex } from './crypto';
import { getMeta, putMeta } from './idb';

const META_KEY = 'device_salt_v1';
const ID_KEY = 'device_id_v1';

function canvasFingerprint(): string {
  try {
    const c = document.createElement('canvas');
    c.width = 220;
    c.height = 40;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 220, 40);
    ctx.fillStyle = '#069';
    ctx.fillText('Attendly device-fp:', 2, 2);
    ctx.strokeStyle = 'rgba(0,200,0,0.6)';
    ctx.beginPath();
    ctx.arc(50, 25, 10, 0, Math.PI * 2);
    ctx.stroke();
    return c.toDataURL().slice(0, 96);
  } catch {
    return '';
  }
}

function glRenderer(): string {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return '';
    return String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL ?? 0) || '');
  } catch {
    return '';
  }
}

function rawFingerprint(salt: string): string {
  if (typeof window === 'undefined') return salt;
  const parts = [
    salt,
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    String(window.devicePixelRatio || 1),
    String(new Date().getTimezoneOffset()),
    canvasFingerprint(),
    glRenderer(),
  ];
  return parts.join('|');
}

async function ensureSalt(): Promise<string> {
  try {
    const existing = await getMeta<string>(META_KEY);
    if (existing) return existing;
  } catch {}
  // Use Web Crypto random to seed; never reused across browsers
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  const salt = Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
  try { await putMeta(META_KEY, salt); } catch {}
  return salt;
}

export interface DeviceInfo {
  id: string;
  shortId: string;
  ua: string;
  screen: string;
  timezone: string;
  glRenderer: string;
  createdAt: number;
}

let cachedInfo: DeviceInfo | null = null;

export async function getDeviceInfo(): Promise<DeviceInfo> {
  if (cachedInfo) return cachedInfo;
  const salt = await ensureSalt();
  const id = await sha256Hex(rawFingerprint(salt));
  const stamp = (await getMeta<number>(ID_KEY)) || Date.now();
  try { await putMeta(ID_KEY, stamp); } catch {}
  cachedInfo = {
    id,
    shortId: id.slice(0, 12),
    ua: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : '',
    screen: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '',
    timezone:
      typeof Intl !== 'undefined'
        ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '')
        : '',
    glRenderer: glRenderer().slice(0, 60),
    createdAt: stamp,
  };
  return cachedInfo;
}

export async function getDeviceId(): Promise<string> {
  return (await getDeviceInfo()).id;
}

// Geolocation (one-shot, returns null on failure or permission denied)
export interface DeviceGeo {
  lat: number;
  lng: number;
  accuracy: number;
  ts: number;
}

export function getCurrentLocation(timeoutMs = 8000): Promise<DeviceGeo | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    const t = setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(t);
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          ts: Date.now(),
        });
      },
      () => {
        clearTimeout(t);
        resolve(null);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: timeoutMs },
    );
  });
}
