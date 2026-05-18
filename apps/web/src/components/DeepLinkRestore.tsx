'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// After GitHub Pages 404.html bounces the user to root, this component
// reads the saved route from sessionStorage and restores navigation.
export function DeepLinkRestore() {
  const router = useRouter();
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('atd_redirect');
      if (saved) {
        sessionStorage.removeItem('atd_redirect');
        const route = saved.startsWith('/') ? saved : `/${saved}`;
        if (route !== '/' && route !== '') {
          router.replace(route);
        }
      }
    } catch {}
  }, [router]);
  return null;
}
