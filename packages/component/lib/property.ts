export class PropChange<T = any> {
  constructor(public key: string | symbol, public newValue: T, public oldValue?: T) {}
}

export interface OnPropChanges {
  onPropChanges(changes: Map<string, PropChange>): void;
}

export interface PropChangeBase extends OnPropChanges {
  definePropChange(change: PropChange): void;
}

export interface PropChangeConstructor<T> {
  properties?: Record<string, {}>;
  new (...args: any[]): T;
}

export function readPropertyDefs<T>(c: PropChangeConstructor<T>) {
  return c.properties || c.prototype.properties || {};
}

/**
 * Mixin that applies an prop change to a base class
 */
export function WithProps<T extends new (...args: any[]) => {}>(
  Base: T,
  props: Array<string | symbol> = []
) {
  class PropChanges extends Base implements PropChangeBase {
    $$propChanges: Map<string | symbol, PropChange> = new Map();
    $$propChange: Promise<void> | null = null;

    onPropChanges(_: Map<string | symbol, PropChange>) {}

    /**
     * Marks a property as changed
     * onPropChanges is called after all prop changes are defined.
     * This batches onPropChanges calls.
     */
    definePropChange(propChange: PropChange): Promise<void> {
      this.$$propChanges.set(propChange.key, propChange);

      if (!this.$$propChange) {
        // If there is no previous change defined set it up
        this.$$propChange = Promise.resolve().then(() => {
          // run onPropChanges here. This makes sure we capture all changes
          this.onPropChanges(this.$$propChanges);

          // reset for next time
          this.$$propChanges.clear();
          this.$$propChange = null;
        });
      }

      return this.$$propChange;
    }
  }

  return new Proxy(PropChanges, {
    construct(base, args, extend) {
      const el: PropChanges = Reflect.construct(base, args, extend);

      new Proxy(el, {
        defineProperty(a, b, c) {
          return Reflect.defineProperty(a, b, c);
        },
        deleteProperty(a, b) {
          return Reflect.deleteProperty(a, b);
        },
        get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver);
        },
        getOwnPropertyDescriptor(a, b) {
          return Reflect.getOwnPropertyDescriptor(a, b);
        },
        getPrototypeOf(a) {
          return Reflect.getPrototypeOf(a);
        },
        has(a, b) {
          return Reflect.has(a, b);
        },
        isExtensible(a) {
          return Reflect.isExtensible(a);
        },
        ownKeys(a) {
          return Reflect.ownKeys(a);
        },
        set(target, prop, value, receiver) {
          if (props.includes(prop)) {
            el.definePropChange(new PropChange(prop as string, value));
          }
          return Reflect.set(target, prop, value, receiver);
        },
        setPrototypeOf(a, b) {
          return Reflect.setPrototypeOf(a, b);
        },
      });

      return el;
    },
  });
}
