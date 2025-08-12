import { attr, element, queryAll, css } from "@joist/element";

import { JoistValueEvent } from "../events.js";
import { JExpression } from "../expression.js";

@element({
  // prettier-ignore
  shadowDom: [css`:host{display: contents}`],
})
export class JoistIfElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @attr()
  accessor target = "";

  @attr({
    name: "depends-on",
  })
  accessor dependsOn = "";

  #templates = queryAll<HTMLTemplateElement>("template", this);
  #shouldShowIf: boolean | null = null;
  #target: Element = this;

  async connectedCallback(): Promise<void> {
    const templates = Array.from(this.#templates());

    if (templates.length === 0) {
      throw new Error("j-if requires at least one template element");
    }

    if (templates.length > 2) {
      throw new Error("j-if can only have two template elements (if and else)");
    }

    if (templates.length === 2 && !templates.some((t) => t.hasAttribute("else"))) {
      throw new Error("When using two templates, one must have the else attribute");
    }

    if (templates.length === 2 && templates[0].hasAttribute("else")) {
      // Swap templates to ensure if template is first
      [templates[0], templates[1]] = [templates[1], templates[0]];
    }

    const token = new JExpression(this.bind);

    const root = this.getRootNode() as Document | ShadowRoot;

    if (this.target) {
      const result = root.querySelector(this.target);

      if (result) {
        this.#target = result;
      }
    }

    if (this.dependsOn) {
      await Promise.all(
        this.dependsOn.split(",").map((tag) => window.customElements.whenDefined(tag)),
      );
    }

    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue, firstChange }) => {
        if (firstChange || newValue !== oldValue) {
          this.apply(token.evaluate(newValue), token.isNegated);
        }
      }),
    );
  }

  apply(value: unknown, isNegative: boolean): void {
    const shouldShowIf = isNegative ? !value : !!value;

    if (shouldShowIf === this.#shouldShowIf) {
      return;
    }

    this.#shouldShowIf = shouldShowIf;

    this.#clean();

    const templates = this.#templates();

    const templateToUse = this.#shouldShowIf ? templates[0] : templates[1];

    if (templateToUse) {
      const content = document.importNode(templateToUse.content, true);

      this.#target.append(content);
    }
  }

  #clean(): void {
    while (!(this.#target.lastChild instanceof HTMLTemplateElement)) {
      this.lastChild?.remove();
    }
  }

  disconnectedCallback(): void {
    this.#clean();
  }
}
