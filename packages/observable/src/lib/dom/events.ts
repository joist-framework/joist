import type { Change } from "../metadata.js";
import type { JToken } from "./token.js";

declare global {
  interface HTMLElementEventMap {
    "joist::value": JoistValueEvent;
  }
}

export class JoistValueEvent extends Event {
  token: JToken;
  cb: (value: Change<unknown>) => void;

  constructor(bindTo: JToken, cb: (value: Change<unknown>) => void) {
    super("joist::value", { bubbles: true, composed: true });

    this.token = bindTo;
    this.cb = cb;
  }
}
