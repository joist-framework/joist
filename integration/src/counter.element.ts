import { styled } from '@joist/styled';
import { observable, observe, OnChange, Changes } from '@joist/observable';
import { inject, injectable } from '@joist/di';

import { MathService } from './math.service';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <button data-action="dec">-</button>
  <span id="count">0</span>
  <button data-action="inc">+</button>
`;

@injectable()
@observable()
@styled({
  styles: [
    `* {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }`,
  ],
})
export class CounterEement extends HTMLElement implements OnChange {
  @observe() count: number = 0;

  constructor(@inject(MathService) private math: MathService) {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const root = this.shadowRoot!;

    root.appendChild(template.content.cloneNode(true));

    this.addListeners();
  }

  onChange(_: Changes) {
    this.update();
  }

  private addListeners() {
    this.shadowRoot!.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      switch (target.dataset.action) {
        case 'inc':
          this.count = this.math.increment(this.count);
          break;

        case 'dec':
          this.count = this.math.decrement(this.count);
          break;
      }
    });
  }

  private update() {
    this.shadowRoot!.getElementById('count')!.innerHTML = this.count.toString();
  }
}

customElements.define('hello-world', CounterEement);
