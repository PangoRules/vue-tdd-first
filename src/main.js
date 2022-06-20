import { createApp } from 'vue';
import App from './App.vue';
import i18n from './locales/i18n.js';
import router from './routes/router.js';
import store from './state/store.js';

createApp(App)
	.use(router)
	.use(i18n)
	.use(store)
	.mount('#app');
