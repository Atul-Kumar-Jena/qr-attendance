'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth, db, isConfigured, signInWithGoogle, signOutUser } from '@/lib/firebase';

export type Role = 'developer' | 'institution' | 'admin' | 'teacher' | 'student';

// Numeric weight for hierarchy checks — mirrors the API's roleLevel()
export const ROLE_WEIGHT: Record<Role, number> = {
  developer:   50,
  institution: 40,
  admin:       30,
  teacher:     20,
  student:     10,
};

export function roleAtLeast(userRole: Role | null, minRole: Role): boolean {
  if (!userRole) return false;
  return ROLE_WEIGHT[userRole] >= ROLE_WEIGHT[minRole];
}

// Developer email — gets the god-mode role automatically
const DEVELOPER_EMAILS: string[] = ['jenaatul8@gmail.com'];

interface AuthState {
  user: User | null;
  role: Role | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children, onSignIn, onSignOut }: {
  children: ReactNode;
  onSignIn?: (user: User, isNew: boolean) => void;
  onSignOut?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const { onAuthStateChanged } = require('firebase/auth');
    const { doc, getDoc, setDoc, serverTimestamp } = require('firebase/firestore');

    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      setUser(u);
      if (u) {
        let resolvedRole: Role = 'student';
        if (u.email && DEVELOPER_EMAILS.includes(u.email)) {
          resolvedRole = 'developer';
        } else if (db) {
          try {
            const ref = doc(db, 'users', u.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              const stored = snap.data()?.role as string;
              // Map old role names to new ones for backwards compat
              const mapped: Record<string, Role> = {
                developer: 'developer',
                sudo_admin: 'institution',
                institution: 'institution',
                admin: 'admin',
                enterprise: 'institution',
                teacher: 'teacher',
                student: 'student',
              };
              resolvedRole = mapped[stored] ?? 'student';
            } else {
              await setDoc(ref, {
                uid: u.uid,
                email: u.email,
                displayName: u.displayName,
                photoURL: u.photoURL,
                role: 'student',
                createdAt: serverTimestamp(),
              });
              resolvedRole = 'student';
            }
          } catch {
            resolvedRole = 'student';
          }
        }
        setRole(resolvedRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signIn = async () => {
    if (!isConfigured) return;
    const { doc, getDoc } = require('firebase/firestore');
    const u = await signInWithGoogle();
    let isNew = false;
    if (db) {
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        isNew = !snap.exists();
      } catch { /* ignore */ }
    }
    onSignIn?.(u, isNew);
  };

  const signOut = async () => {
    await signOutUser();
    onSignOut?.();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
