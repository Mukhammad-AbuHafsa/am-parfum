import { initCatalog } from './components/catalog.js?v=20260825-2';
import { initCustomerGate } from './components/customer-gate.js';
import { initFavorites } from './components/favorites.js';
import { initProductModal } from './components/product-modal.js';
import { initTheme } from './components/theme.js';
import { initWholesale } from './components/wholesale.js';

function startApplication() {
  initTheme();
  initFavorites();
  initProductModal();
  initCatalog();
  initCustomerGate();
  initWholesale();
}

document.addEventListener('DOMContentLoaded', startApplication);
