import { qs, qsa } from '../core/dom.js';

const OPEN_DELAY_MS = 350;
const CLOSE_ANIMATION_MS = 420;

export function initCustomerGate() {
  const gate = qs('#customerGate');
  const choices = qsa('[data-customer]', gate);

  function closeGate(target) {
    gate.classList.add('closing');
    gate.classList.remove('open');
    gate.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      gate.classList.remove('closing');

      if (target) {
        qs(target)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, CLOSE_ANIMATION_MS);
  }

  setTimeout(() => {
    gate.classList.add('open');
    gate.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    choices[0]?.focus();
  }, OPEN_DELAY_MS);

  choices.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.customer === 'wholesale'
        ? '#wholesale'
        : null;

      closeGate(target);
    });
  });
}
