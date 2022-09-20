import { JoistChangeEvent } from './observable';

export function effect(
  fn: (events: JoistChangeEvent[]) => void,
  root: Window | HTMLElement | ShadowRoot = window
) {
  let scheduler: Promise<void> | null = null;
  let events: JoistChangeEvent[] = [];

  function cb(e: Event) {
    if (!scheduler) {
      scheduler = Promise.resolve().then(() => {
        fn(events);

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
