declare global {
  interface HTMLElementEventMap {
    "joist::value": JoistValueEvent;
  }
}

export class JoistValueEvent extends Event {
  bindTo: string;
  cb: (value: unknown) => void;

  constructor(bindTo: string, cb: (value: unknown) => void) {
    super("joist::value", { bubbles: true, composed: true });

    this.bindTo = bindTo;
    this.cb = cb;
  }
}
