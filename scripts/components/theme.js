import { qs } from '../core/dom.js';
export function initTheme() {
  const button = qs('#themeToggle');
  if (!button) return;
  const icon = button.querySelector('span:first-child');
  const label = button.querySelector('span:last-child');
  const apply = dark => { document.body.classList.toggle('dark', dark); icon.textContent = dark ? '☀' : '☾'; label.textContent = dark ? 'Дневная' : 'Ночная'; };
  let dark = false; try { dark = localStorage.getItem('amTheme') === 'dark'; } catch {}
  apply(dark);
  button.addEventListener('click', () => { dark = !document.body.classList.contains('dark'); apply(dark); try { localStorage.setItem('amTheme', dark ? 'dark' : 'light'); } catch {} });
}
