import { PRODUCTS } from '../data/products.js';
import { qs } from '../core/dom.js';
import { state, saveFavorites } from '../core/state.js';
const itemById = id => PRODUCTS.find(item => item.id === id);
export function updateFavoritesPanel() {
  qs('#favCount').textContent = state.favorites.size;
  const items = [...state.favorites].map(itemById).filter(Boolean);
  qs('#favList').innerHTML = items.length ? items.map(item => `<article class="favorites-panel__item"><div><b>${item.name}</b><small>${item.brand}</small></div><button type="button" data-remove-favorite="${item.id}">Удалить</button></article>`).join('') : '<p>Пока ничего не добавлено.</p>';
  const message = 'Здравствуйте! Интересуют ароматы A&M PARFUM:\n' + items.map(item => '• ' + item.brand + ' — ' + item.name).join('\n');
  qs('#sendFav').href = 'https://wa.me/79621441441?text=' + encodeURIComponent(message);
}
export function toggleFavorite(id, button) {
  const active = !state.favorites.has(id);
  active ? state.favorites.add(id) : state.favorites.delete(id);
  saveFavorites();
  if (button) {
    button.classList.toggle('active', active); button.textContent = active ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(active)); button.setAttribute('aria-label', active ? 'Удалить из избранного' : 'Добавить в избранное');
  }
  updateFavoritesPanel();
}
export function initFavorites() {
  const panel = qs('#drawer'), overlay = qs('#overlay'), trigger = qs('#cartBtn'), closeButton = qs('#closeDrawer');
  const open = () => { panel.classList.add('open'); overlay.classList.add('show'); document.body.classList.add('favorites-open'); panel.setAttribute('aria-hidden', 'false'); updateFavoritesPanel(); setTimeout(() => closeButton.focus(), 50); };
  const close = () => { panel.classList.remove('open'); overlay.classList.remove('show'); document.body.classList.remove('favorites-open'); panel.setAttribute('aria-hidden', 'true'); };
  trigger.addEventListener('click', open); closeButton.addEventListener('click', close); overlay.addEventListener('click', close);
  panel.addEventListener('click', event => { const button = event.target.closest('[data-remove-favorite]'); if (button) toggleFavorite(Number(button.dataset.removeFavorite)); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.classList.contains('open')) close(); });
  updateFavoritesPanel();
}
