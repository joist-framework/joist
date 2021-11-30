import { expect } from '@open-wc/testing';

import { css, CSSResult } from './css-tag';

describe('styled', () => {
  it('should create style results from strings', () => {
    const result = css`
      :host {
        display: 'block';
      }
    `;

    expect(result).to.be.instanceOf(CSSResult);
  });

  it('should throw error if tyring to use string literal directly', () => {
    expect(() => {
      css`
        :host {
          display: ${'foo' as any};
        }
      `;
    }).to.throw(`Value passed to 'css' function must be a 'css' function result: foo`);
  });
});
