import { Renderer } from '@joist/component';
import { Provider } from '@joist/di';
import { render, RenderOptions } from 'lit-html';

export class LitHtmlRenderer extends Renderer {
  render<TemplateResult>(
    templateResult: TemplateResult,
    container: Element | DocumentFragment,
    options: Partial<RenderOptions>
  ) {
    render(templateResult, container, options);
  }
}

export function withLitHtml(): Provider<Renderer> {
  return { provide: Renderer, useClass: LitHtmlRenderer };
}
