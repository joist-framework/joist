import { __decorate, __param } from "tslib";
import { observable, observe, styled } from '@joist/component';
import { inject } from '@joist/di';
import { injectable } from '@joist/di-dom';
import { MathService } from './math.service';
const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <button id="dec">-</button>
  <span id="count"></span>
  <button id="inc">+</button>
`;
let CounterEement = class CounterEement extends HTMLElement {
    constructor(math) {
        super();
        this.math = math;
        this.count = 0;
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        const root = this.shadowRoot;
        root.appendChild(template.content.cloneNode(true));
        root.getElementById('inc').addEventListener('click', () => {
            this.count = this.math.increment(this.count);
        });
        root.getElementById('dec').addEventListener('click', () => {
            this.count = this.math.decrement(this.count);
        });
    }
    onChange(c) {
        console.log(c);
        this.update();
    }
    update() {
        const root = this.shadowRoot;
        root.getElementById('count').innerHTML = this.count.toString();
    }
};
__decorate([
    observe()
], CounterEement.prototype, "count", void 0);
CounterEement = __decorate([
    injectable(),
    observable(),
    styled([
        /*css*/ `
  * {
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
    }
  `,
    ]),
    __param(0, inject(MathService))
], CounterEement);
export { CounterEement };
customElements.define('hello-world', CounterEement);
//# sourceMappingURL=counter.element.js.map