'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Mode = 'light' | 'dark' | 'auto';
type Theme = 'light' | 'dark';

// Fluid-glass deep theme is the signature look — "auto" resolves to dark.
function getAutoTheme(): Theme {
  return 'dark';
}

function resolveTheme(mode: Mode): Theme {
  if (mode === 'auto') return getAutoTheme();
  return mode;
}

interface ThemeCtx {
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'light',
  mode: 'auto',
  setMode: () => {},
  cycleMode: () => {},
});

const STORAGE_KEY = 'attendly-theme-mode';
const CYCLE: Mode[] = ['auto', 'light', 'dark'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('auto');
  const [theme, setTheme] = useState<Theme>('light');

  // On mount, read from localStorage
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Mode) || 'auto';
    setModeState(stored);
    const resolved = resolveTheme(stored);
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Auto mode: recalculate every minute
  useEffect(() => {
    if (mode !== 'auto') return;
    const tick = () => {
      const resolved = getAutoTheme();
      setTheme(resolved);
      applyTheme(resolved);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [mode]);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
    const resolved = resolveTheme(m);
    setTheme(resolved);
    applyTheme(resolved);
  };

  const cycleMode = () => {
    const idx = CYCLE.indexOf(mode);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setMode(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Briefly add transition class so colors animate on switch
  root.classList.add('theme-transitioning');
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  const timer = setTimeout(() => root.classList.remove('theme-transitioning'), 400);
  return timer;
}

export function useTheme() {
  return useContext(ThemeContext);
}
