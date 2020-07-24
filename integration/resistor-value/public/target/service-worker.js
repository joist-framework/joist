if (!self.define) {
  const e = (e) => {
      'require' !== e && (e += '.js');
      let r = Promise.resolve();
      return (
        s[e] ||
          (r = new Promise(async (r) => {
            if ('document' in self) {
              const s = document.createElement('script');
              (s.src = e), document.head.appendChild(s), (s.onload = r);
            } else importScripts(e), r();
          })),
        r.then(() => {
          if (!s[e]) throw new Error(`Module ${e} didn’t register its module`);
          return s[e];
        })
      );
    },
    r = (r, s) => {
      Promise.all(r.map(e)).then((e) => s(1 === e.length ? e[0] : e));
    },
    s = { require: Promise.resolve(r) };
  self.define = (r, t, i) => {
    s[r] ||
      (s[r] = Promise.resolve().then(() => {
        let s = {};
        const o = { uri: location.origin + r.slice(1) };
        return Promise.all(
          t.map((r) => {
            switch (r) {
              case 'exports':
                return s;
              case 'module':
                return o;
              default:
                return e(r);
            }
          })
        ).then((e) => {
          const r = i(...e);
          return s.default || (s.default = r), s;
        });
      }));
  };
}
define('./service-worker.js', ['./workbox-1a661b4a'], function (e) {
  'use strict';
  self.addEventListener('message', (e) => {
    e.data && 'SKIP_WAITING' === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [{ url: 'main.bundle.js', revision: '17c003441275ccf0c00991472c591646' }],
      {}
    );
});
