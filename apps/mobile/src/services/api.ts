/**
 * Mobile API client — handles request signing, token refresh, and the
 * device fingerprint header expected by the server.
 */
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.attendly.app/v1';

// In production this key is provisioned per-install via attestation handshake.
// For dev we use a build-time value matching the API's APP_REQUEST_KEY.
const APP_KEY = process.env.EXPO_PUBLIC_APP_KEY ?? 'dev-app-key';

async function hmac(message: string): Promise<string> {
  // expo-crypto exposes a digest; for brevity using a polyfill here.
  // Replace with `expo-crypto` `digestStringAsync` + manual HMAC, or a
  // native module for production.
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(APP_KEY),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return base64url(new Uint8Array(sig));
}

function base64url(buf: Uint8Array): string {
  let s = '';
  buf.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signedFetch(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<Response> {
  const url = `${BASE}${path}`;
  const ts = String(Math.floor(Date.now() / 1000));
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const body = typeof init.body === 'string' ? init.body : JSON.stringify(init.body ?? {});

  const sig = await hmac(
    `${init.method ?? 'POST'}\n${path}\n${body}\n${ts}\n${nonce}`,
  );

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-app-signature': sig,
    'x-app-timestamp': ts,
    'x-app-nonce': nonce,
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (init.auth) {
    const token = await SecureStore.getItemAsync('access');
    if (token) headers.authorization = `Bearer ${token}`;
  }

  return fetch(url, { ...init, body, headers });
}

export async function deviceInfo() {
  const id = (await Application.getIosIdForVendorAsync()) ??
             Application.androidId ?? 'unknown';
  return {
    id,
    fingerprint: id, // production: combine multiple stable signals
    platform: Platform.OS as 'ios' | 'android',
    model: Device.modelName ?? undefined,
    osVersion: Device.osVersion ?? undefined,
    appInstanceId: Application.getInstallationTimeAsync ? '' : undefined,
  };
}

export async function loginStudent(args: {
  institutionCode: string; rollNo: string; password: string;
}) {
  const device = await deviceInfo();
  const res = await signedFetch('/auth/student/login', {
    method: 'POST',
    body: JSON.stringify({ ...args, device }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const data = await res.json();
  await SecureStore.setItemAsync('access', data.accessToken);
  await SecureStore.setItemAsync('refresh', data.refreshToken);
  return data;
}

export async function scan(args: {
  token: string;
  location: { lat: number; lng: number; accuracyM?: number; mock?: boolean };
}) {
  const device = await deviceInfo();
  const res = await signedFetch('/attendance/scan', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({
      token: args.token,
      location: args.location,
      deviceId: device.id,
      deviceFingerprint: device.fingerprint,
    }),
  });
  return res.json();
}
