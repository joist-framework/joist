import { Renderer } from '@joist/component';
import { render } from 'lit-html';
export class LitHtmlRenderer extends Renderer {
  render(templateResult, container, options) {
    render(templateResult, container, options);
  }
}
export function withLitHtml() {
  return { provide: Renderer, useClass: LitHtmlRenderer };
}
//# sourceMappingURL=public_api.js.map
