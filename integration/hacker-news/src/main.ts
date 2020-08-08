import './app/app.element';

if (process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('service-worker.js').then(
    (registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    },
    (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    }
  );
}
