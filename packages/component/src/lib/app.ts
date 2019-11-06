import { Injector } from '@lit-kit/di';

export const bootstrapApplication = () => {
  window.__LIT_KIT_ROOT_INJECTOR__ = new Injector();
};
