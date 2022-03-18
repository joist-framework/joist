import { expect, fixture, html } from '@open-wc/testing';

import { queryAll } from './query-all';

describe('query', () => {
  it('should return the queried item in the light dom', async () => {
    class MyElement extends HTMLElement {
      @queryAll('li') li!: NodeListOf<HTMLLIElement>;

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

    expect(Array.from(el.li).map((li) => li.innerHTML)).to.deep.equal([
      'first',
      'second',
      'third',
      'fourth',
    ]);
  });

  it('should return the queried item in the shadow', async () => {
    class MyElement extends HTMLElement {
      @queryAll('li') li!: NodeListOf<HTMLLIElement>;

      root = this.attachShadow({ mode: 'open' });

      connectedCallback() {
        this.root.innerHTML = /*html*/ `
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

    expect(Array.from(el.li).map((li) => li.innerHTML)).to.deep.equal([
      'first',
      'second',
      'third',
      'fourth',
    ]);
  });

  it('should infer that the property is the id if no selector provided', async () => {
    class MyElement extends HTMLElement {
      @queryAll listItems!: NodeListOf<HTMLLIElement>;

      root = this.attachShadow({ mode: 'open' });

      connectedCallback() {
        this.root.innerHTML = /*html*/ `
            <ul>
                <li query="listItems">first</li>
                <li query="listItems">second</li>
                <li query="listItems">third</li>
                <li query="listItems">fourth</li>
            </ul>
        `;
      }
    }

    customElements.define('query-test-3', MyElement);

    const el = await fixture<MyElement>(html`<query-test-3></query-test-3>`);

    expect(Array.from(el.listItems).map((li) => li.innerHTML)).to.deep.equal([
      'first',
      'second',
      'third',
      'fourth',
    ]);
  });
});
