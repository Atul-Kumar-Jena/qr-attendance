'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const STORAGE_KEY = 'atd_dark_suggested';

export function DarkModeNudge() {
  const { theme, setMode } = useTheme();

  useEffect(() => {
    if (theme === 'dark') return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Show driver.js spotlight after 25 seconds on the landing page
    const t = setTimeout(async () => {
      localStorage.setItem(STORAGE_KEY, '1');
      try {
        const { driver } = await import('driver.js');
        const d = driver({
          allowClose: true,
          popoverClass: 'atd-popover',
          steps: [
            {
              element: '[aria-label="Dark mode"]',
              popover: {
                title: '🌙 Try dark mode',
                description:
                  'Attendly was designed to shine after dark. Switch to dark mode for a calmer, eye-friendly experience.',
                side: 'bottom',
                align: 'end',
                nextBtnText: 'Switch to dark →',
                prevBtnText: 'Maybe later',
                showButtons: ['next', 'previous'],
              },
            },
          ],
          onNextClick: () => {
            setMode('dark');
            d.destroy();
          },
          onPrevClick: () => {
            d.destroy();
          },
          onCloseClick: () => {
            d.destroy();
          },
        });
        d.drive();
      } catch {
        // driver.js failed to load — silently ignore
      }
    }, 25_000);

    return () => clearTimeout(t);
  }, [theme, setMode]);

  return null;
}
