'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isConfigured, signInWithGoogle, signOutUser } from '@/lib/firebase';

export type Role = 'developer' | 'institution' | 'admin' | 'teacher' | 'student';

export const ROLE_WEIGHT: Record<Role, number> = {
  developer: 50, institution: 40, admin: 30, teacher: 20, student: 10,
};

export function roleAtLeast(userRole: Role | null, minRole: Role): boolean {
  if (!userRole) return false;
  return ROLE_WEIGHT[userRole] >= ROLE_WEIGHT[minRole];
}

const DEVELOPER_EMAILS: string[] = ['jenaatul8@gmail.com'];

interface AuthState {
  user: User | null;
  role: Role | null;
  // Effective institution context. For developers this returns the
  // impersonated institution if one is active, otherwise the dev's own (if any).
  institutionId: string | null;
  // The dev's actual institutionId (never the impersonation override).  Used
  // by the admin page header to detect "real" vs "acting-as" state.
  realInstitutionId: string | null;
  impersonatedInstitutionId: string | null;
  setImpersonatedInstitution: (id: string | null) => void;
  loading: boolean;
  needsOnboarding: boolean;
  markOnboardingDone: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null, role: null, institutionId: null, realInstitutionId: null,
  impersonatedInstitutionId: null, setImpersonatedInstitution: () => {},
  loading: false,
  needsOnboarding: false, markOnboardingDone: async () => {},
  signIn: async () => {}, signOut: async () => {},
});

const IMPERSONATION_KEY = 'atd_dev_impersonate_inst';

export function AuthProvider({ children, onSignIn, onSignOut }: {
  children: ReactNode;
  onSignIn?: (user: User, isNew: boolean) => void;
  onSignOut?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [realInstitutionId, setRealInstitutionId] = useState<string | null>(null);
  const [impersonatedInstitutionId, setImpersonatedInstitutionIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(isConfigured);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Hydrate impersonation from localStorage after mount (only takes effect for devs)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(IMPERSONATION_KEY);
      if (stored) setImpersonatedInstitutionIdState(stored);
    } catch {}
  }, []);

  const setImpersonatedInstitution = (id: string | null) => {
    setImpersonatedInstitutionIdState(id);
    try {
      if (id) localStorage.setItem(IMPERSONATION_KEY, id);
      else    localStorage.removeItem(IMPERSONATION_KEY);
    } catch {}
  };

  // Effective institutionId — for devs, prefer impersonation; otherwise their own.
  const institutionId = role === 'developer' && impersonatedInstitutionId
    ? impersonatedInstitutionId
    : realInstitutionId;

  useEffect(() => {
    if (!isConfigured || !auth) { setLoading(false); return; }

    let unsub: (() => void) | undefined;
    try {
      unsub = onAuthStateChanged(auth!, async (u: User | null) => {
      setUser(u);
      if (u) {
        let resolvedRole: Role | null = null;  // null = signed in but no role yet
        let resolvedInstId: string | null = null;
        let resolvedOnboarding = false;

        if (u.email && DEVELOPER_EMAILS.includes(u.email)) {
          resolvedRole = 'developer';
        } else if (db) {
          try {
            const ref = doc(db, 'users', u.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              const data = snap.data();
              const mapped: Record<string, Role> = {
                developer: 'developer', sudo_admin: 'institution', institution: 'institution',
                admin: 'admin', enterprise: 'institution', teacher: 'teacher', student: 'student',
              };
              // Only assign a role if the user has completed onboarding
              const hasRole = data?.role && mapped[data.role as string];
              resolvedRole = hasRole ? mapped[data.role as string] : null;
              resolvedInstId = data?.institutionId ?? null;
              // Show onboarding if not explicitly marked done AND no institutionId assigned
              resolvedOnboarding = !data?.onboardingDone && !data?.institutionId;
            } else {
              // Brand-new user: create stub WITHOUT a role — onboarding assigns it
              await setDoc(ref, {
                uid: u.uid, email: u.email, displayName: u.displayName,
                photoURL: u.photoURL, role: null, createdAt: serverTimestamp(),
              });
              resolvedOnboarding = true;
            }
          } catch { /* Firestore failed — keep role null, skip onboarding */ }
        }
        setRole(resolvedRole);
        setRealInstitutionId(resolvedInstId);
        setNeedsOnboarding(resolvedOnboarding);
      } else {
        setRole(null);
        setRealInstitutionId(null);
        setNeedsOnboarding(false);
      }
      setLoading(false);
    });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Attendly] Auth init failed:', e);
      setLoading(false);
    }
    return () => { try { unsub?.(); } catch {} };
  }, []);

  const signIn = async () => {
    if (!isConfigured) return;
    const u = await signInWithGoogle();
    let isNew = false;
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        isNew = !snap.exists();
      } catch { /* non-critical */ }
    }
    onSignIn?.(u, isNew);
  };

  const signOut = async () => { await signOutUser(); onSignOut?.(); };

  const markOnboardingDone = async () => {
    setNeedsOnboarding(false);
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { onboardingDone: true });
      // Re-fetch role so it reflects the role assigned during onboarding
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const mapped: Record<string, Role> = {
          developer: 'developer', sudo_admin: 'institution', institution: 'institution',
          admin: 'admin', enterprise: 'institution', teacher: 'teacher', student: 'student',
        };
        if (data?.role && mapped[data.role as string]) {
          setRole(mapped[data.role as string]);
        }
        setRealInstitutionId(data?.institutionId ?? null);
      }
    } catch { /* silent */ }
  };

  return (
    <AuthContext.Provider value={{
      user, role, institutionId, realInstitutionId,
      impersonatedInstitutionId, setImpersonatedInstitution,
      loading, needsOnboarding, markOnboardingDone, signIn, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
