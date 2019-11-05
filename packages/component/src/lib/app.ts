import { Injector } from '@lit-kit/di';

export const bootstrapApplication = () => {
  window.ROOT__INJECTOR__ = new Injector();
};
