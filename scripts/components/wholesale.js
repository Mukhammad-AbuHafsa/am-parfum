import { PRODUCTS } from '../data/products.js';
import { qs } from '../core/dom.js';

function escapeHtml(value) {
  const characters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  };

  return String(value).replace(
    /[&<>'"]/g,
    (character) => characters[character],
  );
}

function wholesaleRow(item, index) {
  const number = String(index + 1).padStart(3, '0');

  return `
    <div class="wholesale-table__row" role="row">
      <span class="wholesale-table__name" role="cell">
        <i class="wholesale-table__number">${number}</i>
        ${escapeHtml(item.name)}
      </span>

      <span class="wholesale-table__price" role="cell">
        ${escapeHtml(item.price)}
      </span>
    </div>
  `;
}

export function initWholesale() {
  const rows = qs('#wholesalePriceRows');
  const search = qs('#wholesalePriceSearch');
  const empty = qs('#wholesaleListEmpty');

  function render(query) {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase('ru');
    const items = PRODUCTS.filter((item) =>
      item.name.toLocaleLowerCase('ru').includes(normalizedQuery),
    );

    rows.innerHTML = items.map(wholesaleRow).join('');
    empty.hidden = items.length !== 0;
    rows.hidden = items.length === 0;
  }

  render('');

  search.addEventListener('input', () => {
    render(search.value);
  });
}
