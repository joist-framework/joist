/**
 * Forward properties of one object to another
 */
export function forwardProps(source: any, target: any, props: string[]) {
  props.forEach((key) => {
    target[key] = source[key];

    Object.defineProperty(target, key, {
      get() {
        return source[key];
      },
      set(value) {
        source[key] = value;
      },
    });
  });
}
