import { db } from './firebase';

export type UserRole = 'developer' | 'institution' | 'admin' | 'teacher' | 'student';

export interface FSUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  institutionId?: string;
  suspended?: boolean;
  createdById?: string;
  createdAt?: unknown;
  onboardingDone?: boolean;
}

export interface FSStudent {
  id: string;
  rollNo: string;
  fullName: string;
  email?: string;
  klassName?: string;
  suspended: boolean;
  institutionId: string;
  createdAt?: unknown;
}

export interface FSTeacherPerm {
  teacherId: string;
  institutionId: string;
  canCreateSessions: boolean;
  canEndSessions: boolean;
  canViewAllAttendance: boolean;
  canManageStudents: boolean;
  canExportReports: boolean;
  canViewAuditLog: boolean;
  canManageClasses: boolean;
  canAddRemarks: boolean;
}

export interface FSRemark {
  id: string;
  teacherId: string;
  teacherName?: string;
  studentId: string;
  content: string;
  isPrivate: boolean;
  institutionId: string;
  createdAt?: unknown;
}

export interface FSInstitution {
  id: string;
  name: string;
  code?: string;
  slug?: string;
  type?: string;
  ownerId?: string;
  createdAt?: unknown;
}

type Unsub = () => void;

const DEFAULT_PERMS: Omit<FSTeacherPerm, 'teacherId' | 'institutionId'> = {
  canCreateSessions: true, canEndSessions: true, canViewAllAttendance: true,
  canManageStudents: false, canExportReports: false, canViewAuditLog: false,
  canManageClasses: false, canAddRemarks: true,
};

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function onUsers(institutionId: string | null | undefined, cb: (u: FSUser[]) => void): Unsub {
  if (!db) { cb([]); return () => {}; }
  const { collection, query, where, onSnapshot } = require('firebase/firestore');
  const ref = collection(db, 'users');
  const q = institutionId ? query(ref, where('institutionId', '==', institutionId)) : ref;
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ uid: d.id, ...d.data() } as FSUser)));
  }, () => cb([]));
}

export async function patchUser(uid: string, patch: Partial<FSUser>): Promise<void> {
  if (!db) return;
  const { doc, updateDoc, serverTimestamp } = require('firebase/firestore');
  await updateDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() });
}

