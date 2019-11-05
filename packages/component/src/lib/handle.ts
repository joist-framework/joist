import { ComponentInstance } from './component';

export function Handle(action: string) {
  return function(instance: any, key: string) {
    const i = instance as ComponentInstance;

    if (!i.handlers) {
      i.handlers = {};
    }

    i.handlers[action] = i[key];
  };
}
