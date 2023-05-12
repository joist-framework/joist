import { css, html, template, styles, listen, define, attr } from '@joist/element';
import { effect, observe } from '@joist/observable';

export class CounterElement extends HTMLElement {
  @define static tagName = 'joist-counter';

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

  @observe @attr accessor value = 0;

  @effect onChange() {
    this.innerHTML = String(this.value);
  }

  @listen('click') onClick(e: Event) {
    const { id } = e.target as HTMLElement;

    switch (id) {
      case 'inc':
        this.value++;
        break;

      case 'dec':
        this.value--;
        break;
    }
  }
}