import { Injector } from '../injector';
import { Provider } from '../provider';

let rootInjector: Injector | null = null;

export function defineEnvironment(providers: Provider<any>[] = []): Injector {
  rootInjector = new Injector(providers);

  return rootInjector;
}

export function getEnvironmentRef(): Injector {
  if (rootInjector) {
    return rootInjector;
  }

  return defineEnvironment();
}

export function clearEnvironment(): void {
  rootInjector = null;
}
