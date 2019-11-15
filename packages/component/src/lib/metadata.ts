import { ProviderToken } from '@lit-kit/di';
import { TemplateResult } from 'lit-html';

export type TemplateEvent = (event: string, ...args: unknown[]) => (e: Event) => void;

export type TemplateDef<T> = (state: T, run: TemplateEvent) => TemplateResult | string;

export interface ComponentConfig<T> {
  tag: string;
  template: TemplateDef<T>;
  defaultState: T;
  style?: TemplateResult | string;
  observedAttributes?: string[];
}

export class Metadata<T> {
  handlers: { [key: string]: Function } = {};
  props: string[] = [];
  config?: ComponentConfig<T>;
}

const METADATA_KEY = '__LIT_KIT_COMPONENT_METADATA__';

export const getMetadataRef = <T>(provider: ProviderToken<any>): Metadata<T> => {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    provider[METADATA_KEY] = new Metadata();
  }

  return provider[METADATA_KEY];
};
