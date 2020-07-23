import { Injector } from '@joist/di';

import { AppElement } from './app.element';

describe('AppElement', () => {
  let el: AppElement;

  beforeEach(() => {
    el = document.createElement('app-root') as AppElement;

    el.injector.parent = new Injector();

    el.connectedCallback();
  });

  it('should render', () => {
    expect(el).toBeTruthy();
  });

  it('should increment', async () => {
    await el.onIncrement();

    expect(el.state.value).toBe(1);
    expect(el.innerHTML).toBe('1');
  });

  it('should render', async () => {
    await el.onDecrement();

    expect(el.state.value).toBe(-1);
    expect(el.innerHTML).toBe('-1');
  });
});
