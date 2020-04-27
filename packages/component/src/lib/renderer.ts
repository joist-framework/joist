import { Service } from '@joist/di';

@Service()
export abstract class Renderer {
  render<O>(result: any, container: Element | DocumentFragment, _options: O): void {
    if (container.lastChild) {
      container.removeChild(container.lastChild);
    }

    if (result) {
      if (result instanceof HTMLElement) {
        container.appendChild(result);
      } else if (typeof result === 'string') {
        container.appendChild(document.createTextNode(result));
      }
    }
  }
}
