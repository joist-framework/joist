import { SymbolToken, ProviderToken } from './provider';

export function Inject(injectable: ProviderToken<any>) {
  return function(provider: SymbolToken<any>, _prop: string, index: number) {
    if (!provider.deps) {
      provider.deps = [];
    }

    if (provider.deps[index] === undefined) {
      provider.deps[index] = injectable;
    }
  };
}
