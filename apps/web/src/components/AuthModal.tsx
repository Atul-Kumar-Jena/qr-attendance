'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isConfigured } from '@/lib/firebase';

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  developer:   { label: 'Developer',   color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  institution: { label: 'Institution', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  admin:       { label: 'Admin',       color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  teacher:     { label: 'Teacher',     color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  student:     { label: 'Student',     color: 'bg-ink/10 text-ink-mute border-ink/20' },
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

interface AuthModalProps {
  trigger: ReactNode;
}

export function AuthModal({ trigger }: AuthModalProps) {
  const { user, role, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setBusy(true);
    setError('');
    try {
      await signIn();
      setOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? (e as Error & { code?: string }).code ?? e.message : 'Sign-in failed';
      const isCancelled = msg.includes('popup-closed-by-user') || msg.includes('popup-closed') || msg.includes('cancelled');
      setError(isCancelled ? 'Sign-in cancelled.' : msg);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const badge = role ? ROLE_BADGE[role] : null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-ink/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl border border-ink/10 bg-cream-50 p-8 shadow-2xl dark:bg-[#0C1C14] dark:border-white/8 focus:outline-none"
          aria-describedby="auth-modal-desc"
        >
          <Dialog.Title className="font-display text-[1.6rem] leading-tight mb-1">
            {user ? 'Your account' : 'Welcome back'}
          </Dialog.Title>
          <Dialog.Description id="auth-modal-desc" className="text-[13px] text-ink-mute mb-6">
            {user
              ? 'Manage your Attendly account.'
              : 'Sign in to access your dashboard and manage attendance sessions.'}
          </Dialog.Description>

          {user ? (
            <div className="space-y-4">
              {/* Avatar + info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-cream-100 dark:bg-[#07140E] border border-ink/6">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || ''}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-[15px] flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-medium text-[14px] text-ink truncate">{user.displayName}</div>
                  <div className="text-[12px] text-ink-mute truncate">{user.email}</div>
                  {badge && (
                    <span className={`inline-block mt-1 text-[10.5px] px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full rounded-xl border border-ink/10 py-2.5 text-[13px] text-ink-mute hover:text-ink hover:border-ink/20 transition-all"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {!isConfigured && (
                <div className="text-[12px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Firebase is not configured. Add env vars to enable sign-in.
                </div>
              )}
              <button
                onClick={handleSignIn}
                disabled={busy || !isConfigured}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-accent text-cream-50 py-3 text-[14px] font-medium hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                {busy ? 'Signing in…' : 'Continue with Google'}
              </button>
              {error && (
                <p className="text-[12px] text-red-500 text-center">{error}</p>
              )}
              <p className="text-[11px] text-ink-mute text-center leading-relaxed">
                By signing in you agree to our terms of service and privacy policy.
              </p>
            </div>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-ink-mute hover:text-ink transition-colors p-1"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
