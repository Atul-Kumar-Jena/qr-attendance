import { db } from './firebase';
import {
  collection, query, where, orderBy, limit,
  doc, getDoc, getDocs,
  setDoc, addDoc, updateDoc, deleteDoc, writeBatch,
  onSnapshot, serverTimestamp, increment,
} from 'firebase/firestore';

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
  const ref = collection(db, 'users');
  const q = institutionId ? query(ref, where('institutionId', '==', institutionId)) : ref;
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ uid: d.id, ...d.data() } as FSUser)));
  }, () => cb([]));
}

export async function patchUser(uid: string, patch: Partial<FSUser>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() });
}

export async function createPendingUser(data: Omit<FSUser, 'uid'>): Promise<void> {
  if (!db) return;
  const id = `pending_${data.email?.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
  await setDoc(doc(db, 'users', id), { ...data, pending: true, createdAt: serverTimestamp() });
}

// ── Students ──────────────────────────────────────────────────────────────────

export function onStudents(institutionId: string, cb: (s: FSStudent[]) => void): Unsub {
  if (!db || !institutionId) { cb([]); return () => {}; }
  const q = query(collection(db, 'students'), where('institutionId', '==', institutionId));
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSStudent)));
  }, () => cb([]));
}

export async function createStudent(data: Omit<FSStudent, 'id'>): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, 'students'), { ...data, createdAt: serverTimestamp() });
}

export async function patchStudent(id: string, patch: Partial<FSStudent>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'students', id), { ...patch, updatedAt: serverTimestamp() });
}

// ── Remarks ───────────────────────────────────────────────────────────────────

export function onRemarks(studentId: string, showPrivate: boolean, cb: (r: FSRemark[]) => void): Unsub {
  if (!db || !studentId) { cb([]); return () => {}; }
  const constraints: any[] = [where('studentId', '==', studentId)];
  if (!showPrivate) constraints.push(where('isPrivate', '==', false));
  const q = query(collection(db, 'remarks'), ...constraints);
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSRemark)));
  }, () => cb([]));
}

export async function addRemark(data: Omit<FSRemark, 'id'>): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, 'remarks'), { ...data, createdAt: serverTimestamp() });
}

// ── Teacher perms ─────────────────────────────────────────────────────────────

export function onTeacherPerm(teacherId: string, institutionId: string, cb: (p: FSTeacherPerm) => void): Unsub {
  if (!db || !teacherId) { cb({ teacherId, institutionId, ...DEFAULT_PERMS }); return () => {}; }
  return onSnapshot(doc(db, 'teacherPerms', teacherId), (snap: any) => {
    cb(snap.exists() ? { teacherId: snap.id, ...snap.data() } as FSTeacherPerm : { teacherId, institutionId, ...DEFAULT_PERMS });
  }, () => cb({ teacherId, institutionId, ...DEFAULT_PERMS }));
}

export async function saveTeacherPerm(teacherId: string, perms: Partial<FSTeacherPerm>): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'teacherPerms', teacherId), { ...perms, teacherId, updatedAt: serverTimestamp() }, { merge: true });
}

// ── Institution ───────────────────────────────────────────────────────────────

export function onInstitution(institutionId: string, cb: (i: FSInstitution | null) => void): Unsub {
  if (!db || !institutionId) { cb(null); return () => {}; }
  return onSnapshot(doc(db, 'institutions', institutionId), (snap: any) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } as FSInstitution : null);
  }, () => cb(null));
}

export async function saveInstitution(institutionId: string, data: Partial<FSInstitution>): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'institutions', institutionId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function createInstitution(
  data: Omit<FSInstitution, 'id'>,
  creatorUid?: string,
): Promise<string> {
  if (!db) throw new Error('Firebase not configured');
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
  return onSnapshot(collection(db, 'institutions'), (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSInstitution)));
  }, () => cb([]));
}

// Developer-only terminate: marks institution terminated and detaches all
// members (sets role to 'student' with no institutionId so they can rejoin
// elsewhere). Audit row is written for the dev who pulled the trigger.
export async function terminateInstitution(institutionId: string, actorUid: string, actorName?: string): Promise<void> {
  if (!db) throw new Error('Firebase not configured');
  // 1) detach members
  const usersSnap = await getDocs(query(collection(db, 'users'), where('institutionId', '==', institutionId)));
  const batch = writeBatch(db);
  usersSnap.forEach((u: any) => {
    batch.update(u.ref, { institutionId: null, role: 'student', updatedAt: serverTimestamp() });
  });
  await batch.commit();
  // 2) write audit (one-day retention is a Firestore TTL policy you configure
  //    in console on the auditLogs collection; documented in FIREBASE_SETUP.md)
  await logAudit({
    institutionId, actorId: actorUid, actorName: actorName ?? '',
    action: 'INSTITUTION_TERMINATED', targetId: institutionId,
    details: `Terminated by developer; ${usersSnap.size} members detached.`,
  });
  // 3) delete the institution doc itself
  await deleteDoc(doc(db, 'institutions', institutionId));
}

// ── Join institution by code ──────────────────────────────────────────────────

export async function joinInstitutionByCode(
  userId: string,
  code: string,
  joiningRole: 'student' | 'teacher' = 'student',
): Promise<FSInstitution | null> {
  if (!db) throw new Error('Firebase not configured');
  const q = query(collection(db, 'institutions'), where('code', '==', code.toUpperCase().trim()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const inst = { id: snap.docs[0].id, ...snap.docs[0].data() } as FSInstitution;
  await updateDoc(doc(db, 'users', userId), {
    institutionId: inst.id, role: joiningRole, onboardingDone: true, updatedAt: serverTimestamp(),
  });
  return inst;
}

// ── Leave institution (resets role & institutionId so user can re-onboard) ────

export async function leaveInstitution(userId: string): Promise<void> {
  if (!db) throw new Error('Firebase not configured');
  await updateDoc(doc(db, 'users', userId), {
    institutionId: null, role: null, onboardingDone: false, updatedAt: serverTimestamp(),
  });
}

// ── Check if user already owns an institution ─────────────────────────────────

export async function getOwnedInstitution(ownerId: string): Promise<FSInstitution | null> {
  if (!db) return null;
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
  const ref = await addDoc(collection(db, 'sessions'), {
    ...data, status: 'OPEN', startedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function endSession(id: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'sessions', id), { status: 'CLOSED', endedAt: serverTimestamp() });
}

// ── Audit logs ────────────────────────────────────────────────────────────────

export interface FSAuditLog {
  id: string;
  institutionId: string;
  actorId: string;
  actorName?: string;
  action: string;
  targetId?: string;
  targetName?: string;
  details?: string;
  createdAt?: unknown;
}

export async function logAudit(entry: Omit<FSAuditLog, 'id'>): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, 'auditLogs'), { ...entry, createdAt: serverTimestamp() }).catch(() => {});
}

export function onAuditLogs(institutionId: string, cb: (logs: FSAuditLog[]) => void): Unsub {
  if (!db || !institutionId) { cb([]); return () => {}; }
  const q = query(
    collection(db, 'auditLogs'),
    where('institutionId', '==', institutionId),
    orderBy('createdAt', 'desc'),
    limit(200),
  );
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSAuditLog)));
  }, () => cb([]));
}

// ── Classes ───────────────────────────────────────────────────────────────────

export interface FSClass {
  id: string;
  institutionId: string;
  name: string;
  section?: string;
  description?: string;
  teacherId?: string;
  studentCount?: number;
  joinCode?: string;
  createdAt?: unknown;
}

export interface FSClassMember {
  id: string;
  classId: string;
  institutionId: string;
  userId: string;
  joinedAt?: unknown;
}

export function onClasses(institutionId: string, cb: (c: FSClass[]) => void): Unsub {
  if (!db || !institutionId) { cb([]); return () => {}; }
  const q = query(
    collection(db, 'classes'),
    where('institutionId', '==', institutionId),
    orderBy('name', 'asc'),
  );
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSClass)));
  }, () => cb([]));
}

export async function createClass(data: Omit<FSClass, 'id' | 'joinCode'>): Promise<string> {
  if (!db) throw new Error('Firebase not configured');
  const joinCode = generateCode();
  const ref = await addDoc(collection(db, 'classes'), { ...data, joinCode, createdAt: serverTimestamp() });
  return ref.id;
}

// Student joins a class by its join code
export async function joinClassByCode(userId: string, code: string, institutionId: string): Promise<FSClass | null> {
  if (!db) throw new Error('Firebase not configured');
  const q = query(collection(db, 'classes'), where('joinCode', '==', code.toUpperCase().trim()), where('institutionId', '==', institutionId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const cls = { id: snap.docs[0].id, ...snap.docs[0].data() } as FSClass;
  // Check not already a member
  const existing = await getDocs(query(collection(db, 'classMembers'), where('classId', '==', cls.id), where('userId', '==', userId)));
  if (existing.empty) {
    await addDoc(collection(db, 'classMembers'), { classId: cls.id, institutionId, userId, joinedAt: serverTimestamp() });
    await updateDoc(doc(db, 'classes', cls.id), { studentCount: increment(1) });
  }
  return cls;
}

// Get all classes a user is a member of (for student dashboard)
export function onStudentClasses(userId: string, cb: (c: FSClass[]) => void): Unsub {
  if (!db || !userId) { cb([]); return () => {}; }
  const q = query(collection(db, 'classMembers'), where('userId', '==', userId));
  let memberUnsub: (() => void) | undefined;
  const unsub = onSnapshot(q, async (memberSnap: any) => {
    const classIds: string[] = memberSnap.docs.map((d: any) => d.data().classId);
    if (classIds.length === 0) { cb([]); return; }
    // Fetch each class doc (Firebase doesn't support `in` queries on IDs easily without batching)
    try {
      const classDocs = await Promise.all(classIds.map((id: string) => getDoc(doc(db!, 'classes', id))));
      cb(classDocs.filter((d: any) => d.exists()).map((d: any) => ({ id: d.id, ...d.data() } as FSClass)));
    } catch { cb([]); }
  }, () => cb([]));
  return () => { unsub(); memberUnsub?.(); };
}

export async function patchClass(id: string, patch: Partial<FSClass>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'classes', id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteClass(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'classes', id));
}

export async function getSession(id: string): Promise<FSSession | null> {
  if (!db || !id) return null;
  const snap = await getDoc(doc(db, 'sessions', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as FSSession : null;
}

export function onSession(id: string, cb: (s: FSSession | null) => void): Unsub {
  if (!db || !id) { cb(null); return () => {}; }
  return onSnapshot(doc(db, 'sessions', id), (snap: any) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } as FSSession : null);
  }, () => cb(null));
}

// ── Attendance Records ────────────────────────────────────────────────────────

export interface FSAttendanceRecord {
  id: string;
  sessionId: string;
  institutionId: string;
  studentId?: string;
  studentName?: string;
  rollNo?: string;
  scannedAt?: unknown;
}

export async function recordAttendance(data: Omit<FSAttendanceRecord, 'id'>): Promise<string> {
  if (!db) throw new Error('Firebase not configured');
  const ref = await addDoc(collection(db, 'attendanceRecords'), { ...data, scannedAt: serverTimestamp() });
  // Increment the session count atomically
  await updateDoc(doc(db, 'sessions', data.sessionId), { attendanceCount: increment(1) });
  return ref.id;
}

export function onAttendanceRecords(sessionId: string, cb: (r: FSAttendanceRecord[]) => void): Unsub {
  if (!db || !sessionId) { cb([]); return () => {}; }
  const q = query(
    collection(db, 'attendanceRecords'),
    where('sessionId', '==', sessionId),
    orderBy('scannedAt', 'desc'),
  );
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSAttendanceRecord)));
  }, () => cb([]));
}

export function onStudentAttendance(studentId: string, institutionId: string, cb: (r: FSAttendanceRecord[]) => void): Unsub {
  if (!db || !studentId) { cb([]); return () => {}; }
  const q = query(
    collection(db, 'attendanceRecords'),
    where('studentId', '==', studentId),
    where('institutionId', '==', institutionId),
    orderBy('scannedAt', 'desc'),
    limit(100),
  );
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as FSAttendanceRecord)));
  }, () => cb([]));
}
