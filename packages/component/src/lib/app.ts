import { Injector, Provider } from '@lit-kit/di';

export let ROOT_INJECTOR: Injector | undefined;

export function bootstrapApplication(providers: Provider<any>[] = []) {
  ROOT_INJECTOR = new Injector({ providers });
}

export function clearApplication() {
  ROOT_INJECTOR = undefined;
}
