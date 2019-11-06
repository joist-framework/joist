import { ProviderToken, Inject } from '@lit-kit/di';

export class ElRefToken {}

export const ElRef = () => (c: ProviderToken<any>, k: string, i: number) =>
  Inject(ElRefToken)(c, k, i);
