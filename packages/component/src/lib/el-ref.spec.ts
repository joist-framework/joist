import { html } from 'lit-html';

import { defineComponent, ElementInstance } from './component';
import { ElRef } from './el-ref';

describe('ElRef', () => {
  class MyComponent {
    constructor(@ElRef public elRef: HTMLElement) {}
  }

  const MyElement = defineComponent({ template: () => html`` }, MyComponent);

  customElements.define('el-ref-1', MyElement);


  it('should provide an instance of the Custom Element', () => {
    const el = document.createElement('el-ref-1') as ElementInstance<MyComponent>;

    expect(el.componentInstance.elRef).toBe(el);
  });
});
