import { Injector } from './injector.js';
import { Provider } from './provider.js';

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
