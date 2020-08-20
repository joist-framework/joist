import { RenderCtx, RenderDef, ComponentDef } from '@joist/component';
import { render, TemplateResult, html } from 'lit-html';

const constructableSupported = !!document.adoptedStyleSheets;

export function template<T>(result: (ctx: RenderCtx<T>) => TemplateResult): RenderDef<T> {
  let styles: TemplateResult;

  return (ctx: RenderCtx<T>, def: ComponentDef<any>) => {
    if (def.styles && ctx.host.shadowRoot) {
      if (constructableSupported && ctx.host.shadowRoot.adoptedStyleSheets.length === 0) {
        ctx.host.shadowRoot.adoptedStyleSheets = def.styles.map((styleString) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(styleString);

          return sheet;
        });
      } else if (!constructableSupported && !styles) {
        styles = html`
          <style>
            ${def.styles.join('')}
          </style>
        `;
      }
    }

    return render(styles ? [styles, result(ctx)] : result(ctx), ctx.host.shadowRoot || ctx.host);
  };
}

export { html } from 'lit-html';
