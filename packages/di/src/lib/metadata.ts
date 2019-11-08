import { ProviderToken } from './provider';

export class MetaData {
  deps: ProviderToken<any>[] = [];
  provideInRoot: boolean = false;
}

const METADATA_KEY = '__LIT_KIT_PROVIDER_METADATA__';

export const readMetadata = (provider: ProviderToken<any>): MetaData => {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    attachMetadata(provider, new MetaData());
  }

  return provider[METADATA_KEY];
};

export const attachMetadata = (provider: ProviderToken<any>, metadata: MetaData) => {
  provider[METADATA_KEY] = metadata;
};
