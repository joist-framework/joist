import { attr, element, css, html } from "@joist/element";

import { JExpression } from "../expression.js";
import { JoistValueEvent } from "../events.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-bind": JoistBindElement;
  }
}

export class JAttrToken extends JExpression {
  mapTo: string;

  constructor(binding: string) {
    const [mapTo, bindTo] = binding.split(":");

    super(bindTo ?? mapTo);

    this.mapTo = mapTo;
  }
}

@element({
  tagName: "j-bind",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistBindElement extends HTMLElement {
  @attr()
  accessor props = "";

  @attr()
  accessor attrs = "";

  @attr()
  accessor target = "";

  connectedCallback(): void {
    const attrBindings = this.#parseBinding(this.attrs);
    const propBindings = this.#parseBinding(this.props);

    let child = this.firstElementChild;

    if (this.target) {
      child = this.querySelector(this.target);
    }

    if (!child) {
      throw new Error("j-bind must have a child element or defined target");
    }

    for (const attrValue of attrBindings) {
      const token = new JAttrToken(attrValue);

      this.#dispatch(token, (value) => {
        if (value === true) {
          child.setAttribute(token.mapTo, "");
        } else if (value === false) {
          child.removeAttribute(token.mapTo);
        } else {
          child.setAttribute(token.mapTo, String(value));
        }
      });
    }

    for (const propValue of propBindings) {
      const token = new JAttrToken(propValue);

      this.#dispatch(token, (value) => {
        Reflect.set(child, token.mapTo, value);
      });
    }
  }

  #parseBinding(binding: string) {
    return binding
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b);
  }

  #dispatch(token: JExpression, write: (value: unknown) => void) {
    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue, alwaysUpdate }) => {
        if (newValue === oldValue && !alwaysUpdate) {
          return;
        }

        let valueToWrite = token.evaluate(newValue);

        if (token.isNegated) {
          valueToWrite = !valueToWrite;
        }

        write(valueToWrite);
      }),
    );
  }
}
