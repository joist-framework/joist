import type { Change } from "@joist/observable";

import type { JExpression } from "./expression.js";

declare global {
  interface HTMLElementEventMap {
    "joist::value": JoistValueEvent;
  }
}

export interface BindChange<T> extends Change<T> {
  alwaysUpdate?: boolean;
  firstChange?: boolean;
}

export class JoistValueEvent extends Event {
  readonly expression: JExpression;
  readonly update: (value: BindChange<unknown>) => void;

  constructor(expression: JExpression, update: (value: BindChange<unknown>) => void) {
    super("joist::value", { bubbles: true, composed: true });

    this.expression = expression;
    this.update = update;
  }
}
