import { observable, observe, OnPropertyChanged, attr } from '@joist/observable';
import { css, html, shadow } from '@joist/shadow';

@observable
export class CounterElement extends HTMLElement implements OnPropertyChanged {
  static styles = css`
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
  `;

  static template = html`
    <button id="dec">-</button>

    <slot></slot>

    <button id="inc">+</button>
  `;

  @observe @attr({ read: Number }) count = 0;

  #shadow = shadow(this);

  constructor() {
    super();

    this.#shadow.addEventListener('click', this.#onClick.bind(this));
    this.innerHTML = String(this.count);
  }

  onPropertyChanged() {
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
