import { SymbolToken, Inject } from '@ts-kit/di';

export const ELEMENT_REF = 'ELEMENT_REF';

export const ElRef = () => (c: SymbolToken<any>, k: string, i: number) =>
  Inject(ELEMENT_REF)(c, k, i);
