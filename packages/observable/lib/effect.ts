import { JoistChangeEvent } from './observable';

export function effect(fn: (events: JoistChangeEvent[]) => void) {
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
  window.addEventListener('joist-observable-change', cb);

  return () => {
    window.removeEventListener('joist-observable-change', cb);
  };
}
