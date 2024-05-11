import { expect } from '@open-wc/testing';
import { css, html, htmlTemplateCache, styleSheetCache } from './tags.js';

describe('tags', () => {
  it('should ensure return the same CSSResult', () => {
    class Test {
      styles = css`Hello World`;
    }

    const a = new Test();
    const b = new Test();

    expect(a.styles.strings).to.equal(b.styles.strings);
    expect(styleSheetCache.get(a.styles.strings)).to.equal(styleSheetCache.get(b.styles.strings));
  });

  it('should cache the HTMLTemplateElement', () => {
    class Test {
      dom = html`Hello World`;
    }

    const a = new Test();
    const b = new Test();

    expect(a.dom.strings).to.equal(b.dom.strings);
    expect(htmlTemplateCache.get(a.dom.strings)).to.equal(htmlTemplateCache.get(b.dom.strings));
  });
});
