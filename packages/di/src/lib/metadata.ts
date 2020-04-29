import { ProviderToken } from './provider';

export class Metadata {
  deps: ProviderToken<any>[] = [];
  provideInRoot: boolean = false;
}

const METADATA_KEY = 'joistProvider';

export const getMetadataRef = (provider: ProviderToken<any>): Metadata => {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    provider[METADATA_KEY] = new Metadata();
  }

  return provider[METADATA_KEY];
};
