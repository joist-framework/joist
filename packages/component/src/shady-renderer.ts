import { Provider } from '@lit-kit/di';
import { TemplateResult } from 'lit-html';
import { ShadyRenderOptions, render } from 'lit-html/lib/shady-render';

import { Renderer } from './lib/renderer';

export class ShadyRenderer implements Renderer {
  render(
    templateResult: TemplateResult,
    container: Element | DocumentFragment,
    options: ShadyRenderOptions
  ) {
    render(templateResult, container, options);
  }
}

export function useShadyRenderer(): Provider<Renderer> {
  return { provide: Renderer, useClass: ShadyRenderer };
}
