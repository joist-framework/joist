import { expect } from '@open-wc/testing';

import { InjectableMap } from './injectable-map.js';
import { Injector } from './injector.js';

describe('InjectableMap', () => {
  it('should add a new weak reference for an injector', () => {
    const map = new InjectableMap();
    const app = {
      key: {},
      injector: new Injector()
    };

    map.set(app.key, app.injector);

    expect(map.get(app.key)).to.equal(app.injector);
  });
});
