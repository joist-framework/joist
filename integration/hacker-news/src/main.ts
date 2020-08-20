import './app/loader/loader.element';
import './app/news-card/news-card.element';
import './app/app.element';

if ((import.meta as any).env.MODE === 'production') {
  navigator.serviceWorker.register('sw.js').then(
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
