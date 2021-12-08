import { expect } from '@open-wc/testing';

import { slotted } from './slotted';

describe('slotted', () => {
  it('should validate that all required slots are initially available', () => {
    @slotted
    class MyEl extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }

      connectedCallback() {
        this.shadowRoot!.innerHTML = /*html*/ `
          <slot name="first" required></slot>
          <slot name="second" required></slot>
          <slot name="third" required></slot>
        `;
      }
    }

    customElements.define('my-el', MyEl);

    const el = new MyEl();
    el.innerHTML = /*html*/ `
      <div slot="first">First</div>
      <div slot="second">Second</div>
    `;

    expect(() => el.connectedCallback()).to.throw(
      'Slot "third" is required but not found as a child of "MY-EL"'
    );
  });
});
