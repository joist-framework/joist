import { Injector, Provider } from '@joist/di';

let rootInjector: Injector;

export function environment(): Injector {
  if (!rootInjector) {
    rootInjector = new Injector();
  }

  return rootInjector;
}

export function defineEnvironment(providers: Provider<any>[]) {
  environment().providers = providers;
}

export function clearEnvironment(): void {
  rootInjector.providers = [];
  rootInjector.clear();
}
