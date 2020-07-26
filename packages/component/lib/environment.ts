import { Injector, Provider } from '@joist/di';

let ROOT_INJECTOR: Injector | undefined;

export function defineEnvironment(providers: Provider<any>[] = []): Injector {
  ROOT_INJECTOR = new Injector({ providers });

  return ROOT_INJECTOR;
}

export function getEnvironmentRef(): Injector {
  if (ROOT_INJECTOR) {
    return ROOT_INJECTOR;
  }

  return defineEnvironment();
}

export function clearEnvironment(): void {
  ROOT_INJECTOR = undefined;
}
