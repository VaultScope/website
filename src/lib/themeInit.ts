// Apply saved light/dark theme class immediately on entry module execution
try {
  const storedTheme = localStorage.getItem('vs-theme');
  if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.add('dark');
  }
} catch {
  // Ignore storage access errors in restricted contexts
}
