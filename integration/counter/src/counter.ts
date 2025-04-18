import { attr, css, element, html, listen } from "@joist/element";
import { bind } from "@joist/observable/dom.js";

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

      j-value {
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
      <j-value bind="count"></j-value>
      <button id="inc">+</button>
    `,
  ],
})
export class CounterElement extends HTMLElement {
  @attr()
  @bind()
  accessor count = 0;

  @listen("click", "#inc")
  onIncrement() {
    this.count++;
  }

  @listen("click", "#dec")
  onDecrement() {
    this.count--;
  }
}
