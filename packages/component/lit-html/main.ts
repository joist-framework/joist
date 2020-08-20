import { RenderCtx, RenderDef, ComponentDef } from '@joist/component';
import { render, TemplateResult, html } from 'lit-html';

export function template<T>(result: (ctx: RenderCtx<T>) => TemplateResult): RenderDef<T> {
  let styles: TemplateResult;

  return (ctx: RenderCtx<T>, def: ComponentDef<any>) => {
    const {
      host: { shadowRoot },
    } = ctx;

    if (def.styles && shadowRoot && !shadowRoot.adoptedStyleSheets && !styles) {
      styles = html`
        <style>
          ${def.styles.join('')}
        </style>
      `;
    }

    return render(styles ? [styles, result(ctx)] : result(ctx), ctx.host.shadowRoot || ctx.host);
  };
}

export { html } from 'lit-html';
