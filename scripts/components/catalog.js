import { PRODUCTS } from '../data/products.js';
import { qs } from '../core/dom.js';
import { state } from '../core/state.js';
import { toggleFavorite } from './favorites.js';

const PAGE_SIZE = 24;
const WHATSAPP_NUMBER = '79621441441';

function imageFor(product) {
  const description = [
    product.brand,
    product.name,
    'official perfume bottle luxury campaign advertising photo',
    'elegant beautiful background product only no people no hands no box',
  ].join(' ');

  const parameters = new URLSearchParams({
    th: description,
    w: '700',
    h: '700',
    c: '7',
    rs: '1',
    p: '0',
    dpr: '1.5',
    pid: '1.7',
    mkt: 'ru-RU',
    adlt: 'strict',
  });

  return `https://tse2.mm.bing.net/th?${parameters}`;
}

function priceValue(product) {
  const match = String(product.price).match(/\d+/);

  return Number(match?.[0] ?? Infinity);
}

function productCard(product) {
  const isFavorite = state.favorites.has(product.id);
  const favoriteLabel = isFavorite
    ? 'Удалить из избранного'
    : 'Добавить в избранное';
  const badge = product.badge
    ? `<span class="product-card__badge">${product.badge}</span>`
    : '';

  return `
    <article
      class="product-card"
      data-product-id="${product.id}"
      tabindex="0"
      role="button"
      aria-label="Открыть описание ${product.name}"
    >
      <div class="product-card__media">
        ${badge}

        <button
          type="button"
          class="product-card__favorite ${isFavorite ? 'active' : ''}"
          data-favorite="${product.id}"
          aria-pressed="${isFavorite}"
          aria-label="${favoriteLabel}"
        >
          ${isFavorite ? '♥' : '♡'}
        </button>

        <img
          class="product-card__image"
          src="${imageFor(product)}"
          alt="Флакон аромата ${product.name}"
          loading="lazy"
          decoding="async"
        >

        <div class="product-card__fallback" hidden>
          A&amp;M PARFUM<br>
          <strong>${product.name}</strong>
        </div>
      </div>

      <div class="product-card__body">
        <span class="product-card__brand">${product.brand}</span>
        <h3>${product.name}</h3>
        <span class="product-card__meta">${product.gender}</span>

        <div class="product-card__footer">
          <span>${product.volume}</span>

          <button
            type="button"
            class="product-card__price-button"
            data-price="${product.id}"
          >
            Узнать цену
          </button>
        </div>
      </div>
    </article>
  `;
}

function filteredProducts() {
  const query = qs('#search').value.toLowerCase().trim();
  const gender = qs('#gender').value;

  return PRODUCTS.filter((product) => {
    const searchableText = `${product.name} ${product.brand}`.toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const matchesGender = gender === 'all' || product.gender === gender;

    return matchesSearch && matchesGender;
  });
}

function sortProducts(products) {
  const sort = qs('#sort').value;
  const items = [...products];
  const strategies = {
    'name-asc': (first, second) =>
      first.name.localeCompare(second.name, 'ru'),
    'name-desc': (first, second) =>
      second.name.localeCompare(first.name, 'ru'),
    'price-asc': (first, second) =>
      priceValue(first) - priceValue(second),
    'price-desc': (first, second) =>
      priceValue(second) - priceValue(first),
  };

  return strategies[sort] ? items.sort(strategies[sort]) : items;
}

export function renderCatalog() {
  const items = sortProducts(filteredProducts());
  const visibleItems = items.slice(0, state.shown);

  qs('#grid').innerHTML = visibleItems.map(productCard).join('');
  qs('#loadMore').style.display =
    state.shown >= items.length ? 'none' : 'inline-flex';
}

function resetCatalog() {
  qs('#search').value = '';
  qs('#gender').value = 'all';
  qs('#sort').value = 'default';
  state.shown = PAGE_SIZE;

  renderCatalog();
}

function openPriceRequest(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const message = encodeURIComponent(
    `Здравствуйте! Подскажите цену и наличие: ${product.brand} — ${product.name}`,
  );

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    '_blank',
    'noopener,noreferrer',
  );
}

function handleGridClick(event) {
  const favoriteButton = event.target.closest('[data-favorite]');

  if (favoriteButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(Number(favoriteButton.dataset.favorite), favoriteButton);

    return;
  }

  const priceButton = event.target.closest('[data-price]');

  if (priceButton) {
    event.stopPropagation();
    openPriceRequest(Number(priceButton.dataset.price));

    return;
  }

  const card = event.target.closest('.product-card');

  if (card) {
    const image = card.querySelector('.product-card__image');

    window.openProductDetail(
      Number(card.dataset.productId),
      image?.src,
    );
  }
}

export function initCatalog() {
  ['search', 'gender', 'sort'].forEach((id) => {
    const eventName = id === 'search' ? 'input' : 'change';

    qs(`#${id}`).addEventListener(eventName, () => {
      state.shown = PAGE_SIZE;
      renderCatalog();
    });
  });

  qs('#reset').addEventListener('click', resetCatalog);

  qs('#loadMore').addEventListener('click', () => {
    state.shown += PAGE_SIZE;
    renderCatalog();
  });

  qs('#grid').addEventListener('click', handleGridClick);

  renderCatalog();
}
