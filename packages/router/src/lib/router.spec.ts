import { Component } from '@lit-kit/component';

import { Router } from './router2';

describe('Router', () => {
  it('should work', () => {
    @Component({
      tag: 'c-one',
      initialState: null,
      template() {
        return '';
      }
    })
    class One {}

    const router = new Router();

    router.registerRoutes([
      {
        path: '/products\\/(.*)\\/edit\\/(.*)/',
        component: () => One
      }
    ]);

    window.history.pushState(null, 'title', '/products/10/edit/20');

    router.resolve().then(res => {
      console.log(res);
    });

    expect(Router).toBeTruthy();
  });
});
