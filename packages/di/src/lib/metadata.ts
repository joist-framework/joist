import { ProviderToken } from './provider';

export class MetaData {
  deps: ProviderToken<any>[] = [];
  provideInRoot: boolean = false;
}

const METADATA_KEY = '__LIT_KIT_PROVIDER_METADATA__';

export const readMetadata = (provider: ProviderToken<any>): MetaData => {
  const metadata = (provider as any)[METADATA_KEY];

  if (!metadata) {
    attachMetadata(provider, new MetaData());
  }

  return (provider as any)[METADATA_KEY];
};

export const attachMetadata = (provider: ProviderToken<any>, metadata: MetaData) => {
  return ((provider as any)[METADATA_KEY] = metadata);
};
