export class PropChange<T = any> {
  constructor(public key: string | symbol, public newValue: T, public oldValue?: T) {}
}

export interface OnPropChanges {
  onPropChanges(changes: Map<string, PropChange>): void;
}

export type PropChanges = Record<string | symbol, PropChange>;

export function readPropertyDefs(c: any): Record<string | symbol, {}> {
  return c.properties || c.prototype.properties || {};
}

export function propChanges() {
  return <T extends HTMLElement>(Cec: new () => T) => {
    const defs = readPropertyDefs(Cec);

    Cec.prototype.__$$propChanges = new Map();

    for (let def in defs) {
      Object.defineProperty(Cec.prototype, def, {
        set(val: any) {
          Reflect.set(this, `__$$${def}`, val);

          definePropChange.call(this, new PropChange(def, val));
        },
        get() {
          return Reflect.get(this, `__$$${def}`);
        },
      });
    }

    return Cec;
  };
}

export interface PropChangeBase {
  __$$propChanges: Map<string | symbol, PropChange>;
  __$$propChange: Promise<void> | null;

  onPropChanges?: (changes: PropChanges) => void;
}

function definePropChange(this: PropChangeBase, propChange: PropChange): Promise<void> {
  this.__$$propChanges.set(propChange.key, propChange);

  if (!this.__$$propChange) {
    // If there is no previous change defined set it up
    this.__$$propChange = Promise.resolve().then(() => {
      // run onPropChanges here. This makes sure we capture all changes
      if (this.onPropChanges) {
        this.onPropChanges(Object.fromEntries(this.__$$propChanges));
      }

      // reset for next time
      this.__$$propChanges.clear();
      this.__$$propChange = null;
    });
  }

  return this.__$$propChange;
}
