import type { Change } from "@joist/observable";

import type { JToken } from "./token.js";

declare global {
  interface HTMLElementEventMap {
    "joist::value": JoistValueEvent;
  }
}

export class JoistValueEvent extends Event {
  readonly token: JToken;
  readonly update: (value: Change<unknown>) => void;

  constructor(bindTo: JToken, update: (value: Change<unknown>) => void) {
    super("joist::value", { bubbles: true, composed: true });

    this.token = bindTo;
    this.update = update;
  }
}
