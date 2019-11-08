import { ProviderToken } from '@lit-kit/di';

export class MetaData {
  handlers: { [key: string]: Function } = {};
  props: string[] = [];
}

export const metaDataCache = new WeakMap<ProviderToken<any>, MetaData>();
