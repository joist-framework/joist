import { Router, RouteCtx } from './router';
import { State } from '@lit-kit/component';

describe('Router', () => {
  it('should work', () => {
    const router = new Router([], new State({}), new RouteCtx());

    expect(router).toBeTruthy();
  });
});
