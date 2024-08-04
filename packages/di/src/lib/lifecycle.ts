(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export const onInitMethods = new WeakMap<object, Function>();
export const onInjectMethods = new WeakMap<object, Function>();

export const LifeCycle = {
  onInit: function onInit() {
    return function onInitDecorator(value: Function, ctx: ClassMethodDecoratorContext<object>) {
      ctx.addInitializer(function (this) {
        onInitMethods.set(this, value);
      });
    };
  },
  onInject: function onInject() {
    return function onInitDecorator(value: Function, ctx: ClassMethodDecoratorContext<object>) {
      ctx.addInitializer(function (this) {
        onInjectMethods.set(this, value);
      });
    };
  }
};
