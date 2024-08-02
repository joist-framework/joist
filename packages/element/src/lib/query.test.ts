import { expect } from '@open-wc/testing';
import { element } from './element.js';
import { query } from './query.js';
import { html } from './tags.js';

describe('query', () => {
  it('should work', () => {
    @element({
      tagName: 'query-test-1',
      shadow: [
        html`
          <form>
            <input id="fname" name="fname" />
            <input id="lname" name="lname" />
          </form>
        `
      ]
    })
    class MyElement extends HTMLElement {
      fname = query<HTMLInputElement>('#fname');
      lname = query<HTMLInputElement>('#lname');
    }

    const el = new MyElement();

    expect(el.fname()).to.equal(el.shadowRoot?.querySelector('#fname'));
    expect(el.lname()).to.equal(el.shadowRoot?.querySelector('#lname'));
  });

  it('should patch the selected item', () => {
    @element({
      tagName: 'query-test-2',
      shadow: [
        html`
          <form>
            <input id="fname" name="fname" />
            <input id="lname" name="lname" />
          </form>
        `
      ]
    })
    class MyElement extends HTMLElement {
      fname = query<HTMLInputElement>('#fname');
      lname = query<HTMLInputElement>('#lname');
    }

    const el = new MyElement();
    el.fname({ value: 'Foo' });
    el.lname({ value: 'Bar' });

    expect(el.shadowRoot?.querySelector<HTMLInputElement>('#fname')?.value).to.equal('Foo');
    expect(el.shadowRoot?.querySelector<HTMLInputElement>('#lname')?.value).to.equal('Bar');
  });
});
