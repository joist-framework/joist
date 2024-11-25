import { expect } from 'chai';

import { element } from './element.js';
import { query } from './query.js';
import { html } from './tags.js';

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
