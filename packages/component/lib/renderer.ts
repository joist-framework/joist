import { Service } from '@joist/di';

@Service()
export abstract class Renderer {
  render(_result: any, _container: Element | DocumentFragment): void {}
}
