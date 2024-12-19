import { assert } from 'chai';

import { element } from './element.js';
import { listen } from './listen.js';

describe('@listen()', () => {
  it('should add listener to an outer HTMLElement', (done) => {
    @element({
      tagName: 'listener-1'
    })
    class MyElement extends HTMLElement {
      @listen('click')
      onClick(e: Event) {
        assert.equal(e.type, 'click');

        done();
      }
    }

    const el = new MyElement();

    document.body.append(el);

    el.dispatchEvent(new Event('click'));

    el.remove();
  });

  it('should add listener to the shadow root if available', (done) => {
    @element({
      tagName: 'listener-2',
      shadowDom: []
    })
    class MyElement extends HTMLElement {
      @listen('click')
      onClick(e: Event) {
        assert.equal(e.type, 'click');

        done();
      }
    }

    const el = new MyElement();

    document.body.append(el);

    el.shadowRoot!.dispatchEvent(new Event('click'));

    el.remove();
  });

  it('should restrict argument to an event or an event subtype', (done) => {
    class CustomEvent extends Event {
      test = 'Hello World';

      constructor() {
        super('customevent');
      }
    }

    @element({
      tagName: 'listener-3'
    })
    class MyElement extends HTMLElement {
      @listen('customevent')
      onClick(e: CustomEvent) {
        assert.equal(e.type, 'customevent');

        done();
      }
    }

    const el = new MyElement();

    document.body.append(el);

    el.dispatchEvent(new CustomEvent());

    el.remove();
  });

  it('should respect a provided selector function', (done) => {
    @element({
      tagName: 'listener-4',
      shadowDom: []
    })
    class MyElement extends HTMLElement {
      @listen('click', (host) => host)
      onClick(e: Event) {
        assert.equal(e.type, 'click');

        done();
      }
    }

    const el = new MyElement();

    document.body.append(el);

    el.dispatchEvent(new Event('click'));

    el.remove();
  });
});
