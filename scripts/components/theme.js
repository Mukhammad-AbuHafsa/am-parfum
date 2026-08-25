import { qs } from '../core/dom.js';

const STORAGE_KEY = 'amTheme';

function readSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme still works when private browsing blocks storage.
  }
}

export function initTheme() {
  const button = qs('#themeToggle');

  if (!button) {
    return;
  }

  const icon = button.querySelector('.theme-toggle__icon');
  const label = button.querySelector('.theme-toggle__label');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    icon.textContent = isDark ? '☀' : '☾';
    label.textContent = isDark ? 'Дневная' : 'Ночная';
  }

  applyTheme(readSavedTheme() === 'dark');

  button.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');

    applyTheme(isDark);
    saveTheme(isDark ? 'dark' : 'light');
  });
}
