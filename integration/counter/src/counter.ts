import { attr, css, element, html, listen } from "@joist/element";
import { effect } from "@joist/observable";
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

  @bind()
  accessor show = false;

  @listen("click", "#inc")
  onIncrement() {
    this.count++;
  }

  @listen("click", "#dec")
  onDecrement() {
    this.count--;
  }

  @effect()
  onCountChange() {
    this.show = this.count > 10;
  }

  @effect()
  onShowChange() {
    console.log("show", this.show);
  }
}
