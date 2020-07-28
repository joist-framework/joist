import { component, getComponentDef, ComponentDef } from './component';
import { JoistElement } from './element';

describe('Component', () => {
  const def: ComponentDef<void> = {
    tagName: 'component-test-1',
  };

  @component(def)
  class MyComponent extends JoistElement {
    foo = getComponentDef(this.constructor);
  }

  it('should add component definition to class', () => {
    expect(getComponentDef(MyComponent)).toBe(def);
  });

  it('should define a custom element if a tagName is provided', async () => {
    expect(customElements.get('component-test-1')).toBeTruthy();
  });

  it('should be able to see metadata internally', async () => {
    expect(new MyComponent().foo).toBe(def);
  });
});
