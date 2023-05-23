export function listen<This extends HTMLElement>(
  event: string,
  root: (el: This) => ShadowRoot | This = (el) => el.shadowRoot || el
) {
  return (value: (e: Event) => void, ctx: ClassMethodDecoratorContext<This>) => {
    ctx.addInitializer(function () {
      // method initializers are run before fields and accessors.
      // we want to wait till after all have run so we can check if there is a shadowRoot or not.
      Promise.resolve().then(() => {
        root(this).addEventListener(event, value.bind(this));
      });
    });
  };
}
