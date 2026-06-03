'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Mode = 'light' | 'dark' | 'auto';
type Theme = 'light' | 'dark';

function getAutoTheme(): Theme {
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? 'light' : 'dark';
}

function resolveTheme(mode: Mode): Theme {
  if (mode === 'auto') return getAutoTheme();
  return mode;
}

const STORAGE_KEY = 'attendly-theme-mode';
const CYCLE: Mode[] = ['auto', 'light', 'dark'];
const DEFAULT_MODE: Mode = 'dark'; // dark-first design; matches the pre-paint boot script

// Read the mode the boot script already resolved. Prefer the data-mode the
// inline script wrote onto <html> (the single source of truth that's available
// synchronously on the client), then localStorage, then the default.
function getInitialMode(): Mode {
  if (typeof document !== 'undefined') {
    const dm = document.documentElement.dataset.mode as Mode | undefined;
    if (dm === 'light' || dm === 'dark' || dm === 'auto') return dm;
    try {
      const s = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (s) return s;
    } catch {}
  }
  return DEFAULT_MODE;
}

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const dt = document.documentElement.dataset.theme as Theme | undefined;
    if (dt === 'light' || dt === 'dark') return dt;
  }
  return resolveTheme(getInitialMode());
}

interface ThemeCtx {
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'dark',
  mode: DEFAULT_MODE,
  setMode: () => {},
  cycleMode: () => {},
});

function applyTheme(theme: Theme, mode: Mode) {
  const root = document.documentElement;
  // Briefly add a transition class so colours animate on a deliberate switch.
  root.classList.add('theme-transitioning');
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.dataset.mode = mode;
  window.setTimeout(() => root.classList.remove('theme-transitioning'), 520);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(getInitialMode);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Auto mode: keep the theme in sync with the time of day without a flash on
  // mount (the boot script already applied the correct class).
  useEffect(() => {
    if (mode !== 'auto') return;
    const tick = () => setTheme(getAutoTheme());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [mode]);

  // Reflect any theme change onto <html>. Runs after the first paint too, but is
  // idempotent so it never causes a visible flicker.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setMode = (m: Mode) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch {}
    const resolved = resolveTheme(m);
    setTheme(resolved);
    applyTheme(resolved, m);
  };

  const cycleMode = () => {
    const idx = CYCLE.indexOf(mode);
    setMode(CYCLE[(idx + 1) % CYCLE.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, cycleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
