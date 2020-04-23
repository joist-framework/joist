import { Injector, Provider } from '@lit-kit/di';

let ROOT_INJECTOR: Injector | undefined;

export function bootstrapEnvironment(providers: Provider<any>[] = []): Injector {
  ROOT_INJECTOR = new Injector({ providers });

  return ROOT_INJECTOR;
}

export function getEnvironmentRef(): Injector {
  if (ROOT_INJECTOR) {
    return ROOT_INJECTOR;
  }

  return bootstrapEnvironment();
}

export function clearEnvironment(): void {
  ROOT_INJECTOR = undefined;
}
