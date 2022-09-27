import { JoistChangeEvent } from './observable';

export interface EffectOptions {
  root: Window | HTMLElement | ShadowRoot;
  once: boolean;
}

export function effect(
  fn: (events: JoistChangeEvent[]) => void,
  opts: Partial<EffectOptions> = {}
) {
  const { root, once } = { root: window, once: false, ...opts };

  let scheduler: Promise<void> | null = null;
  let events: JoistChangeEvent[] = [];

  function cb(e: Event) {
    if (!scheduler) {
      scheduler = Promise.resolve().then(() => {
        fn(events);

        if (once) {
          root.removeEventListener('joist-observable-change', cb);
        }

        events = [];
        scheduler = null;
      });
    }

    events.push(e as JoistChangeEvent);
  }

  // batch all observable events
  root.addEventListener('joist-observable-change', cb);

  return () => {
    root.removeEventListener('joist-observable-change', cb);
  };
}