export async function createPendingUser(data: Omit<FSUser, 'uid'>): Promise<void> {
  if (!db) return;
  const { doc, setDoc, serverTimestamp } = require('firebase/firestore');
  const id = `pending_${data.email?.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
  await setDoc(doc(db, 'users', id), { ...data, pending: true, createdAt: serverTimestamp() });
}

// ── Students ──────────────────────────────────────────────────────────────────

export function onStudents(institutionId: string, cb: (s: FSStudent[]) => void): Unsub {
  if (!db || !institutionId) { cb([]); return () => {}; }
  const { collection, query, where, onSnapshot } = require('firebase/firestore');
  const q = query(collection(db, 'students'), where('institutionId', '==', institutionId));
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSStudent)));
  }, () => cb([]));
}

export async function createStudent(data: Omit<FSStudent, 'id'>): Promise<void> {
  if (!db) return;
  const { collection, addDoc, serverTimestamp } = require('firebase/firestore');
  await addDoc(collection(db, 'students'), { ...data, createdAt: serverTimestamp() });
}

export async function patchStudent(id: string, patch: Partial<FSStudent>): Promise<void> {
  if (!db) return;
  const { doc, updateDoc, serverTimestamp } = require('firebase/firestore');
  await updateDoc(doc(db, 'students', id), { ...patch, updatedAt: serverTimestamp() });
}

// ── Remarks ───────────────────────────────────────────────────────────────────

export function onRemarks(studentId: string, showPrivate: boolean, cb: (r: FSRemark[]) => void): Unsub {
  if (!db || !studentId) { cb([]); return () => {}; }
  const { collection, query, where, onSnapshot } = require('firebase/firestore');
  const constraints: any[] = [where('studentId', '==', studentId)];
  if (!showPrivate) constraints.push(where('isPrivate', '==', false));
  const q = query(collection(db, 'remarks'), ...constraints);
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSRemark)));
  }, () => cb([]));
}

export async function addRemark(data: Omit<FSRemark, 'id'>): Promise<void> {
  if (!db) return;
  const { collection, addDoc, serverTimestamp } = require('firebase/firestore');
  await addDoc(collection(db, 'remarks'), { ...data, createdAt: serverTimestamp() });
}

// ── Teacher perms ─────────────────────────────────────────────────────────────

export function onTeacherPerm(teacherId: string, institutionId: string, cb: (p: FSTeacherPerm) => void): Unsub {
  if (!db || !teacherId) { cb({ teacherId, institutionId, ...DEFAULT_PERMS }); return () => {}; }
  const { doc, onSnapshot } = require('firebase/firestore');
  return onSnapshot(doc(db, 'teacherPerms', teacherId), (snap: any) => {
    cb(snap.exists() ? { teacherId: snap.id, ...snap.data() } as FSTeacherPerm : { teacherId, institutionId, ...DEFAULT_PERMS });
  }, () => cb({ teacherId, institutionId, ...DEFAULT_PERMS }));
}

export async function saveTeacherPerm(teacherId: string, perms: Partial<FSTeacherPerm>): Promise<void> {
  if (!db) return;
  const { doc, setDoc, serverTimestamp } = require('firebase/firestore');
  await setDoc(doc(db, 'teacherPerms', teacherId), { ...perms, teacherId, updatedAt: serverTimestamp() }, { merge: true });
}

// ── Institution ───────────────────────────────────────────────────────────────

export function onInstitution(institutionId: string, cb: (i: FSInstitution | null) => void): Unsub {
  if (!db || !institutionId) { cb(null); return () => {}; }
  const { doc, onSnapshot } = require('firebase/firestore');
  return onSnapshot(doc(db, 'institutions', institutionId), (snap: any) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } as FSInstitution : null);
  }, () => cb(null));
}

export async function saveInstitution(institutionId: string, data: Partial<FSInstitution>): Promise<void> {
  if (!db) return;
  const { doc, setDoc, serverTimestamp } = require('firebase/firestore');
  await setDoc(doc(db, 'institutions', institutionId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function createInstitution(
  data: Omit<FSInstitution, 'id'>,
  creatorUid?: string,
): Promise<string> {
  if (!db) throw new Error('Firebase not configured');
  const { collection, addDoc, doc, updateDoc, serverTimestamp } = require('firebase/firestore');
  const code = generateCode();
  const ref = await addDoc(collection(db, 'institutions'), {
    ...data, code, ownerId: creatorUid ?? null, createdAt: serverTimestamp(),
  });
  if (creatorUid) {
    await updateDoc(doc(db, 'users', creatorUid), {
      role: 'institution', institutionId: ref.id, onboardingDone: true, updatedAt: serverTimestamp(),
    });
  }
  return ref.id;
}

// ── All institutions (developer) ──────────────────────────────────────────────

export function onAllInstitutions(cb: (i: FSInstitution[]) => void): Unsub {
  if (!db) { cb([]); return () => {}; }
  const { collection, onSnapshot } = require('firebase/firestore');
  return onSnapshot(collection(db, 'institutions'), (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSInstitution)));
  }, () => cb([]));
}

// ── Join institution by code ──────────────────────────────────────────────────

export async function joinInstitutionByCode(
  userId: string,
  code: string,
): Promise<FSInstitution | null> {
  if (!db) throw new Error('Firebase not configured');
  const { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } = require('firebase/firestore');
  const q = query(collection(db, 'institutions'), where('code', '==', code.toUpperCase().trim()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const inst = { id: snap.docs[0].id, ...snap.docs[0].data() } as FSInstitution;
  await updateDoc(doc(db, 'users', userId), {
    institutionId: inst.id, role: 'student', onboardingDone: true, updatedAt: serverTimestamp(),
  });
  return inst;
}

// ── Check if user already owns an institution ─────────────────────────────────

export async function getOwnedInstitution(ownerId: string): Promise<FSInstitution | null> {
  if (!db) return null;
  const { collection, query, where, getDocs } = require('firebase/firestore');
  const q = query(collection(db, 'institutions'), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as FSInstitution;
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export interface FSSession {
  id: string;
  institutionId: string;
  teacherId: string;
  teacherName?: string;
  subjectName: string;
  className: string;
  status: 'OPEN' | 'CLOSED';
  startedAt?: unknown;
  endedAt?: unknown;
  attendanceCount: number;
}

export function onSessions(institutionId: string, cb: (s: FSSession[]) => void): Unsub {
  if (!db || !institutionId) { cb([]); return () => {}; }
  const { collection, query, where, orderBy, onSnapshot } = require('firebase/firestore');
  const q = query(
    collection(db, 'sessions'),
    where('institutionId', '==', institutionId),
    orderBy('startedAt', 'desc'),
  );
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSSession)));
  }, () => cb([]));
}

export async function createSession(data: Omit<FSSession, 'id' | 'startedAt'>): Promise<string> {
  if (!db) throw new Error('Firebase not configured');
  const { collection, addDoc, serverTimestamp } = require('firebase/firestore');
  const ref = await addDoc(collection(db, 'sessions'), {
    ...data, status: 'OPEN', startedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function endSession(id: string): Promise<void> {
  if (!db) return;
  const { doc, updateDoc, serverTimestamp } = require('firebase/firestore');
  await updateDoc(doc(db, 'sessions', id), { status: 'CLOSED', endedAt: serverTimestamp() });
}

export async function getSession(id: string): Promise<FSSession | null> {
  if (!db || !id) return null;
  const { doc, getDoc } = require('firebase/firestore');
  const snap = await getDoc(doc(db, 'sessions', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as FSSession : null;
}

export function onSession(id: string, cb: (s: FSSession | null) => void): Unsub {
  if (!db || !id) { cb(null); return () => {}; }
  const { doc, onSnapshot } = require('firebase/firestore');
  return onSnapshot(doc(db, 'sessions', id), (snap: any) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } as FSSession : null);
  }, () => cb(null));
}
