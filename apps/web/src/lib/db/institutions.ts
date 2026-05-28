import type { DbInstitution } from './types';
import { db } from '@/lib/firebase';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function createInstitution(
  data: { name: string; type: string },
  ownerId: string,
): Promise<string> {
  if (!db) throw new Error('Database not available');
  const { doc, setDoc, collection, serverTimestamp } = await import('firebase/firestore');
  const id = doc(collection(db, 'institutions')).id;
  const code = generateCode();
  await setDoc(doc(db, 'institutions', id), {
    name: data.name,
    type: data.type,
    code,
    ownerId,
    codeActive: true,
    createdAt: serverTimestamp(),
  });
  // Update owner's user record
  const { updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'users', ownerId), {
    role: 'institution',
    institutionId: id,
    onboardingDone: true,
  }).catch(() => {});
  return id;
}

export async function getInstitution(id: string): Promise<DbInstitution | null> {
  if (!db) return null;
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'institutions', id));
    if (!snap.exists()) return null;
    const d = snap.data();
    return { id: snap.id, ...d, createdAt: d.createdAt?.toDate?.()?.toISOString() ?? '' } as DbInstitution;
  } catch { return null; }
}

export async function getInstitutionByCode(code: string): Promise<DbInstitution | null> {
  if (!db) return null;
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const q = query(
      collection(db, 'institutions'),
      where('code', '==', code.toUpperCase()),
      where('codeActive', '==', true),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0].data();
    return { id: snap.docs[0].id, ...d, createdAt: d.createdAt?.toDate?.()?.toISOString() ?? '' } as DbInstitution;
  } catch { return null; }
}

export async function getOwnedInstitution(ownerId: string): Promise<DbInstitution | null> {
  if (!db) return null;
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const q = query(collection(db, 'institutions'), where('ownerId', '==', ownerId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0].data();
    return { id: snap.docs[0].id, ...d, createdAt: d.createdAt?.toDate?.()?.toISOString() ?? '' } as DbInstitution;
  } catch { return null; }
}

export async function setCodeActive(institutionId: string, active: boolean): Promise<void> {
  if (!db) return;
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'institutions', institutionId), { codeActive: active });
  } catch { /* noop */ }
}

export async function joinInstitution(
  uid: string,
  code: string,
  joinAs: 'student' | 'teacher',
): Promise<DbInstitution> {
  const inst = await getInstitutionByCode(code);
  if (!inst) throw new Error('Institution not found or code inactive. Check the code and try again.');
  if (!db) throw new Error('Database not available');
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'users', uid), {
    institutionId: inst.id,
    role: joinAs,
    onboardingDone: true,
  });
  return inst;
}
