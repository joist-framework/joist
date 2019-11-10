import { ProviderToken } from '@lit-kit/di';

import { getMetadataRef } from './metadata';
import { ElementInstance } from './component';

export const createComponent = <Component, State>(componentDef: ProviderToken<any>) => {
  const metadata = getMetadataRef<State>(componentDef);

  if (!metadata.config) {
    throw new Error(
      `${componentDef.name} is not a Component. Decorate it with the @Component() decorator`
    );
  }

  return document.createElement(metadata.config.tag) as ElementInstance<Component, State>;
};
