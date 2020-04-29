import { ProviderToken } from './provider';

export interface Metadata {
  deps?: ProviderToken<any>[];
  provideInRoot?: boolean;
}
