import { css, html, template, styles } from '@joist/shadow';

export class CounterElement extends HTMLElement {
  @styles styles = css`
    * {
      font-size: 200%;
    }

    :host {
      display: block;
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

  @template template = html`
    <button id="dec">-</button>

    <slot></slot>

    <button id="inc">+</button>
  `;

  constructor() {
    super();

    this.shadowRoot!.addEventListener('click', this.#onClick.bind(this));

    if (!this.innerHTML) {
      this.innerHTML = this.innerHTML || '0';
    }
  }

  #onClick(e: Event) {
    const { id } = e.target as HTMLElement;
    const current = Number(this.innerHTML);

    switch (id) {
      case 'inc':
        this.innerHTML = String(current + 1);
        break;

      case 'dec':
        this.innerHTML = String(current - 1);
        break;
    }
  }
}
