import { observable, observe, OnChange, PropChanges, styled } from '@joist/component';
import { inject, service } from '@joist/di';
import { injectable } from '@joist/di-dom';

@service()
class AppService {
  sayHello(name: string) {
    return `Hello World, ${name}`;
  }
}

@injectable()
@observable()
@styled([
  /*css*/ `
    :host {
      color: red;
    }
  `,
])
export class CounterElement extends HTMLElement implements OnChange {
  @observe() name: string = 'Danny';

  constructor(@inject(AppService) private app: AppService) {
    super();

    this.attachShadow({ mode: 'open' });
  }

  onChange(c: PropChanges) {
    console.log(c);

    this.shadowRoot!.innerHTML = this.app.sayHello(this.name);
  }
}

customElements.define('hello-world', CounterElement);
