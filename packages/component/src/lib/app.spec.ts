import { Injector } from '@lit-kit/di';

import { bootstrapApplication } from './app';

describe('app', () => {
  it('should create a global Injector instance', () => {
    bootstrapApplication();

    expect(window.__LIT_KIT_ROOT_INJECTOR__ instanceof Injector).toBe(true);
  });
});
