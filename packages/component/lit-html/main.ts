import { RenderCtx, RenderDef } from '@joist/component';
import { render, TemplateResult } from 'lit-html';

export function template<T>(result: (ctx: RenderCtx<T>) => TemplateResult): RenderDef<T> {
  return (ctx: RenderCtx<T>) => render(result(ctx), ctx.host.shadowRoot || ctx.host);
}
