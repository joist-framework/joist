import { html } from 'lit-html';

import { getComponentDef } from './metadata';
import { Component } from './component';

describe('Component', () => {
  const def = { template: () => html`` };

  @Component(def)
  class MyComponent {}

  it('should add component definition to class', () => {
    expect(getComponentDef(MyComponent)).toBe(def);
  });
});
