export function effect(fn: () => void) {
  let defer: Promise<any>;

  function cb() {
    if (!defer) {
      defer = Promise.resolve();

      defer.then(() => {
        fn();
      });
    }
  }

  // batch all observable events
  window.addEventListener('joist-change-event', cb);

  return () => {
    window.removeEventListener('joist-change-event', cb);
  };
}
