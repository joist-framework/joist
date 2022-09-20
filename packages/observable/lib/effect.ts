import { JoistChangeEvent } from './observable';

export function effect(fn: (events: JoistChangeEvent[]) => void) {
  let defer: Promise<void> | null = null;
  let events: JoistChangeEvent[] = [];

  function cb(e: Event) {
    if (!defer) {
      defer = Promise.resolve();

      defer.then(() => {
        fn(events);

        events = [];
        defer = null;
      });
    }

    events.push(e as JoistChangeEvent);
  }

  // batch all observable events
  window.addEventListener('joist-change-event', cb);

  return () => {
    window.removeEventListener('joist-change-event', cb);
  };
}
