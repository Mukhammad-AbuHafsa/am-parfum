import { PRODUCTS } from '../data/products.js';
import { qs, qsa } from '../core/dom.js';
export function initProductModal() {
  const modal = qs('#productDetail'); let previousFocus = null;
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (previousFocus?.focus) previousFocus.focus(); };
  window.openProductDetail = (id, imageSource) => {
    const product = PRODUCTS.find(item => item.id === id); if (!product) return;
    previousFocus = document.activeElement;
    Object.entries({ detailBrand: product.brand, detailName: product.name, detailGender: product.gender, detailTopNotes: product.topNotes, detailHeartNotes: product.heartNotes, detailBaseNotes: product.baseNotes, detailDescription: product.description }).forEach(([id, value]) => { qs('#' + id).textContent = value; });
    const image = qs('#detailImage'); image.src = imageSource || 'assets/images/logo.jpg'; image.alt = 'Флакон-референс ' + product.brand + ' ' + product.name;
    qs('#detailOrder').href = 'https://wa.me/79621441441?text=' + encodeURIComponent('Здравствуйте! Подскажите цену и наличие: ' + product.brand + ' — ' + product.name);
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; qs('.product-modal__close').focus();
  };
  qsa('[data-detail-close]', modal).forEach(button => button.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
}
