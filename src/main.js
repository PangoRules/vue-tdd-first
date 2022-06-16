import { createApp } from 'vue';
import App from './App.vue';
import i18n from './locales/i18n.js';
import router from './routes/router.js';


createApp(App)
    .use(router)
    .use(i18n)
    .mount('#app');
