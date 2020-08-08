import './app/app.element';

if (process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('/target/service-worker.js').then(
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
