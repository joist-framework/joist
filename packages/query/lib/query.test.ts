import { expect, fixture, html } from '@open-wc/testing';

import { query } from './query';

describe('query', () => {
  it('should return the queried item in the light dom', async () => {
    class MyElement extends HTMLElement {
      @query('ul') ul!: HTMLUListElement;

      connectedCallback() {
        this.innerHTML = /*html*/ `
            <ul>
                <li>first</li>
                <li>second</li>
                <li>third</li>
                <li>fourth</li>
            </ul>
        `;
      }
    }

    customElements.define('query-test-1', MyElement);

    const el = await fixture<MyElement>(html`<query-test-1></query-test-1>`);

    expect(el.ul).to.be.instanceOf(HTMLUListElement);
  });

  it('should return the queried item in the shadow', async () => {
    class MyElement extends HTMLElement {
      @query('ul') ul!: HTMLUListElement;

      root = this.attachShadow({ mode: 'open' });

      connectedCallback() {
        this.shadowRoot!.innerHTML = /*html*/ `
            <ul>
                <li>first</li>
                <li>second</li>
                <li>third</li>
                <li>fourth</li>
            </ul>
        `;
      }
    }

    customElements.define('query-test-2', MyElement);

    const el = await fixture<MyElement>(html`<query-test-2></query-test-2>`);

    expect(el.ul).to.be.instanceOf(HTMLUListElement);
  });

  it('should infer that the property is the id if no selector provided', async () => {
    class MyElement extends HTMLElement {
      @query myList!: HTMLUListElement;

      root = this.attachShadow({ mode: 'open' });

      connectedCallback() {
        this.root.innerHTML = /*html*/ `
            <ul query-id="myList">
                <li>first</li>
                <li>second</li>
                <li>third</li>
                <li>fourth</li>
            </ul>
        `;
      }
    }

    customElements.define('query-test-3', MyElement);

    const el = await fixture<MyElement>(html`<query-test-3></query-test-3>`);

    expect(el.myList).to.be.instanceOf(HTMLUListElement);
  });
});
