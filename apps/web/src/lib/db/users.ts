import type { DbUser } from './types';
import { db } from '@/lib/firebase';

export async function getUser(uid: string): Promise<DbUser | null> {
  if (!db) return null;
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid: snap.id,
      email: d.email ?? '',
      displayName: d.displayName ?? null,
      photoURL: d.photoURL ?? null,
      role: d.role ?? 'student',
      institutionId: d.institutionId ?? null,
      onboardingDone: d.onboardingDone ?? false,
      suspended: d.suspended ?? false,
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as DbUser;
  } catch { return null; }
}

export async function upsertUser(uid: string, data: Partial<DbUser>): Promise<void> {
  if (!db) return;
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch { /* noop */ }
}

export async function getUsersByInstitution(institutionId: string): Promise<DbUser[]> {
  if (!db) return [];
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const q = query(collection(db, 'users'), where('institutionId', '==', institutionId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      uid: d.id, ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? '',
    } as DbUser));
  } catch { return []; }
}

export async function suspendUser(uid: string, suspended: boolean): Promise<void> {
  await upsertUser(uid, { suspended });
}

export async function changeUserRole(uid: string, role: DbUser['role']): Promise<void> {
  await upsertUser(uid, { role });
}
