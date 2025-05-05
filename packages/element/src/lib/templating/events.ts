import type { Change } from "@joist/observable";

import type { JToken } from "./token.js";

declare global {
  interface HTMLElementEventMap {
    "joist::value": JoistValueEvent;
  }
}

export class JoistValueEvent extends Event {
  #token: JToken;
  #update: (value: Change<unknown>) => void;

  get token(): JToken {
    return this.#token;
  }

  constructor(bindTo: JToken, update: (value: Change<unknown>) => void) {
    super("joist::value", { bubbles: true, composed: true });

    this.#token = bindTo;
    this.#update = update;
  }

  update(value: Change<unknown>): void {
    this.#update(value);
  }
}
