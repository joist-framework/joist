import { expect, fixture, html } from '@open-wc/testing';

import { control } from './control';

describe('slotted', () => {
  it('should validate that all required slots are initially available', async () => {
    @control
    class MyInput extends HTMLElement {
      value = 'Danny Blue';
      name = 'fname';

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }

      connectedCallback() {
        const input = document.createElement('input');
        input.name = this.name;
        input.value = this.value;

        input.addEventListener('change', () => {
          this.value = input.value;
        });

        this.shadowRoot!.appendChild(input);
      }
    }

    customElements.define('my-input', MyInput);

    const el = await fixture<HTMLFormElement>(html`
      <form>
        <my-input></my-input>
        <button>submit</button>
      </form>
    `);

    const submit = el.querySelector('button') as HTMLButtonElement;

    return new Promise((resolve) => {
      el.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.target as HTMLFormElement);

        expect(data.get('fname')).to.equal('Danny Blue');

        resolve();
      });

      submit.click();
    });
  });
});
