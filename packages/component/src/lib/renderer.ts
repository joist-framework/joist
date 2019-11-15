import { Service } from '@lit-kit/di';
import { render, TemplateResult } from 'lit-html';
import { ShadyRenderOptions } from 'lit-html/lib/shady-render';

@Service()
export class Renderer {
  render(
    templateResult: TemplateResult,
    container: Element | DocumentFragment,
    _options: ShadyRenderOptions
  ) {
    render(templateResult, container);
  }
}
