export function listen<This extends HTMLElement>(event: string) {
  return (value: (e: Event) => void, ctx: ClassMethodDecoratorContext<This>) => {
    ctx.addInitializer(function () {
      const root = this.shadowRoot || this;

      root.addEventListener(event, value);
    });
  };
}
