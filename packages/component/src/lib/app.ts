import { Injector, Provider } from '@lit-kit/di';

export let ROOT_INJECTOR: Injector | undefined;

export const bootstrapApplication = (providers: Provider<any>[]) => {
  ROOT_INJECTOR = new Injector({ providers });
};
