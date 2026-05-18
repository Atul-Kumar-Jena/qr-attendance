// ─── Database abstraction types ────────────────────────────────────────────
// These interfaces define the DB schema. Currently backed by Firestore.
// To swap to SQLite/Postgres: implement the functions in the appropriate
// adapter and re-export from index.ts.

export interface DbUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'developer' | 'institution' | 'admin' | 'teacher' | 'student';
  institutionId: string | null;
  onboardingDone: boolean;
  suspended: boolean;
  createdAt: string; // ISO date string
}

export interface DbInstitution {
  id: string;
  name: string;
  code: string;           // 6-char alphanumeric join code
  type: string;           // 'school' | 'college' | 'coaching' | 'corporate' | 'other'
  ownerId: string;        // uid of creator
  codeActive: boolean;    // admin can revoke/reactivate
  createdAt: string;
}

export interface DbMembership {
  uid: string;
  institutionId: string;
  role: 'student' | 'teacher' | 'admin';
  joinedAt: string;
}

export interface DbAttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  institutionId: string;
  markedAt: string;
  method: 'qr' | 'manual';
}

// ── SQLite schema (for future migration) ─────────────────────────────────
// CREATE TABLE users (
//   uid TEXT PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   display_name TEXT,
//   photo_url TEXT,
//   role TEXT NOT NULL DEFAULT 'student',
//   institution_id TEXT,
//   onboarding_done INTEGER DEFAULT 0,
//   suspended INTEGER DEFAULT 0,
//   created_at TEXT DEFAULT CURRENT_TIMESTAMP
// );
// CREATE TABLE institutions (
//   id TEXT PRIMARY KEY,
//   name TEXT NOT NULL,
//   code TEXT UNIQUE NOT NULL,
//   type TEXT NOT NULL DEFAULT 'school',
//   owner_id TEXT NOT NULL,
//   code_active INTEGER DEFAULT 1,
//   created_at TEXT DEFAULT CURRENT_TIMESTAMP
// );
// CREATE TABLE memberships (
//   uid TEXT NOT NULL,
//   institution_id TEXT NOT NULL,
//   role TEXT NOT NULL DEFAULT 'student',
//   joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY(uid, institution_id)
// );
