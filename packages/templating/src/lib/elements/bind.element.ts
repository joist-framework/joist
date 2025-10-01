import { attr, element, css, html } from "@joist/element";

import { JExpression } from "../expression.js";
import { JoistValueEvent } from "../events.js";

export class JAttrToken extends JExpression {
  mapTo: string;

  constructor(binding: string) {
    const [mapTo, bindTo] = binding.split(":");

    super(bindTo ?? mapTo);

    this.mapTo = mapTo;
  }
}

@element({
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

  @attr({
    name: "depends-on",
  })
  accessor dependsOn = "";

  async connectedCallback(): Promise<void> {
    const attrBindings = this.#parseBinding(this.attrs);
    const propBindings = this.#parseBinding(this.props);

    let children: Iterable<Element> = this.children;

    const root = this.getRootNode() as Document | ShadowRoot;

    if (this.target) {
      children = root.querySelectorAll(this.target);
    }

    if (this.dependsOn) {
      await Promise.all(
        this.dependsOn.split(",").map((tag) => window.customElements.whenDefined(tag)),
      );
    }

    for (const attrValue of attrBindings) {
      const token = new JAttrToken(attrValue);

      this.#dispatch(token, (value) => {
        for (const child of children) {
          if (value === true) {
            child.setAttribute(token.mapTo, "");
          } else if (value === false) {
            child.removeAttribute(token.mapTo);
          } else {
            child.setAttribute(token.mapTo, String(value));
          }
        }
      });
    }

    for (const propValue of propBindings) {
      const token = new JAttrToken(propValue);

      this.#dispatch(token, (value) => {
        for (const child of children) {
          const mapToParts = token.mapTo.split(".");

          if (mapToParts.length > 1) {
            const finalPart = mapToParts.pop() as string;

            let pointer: any = child;

            for (const part of mapToParts) {
              pointer = pointer?.[part];

              if (pointer === undefined) {
                break;
              }
            }

            Reflect.set(pointer, finalPart, value);
          } else {
            Reflect.set(child, token.mapTo, value);
          }
        }
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
        let oldWrittenValue = token.evaluate(oldValue);

        if (oldWrittenValue === valueToWrite) {
          return;
        }

        if (token.isNegated) {
          valueToWrite = !valueToWrite;
        }

        write(valueToWrite);
      }),
    );
  }
}
