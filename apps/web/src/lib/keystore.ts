/**
 * Higher-level key management on top of idb.putKey/getKey.
 *
 * Two key roles:
 *   - institution key: signs every rotating QR token
 *   - device key:      signs attendance proofs from a student device
 */

import { generateKeyPair, type KeyPairExport } from './crypto';
import { getKey, putKey, deleteKey, listKeys, type StoredKey } from './idb';
import { publishInstitutionPublicKey } from './firestore-db';

function instKeyId(institutionId: string): string {
  return `inst:${institutionId}`;
}

const DEVICE_KEY_ID = 'device:self';

export async function getOrCreateInstitutionKeys(
  institutionId: string,
): Promise<StoredKey> {
  const id = instKeyId(institutionId);
  const existing = await getKey(id);
  if (existing) return existing;
  const kp = await generateKeyPair();
  const rec: StoredKey = { id, ...kp };
  await putKey(rec);
  // Publish just the public half so student devices can verify QR tokens
  try {
    await publishInstitutionPublicKey({
      institutionId,
      algo: kp.algo,
      publicKey: kp.publicKey,
      fingerprint: kp.publicKey.slice(0, 16),
    });
  } catch { /* offline or rules block — local key still works */ }
  return rec;
}

export async function getInstitutionKeys(
  institutionId: string,
): Promise<StoredKey | undefined> {
  return getKey(instKeyId(institutionId));
}

export async function rotateInstitutionKeys(
  institutionId: string,
): Promise<StoredKey> {
  const previous = await getInstitutionKeys(institutionId);
  const kp = await generateKeyPair();
  const rec: StoredKey = {
    id: instKeyId(institutionId),
    ...kp,
    meta: { rotatedFrom: previous?.publicKey?.slice(0, 16) || null },
  };
  await putKey(rec);
  try {
    await publishInstitutionPublicKey({
      institutionId,
      algo: kp.algo,
      publicKey: kp.publicKey,
      fingerprint: kp.publicKey.slice(0, 16),
      rotatedFrom: previous?.publicKey?.slice(0, 16) || null,
    });
  } catch {}
  return rec;
}

export async function getOrCreateDeviceKeys(): Promise<StoredKey> {
  const existing = await getKey(DEVICE_KEY_ID);
  if (existing) return existing;
  const kp = await generateKeyPair();
  const rec: StoredKey = { id: DEVICE_KEY_ID, ...kp };
  await putKey(rec);
  return rec;
}

export async function getDeviceKeys(): Promise<StoredKey | undefined> {
  return getKey(DEVICE_KEY_ID);
}

export async function listAllKeys(): Promise<StoredKey[]> {
  return listKeys();
}

export async function purgeKey(id: string): Promise<void> {
  await deleteKey(id);
}

export function exportKeyForShare(k: StoredKey): {
  algo: string;
  publicKey: string;
  fingerprint: string;
  createdAt: number;
} {
  return {
    algo: k.algo,
    publicKey: k.publicKey,
    fingerprint: k.publicKey.slice(0, 16),
    createdAt: k.createdAt,
  };
}

export type { StoredKey, KeyPairExport };
