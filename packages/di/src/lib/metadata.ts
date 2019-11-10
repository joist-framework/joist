import { ProviderToken } from './provider';

export class MetaData {
  deps: ProviderToken<any>[] = [];
  provideInRoot: boolean = false;
}

const METADATA_KEY = '__LIT_KIT_PROVIDER_METADATA__';

export const getMetadataRef = (provider: ProviderToken<any>): MetaData => {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    provider[METADATA_KEY] = new MetaData();
  }

  return provider[METADATA_KEY];
};
