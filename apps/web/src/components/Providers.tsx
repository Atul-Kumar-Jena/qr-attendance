'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { CookieConsent } from '@/components/CookieConsent';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { User } from 'firebase/auth';

function AuthWithToasts({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const handleSignIn = (user: User, isNew: boolean) => {
    if (isNew) {
      toast.success(`Account created! Welcome to Attendly.`);
    } else {
      toast.success(`Welcome back, ${user.displayName?.split(' ')[0] || 'there'}!`);
    }
  };

  const handleSignOut = () => {
    toast.info('Signed out.');
  };

  return (
    <AuthProvider onSignIn={handleSignIn} onSignOut={handleSignOut}>
      <OnboardingGate>{children}</OnboardingGate>
    </AuthProvider>
  );
}

function OnboardingGate({ children }: { children: ReactNode }) {
  const { user, role, needsOnboarding, markOnboardingDone } = useAuth();
  const showOnboarding = user && role !== 'developer' && needsOnboarding;

  return (
    <>
      {children}
      {showOnboarding && (
        <OnboardingFlow user={user} onComplete={markOnboardingDone} />
      )}
    </>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary name="root">
      <ThemeProvider>
        <ToastProvider>
          <SiteConfigProvider>
            <AuthWithToasts>
              {children}
              <ErrorBoundary name="toasts" fallback={null}><ToastContainer /></ErrorBoundary>
              <ErrorBoundary name="cookie-consent" fallback={null}><CookieConsent /></ErrorBoundary>
            </AuthWithToasts>
          </SiteConfigProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
