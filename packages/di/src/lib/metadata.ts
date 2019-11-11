import { ProviderToken } from './provider';

export class Metadata {
  deps: ProviderToken<any>[] = [];
  provideInRoot: boolean = false;
}

const METADATA_KEY = '__LIT_KIT_PROVIDER_METADATA__';

export const getMetadataRef = (provider: ProviderToken<any>): Metadata => {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    provider[METADATA_KEY] = new Metadata();
  }

  return provider[METADATA_KEY];
};
