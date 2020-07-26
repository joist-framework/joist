export function property() {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      set(val) {
        if (this.onPropChanges) {
          this[`__prop__${key}`] = val;

          this.onPropChanges();
        }
      },
      get() {
        return this[`__prop__${key}`];
      },
    });
  };
}
