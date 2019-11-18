import { Injector, Provider } from '@lit-kit/di';

let ROOT_INJECTOR: Injector | undefined;

export function bootstrapApplication(providers: Provider<any>[] = []): Injector {
  ROOT_INJECTOR = new Injector({ providers });

  return ROOT_INJECTOR;
}

export function getApplicationRef(): Injector | undefined {
  return ROOT_INJECTOR;
}

export function clearApplication(): void {
  ROOT_INJECTOR = undefined;
}
