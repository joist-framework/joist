import { ProviderToken } from '@lit-kit/di';

import { getMetadataRef } from './metadata';

export function Prop() {
  return function(instance: { constructor: ProviderToken<any> }, key: string) {
    const metadata = getMetadataRef(instance.constructor);

    metadata.props.push(key);
  };
}
