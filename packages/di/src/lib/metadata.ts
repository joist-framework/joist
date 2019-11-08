import { ProviderToken } from './provider';

export class MetaData {
  deps: ProviderToken<any>[] = [];
  provideInRoot: boolean = false;
}

export const metaDataCache = new WeakMap<ProviderToken<any>, MetaData>();
