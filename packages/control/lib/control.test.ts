import { expect, fixture, html } from '@open-wc/testing';

import { control, FormControl } from './control';

describe('slotted', () => {
  it('should append the current value to formdata', async () => {
    @control
    class MyInput extends HTMLElement {
      value = 'Danny Blue';
      name = 'fname';
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

  it('should append the checked value if defined', async () => {
    @control
    class MyInput extends HTMLElement {
      name = 'toc';
      checked = true;
    }

    customElements.define('my-checkbox', MyInput);

    const el = await fixture<HTMLFormElement>(html`
      <form>
        <my-checkbox></my-checkbox>
        <button>submit</button>
      </form>
    `);

    const submit = el.querySelector('button') as HTMLButtonElement;

    return new Promise((resolve) => {
      el.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.target as HTMLFormElement);

        expect(data.get('toc')).to.equal('true');

        resolve();
      });

      submit.click();
    });
  });

  it('should allow a user to provide their own udpate function', async () => {
    @control
    class MyInput extends HTMLElement implements FormControl {
      value = 'Danny Blue';
      name = 'fname';

      appendFormData({ formData }: FormDataEvent) {
        formData.append(this.name, this.value + ' Again');
      }
    }

    customElements.define('my-input-2', MyInput);

    const el = await fixture<HTMLFormElement>(html`
      <form>
        <my-input-2></my-input-2>
        <button>submit</button>
      </form>
    `);

    const submit = el.querySelector('button') as HTMLButtonElement;

    return new Promise((resolve) => {
      el.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.target as HTMLFormElement);

        expect(data.get('fname')).to.equal('Danny Blue Again');

        resolve();
      });

      submit.click();
    });
  });
});
