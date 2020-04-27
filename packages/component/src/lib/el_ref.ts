import { ProviderToken, Inject } from '@joist/di';

export abstract class ElRefToken {}

export function ElRef(c: ProviderToken<any>, k: string, i: number) {
  Inject(ElRefToken)(c, k, i);
}
