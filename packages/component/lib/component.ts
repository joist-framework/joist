import { ClassProviderToken } from '@joist/di';

import { ComponentDef, COMPONENT_DEF_KEY } from './metadata';

export function Component<T>(componentDef: ComponentDef<T>) {
  return function (component: ClassProviderToken<any>) {
    Object.defineProperty(component, COMPONENT_DEF_KEY, {
      get() {
        return componentDef;
      },
    });

    return component;
  };
}
