import { expect, fixture, html } from '@open-wc/testing';

import { attr } from './attribute';
import { observable, observe, Changes, ForwardProps } from './observable';

const ForwardedElement = ForwardProps(HTMLElement);

describe('attribute', () => {
  it('should default the property to the given attribute', async () => {
    @observable
    class TestElement extends ForwardedElement {
      @observe @attr name = 'Foo';
      @observe @attr fooBar = true;
    }

    customElements.define('attr-test-1', TestElement);

    const el = await fixture<TestElement>(
      html`<attr-test-1 name="Bar" foo-bar="false"></attr-test-1>`
    );

    expect(el.name).to.equal('Bar');
    expect(el.fooBar).to.equal(false);
  });

  it('should map a property to an attribute when changed', (done) => {
    @observable
    class TestElement extends ForwardedElement {
      @observe @attr name = '';

      onPropertyChanged(_: Changes) {
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
    class TestElement extends ForwardedElement {
      @observe @attr name: string = '';

      onPropertyChanged(_: Changes) {
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
    class TestElement extends ForwardedElement {
      @attr hasThing: boolean = true;
    }

    customElements.define('attr-test-4', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-4 has-thing="false"></attr-test-4>`);

    expect(el.hasThing).to.equal(false);
  });

  it('should use provided parser (read)', async () => {
    @observable
    class TestElement extends ForwardedElement {
      @attr<number>({ read: Number }) count = 0;
    }

    customElements.define('attr-test-5', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-5 count="100"></attr-test-5>`);

    expect(el.count).to.equal(100);
  });

  it('should use provided parser', async () => {
    @observable
    class TestElement extends ForwardedElement {
      @attr<number>({
        read: (val) => Number(val),
        write: (val) => `${String(val)}--1234`,
      })
      count = 100;
    }

    customElements.define('attr-test-parser-2', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-parser-2></attr-test-parser-2>`);

    expect(el.getAttribute('count')).to.equal('100--1234');
  });

  it('should not set prop from attribute if null to start', async () => {
    @observable
    class TestElement extends ForwardedElement {
      @attr({ read: Number }) count: number = 0;
    }

    customElements.define('attr-test-6', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-6></attr-test-6>`);

    expect(el.count).to.equal(0);
  });

  it('should set default value for attributes if not set', async () => {
    @observable
    class TestElement extends ForwardedElement {
      @attr name = 'Hello World';
    }

    customElements.define('attr-test-7', TestElement);

    const el = await fixture<TestElement>(html`<attr-test-7></attr-test-7>`);

    expect(el.getAttribute('name')).to.equal('Hello World');
  });

  it('should map kebab case attributes to cammelCase property on changle', async () => {
    return new Promise(async (resolve) => {
      @observable
      class TestElement extends ForwardedElement {
        @attr @observe fooBar = 'Hello';

        onPropertyChanged(_: Changes) {
          expect(this.fooBar).to.equal('World');

          resolve();
        }
      }

      customElements.define('attr-test-8', TestElement);

      const el = await fixture<TestElement>(html`<attr-test-8></attr-test-8>`);

      el.setAttribute('foo-bar', 'World');
    });
  });

  it('should map cammelCase property to kebab case attributes on changle', async () => {
    return new Promise(async (resolve) => {
      @observable
      class TestElement extends ForwardedElement {
        @attr @observe fooBar = 'Hello';

        onPropertyChanged(_: Changes) {
          expect(el.getAttribute('foo-bar')).to.equal('World');
          resolve();
        }
      }

      customElements.define('attr-test-9', TestElement);

      const el = await fixture<TestElement>(html`<attr-test-9></attr-test-9>`);

      expect(el.getAttribute('foo-bar')).to.equal('Hello');

      el.fooBar = 'World';
    });
  });
});
