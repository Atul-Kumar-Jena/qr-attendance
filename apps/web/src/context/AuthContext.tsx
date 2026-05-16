'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
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
  institutionId: string | null;
  loading: boolean;
  needsOnboarding: boolean;
  markOnboardingDone: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null, role: null, institutionId: null, loading: false,
  needsOnboarding: false, markOnboardingDone: () => {},
  signIn: async () => {}, signOut: async () => {},
});

export function AuthProvider({ children, onSignIn, onSignOut }: {
  children: ReactNode;
  onSignIn?: (user: User, isNew: boolean) => void;
  onSignOut?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isConfigured);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!isConfigured || !auth) { setLoading(false); return; }

    const { onAuthStateChanged } = require('firebase/auth');
    const { doc, getDoc, setDoc, serverTimestamp } = require('firebase/firestore');

    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      setUser(u);
      if (u) {
        let resolvedRole: Role = 'student';
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
              resolvedRole = mapped[data?.role as string] ?? 'student';
              resolvedInstId = data?.institutionId ?? null;
              // Show onboarding if not done and user has no institution assigned
              resolvedOnboarding = !data?.onboardingDone && !data?.institutionId;
            } else {
              await setDoc(ref, {
                uid: u.uid, email: u.email, displayName: u.displayName,
                photoURL: u.photoURL, role: 'student', createdAt: serverTimestamp(),
              });
              resolvedOnboarding = true;
            }
          } catch { resolvedRole = 'student'; }
        }
        setRole(resolvedRole);
        setInstitutionId(resolvedInstId);
        setNeedsOnboarding(resolvedOnboarding);
      } else {
        setRole(null);
        setInstitutionId(null);
        setNeedsOnboarding(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async () => {
    if (!isConfigured) return;
    const u = await signInWithGoogle(); // throws on popup cancel / network error — let caller handle
    let isNew = false;
    if (db) {
      try {
        const { doc, getDoc } = require('firebase/firestore');
        const snap = await getDoc(doc(db, 'users', u.uid));
        isNew = !snap.exists();
      } catch { /* non-critical — isNew stays false */ }
    }
    onSignIn?.(u, isNew);
  };

  const signOut = async () => { await signOutUser(); onSignOut?.(); };

  const markOnboardingDone = () => {
    setNeedsOnboarding(false);
    if (user && db) {
      const { doc, updateDoc } = require('firebase/firestore');
      updateDoc(doc(db, 'users', user.uid), { onboardingDone: true }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, institutionId, loading, needsOnboarding, markOnboardingDone, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
