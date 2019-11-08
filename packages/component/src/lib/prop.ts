import { ProviderToken } from '@lit-kit/di';

import { readMetadata } from './metadata';

export function Prop() {
  return function(instance: any, key: string) {
    const metadata = readMetadata(instance.constructor as ProviderToken<any>);

    metadata.props.push(key);
  };
}
