import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
// import $ from 'jquery'; // Import jQuery
import jQuery from 'jquery';

import '@fortawesome/fontawesome-free/css/all.min.css';
// import { createAuth0 } from '@auth0/auth0-vue';
// import store from './store'; // Import the store

const app = createApp(App);

// app.use(
//     createAuth0({
//       domain: 'dev-cbukasjtxq5jk5jz.us.auth0.com',
//       clientId: 'WutLrQc9PalfMNXGsiFl3XzAoBstXb1i',
//       authorizationParams: {
//         redirect_uri: window.location.origin
//       }
//     })
// );

// app.use(store); // Use the store
app.use(router); // Add the router to the Vue app
app.mount('#app');

// Attach jQuery to the global object
(window as any).$ = jQuery;
(window as any).jQuery = jQuery;
