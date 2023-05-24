import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/plugins/route';
import store from '@/plugins/pinia'
import vuetify from '@/plugins/vuetify';


createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .mount('#app');
