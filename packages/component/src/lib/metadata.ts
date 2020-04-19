import { ProviderToken, Provider } from '@lit-kit/di';
import { TemplateResult } from 'lit-html';

export type TemplateEvent = (event: string, ...args: unknown[]) => (e: Event) => void;

export type TemplateDef<T> = (
  state: T,
  run: TemplateEvent,
  dispatch: (eventName: string, detail?: any) => () => void
) => TemplateResult | string | HTMLElement | undefined | null;

export interface ComponentConfig<T> {
  template: TemplateDef<T>;
  initialState?: T;
  useShadowDom?: boolean;
  observedAttributes?: string[];
  use?: Provider<any>[];
}

export class Metadata {
  handlers: { [key: string]: Function } = {};
  props: string[] = [];
}

const METADATA_KEY = 'litKitComponentDef';

export function getMetadataRef(provider: ProviderToken<any>): Metadata {
  const metadata = provider[METADATA_KEY];

  if (!metadata) {
    provider[METADATA_KEY] = new Metadata();
  }

  return provider[METADATA_KEY];
}
