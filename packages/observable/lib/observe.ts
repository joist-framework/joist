let scheduler: Promise<any> | null = null;
const effects: Array<() => undefined> = [];

export function observe(
  base: ClassAccessorDecoratorTarget<any, any>,
  _: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<any, any> {
  return {
    set(value: unknown) {
      if (!scheduler) {
        scheduler = Promise.resolve().then(() => {
          scheduler = null;

          for (let effect of effects) {
            effect();
          }
        });
      }

      base.set.call(this, value);
    },
  };
}
