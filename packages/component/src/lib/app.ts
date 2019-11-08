import { Injector } from '@lit-kit/di';

export let ROOT_INJECTOR: Injector | undefined;

export const bootstrapApplication = () => {
  ROOT_INJECTOR = new Injector();
};
