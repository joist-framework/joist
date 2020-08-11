import './app/select-band-count.element';
import './app/resistor.element';
import './app/select-band-color.element';
import './app/app.element';

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
