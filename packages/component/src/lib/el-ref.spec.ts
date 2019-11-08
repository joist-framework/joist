import { html } from 'lit-html';

import { Component } from './component';
import { ElRef } from './el-ref';
import { createComponent } from './create-component';

describe('ElRef', () => {
  @Component({
    tag: 'el-ref-component-test-1',
    defaultState: undefined,
    template: () => html``
  })
  class MyComponent {
    constructor(@ElRef() public elRef: HTMLElement) {}
  }

  it('should provide an instance of the Custom Element', () => {
    const el = createComponent(MyComponent);

    expect(el.componentInstance.elRef).toBe(el);
  });
});
