import { Injector } from '@lit-kit/di';

import { bootstrapApplication, ROOT_INJECTOR } from './app';

describe('app', () => {
  it('should create a global Injector instance', () => {
    expect(ROOT_INJECTOR).toBeUndefined();

    bootstrapApplication();

    expect(ROOT_INJECTOR instanceof Injector).toBe(true);
  });
});
