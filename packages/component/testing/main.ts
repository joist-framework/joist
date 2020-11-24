import { InjectorBase, withInjector } from '@joist/component';
import { Provider, ProviderToken } from '@joist/di';

let testBedId = 0;

type TestBedBase = HTMLElement & InjectorBase;

class TestBed {
  constructor(private host: TestBedBase) {
    document.body.appendChild(this.host);
  }

  create<T extends HTMLElement>(CEC: new (...args: any[]) => T): T {
    return this.host.appendChild(new CEC());
  }

  get<T>(token: ProviderToken<T>) {
    return this.host.injector.get(token);
  }

  clean() {
    document.removeChild(this.host);

    document.body.appendChild(this.host);
  }
}

export function defineTestBed(providers: Provider<any>[] = []) {
  testBedId++;

  class Host extends withInjector(HTMLElement) {
    constructor() {
      super();

      this.injector.parent = undefined;
      this.injector.options.providers = providers;

      this.setAttribute('__joist__injector__root__', 'true');
    }
  }

  customElements.define(`joist-test-bed-${testBedId}`, Host);

  return new TestBed(new Host());
}
