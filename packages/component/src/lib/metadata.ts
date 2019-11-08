import { ProviderToken } from '@lit-kit/di';
import { TemplateResult } from 'lit-html';

export type TemplateDef<T> = (
  state: T,
  run: (event: string, ...args: unknown[]) => (e: Event) => void
) => TemplateResult;

export interface ComponentConfig<T> {
  tag: string;
  template: TemplateDef<T>;
  defaultState: T;
  style?: TemplateResult;
  observedAttributes?: string[];
}

export class MetaData<T> {
  handlers: { [key: string]: Function } = {};
  props: string[] = [];
  config?: ComponentConfig<T>;
}

export const metaDataCache = new WeakMap<ProviderToken<any>, MetaData<any>>();
