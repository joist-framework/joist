import { ProviderToken } from '@lit-kit/di';

import { readMetadata } from './metadata';

export function Prop() {
  return function(instance: { constructor: ProviderToken<any> }, key: string) {
    const metadata = readMetadata(instance.constructor);

    metadata.props.push(key);
  };
}
