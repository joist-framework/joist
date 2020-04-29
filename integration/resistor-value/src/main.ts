import './app/app.component';

import { bootstrapEnvironment } from '@joist/component';
import { withLitHtml } from '@joist/component/lit-html';

bootstrapEnvironment([withLitHtml()]);

if (process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('/service-worker.js').then(
    function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    },
    function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    }
  );
}
