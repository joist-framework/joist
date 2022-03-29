import { Injector } from '../injector';

const rootInjector = new Injector();

export function environment(): Injector {
  return rootInjector;
}

export function clearEnvironment(): void {
  rootInjector.providers = [];
  rootInjector.instances = new WeakMap();
}
