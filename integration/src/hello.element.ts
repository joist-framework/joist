import { properties, property, OnPropChanges, PropChanges, styled } from '@joist/component';
import { inject, service } from '@joist/di';
import { injectable } from '@joist/di-dom';

@service()
class AppService {
  sayHello(name: string) {
    return `Hello World, ${name}`;
  }
}

@injectable()
@properties()
@styled([
  /*css*/ `
    :host {
      color: red;
    }
  `,
])
export class CounterElement extends HTMLElement implements OnPropChanges {
  @property() name: string = 'Danny';

  constructor(@inject(AppService) private app: AppService) {
    super();

    this.attachShadow({ mode: 'open' });
  }

  onPropChanges(c: PropChanges) {
    console.log(c);

    this.shadowRoot!.innerHTML = this.app.sayHello(this.name);
  }
}

customElements.define('hello-world', CounterElement);
