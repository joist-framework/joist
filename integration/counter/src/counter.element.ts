import { observable, observe, OnPropertyChanged, attr } from '@joist/observable';
import { styled, css } from '@joist/styled';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <button id="dec">-</button>
  
  <slot></slot>

  <button id="inc">+</button>
`;

@observable
@styled
export class CounterElement extends HTMLElement implements OnPropertyChanged {
  static styles = [
    css`
      :host {
        display: block;
      }

      * {
        font-size: 200%;
      }

      slot {
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
        cursor: pointer;
      }
    `,
  ];

  @observe @attr({ read: Number }) count = 0;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.appendChild(template.content.cloneNode(true));

    shadow.addEventListener('click', this.#onClick.bind(this));

    this.#update();
  }

  onPropertyChanged() {
    this.#update();
  }

  #update() {
    this.innerHTML = String(this.count);
  }

  #onClick(e: Event) {
    const { id } = e.target as HTMLElement;

    switch (id) {
      case 'inc':
        this.count++;
        break;

      case 'dec':
        this.count--;
        break;
    }
  }
}
