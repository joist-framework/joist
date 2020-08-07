import { expect } from '@open-wc/testing';

import { component, getComponentDef, ComponentDef } from './component';
import { JoistElement } from './element';

describe('Component', () => {
  const def: ComponentDef<void> = {
    tagName: 'component-test-1',
  };

  @component(def)
  class MyElement extends JoistElement {
    foo = getComponentDef(this.constructor);
  }

  it('should add component definition to class', () => {
    expect(getComponentDef(MyElement)).to.equal(def);
  });

  it('should define a custom element if a tagName is provided', async () => {
    expect(customElements.get('component-test-1')).to.equal(MyElement);
  });

  it('should be able to see metadata internally', async () => {
    expect(new MyElement().foo).to.equal(def);
  });
});
