import { ClassProviderToken } from '@lit-kit/di';
import { ComponentDef, COMPONENT_DEF_KEY } from './metadata';

export function Component<T>(componentDef: ComponentDef<T>) {
  return function (component: ClassProviderToken<any>) {
    component[COMPONENT_DEF_KEY] = componentDef;
  };
}
