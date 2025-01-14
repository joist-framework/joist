import { css, element, html, listen } from "@joist/element";

@element({
  tagName: "joist-counter",
  shadowDom: [
    css`
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
    `,
    html`
      <button id="dec">-</button>
      <slot></slot>
      <button id="inc">+</button>
    `,
  ],
})
export class CounterElement extends HTMLElement {
  connectedCallback() {
    if (!this.children.length) {
      this.innerHTML = "0";
    }
  }

  @listen("click", "#inc")
  onIncrement() {
    this.#update(1);
  }

  @listen("click", "#dec")
  onDecrement() {
    this.#update(-1);
  }

  #update(change: number) {
    const value = Number(this.innerHTML.trim());
    this.innerHTML = String(value + change);
  }
}
