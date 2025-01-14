import { assert } from 'chai';

import { DOMInjector } from './dom-injector.js';
import { INJECTOR_CTX } from './context/injector.js';
import { Injector } from './injector.js';
import { ContextRequestEvent } from './context/protocol.js';

describe('DOMInjector', () => {
  it('should respond to elements looking for an injector', () => {
    const injector = new DOMInjector();
    injector.attach(document.body);

    const host = document.createElement('div');
    document.body.append(host);

    let parent: Injector | null = null;

    host.dispatchEvent(
      new ContextRequestEvent(INJECTOR_CTX, (i) => {
        parent = i;
      })
    );

    assert.equal(parent, injector);

    injector.detach();
    host.remove();
  });

  it('should send request looking for other injector contexts', () => {
    const parent = new Injector();
    const injector = new DOMInjector();
    const controller = new AbortController();

    document.body.addEventListener(
      'context-request',
      (e: any) => {
        if (e.context === INJECTOR_CTX) {
          e.callback(parent);
        }
      },
      { signal: controller.signal }
    );

    injector.attach(document.body);

    assert.equal(injector.parent, parent);

    injector.detach();
    controller.abort();
  });
});
