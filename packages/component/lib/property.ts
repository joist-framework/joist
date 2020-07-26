export function property() {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      set(val) {
        if (this.onPropChanges) {
          const oldValue = this[key];

          this[`__prop__${key}`] = val;

          this.onPropChanges(key, oldValue, val);
        }
      },
      get() {
        return this[`__prop__${key}`];
      },
    });
  };
}
