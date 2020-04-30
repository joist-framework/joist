import { Service } from '@joist/di';

@Service()
export abstract class Renderer {
  render(result: any, container: Element | DocumentFragment): void {
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
