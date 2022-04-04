import { expect, fixture, html } from '@open-wc/testing';

import { attr } from './attribute';
import { OnPropertyChanged, observable, observe } from './observable';

describe('attribute', () => {
  it('should default the property to the given attribute', async () => {
    @observable
    class TestElement extends HTMLElement {
      @attr name: string = '';
    }

    customElements.define('attr-test-1', TestElement);
    const el = await fixture<TestElement>(html`<attr-test-1 name="Foo"></attr-test-1>`);

    expect(el.name).to.equal('Foo');
  });

  it('should map a property to an attribute when changed', (done) => {
    @observable
    class TestElement extends HTMLElement implements OnPropertyChanged {
      @observe @attr name = '';

      onPropertyChanged() {
        expect(this.name).to.equal('Hello World');
        expect(this.getAttribute('name')).to.equal('Hello World');

        done();
      }
    }

    customElements.define('attr-test-2', TestElement);

    const el = new TestElement();
    el.name = 'Hello World';
  });

  it('should map an attribute to a property when changed', (done) => {
    @observable
    class TestElement extends HTMLElement implements OnPropertyChanged {
      @observe @attr name: string = '';

      onPropertyChanged() {
        expect(this.name).to.equal('Hello World');
        expect(this.getAttribute('name')).to.equal('Hello World');

        done();
      }
    }

    customElements.define('attr-test-3', TestElement);

    const el = new TestElement();
    el.setAttribute('name', 'Hello World');
  });

  it('should auto parse bool', async () => {
    @observable
    class TestElement extends HTMLElement {
      @attr hasthing: boolean = true;
    }

    customElements.define('attr-test-4', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-4 hasthing="false"></attr-test-4>`);

    expect(el.hasthing).to.equal(false);
  });

  it('should use provided parser (read)', async () => {
    @observable
    class TestElement extends HTMLElement {
      @attr({ read: Number }) count: number = 0;
    }

    customElements.define('attr-test-5', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-5 count="100"></attr-test-5>`);

    expect(el.count).to.equal(100);
  });

  it('should use provided parser', async () => {
    @observable
    class TestElement extends HTMLElement {
      @attr({
        read: (val) => Number(val),
        write: (val) => `${String(val)}--1234`,
      })
      count: number = 100;
    }

    customElements.define('attr-test-parser-2', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-parser-2></attr-test-parser-2>`);

    expect(el.getAttribute('count')).to.equal('100--1234');
  });

  it('should not set prop from attribute if null to start', async () => {
    @observable
    class TestElement extends HTMLElement {
      @attr({ read: Number }) count: number = 0;
    }

    customElements.define('attr-test-6', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-6></attr-test-6>`);

    expect(el.count).to.equal(0);
  });

  it('should set default value for attributes if not set', async () => {
    @observable
    class TestElement extends HTMLElement {
      @attr name = 'Hello World';
    }

    customElements.define('attr-test-7', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-7></attr-test-7>`);

    expect(el.getAttribute('name')).to.equal('Hello World');
  });
});
