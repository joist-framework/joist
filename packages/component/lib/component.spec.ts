import { Component, getComponentDef } from './component';

describe('Component', () => {
  const def = {};

  @Component(def)
  class MyComponent {}

  it('should add component definition to class', () => {
    expect(getComponentDef(MyComponent)).toBe(def);
  });
});
