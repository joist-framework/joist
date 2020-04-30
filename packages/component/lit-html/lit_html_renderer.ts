import { Renderer } from '@joist/component';
import { Provider } from '@joist/di';
import { render } from 'lit-html';

export class LitHtmlRenderer extends Renderer {
  render<TemplateResult>(templateResult: TemplateResult, container: Element | DocumentFragment) {
    render(templateResult, container);
  }
}

export function litHtml(): Provider<Renderer> {
  return { provide: Renderer, useClass: LitHtmlRenderer };
}
