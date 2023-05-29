// Vuetify UI 프레임워크
import 'vuetify/styles';
import {createVuetify}  from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
    theme: {
        defaultTheme: 'light'
    },
    icons: {
        defaultSet: 'mdi',
    },
    components,
    directives,
});
