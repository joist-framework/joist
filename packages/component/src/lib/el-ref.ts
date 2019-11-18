import { ProviderToken, Inject } from '@lit-kit/di';

export abstract class ElRefToken {}

export function ElRef() {
  return function(c: ProviderToken<any>, k: string, i: number) {
    Inject(ElRefToken)(c, k, i);
  };
}
