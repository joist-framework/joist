import { expect } from '@open-wc/testing';

import { Router, Location, RouterConfig } from './router';

describe('Router', () => {
  it('should return a normalized path', () => {
    class MockLocation extends Location {
      private path = '/foo/bar';

      getPath() {
        return this.path;
      }

      goTo(path: string) {
        this.path = path;
      }

      onPopState() {
        return () => {};
      }
    }

    const router = new Router(new MockLocation(), new RouterConfig());

    expect(router.getFragment()).to.equal('foo/bar');
  });

  it('should listen for navigation changes', (done) => {
    class MockLocation extends Location {
      private path = '/foo/bar';

      getPath() {
        return this.path;
      }

      goTo(path: string) {
        this.path = path;
      }

      onPopState() {
        return () => {};
      }
    }

    const router = new Router(new MockLocation(), new RouterConfig());

    const removeListener = router.listen(() => {
      removeListener();

      expect(router.getFragment()).to.equal('foo/bar');

      done();
    });

    router.navigate('/foo/bar/');
  });
});
