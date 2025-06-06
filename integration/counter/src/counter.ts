import { css, element, html, listen } from "@joist/element";
import { bind } from "@joist/templating";

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

      j-val {
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
      <j-val bind="count.value"></j-val>
      <button id="inc">+</button>
    `,
  ],
})
export class CounterElement extends HTMLElement {
  @bind()
  accessor count = {
    value: 0,
  };

  @listen("click", "#inc")
  onIncrement() {
    this.count = {
      value: this.count.value + 1,
    };
  }

  @listen("click", "#dec")
  onDecrement() {
    this.count = {
      value: this.count.value - 1,
    };
  }
}
