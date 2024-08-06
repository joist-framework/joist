import { css, html, listen, attr, element, template } from '@joist/element';

@element({
  tagName: 'joist-counter',
  shadow: [
    css`
      * {
        font-size: 200%;
      }

      :host {
        display: block;
      }

      #value {
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
    html`
      <button id="dec">-</button>
      <div id="value">
        <!--#:value-->
      </div>
      <button id="inc">+</button>
    `
  ]
})
export class CounterElement extends HTMLElement {
  @attr()
  accessor value = 0;

  #update = template();

  attributeChangedCallback() {
    this.#update();
  }

  @listen('click')
  onClick(e: Event) {
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
