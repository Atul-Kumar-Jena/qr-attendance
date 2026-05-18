// Database adapter — currently Firestore. Swap implementation here.
// All callers import from '@/lib/db', never from specific adapters.

export type { DbUser, DbInstitution, DbMembership, DbAttendanceRecord } from './types';

export {
  getUser,
  upsertUser,
  getUsersByInstitution,
  suspendUser,
  changeUserRole,
} from './users';

export {
  createInstitution,
  getInstitution,
  getInstitutionByCode,
  getOwnedInstitution,
  setCodeActive,
  joinInstitution,
} from './institutions';
