import { ProviderToken } from '@lit-kit/di';
import { TemplateResult } from 'lit-html';

export type TemplateEvent = (event: string, ...args: unknown[]) => (e: Event) => void;

export type TemplateDef<T> = (state: T, run: TemplateEvent) => TemplateResult;

export interface ComponentConfig<T> {
  tag: string;
  template: TemplateDef<T>;
  defaultState: T;
  style?: TemplateResult;
  observedAttributes?: string[];
}

export class Metadata<T> {
  handlers: { [key: string]: Function } = {};
  props: string[] = [];
  config?: ComponentConfig<T>;
}

const METADATA_KEY = '__LIT_KIT_COMPONENT_METADATA__';

export const readMetadata = <T>(provider: ProviderToken<any>): Metadata<T> => {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    attachMetadata(provider, new Metadata());
  }

  return provider[METADATA_KEY];
};

export const attachMetadata = <T>(provider: ProviderToken<any>, metadata: Metadata<T>) => {
  provider[METADATA_KEY] = metadata;
};
