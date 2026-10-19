const STORAGE_KEY = 'vs-theme';

export function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
  } catch { /* storage unavailable */ }
  return true;
}

export function applyDark(next: boolean): void {
  document.documentElement.classList.toggle('dark', next);
  document.documentElement.classList.toggle('light', !next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  } catch { /* storage unavailable */ }
}
