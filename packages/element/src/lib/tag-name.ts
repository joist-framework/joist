export function tagName(_val: unknown, _ctx: ClassFieldDecoratorContext) {
  return function (this: CustomElementConstructor, val: string) {
    setTimeout(() => {
      if (!customElements.get(val)) {
        customElements.define(val, this);
      }
    });

    return val;
  };
}
