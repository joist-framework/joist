import { Injector } from '@ts-kit/di';

export const bootstrapApplication = () => {
  window.ROOT__INJECTOR__ = new Injector();
};
