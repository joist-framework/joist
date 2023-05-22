import { tagName } from './tag-name.js';

describe('tag-name', () => {
  it('should define a custom element', async () => {
    class MyElement extends HTMLElement {
      @tagName static tagName = 'tn-test-1';
    }

    return customElements.whenDefined(MyElement.tagName);
  });
});
