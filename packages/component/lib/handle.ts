export function getComponentHandlers(provider: any): Handler[] {
  return provider.handlers || [];
}

export interface Handler {
  pattern: string | RegExp;
  key: string;
}

export function handle(pattern: string | RegExp) {
  return function (instance: any, key: string) {
    const constructor = instance.constructor;

    constructor.handlers = constructor.handlers || [];
    constructor.handlers.push({ pattern, key });
  };
}
