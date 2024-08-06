import { test, assert } from 'vitest';

import { effect, observe } from './observe.js';

test('should work with static accessors', () => {
  return new Promise<void>((resolve) => {
    class Counter {
      @observe()
      static accessor value = 0;

      @effect() static onPropChanged() {
        assert.equal(Counter.value, 1);

        resolve();
      }
    }

    assert.equal(Counter.value, 0);

    Counter.value++;

    assert.equal(Counter.value, 1);
  });
});

test('should work with instance accessors', () => {
  return new Promise<void>((resolve) => {
    class Counter {
      @observe()
      accessor value = 0;

      // confirm it works with private methods
      // @ts-ignore
      @effect #onChange() {
        assert.equal(this.value, 1);

        resolve();
      }
    }

    const counter = new Counter();

    assert.equal(counter.value, 0);

    counter.value++;

    assert.equal(counter.value, 1);
  });
});

test('should return a set of changed props', () => {
  return new Promise<void>((resolve) => {
    class Counter {
      @observe() accessor value = 0;

      @effect() onChange(changes: Set<symbol | string>) {
        assert.ok(changes.has('value'));

        resolve();
      }
    }

    const counter = new Counter();
    counter.value++;
  });
});

test('should upgrade custom elements', () => {
  return new Promise<void>((resolve) => {
    class Counter extends HTMLElement {
      @observe()
      accessor value = 0;

      constructor() {
        super();

        assert.equal(this.value, 100);
      }

      @effect() onChange() {
        assert.equal(this.value, 101);

        resolve();
      }
    }

    const el = document.createElement('observable-1') as Counter;
    el.value = 100;

    document.body.append(el);

    customElements.whenDefined('observable-1').then(() => {
      el.value++;
    });

    customElements.define('observable-1', Counter);
  });
});
