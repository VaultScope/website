const STORAGE_KEY = 'vs-theme';

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
  } catch { /* storage unavailable */ }
  return getSystemPrefersDark();
}

export function applyDark(next: boolean): void {
  document.documentElement.classList.toggle('dark', next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  } catch { /* storage unavailable */ }
}
