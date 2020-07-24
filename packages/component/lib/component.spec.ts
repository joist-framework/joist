import { Component, getComponentDef, ComponentDef } from './component';

describe('Component', () => {
  const def: ComponentDef<void> = {
    tagName: 'component-test-1',
  };

  @Component(def)
  class MyComponent extends HTMLElement {}

  it('should add component definition to class', () => {
    expect(getComponentDef(MyComponent)).toBe(def);
  });

  it('should define a custom element if a tagName is provided', async () => {
    expect(customElements.get('component-test-1')).toBeTruthy();
  });
});
