'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/context/ToastContext';
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
      {children}
    </AuthProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SiteConfigProvider>
          <AuthWithToasts>
            {children}
            <ToastContainer />
          </AuthWithToasts>
        </SiteConfigProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
