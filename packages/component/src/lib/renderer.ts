import { Service } from '@lit-kit/di';
import { render, TemplateResult, RenderOptions } from 'lit-html';
import { ShadyRenderOptions } from 'lit-html/lib/shady-render';

@Service()
export class Renderer {
  render(
    templateResult: TemplateResult,
    container: Element | DocumentFragment,
    options: RenderOptions | ShadyRenderOptions
  ) {
    render(templateResult, container, options);
  }
}
