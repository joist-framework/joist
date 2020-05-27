import { defineElement, ElementInstance } from './define_element';
import { ElRef } from './el_ref';

describe('ElRef', () => {
  class MyComponent {
    constructor(@ElRef public elRef: HTMLElement) {}
  }

  customElements.define('el-ref-1', defineElement(MyComponent));

  it('should provide an instance of the Custom Element', () => {
    const el = document.createElement('el-ref-1') as ElementInstance<MyComponent>;

    expect(el.componentInstance.elRef).toBe(el);
  });
});
