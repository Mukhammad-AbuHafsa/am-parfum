import { initTheme } from './components/theme.js';
import { initFavorites } from './components/favorites.js';
import { initProductModal } from './components/product-modal.js';
import { initCatalog } from './components/catalog.js';
import { initCustomerGate } from './components/customer-gate.js';
import { initWholesale } from './components/wholesale.js';
document.addEventListener('DOMContentLoaded', () => { initTheme(); initFavorites(); initProductModal(); initCatalog(); initCustomerGate(); initWholesale(); });
