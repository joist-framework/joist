import { assert } from 'chai';

import { attrChanged } from './attr-changed.js';
import { attr } from './attr.js';
import { element } from './element.js';

it('should call specific attrbute callback', () => {
  let args: string[] = [];

  @element({
    tagName: 'attr-changed-1'
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = 'hello';

    @attrChanged('test')
    onTestChanged(oldValue: string, newValue: string) {
      args = [oldValue, newValue];
    }
  }

  const el = new MyElement();

  document.body.append(el);

  assert.deepEqual(args, [null, 'hello']);

  el.setAttribute('test', 'world');

  assert.deepEqual(args, ['hello', 'world']);

  el.remove();
});
