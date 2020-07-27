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

    expect(router.getFragment()).toBe('foo/bar');
  });
});
