import { Injector } from './injector.js';
import { Provider } from './provider.js';

const rootInjector = new Injector();

export function environment(): Injector {
  return rootInjector;
}

export function defineEnvironment(providers: Provider<any>[]) {
  environment().providers = providers;
}

export function clearEnvironment(): void {
  rootInjector.providers = [];
  rootInjector.clear();
}
