const loadFavorites = () => {
  try { return new Set(JSON.parse(localStorage.getItem('amFav') || '[]')); }
  catch { return new Set(); }
};
export const state = { shown: 24, favorites: loadFavorites() };
export const saveFavorites = () => {
  try { localStorage.setItem('amFav', JSON.stringify([...state.favorites])); } catch {}
};
