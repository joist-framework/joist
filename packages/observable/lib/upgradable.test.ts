import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { observable } from './observable.js';
import { upgradable } from './upgradable.js';

describe('observable', () => {
  it('should ForwardProps initial props to upgraded element', async () => {
    @observable
    class MyElement extends upgradable(HTMLElement) {
      name = 'hello';
    }

    const instance = await fixture<MyElement>(html`<test-el .name=${'world'}></test-el>`);

    customElements.define('test-el', MyElement);

    expect(instance.name).to.equal('world');
  });
});
