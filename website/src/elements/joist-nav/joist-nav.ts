import { element } from '@joist/element';

@element({
  tagName: 'joist-nav'
})
class JoistNavElement extends HTMLElement {
  connectedCallback(): void {
    alert('test');
  }
}

export { JoistNavElement };
